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

The iOS Team has experience with the following additional testing frameworks, which can be used however the guidance is to use XCTest.

* Quick/Nimble (https://github.com/Quick/Nimble) 

## What to Test

The iOS team is currently focused on writing unit tests against Models and ViewModels. By adopting an MVVM architecture, most business logic will be extracted from the ViewController and included in a ViewModel, thereby making this business logic more testable. For a more detailed look at Testing and MVVM see this related [reference] (https://github.com/IntrepidPursuits/sherpa/blob/master/ios/MVVM_Testing.md). 

## Testing Tools

Provided below is a list of commonly used tools when writing tests. 

### Web stubbing

Stubbing webcalls is required when unit testing portions of a codebase that relied on web resources. The desired stubbing tool is OHHTTPStubs (https://github.com/AliSoftware/OHHTTPStubs). OHHTTPStubs allow for stubbing of specific webcalls or all web traffic. Stubbed webcalls are intercepted and allow for a static file (JSON/XML/etc) to be returned.

## Testing Terms

### Dependency Injection

Dependency Injection is the process of providing an object with any external dependencies required to test the functionality of the object. This could include injecting a mock networking layer, data store layer or any other dependency. The dependency is usually injected via an initializer. 

Provided below is an example of dependency injection.

```swift

protocol NetworkingLayer {
    func searchFor(searchTerm: String, completionHandler:@escaping ([String]) -> ())
}

class SearchViewModel {
    
    private let networkingLayer: NetworkingLayer
    
    var albums: [Albums] = []
        
    init(networkingLayer: NetworkingLayer) {
        self.networkingLayer = networkingLayer
    }

    func searchFor(searchTerm: String) {
        networkingLayer.searchFor(searchTerm: searchTerm) { [weak self] (albums) in
            self?.albums = albums
        }
    }
}
```

In the above example, the `SearchViewModel` can be initialized with a `NetworkingLayer` to allow a mock `NetworkingLayer` to be injected into the `SearchViewModel`. In this example `NetworkingLayer` is a protocol and as a result the live and mock network layers can both conform to the protocol. Using protocol is an effective way to implement dependency injection.

### Expectations

An expectation is the tool for testing an asynchronous function. An expectation allow a unit test to execute an asynchronous function and only fail the test if the asynchronous function failes to succeed within a defined ammount of time.

Below is a basic web search test that uses an expectation

```swift
func testBasicAlbumSearch() {

  let album1 = Album(title: "Big Boat", artist: "Phish", releaseDate: Date(), imageURL: URL(string: "http://www.image1.jpg")!)
  let album2 = Album(title: "Farmhouse", artist: "Phish", releaseDate: Date(), imageURL: URL(string: "http://www.image2.jpg")!)
  let album3 = Album(title: "Billy Breathes", artist: "Phish", releaseDate: Date(), imageURL: URL(string: "http://www.image2.jpg")!)

  let mockNetworkingLayer = MockNetworkingLayer(searchResults: [album1, album2, album3])
  let searchViewModel = SearchViewModel(networkingLayer: mockNetworkingLayer)

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
