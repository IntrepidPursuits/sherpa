# Rx{Swift,Cocoa} Sherpa
### _“How to use Rx responsibility”_

Reactive Extensions (Rx) represent a suite of operators and methods that allow for the easy understanding and reasoning about streams of data.  If you can have a source of information that emits events in a less than understandable manner, you can apply Rx operators, transforming it, through a series of small idempotent steps, into something that is easy to reason about.  Two examples of events can be transformed using Rx are text being entered into a text field and the value of an object property  that changes over time.

The combination of MVVM+Rx allows us to make use of a pattern that encourages clean decoupled application architecture that separates the view and the underlying view model that represents the state of the view over time. Ultimately the result is an application that is highly testable, easy to reason about and ultimately lower effort to maintain and extend.


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
