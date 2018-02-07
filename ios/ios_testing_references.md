# iOS Testing References

## Types of Tests

### Unit Tests

Unit testing is a software development process in which the smallest testable parts of an application, called units, are individually and independently scrutinized for proper operation. In terms of iOS development, the unit may be as small as testing the public API on a given object.

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

Stubbing webcalls is required when unit testing portions of a codebase that relied on web resources. The desired stubbing tool is [OHHTTPStubs](https://github.com/AliSoftware/OHHTTPStubs). OHHTTPStubs allow for stubbing of specific webcalls or all web traffic. Stubbed webcalls are intercepted and allow for a static file (JSON/XML/etc) to be returned.

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

As eluded to in the previous section, mocking is a process of creating a dummy or 'mock' object, which will simulate the behavior of a real dependency. This is useful if the real objects are impractical to incorporate into a unit test. Objective-C has access to tools like OCMockito which allow you to automatically generate mock objects at runtime. Unfortunately, because of limitations in the Swift language, you are forced to write your own mocks.

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

    waitForExpectations(timeout: 10) { error in
      if let error = error {
        print("Error: \(error.localizedDescription)")
      }
    }
}
```

In the above code, the `SearchViewModel.searchFor` function is an asynchronous function that searches for albums based on the name of an artist. By using the `albumSearchExpectation` the test will execute the `searchFor` function and only triggers a failing test if the `albumSearchExpectation` is not fulfilled in the TimeInterval defined in `waitForExpectations`.
