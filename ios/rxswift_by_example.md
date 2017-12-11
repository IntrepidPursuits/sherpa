# RxSwift by Example

Let's imaging that we want to implement a simple search view that gets a search query from the user via a textfield, queries a remote server, and displays the results in a table with a label to give the result count.

The traditional approach (pre RxSwift, using delegates, selectors, and `addTarget`) might look something like this:
  ```swift
  import UIKit

  class SearchTableViewController: UIViewController, UITableViewDataSource {

      @IBOutlet weak var searchTextField: UITextField!
      @IBOutlet weak var resultsTableView: UITableView!
      @IBOutlet weak var resultCountLabel: UILabel!

      private var results = [String]()

      override func viewDidLoad() {
          super.viewDidLoad()

          resultsTableView.dataSource = self
          resultsTableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
          searchTextField.addTarget(self, action: #selector(searchTextFieldDidChange(_:)), for: .editingChanged)
      }

      // MARK: - Handle Text Field Changes

      @objc func searchTextFieldDidChange(_ textField: UITextField) {
          if let searchText = textField.text {
              results = fetchResults(search: searchText)

              resultCountLabel.text = "\(results.count)"
              resultsTableView.reloadData()
          }
      }

      // MARK: - UITableViewDataSource

      func numberOfSections(in tableView: UITableView) -> Int {
          return 1
      }

      func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
          return results.count
      }

      func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
          if let cell = tableView.dequeueReusableCell(withIdentifier: "Cell") {
              let result = results[indexPath.row]
              cell.textLabel?.text = "\(result)"
              return cell
          } else {
              return UITableViewCell()
          }
      }
  }
  ```

While this code works, it's got two primary problems. First, each letter the user types will cause `fetchResults` to be called. This will result in a lot of unnecessary queries that the user is probably not interested in their results. Second, there's a lot of code here, spread out across multiple functions. This example is simple, so it may be easy for the reader to understand the developers intent but as the amount of code grows complexity will increase and it will become harder to follow the code and understand the developers intent.

Let's add RxSwift & RxCocoa to the project to help things along:

  ```swift
  import UIKit
  import RxSwift
  import RxCocoa

  class SearchTableViewController: UIViewController {

      @IBOutlet weak var searchTextField: UITextField!
      @IBOutlet weak var resultsTableView: UITableView!
      @IBOutlet weak var resultCountLabel: UILabel!

      private let disposeBag = DisposeBag()

      override func viewDidLoad() {
          super.viewDidLoad()

          resultsTableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
          setupBindings()
      }

      func setupBindings() {
          let results = searchTextField.rx.text
              .throttle(0.3, scheduler: MainScheduler.instance)
              .flatMapLatest {
                  self.fetchResults(search: $0)
              }

          results
              .map { "\($0.count)" }
              .bind(to: resultCountLabel.rx.text)
              .disposed(by: disposeBag)

          results
              .bind(to: resultsTableView.rx.items(cellIdentifier: "Cell")) { (_, result, cell) in
                  cell.textLabel?.text = "\(result)"
              }
              .disposed(by: disposeBag)

      }
  }
  ```

  Much better. The code is a lot more compact and it's clearer what the developer meant to happen:
  * User input (from `searchTextField`) is throttled (so we don't overload the server with requests)
  * The server (via `fetchResults`) is contacted and results are fetched
  * The results are bound to two UI elements: the results table view and the results count label

  Unfortunately this solution is not without its own set of problems:
  * If the `fetchResults` observable sequence errors out (connection failed or parsing error), this error would unbind everything and the UI wouldn't respond any more to new queries.
  * If `fetchResults` returns results on some background thread, results would be bound to UI elements from a background thread which could cause non-deterministic crashes.
  * Results are bound to two UI elements, which means that for each user query, two requests would be made, one for each UI element, which is not the intended behavior.

  Here is a version of the code that addresses these issues:

  ```swift
  import UIKit
  import RxSwift
  import RxCocoa

  class SearchTableViewController: UIViewController {

      @IBOutlet weak var searchTextField: UITextField!
      @IBOutlet weak var resultsTableView: UITableView!
      @IBOutlet weak var resultCountLabel: UILabel!

      private let disposeBag = DisposeBag()

      override func viewDidLoad() {
          super.viewDidLoad()

          resultsTableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
          setupBindings()
      }

      func setupBindings() {
          let results = searchTextField.rx.text
              .throttle(0.3, scheduler: MainScheduler.instance)
              .flatMapLatest {
                  self.fetchResults(search: $0)
                      .observeOn(MainScheduler.instance)
                      .catchErrorJustReturn([])
              }
              .share(replay: 1)

          results
              .map { "\($0.count)" }
              .bind(to: resultCountLabel.rx.text)
              .disposed(by: disposeBag)

          results
              .bind(to: resultsTableView.rx.items(cellIdentifier: "Cell")) { (_, result, cell) in
                  cell.textLabel?.text = "\(result)"
              }
              .disposed(by: disposeBag)

      }
  }
  ```

  This new code does a much better job.
  * `catchErrorJustReturn([])` ensures that any errors are handled, preventing the system from unbinding
  * The call to `observeOn(MainScheduler.instance)` ensures that `fetchResults` returns results on the `Main` thread.
  * `share(replay: 1)` ensures that one instance of the resulting observer is shared by both UI element bindings.

  Making sure all of these requirements are properly handled in large systems can be challenging, but there is a simpler way of using the compiler and RxSwift traits to prove these requirements are met.

  The following code looks almost the same:

  ```swift
  import UIKit
  import RxSwift
  import RxCocoa

  class SearchTableViewController: UIViewController {

      @IBOutlet weak var searchTextField: UITextField!
      @IBOutlet weak var resultsTableView: UITableView!
      @IBOutlet weak var resultCountLabel: UILabel!

      private let disposeBag = DisposeBag()

      override func viewDidLoad() {
          super.viewDidLoad()

          resultsTableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
          setupBindings()
      }

      func setupBindings() {
          let results = searchTextField.rx.text.asDriver()
              .throttle(0.3)
              .flatMapLatest {
                  self.fetchResults(search: $0).asDriver(onErrorJustReturn: [])
              }

          results
              .map { "\($0.count)" }
              .drive(resultCountLabel.rx.text)
              .disposed(by: disposeBag)

          results
              .drive(resultsTableView.rx.items(cellIdentifier: "Cell")) { (_, result, cell) in
                  cell.textLabel?.text = "\(result)"
              }
              .disposed(by: disposeBag)

      }
  }
  ```

  but we've now switched to using the `Driver` trait. We start by switching from using the `ControlProperty` trait `searchTextField.rx.text` we appended the `asDriver` method to convert to a `Driver` trait which has all the properties of the `ControlProperty` trait plus a few more.

  Next, we appended `asDriver(onErrorJustReturn: [])` to `fetchResults` turning the resulting observable sequence into a `Driver` trait. Any observable sequence can be converted to `Driver` trait, as long as it satisfies 3 properties:
  * Can't error out
  * Observe on main scheduler
  * Sharing side effects (`shareReplayLatestWhileConnected`)

  How do you make sure those properties are satisfied? Just use normal Rx operators. `asDriver(onErrorJustReturn: [])` is equivalent to the following code:

  ```swift
  let safeSequence = xs
    .observeOn(MainScheduler.instance)       // observe events on main scheduler
    .catchErrorJustReturn(onErrorJustReturn) // can't error out
    .shareReplayLatestWhileConnected()       // side effects sharing
  return Driver(raw: safeSequence)         // wrap it up
  ```

  The final change is using `drive` instead of `bindTo`. `drive` is defined only on the `Driver` trait. This means that if you see `drive` somewhere in code, that observable sequence can never error out and it observes on the main thread, which is safe for binding to a UI element.
