# iOS Testing References

## Why do we write tests?

Project stakeholders are not always sold on the benefits of writing tests. Here are a few arguments to help convince them:

* Automated tests allow you to catch bugs as they are being introduced, instead of being caught by users
* You can integrate new code faster and with more confidence if there are tests looking for regression bugs
* Manually testing edge cases often takes a long time to setup and perform, and those actions must be done every time you want to test them, automated edge case tests only need to be setup once and can be run over and over
* Testing forces you to write maintainable code because it is generally harder to test poorly designed code
* Good tests are effective documentation making it easier to introduce new developers to a project

## Types of Tests

### Unit Tests

Unit testing is a software development process in which the smallest testable parts of an application, called units, are individually and independently scrutinized for proper operation. In terms of iOS development, the unit may be as small as testing the public API on a given object.

In order for unit tests to be useful, they must:
* Run Often - tests need to be run often so that they catch bugs as they are introduced
* Run Quickly - tests need to run quickly so that they can actually be run often without slowing development
* Run Reliably - tests should only fail if there is a bug in the system under test
* Be Readable - failing tests that are difficult to read will be even harder to fix

### Integration Tests

Integration testing is the phase in software testing in which individual software modules are combined and tested as a group. This could include testing the integration of a networking layer with an active web API. The iOS team is not currently focused on implementing integration tests.

### UI Tests

UI testing is the process of ensuring proper functionality of the UI for a given application and making sure it conforms to its written specifications. Xcode provides a UI testing framework to make writing UI tests easier but the iOS team is not currently focused on writing UI tests.

## Testing Framework

The iOS Team's default approach is to use the XCTest Framework when writing tests. Given that XCTest is an official Apple supported testing framework our guidance is to use XCTest.

The iOS Team has experience with additional testing frameworks, such as Quick/Nimble. However, while these can be used, the guidance is to use XCTest until you have fully grasped the process of writing tests.

## What to Test

The iOS team is currently focused on writing unit tests against Models and ViewModels. By adopting an MVVM architecture, most business logic will be extracted from the ViewController and included in a ViewModel, thereby making this business logic more testable. For a more detailed look at Testing and MVVM see this related [reference] (https://github.com/IntrepidPursuits/sherpa/blob/master/ios/MVVM_Testing.md).

## Testing Tools

Provided below is a list of commonly used tools when writing tests.

### OHHTTPStubs - Web stubbing

Two guiding principles for unit tests from above are that they must run quickly and reliably. When unit testing portions of a codebase that rely on web resources, it is not possible for those tests to make actual webcalls because the testing speed and reliability would depend on the testing environment's netowrk connectivity. Luckily, webcall stubbing makes these tests possible by intercepting webcalls before they go out and immediately returning a pre-canned response.

[OHHTTPStubs](https://github.com/AliSoftware/OHHTTPStubs) is the recommended tool for webcall stubbing. OHHTTPStubs allows for stubbing of specific webcalls or all web traffic. Stubbed webcalls are intercepted and allow for a static file (JSON/XML/etc) to be returned.

In addition to testing code that depends upon existing web APIs, webcall stubbing enables you to code and test against web resources that are not yet available. Once there is an agreed upon API spec, your tests can stub the spec and test against those stubbed endpoints as if they were real.

### Quick - Behavior Driven Development (BDD)

[Quick](https://github.com/Quick/Quick) is a behavior-driven development framework for Swift, inspired by RSpec and Specta. It allows you to organize your tests hierarchically and encourages you to test directly against your acceptance criteria. Tests written using Quick are designed to be as human readable as possible, so they have the added benefit of being effective documentation.

### Nimble - Matcher Framework

[Nimble](https://github.com/Quick/Nimble) is matcher framework and supports many more assertion types than basic XCTAssert, including collection-member-matching, string-parsing, and single-line-asynchronous-expectations. The readability of Nimble's assertions lends itself well to BDD and is frequently used with Quick; however, Nimble is powerful enough to warrant using even if you do not wish to do BDD.

## Testing Terms

In the following, we will introduce a series of testing terms and how they apply to testing real-world asynchronous classes with dependencies.

### Dependency Injection

Dependency Injection is the process of providing an object with any external dependencies required to test the functionality of the object. This could include injecting a mock networking layer, data store layer or any other dependency. The dependency is usually injected via an initializer.

Provided below is an example of dependency injection.

```swift

protocol NetworkingLayer {
    func searchFor(searchTerm: String, completionHandler:@escaping (Result<[Album]>) -> ())
}

class SearchViewModel {

    private let networkingLayer: NetworkingLayer

    var albums: [Albums] = []

    init(networkingLayer: NetworkingLayer = DefaultNetworkingLayer.instance) {
        self.networkingLayer = networkingLayer
    }

    func searchFor(searchTerm: String, completionHandler: (Result<[Album]>) -> ()) {
        networkingLayer.searchFor(searchTerm: searchTerm) { [weak self] (albums) in
            self?.albums = albums
        }
    }
}
```

In the above example, the `SearchViewModel` can be initialized with a `NetworkingLayer` to allow a mock `NetworkingLayer` to be injected into the `SearchViewModel`. In this example `NetworkingLayer` is a protocol and as a result the live and mock network layers can both conform to the protocol. The class `DefaultNetworkingLayer` conforms to `NetworkingLayer` and is included as a default initializer. Using protocol is an effective way to implement dependency injection.

### Mocking

As eluded to in the previous section, mocking is a process of creating a dummy or 'mock' object, which will simulate the behavior of a real dependency. This is useful if the real objects are impractical to incorporate into a unit test.

In the above example, we would like to isolate `SearchViewModel` from any real world implementation of `NetworkingLayer`. We do this by implementing a mock version of `NetworkingLayer`, which will run predictably during our testing of `SearchViewModel`:

```swift
class MockNetworkingLayer: NetworkingLayer {
    var stubbedResult: Result<[String]> = Result.failure(APIError())
    func searchFor(searchTerm: String, completionHandler: @escaping (Result<[String]>) -> ()) {
        DispatchQueue.main.async {
            completionHandler(self.stubbedResult)
        }
    }
}
```

We can now test how `SearchViewModel` will behave regardless of how its dependency performs:

```swift

func testSearchWithSuccess() {
    let mockNetworkingLayer = MockNetworkingLayer()
    let viewModel = SearchViewModel(networkingLayer: mockNetworkingLayer)
    mockNetworkingLayer.stubbedResult = Result.success([album1])
    viewModel.searchFor(searchTerm: "Big")
    // verify SearchViewModel properly handles successful searches
    ...
}

func testSearchWithFailure() {
    let mockNetworkingLayer = MockNetworkingLayer()
    let viewModel = SearchViewModel(networkingLayer: mockNetworkingLayer)
    mockNetworkingLayer.stubbedResult = Result.failure(APIError())
    viewModel.searchFor(searchTerm: "Big")
    // verify SearchViewModel properly handles failed searches
    ...
}

```

_NOTE: Other languages have automatic mocking tools; however, because of limitations in the Swift language, you are forced to write your own mocks._

### Argument Spying

In addition to verifying how the system responds to output from its dependencies, we also want to verify that it is sending the correct inputs to those dependencies. We do this by spying on the arguments passed to the dependency.

Amending on the mocking example above:

```swift
class MockNetworkingLayer: NetworkingLayer {
    var stubbedResult: Result<[String]> = Result.failure(APIError())
    var capturedSearchArguments = [String]()
    func searchFor(searchTerm: String, completionHandler: @escaping (Result<[String]>) -> ()) {
        capturedSearchArguments.append(searchTerm)
        DispatchQueue.main.async {
            completionHandler(self.stubbedResult)
        }
    }
}
```

This allows us to make expectations on how `SearchViewModel` interacts with its dependency:

```swift
func testSearchWithSuccess() {
    ...
    viewModel.searchFor(searchTerm: "Big")
    XCTAssertEqual(mockNetworkingLayer.capturedSearchArguments, ["Big"])
    ...
}
```

In the above code, we are establishing the expectation that when `SearchViewModel.searchFor` is called, it will in turn call `NetworkingLayer.searchFor` exactly once with the correct search term.

### Expectations

An expectation is the tool for testing an asynchronous function. An expectation allow a unit test to execute an asynchronous function and only fail the test if the asynchronous function fails to succeed within a defined amount of time.

Below is a basic web search test that uses an expectation

```swift
func testBasicAlbumSearch() {

  let album1 = Album(title: "Big Boat", artist: "Phish", releaseDate: Date(), imageURL: URL(string: "http://www.image1.jpg")!)
  let album2 = Album(title: "Farmhouse", artist: "Phish", releaseDate: Date(), imageURL: URL(string: "http://www.image2.jpg")!)
  let album3 = Album(title: "Billy Breathes", artist: "Phish", releaseDate: Date(), imageURL: URL(string: "http://www.image2.jpg")!)

  let mockNetworkingLayer = MockNetworkingLayer()
  let searchViewModel = SearchViewModel(networkingLayer: mockNetworkingLayer)
  mockNetworkingLayer.stubbedResult = Result.success([album1, album2, album3])

  let albumSearchExpectation = expectation(description: "Validation")

  searchViewModel.searchFor(searchTerm: "Phish") {
    XCTAssert(searchViewModel.albumViewModels.count == 3)

    let album = searchViewModel.albumViewModelAt(index: 1)
    XCTAssertEqual(album.title, "Farmhouse")
    albumSearchExpectation.fulfill()
  }
  XCTAssertEqual(mockNetworkingLayer.capturedSearchArguments, ["Big"])

  waitForExpectations(timeout: 10) { error in
    if let error = error {
      print("Error: \(error.localizedDescription)")
    }
  }
}
```

In the above code, the `SearchViewModel.searchFor` function is an asynchronous function that searches for albums based on the name of an artist. By using the `albumSearchExpectation` the test will execute the `searchFor` function and only triggers a failing test if the `albumSearchExpectation` is not fulfilled in the TimeInterval defined in `waitForExpectations`.
