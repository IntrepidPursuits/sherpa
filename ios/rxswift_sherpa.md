# Rx{Swift,Cocoa} Sherpa

*** **This document is under active development** ***

This document contains best practices when using RxSwift, RxCocoa, and other Rx libraries in iOS projects.

## Rx-enabled View Models

### Setting up your Observables

When possible, a ViewModel's observable sequences should be setup in a declarative fashion within the ViewModel's `init` method or in lazily declared properties. This allows you to specify your exposed observables as non-optional immutable `let` properties.

```
private let user = Variable<User?>(nil)
let username: Driver<String>
let disposeBag = DisposeBag()

init(identifier: String) {
  APIClient.user(withIdentifier: identifier).catchErrorJustReturn(nil).bind(to: user).disposed(by: disposeBag)
  username = user.asDriver().map({ $0?.username ?? "" })
}
```

#### What type of observable should I use?

The majority of a ViewModel's exposed observable sequences will be observed by objects in the UI layer (aka, view-binding). CocoaTouch requires that UI updates be performed on the main thread. Additionally, RxCocoa requires that UI bindings never emit errors and will trigger runtime exceptions if errors occur. When Views are going to bind to these sequences they need assurances that these rules are followed. For these reasons, you should use the correct observable type for the given situation:

* Use a `Driver` when data is read-only from the View's perspective
  * `Driver` is specifically for observations in the UI Layer
  * `Driver` is roughly equivalent to `Observable` + `.observeOn(MainScheduler.instance)` + `.shareReplayLatestWhileConnected()`
* Use a `Variable` when bi-directional binding is required to allow the observing View to append to the observable sequence based on user input
  * **Note:** `Variable` does not imply that it will emit on the main thread so the view will have to observe carefully (see Observing bellow)
* Use an ordinary swift property when the value never changes and can avoid the overhead of wrapping it in Rx.
* Exposing sequences of type `Observable` for view-binding should generally be avoided on ViewModels
  * They have no implication that it will emit only on the main thread
  * They have no implication that they will not error out

### Observing

You should prefer `.bind(to: ...)` or `.drive(...)` over `.subscribe(...)` as these are more declarative and less prone to user error.

**Do this**
```
// Driving from a Driver
viewModel.titleDriver.drive(titleLabel.rx.text).disposed(by: disposeBag)

// Driving from a Variable
viewModel.titleVariable.asDriver().drive(titleLabel.rx.text).disposed(by: disposeBag)

// Safely driving from an Observable
viewModel.titleObservable.asDriver(onErrorJustReturn: "").drive(to: titleLabel.rx.text).disposed(by: disposeBag)
```
**Not this**
```
// Subscribing
viewModel.titleObservable.subscribe(onNext: { [weak self] title in self?.titleLabel.text }).disposed(by: disposeBag)

// Dangerously binding
viewModel.titleObservable.bind(to: titleLabel.rx.text).disposed(by: disposeBag)
```

#### Where to perform the bindings?

A ViewModel's observables should be bound to a ViewController's outlets from `viewWillAppear` or in a dependent method. This allows time for the ViewModel to be injected into the ViewController (if necessary) and for the outlets initial value to be set prior to the View being displayed on screen. Additionally, it allows for the disposal and rebinding when the view controller leaves and returns to the screen.

```
override func viewWillAppear(_ animated: Bool) {
  super.viewWillAppear(animated)
  viewModel.title.bind(to: self.rx.title).disposed(by: disposeBag)
}
```

When a ViewModel's observables apply to outlets on custom (Table|Collection)ViewCells in a ViewController, the observables should be bound in a `configure(with viewModel: ...)` method in the custom cell class. This allows cell to limit the exposure of its outlet properties.

```
// In the ViewController
viewModel.profileSummary.bind(to: profileCollectionView.rx.items(cellIdentifier: ProfileCollectionViewCell.reusableIdentifier, cellType: ProfileCollectionViewCell.self)) { (_, element, cell) in
  cell.configure(with: element)
}.disposed(by: disposeBag)

// In the Cell
func configure(with viewModel: ProfileViewModel) {
  viewModel.username.bind(to: usernameLabel.rx.image).disposed(by: cellReuseBag)
  viewModel.title.bind(to: titleLabel.rx.image).disposed(by: cellReuseBag)
  viewModel.image.bind(to: imageView.rx.image).disposed(by: cellReuseBag)
}
```

### Disposing

Each ViewController should be given a `var` DisposeBag for use with outlet bindings and other subscriptions. This bag should be replaced within `viewWillDisappear`, or in a dependent method, and balances against the bindings performed in `viewWillAppear`. This allows the ViewController to disable UI updates while it is not on screen.

```
override func viewWillDisappear(_ animated: Bool) {
  super.viewWillDisappear(animated)
  disposeBag = DisposeBag()
}
```

Similarly, each custom (Table|Collection)ViewCell should be giving a `var` DisposeBag that is replaced in `prepareForReuse`. This allows cells to disable old bindings and free up resources as the cells are dequeued and reused.

```
override func prepareForReuse() {
  super.prepareForReuse()
  cellReuseBag = DisposeBag()
}
```

## Testing

### Asynchronous tests with [Nimble](https://github.com/Quick/Nimble) and [RxBlocking](https://github.com/ReactiveX/RxSwift/tree/master/RxBlocking)

Frequently when testing an observable sequence, you only care that when a certain condition is reached, the sequence will emit a specific value. You can combine Nimble's asynchronous testing with RxBlocking's subscriptions to make simple boilerplate free tests.

**Do this**
```
doSetup(username: "john_doe")
expect(sut.username.first()).toEventually(equal("john_doe"))
```
**Instead of this**
```
var username = ""
let usernameExpectation = expectation(description: "username")
sut.username.subscribe(onNext: {
  username = $0
  asyncExpectation.fulfill()
}).disposed(by: disposeBag)
doSetup(username: "john_doe")
waitForExpectations(timeout: 1.0) { [weak self] error in
  XCTAssertEqual(username, "john_doe")
}
```

---

### A practical example of RxSwift

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

---

### _“How to use Rx responsibility”_

* What is ReactiveX all about?
  * Reactive Extensions (ReactiveX / Rx) is about reacting to the events whether they’re synchronous or asynchronous
    * In this way it can also feel like a solution for threading
* Best practices for the novice
  * Start by just connecting viewmodels to views
  * Keep your bindings between viewmodel and view in the view controller (ie in one file)
  * If you find that your binding to different elements of the viewmodel but repeating the same action in the view move the the logic to the viewmodel and create a single observable
  * Instead of using a Variable<Bool> or Variable<Int> as signal (ie you’re not actually interested in the value but just a signal) use an Observable<Void>
  * Basics of observables, subscriptions, and disposables
  * Creating basic observables (Observable.of, from, empty, never, etc.)
* Best practices for the the more advanced
  * Creating custom observables (Observable.create)
  * Combining observables (combineLatest, merge, concat, flatMap*)
  * Common operators for modeling an observable (startWith, filter, map, scan)
  * Hot vs cold observables
  * Connectable observables & related operators (publish + connect, replay*, shareReplay*)
  * RxSwift specific “traits” (Single, Completable, Maybe, Driver) and special types (*Subject, Variable)
  * Bridging imperative and rx code (using *Subjects & Variables or bridging delegates)
  * Threading (observeOn vs subscribeOn)
  * Error handling (catch, retry, subscription)
  * Unit testing (i.e. RxTest & RxBlocking quick guide)
* When shouldn’t you use Rx?
  * Rx is like Ruby. It’s very easy to make use of it but it’s also very easy to use it poorly
  * Failing to understand the complexities of the tool can easily lead to misuse which appears benign in the short term but can lead to many problems in the long term
* Some patterns
  * Networking & Handling network errors properly
  * Chaining network requests (with flatMap)
  * Online/Offline data?
  * Processing user input

---

### References:

* RxSwift - https://github.com/ReactiveX/RxSwift
* RxCocoa - https://github.com/ReactiveX/RxSwift/tree/master/RxCocoa
* Getting started with RxSwift and RxCocoa - https://www.raywenderlich.com/138547/getting-started-with-rxswift-and-rxcocoa
* RxSwift (eBook) - https://store.raywenderlich.com/products/rxswift
* RxMarbles - http://rxmarbles.com
* Introduction to Rx - http://www.introtorx.com
* ReactiveX - http://reactivex.io
* RxSwift docs - https://github.com/ReactiveX/RxSwift/tree/master/Documentation
* Reactive Extensions - https://en.wikipedia.org/wiki/Reactive_extensions
