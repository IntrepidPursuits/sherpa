## MVVM Testing Walkthrough

To better understand testing in an MVVM architected app we will walkthrough a simple app and highlight testing approaches for the related view models.

This post will rely on a basic music app that includes a single screen for searching for albums from a web API. Each album in the search result will be displayed as a table view row in a SearchViewController. The table view displays each album as an AlbumSearchResultTableViewCell. The AlbumSearchResultTableViewCell displays an album title in a single label and the artist name, album release year on a second label and the album cover art.

In terms of view models, the SearchViewController is backed by a SearchViewModel and each AlbumSearchResultTableViewCell is backed by an AlbumSearchResultCellViewModel.

Provided below is the album model and the relevant view models.

```
struct Album {
  let title: String
  let artist: String
  let releaseDate: Date
  let imageURL: URL

  init(title: String, artist: String, releaseDate: Date, imageURL: URL) {
    self.title = title
    self.artist = artist
    self.releaseDate = releaseDate
    self.imageURL = imageURL
  }
}
```

```
class SearchViewModel {

  private let networkingLayer: NetworkingLayer

  var albumViewModels: [AlbumSearchResultCellViewModel] = []

  init(networkingLayer: NetworkingLayer = NetworkingLayer()) {
    self.networkingLayer = networkingLayer
  }

  func albumViewModelAt(index: Int) -> AlbumSearchResultCellViewModel {
    return albumViewModels[index]
  }

  func searchFor(searchTerm: String, completionHandler:@escaping () -> ()) {
    networkingLayer.searchFor(searchTerm: searchTerm) { [weak self] (albums) in

    self?.albumViewModels = albums.map( {AlbumSearchResultCellViewModel(album: $0)} )
      completionHandler()
    }
  }
}
```
```
class AlbumSearchResultCellViewModel {

  private let album: Album

  var title: String {
    return album.title
  }

  var details: String {
    return "\(album.artist) | \(releaseYear)"
  }

  var coverURL: URL {
    return album.imageURL
  }

  private var releaseYear: String {
    let calendar = Calendar(identifier: .gregorian)

    let dateComponents = calendar.dateComponents([.year], from: album.releaseDate)
    return String(dateComponents.year!)
  }

  init(album: Album) {
    self.album = album
  }
}
```

### AlbumSearchResultCellViewModel

The AlbumSearchResultCellViewModel is primarily a thin wrapper around the album model, providing some presentation logic. This type of presentation logic is a good place to start when writing view model tests. In this instance, all public variables can be easily tested by initializing the AlbumSearchResultCellViewModel with an Album. The first code below tests the basic presentation logic in the view model.

```
func testAlbumSearchResultCellViewModelProperties() {
  let releaseDate = Date(dateString: "2016-10-07T07:00:00Z")

  let album = Album(title: "Big Boat", artist: "Phish", releaseDate: releaseDate!, imageURL: URL(string: "http://www.google.com")!)
  let viewModel = AlbumSearchResultCellViewModel(album: album)

  XCTAssertEqual(viewModel.title, "Big Boat")
  XCTAssertEqual(viewModel.details, "Phish | 2016")
  XCTAssertEqual(viewModel.coverURL.absoluteString, "http://www.google.com")
}
```

This first test demonstrates how presentation logic can be tested by simply initializing a view model and confirming the return values of all publicly exposed variables.

### SearchViewModel

The SearchViewModel backs the SearchViewController. The SearchViewModel’s primary function is to act as an abstraction layer between the SearchViewController and the NetworkingLayer, by initiating the album search and creating and maintaining AlbumSearchResultCellViewModels based on the Album models returned from the search.

The entire SearchViewModel is included above but we will focus on writing tests for the search function and the AlbumSearchResultCellViewModel getter function

Below is the album search function.

```
private let networkingLayer: NetworkingLayer

init(networkingLayer: NetworkingLayer = NetworkingLayer()) {
	self.networkingLayer = networkingLayer
}

func searchFor(searchTerm: String, completionHandler:@escaping () -> ()) {
	networkingLayer.searchFor(searchTerm: searchTerm) { [weak self] (albums) in

	self?.albumViewModels = albums.map( {AlbumSearchResultCellViewModel(album: $0)} )

    	completionHandler()
    }
}
```
The view model often acts as the first layer of abstraction between the view and the business logic, networking and data layer of an app. That said, view model tests should not be responsible for testing beyond the functionality of the view model. For instance, writing a test for the above `searchFor` method should not test the actual networking layer. Instead, dependency injection should be used to inject a mock networking layer configured to simulate a functioning networking layer. As shown above, the initializer allows for injection of a mock layer. The below tests demonstrates use of the initializer to inject a mock networking layer to test the `searchFor` function. The mock networking layer simply returns a searchResults array, as would be returned by the real Networking Layer.

```
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

    waitForExpectations(timeout: 100) { error in
      if let error = error {
        print("Error: \(error.localizedDescription)")
      }
    }
}
```

The above test initializes a SearchViewModel with the MockNetworkingLayer then calls the `searchFor` function on the SearchViewModel. The test then confirms that the `searchFor` closure returns the correct number of search results and the the album at index 1 is as expected.

The `searchFor` function just returns the results from the NetworkingLayer, however in a more complex example, the SearchViewModel could perform sorting or filtering logic on the results. In that case the test would also include test coverage for such functionality.

It is important to not test too much. The tests written against the view model should only test the actual functionality of the view model itself and not the model or other services accessed by the view model. For instance, in the above example, the test should not address the interworkings of the NetworkLayer. Instead, the test should focus on the view model's use of the results returned from the NetworkLayer. Other tests can be written directed at the NetworkingLayer that will not include the view model.

The final method to test on the SearchViewModel is `albumViewModelAt`.

```
func albumViewModelAt(index: Int) -> AlbumSearchResultCellViewModel {
	return albumViewModels[index]
}
```

Testing the `albumViewModelAt` method is fairly straight forward and can be accomplished by simply creating a SearchViewModel with a known order of album elements and testing to ensure that the correct album is returned for each index, as shown below.

```
func testAlbumViewModelAtIndex() {

  let album1 = Album(title: "Big Boat", artist: "Phish", releaseDate: Date(), imageURL: URL(string: "http://www.image1.jpg")!)
  let album2 = Album(title: "Farmhouse", artist: "Phish", releaseDate: Date(), imageURL: URL(string: "http://www.image2.jpg")!)
  let album3 = Album(title: "Billy Breathes", artist: "Phish", releaseDate: Date(), imageURL: URL(string: "http://www.image3.jpg")!)

  let searchViewModel = SearchViewModel()
  searchViewModel.albumViewModels = [AlbumSearchResultCellViewModel(album: album1), AlbumSearchResultCellViewModel(album: album2),AlbumSearchResultCellViewModel(album: album3)]

  XCTAssertEqual(searchViewModel.albumViewModelAt(index: 0).title, "Big Boat")
  XCTAssertEqual(searchViewModel.albumViewModelAt(index: 1).title, "Farmhouse")
  XCTAssertEqual(searchViewModel.albumViewModelAt(index: 2).title, "Billy Breathes")
}
```

### Conclusion

As shown in the above examples, testing view models can be a good first step to provide test coverage for presentation and other basic aspects of an apps business logic. When writing tests it is important to keep the following points in mind:

- Use a view model’s public API as a guide for what tests should/could be written

- Only test functionality of the view model, do not attempt to test the functionality of any dependencies of the view model, use dependency injection if needed

The entire app codebase for this test app can be found [here](https://github.com/IntrepidPursuits/MVVMExamples-ios/tree/master/ViewModelTestingDemo).
