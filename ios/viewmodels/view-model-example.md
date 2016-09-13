# View Model Example

This file lays out an example of view model use from the Prezto project.

Prezto is an app used to create and share slideshows (preztos) directly on your mobile device.

For this example, we show the implemenation of the "saved preztos" screen, which allows a user to:

- Create a new prezto
- View a list of existing prezto's
- Delete a prezto

![SavedPreztosViewController](prezto.png)

## Parent View Model

The `SavedPreztosViewController` contains a `SavedPreztosViewModel` that provides the backing logic for fetching and deleting prezto's. 

The relevant portion is shown below:

### SavedPreztosViewController.swift
```swift
class SavedPreztosViewModel {

    var savedPreztos = [Prezto]() 

    var count: Int {
        return savedPreztos.count
    }

    func retrievePreztos(completion: (RequestResult<[Prezto]>) -> ()) {
        RequestManager.sharedInstance.getMyPreztos { result in
            switch result {
            case .Success(let preztos):
                self.savedPreztos = preztos
            case .Failure(let error):
                print("Error refreshing preztos: \(error)")
                return
            }
            completion(result)
        }
    }

    func getPrezto(index: Int) -> Prezto {
        return savedPreztos[index]
    }

    func deletePreztoAtIndex(index: Int, completion: (RequestResult<Void>) -> ()) {
        guard index < savedPreztos.count else {
            completion(.Failure("No prezto found to delete."))
            return
        }
        let prezto = savedPreztos[index]
        guard let id = prezto.id else {
            completion(.Failure("No id found on prezto."))
            return
        }

        RequestManager.sharedInstance.deletePrezto(id) { result in
            self.savedPreztos.removeAtIndex(index)
            completion(.Success())
        }
    }
}
```

## Child View Models

This `SavedPreztosViewModel` also contains an array of `SavedPreztoViewModel` objects that are used in displaying information about an individual prezto.

### SavedPreztosViewController.swift
```swift
class SavedPreztosViewModel {

    var savedPreztos = [Prezto]() {
        didSet {
            viewModels = [SavedPreztoViewModel?](count: savedPreztos.count, repeatedValue: nil)
        }
    }

    var viewModels = [SavedPreztoViewModel?]()

    func viewModelForPreztoAtIndex(index: Int) -> SavedPreztoViewModel {
        if let viewModel = viewModels[index] {
            return viewModel
        } else {
            let viewModel = SavedPreztoViewModel(prezto: savedPreztos[index])
            viewModels[index] = viewModel
            return viewModel
        }
    }
}
```

The `SavedPreztoViewModel` encapsulates view styling logic for individual cells, as well as the logic to download thumbnail images.

### SavedPreztoViewModel.swift

```swift
class SavedPreztoViewModel {

    let prezto: Prezto
    var images: [UIImage]?

    init(prezto: Prezto) {
        self.prezto = prezto
    }

    var titleLabelText: String {
        return prezto.title ?? ""
    }

    var accessCodeLabelText: String {
        guard let code = prezto.accessCode else {
            return ""
        }
        return "Access code: \(code)"
    }

    var modifiedLabelText: String {
        guard let updatedAt = prezto.updatedAt else {
            return ""
        }
        return "Modified on \(updatedAt.dateInLocalTimeZone())"
    }

    func getImages(completion: () -> Void) {
        if let _ = images {
            completion()
        } else {
            prezto.thumbnailImages { images in
                self.images = images
                completion()
            }
        }
    }
```
