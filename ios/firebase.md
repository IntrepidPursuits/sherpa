# Firebase Realtime Database: Usage and Gotchas

The purpose of this document is to capture some of our thinking around key take aways of using Google Firebase. For the best information on getting started with Firebase, checkout the guides [here](https://firebase.google.com/docs/database/).

### Requesting Remote Resources

Requesting a single resource similar to a typical REST api request

```swift
let ref = FIRDatabase.database().reference().child("user_profile").child(userIdentifier)
ref.observeSingleEvent(of: .value, with: { snapshot in
    // async callback logic
})
```

Creating an observer callback that will be called for the initial value at the destination node, if one exists, as well as whenever data below that node changes in any way.

```swift
let ref = FIRDatabase.database().reference().child("user_profile").child(userIdentifier)
let handle = ref.observe(.value, with: { snapshot in
    // async listener logic
})
```

#### Gotchas

* These callbacks never time out, even in the case of the REST like observeSingleEvent
* Observation callbacks will continue to be triggered even if the associated FIRDatabaseReference is discarded
* Observation handles need to be removed from a FIRDatabaseReference with the exact path on which they were created

```swift
let ref = FIRDatabase.database().reference().child("user_profile")
let handle = ref.observe(...)

// This
ref.remove(handle)

// Not this
FIRDatabase.database().reference().remove(handle)
```

### Querying

Firebase provides a series of query methods that allow you to [filter, order, and limit] (https://firebase.google.com/docs/database/ios/lists-of-data#sorting_and_filtering_data) the data that is retrieved.

For example, in a blogging app, if you wanted to get retrieve the last 5 blog posts about cooking, you would use a query like this:

```swift
let ref = FIRDatabase.database().reference().child("blog_posts")
let query = ref.queryOrdered(byChild: "post_date")
               .queryEqual(toValue: "cooking", childKey: "primary_category")
               .queryLimited(toLast: 5)

query.observeSingleEvent(of: .value, with: { snapshot in
    // async callback logic
})
```

Paging can be accomplished by using the data from the previous page to limit the results of the next page.

```swift
// Request initial page
let ref = FIRDatabase.database().reference().child("blog_posts")
let query1 = ref.queryOrdered(byChild: "post_date")
                .queryEnding(atValue: Date().timeIntervalSince1970, childKey: "post_date")
                .queryLimited(toLast: 5)

// Request next page
let first = ... // first entry from previous page
let ref = FIRDatabase.database().reference().child("blog_posts")
let query1 = ref.queryOrdered(byChild: "post_date")
                .queryEnding(atValue: first.postDate.timeIntervalSince1970, childKey: "post_date")
                .queryLimited(toLast: 5)

```

#### Gotchas

* Querying is not really querying, but rather selecting a subtree with limited filtering.
* You can combine a single `queryStarting` and single `queryEnding` filter, or you can use a single `queryEqual` filter. Any other attempt at combining filters will result in a runtime exception. If you need to filter any further, you'll need to bake the desired filtering into the structure of the data. For example, if you wanted to retrieve the last 5 cooking blog posts that only a specific user posted, you would have to group posts under user-specific nodes.

```swift
let ref = FIRDatabase.database().reference().child("blog_posts")
ref.queryStarting(atValue: ...).queryEnding(atValue: ...).queryEqual(toValue: ...) // Runtime Error

// If you wanted to have two categories of blog posts, one cooking and one nature, you would store two separate children:
let cookingRef = FIRDatabase.database().reference().child("blog_posts").child("cooking")
let natureRef = FIRDatabase.database().reference().child("blog_posts").child("nature")

// you have to query each child separately, and if you need to show them both, combine
// them client-side
cookingRef.queryStarting(atValue: ...).queryEnding(atValue: ...) // This is ok, checks out.
natureRef.queryStarting(atValue: ...).queryEnding(atValue: ...) // This is ok, checks out.

```

* You can only use a single `queryOrdered` modifier or else you will get a runtime exception. Any additional ordering will need to be done locally.
* You can only use a single `queryLimitedTo` modifier or else you will get a runtime exception, though, its difficult to imagine when you would want to.

### Updating Remote Resources

#### By Child Refs

```swift
let ref = FIRDatabase.database().reference().child("characters")
ref.updateChildValues([
    "Luke" : [
        "homeworld": "Tatooine",
        "species" : "human"
    ]
], withCompletionBlock: { (error, reference) in
    // Async update complete
})
```

This replaces the data for "characters/Luke" with the values for his homeworld and species.

#### By Child Key Paths

```swift
let ref = FIRDatabase.database().reference()
ref.updateChildValues([
    "characters/Luke/affiliations/rebels"  : true ,
    "groups/rebels/members/Luke": true
], withCompletionBlock: { (error, reference) in
    // Async update complete
})
```

This associates Luke with the rebels through a many-to-many relationship characters to groups.

#### By Transaction Block

```swift
let ref = FIRDatabase.database().reference().child("groups")
ref.runTransactionBlock({ data -> FIRTransactionResult in
    if let groups = data.value as? NSMutableDictionary, let rebels = groups["rebels"] as? NSMutableDictionary {
        if let likes = rebels["likes"] as? Int {
            rebels["likes"] = likes + 1
        } else {
            rebels["likes"] = 1
        }
    }
    data.value = value
    return .success(withValue: data)
}, andCompletionBlock: { (error, success, reference) in
    // Async update complete
})
```

This increments the rebels "likes" count and ensures that simultaneous increment requests do not conflict.

#### Gotchas

* Neither `updateChildValues` nor `runTransactionBlock` requests timeout when the device has no network connectivity. Instead, they update the local store immediately, triggering observer callbacks. Contrastingly, update completion callbacks do not get triggered until their request updates the server.
* When you make an update, any observers of the data that is updated will get notified of the change immediately, even if you have no network connectivity.

### Enabling Firebase Disk Persistence

Enabling Firebase disk persistence results in the local Firebase database to be saved to disk and reused between launches. This allows user to start the app to be started without network connectivity and be able to immediately begin viewing and modifying their data. Additionally, this allows for  offline data to be saved across app restarts and synced eventually when connectivity resumes.

`Database.database().isPersistenceEnabled = true`

#### Gotchas

* When database persistence is enabled, `updateChildValues`, on the other hand, is cached across app launches. However, their completion blocks do not get cached and are not called across app launches.
* When database persistence is enabled, `runTransactionBlock` requests do not persist across app launches, requiring you to create another mechanism to persisting these changes and performing them later.
* When database persistence is enabled, Firebase's query results are persisted and will remain unchanged even if the underlying data changes. (TODO: Verify)
