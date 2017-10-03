# Rx{Swift,Cocoa} Sherpa

*** **This document is under active development** ***

This document contains best practices when using RxSwift, RxCocoa, and other Rx libraries in iOS projects.

## Rx-enabled View Models

### Setting up your Observables

When possible, a ViewModel's observable sequences should be setup in a declarative fashion within the ViewModel's `init` method or in lazily declared properties. This allows you to specify your exposed observables as non-optional immutable `let` properties.

```
private let user = Variable<User?>(nil)
let username: Observable<String>

init(identifier: String) {
  APIClient.user(withIdentifier: identifier).catchErrorJustReturn(nil).bind(to: user).disposed(by: disposeBag)
  username = user.asObservable.map({ $0.username })
}
```

The majority of a ViewModel's exposed observable sequences will be observed by objects in the UI layer. CocoaTouch requires that UI updates be performed on the main thread. Additionally, since these observations should generally continue until the ViewController leaves the screen, the observed sequences should not complete or error. For these reasons, you should use the correct observable type for the given situation:

* Use a `Driver` when data is set by the ViewModel and is read-only from the View's perspective
* Use a `Variable` when double-binding is required to allow the observing View to update observable sequence's most recent value based on user input
* Use of `Observable` should be limited to when the initial stream is a immediately available; although, in these cases, a plain swift property may be sufficient

__Open Question: Should we be advocating against using Observable at all?__

### Observing

You should prefer `.bind(to: ...)` or `.drive(...)` over `.subscribe(...)` as these are more declarative and less prone to user error.

**Do this**
```
// Binding
viewModel.titleObservable.bind(to: titleLabel.rx.text).disposed(by: disposeBag)
// Driving
viewModel.titleDriver.drive(titleLabel.rx.text).disposed(by: disposeBag)
```
**Not this**
```
// Subscribing
viewModel.title.subscribe(onNext: { [weak self] title in self?.titleLabel.text }).disposed(by: disposeBag)
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
  disposeBag = DisposeBag
}
```

Similarly, each custom (Table|Collection)ViewCell should be giving a `var` DisposeBag that is replaced in `prepareForReuse`. This allows cells to disable old bindings and free up resources as the cells are dequeued and reused.

```
override func prepareForReuse() {
  super.prepareForReuse()
  cellReuseBag = DisposeBag
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
