This document tries to provide a high level overview of some key differences (and similarities) of developing for Android versus developing for iOS. It is aimed to be a reference for people who are starting to or are considering switching from one mobile platform to another.

# Language

**TL;DR: Kotlin is more convenient, Swift is more powerful**

## Common features and similarities (Kotlin and Swift)
* Mainly object oriented (classes, inheritance, interface/protocol)
* Statically typed
* Type inference with option to specify explicit type
* Type alias
* Extensions
* Generics
* Optionals
* Properties
* Higher order functions
* Default method parameters
* Operator overloading
* Interoperable with the previous language (with Java and Objective-C respectively)
* Semicolons are optional

## Memory management
Kotlin and Java uses [garbage collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)), which handles pretty much all the memory deallocation automatically, with the downside being that it can cause performance issues (ex: frame drop) when it runs and it is very hard/impossible to predict when it is triggered. It's very difficult to create an actual memory leak where an object exists in memory but there's no way to reference it ([here's one way](https://stackoverflow.com/a/6471947/4051916)), but soft memory leaks can still occur by holding references to obsolete variables. A very common one on Android is holding reference (often static reference) to an Activity that was destroyed and can no longer be used.

Swift and Objective-C uses [automatic reference counting (ARC)](https://docs.swift.org/swift-book/LanguageGuide/AutomaticReferenceCounting.html), which makes it more predictable on when memory is deallocated, but requires more care to avoid retain cycles (ie: memory leaks). This happens when an object A references object B, and B also references back to A (ex: in MVP, View references Presenter while Presenter also references View, which is probably part of reason iOS prefers MVVM instead). This is solved by marking one of the reference as `weak` or `unowned` to break the cycle. This problem can also manifest itself when a lambda/closure references `self` inside of it and is held by a member variable (it’s not a problem if the lambda/closure is held by a local variable). This can be solved by using a [capture list](https://docs.swift.org/swift-book/ReferenceManual/Expressions.html#Capture%20Lists) and marking `self` as `weak` or `unowned`.

## Struct vs Data Class
Kotlin and Swift both offer another construct for representing objects in additional regular classes. Swift has [structs](https://docs.swift.org/swift-book/LanguageGuide/ClassesAndStructures.html#ID88) (which is a bit different from C structs), and Kotlin has [data classes](https://kotlinlang.org/docs/reference/data-classes.html). Swift's struct is not equivalent to Kotlin’s data class, although they sometimes are used for the same purpose.

Data class’ main feature is to provide a default `equals()`, `hashcode()`, and `copy()` method and [destructuring](https://kotlinlang.org/docs/reference/multi-declarations.html). So it is still a class, but with a couple of functions already implemented.

Struct’s main feature to is to serve as value type and enforce immutability, so it behaves differently from class, particularity when the object is passed around. (Swift 4.1 also added automatic synthesizer to implement Equatable and Hashable)

They both forbid subclassing and are often be used for models.

## Extensions + Protocol/Interface
Swift’s [extension](https://docs.swift.org/swift-book/LanguageGuide/Extensions.html) is a bit more powerful as it allows adding protocol conformance to existing classes (including unmodifiable classes from framework/libraries). So in addition to adding new helper methods to classes, Swift’s extension is also commonly used to provide default implementation of protocols (since protocols doesn’t directly support it). Along with it, the common pattern is to use [protocols+extensions for inheritance](https://medium.com/nsistanbul/protocol-oriented-programming-in-swift-ad4a647daae2) instead a single base class (this is also used to emulate an abstract class).

Kotlin’s [extensions](https://kotlinlang.org/docs/reference/extensions.html) are on a per method basis, so it can only be used to add helper methods and cannot be used to add interface conformance. On the plus side, the extensions can be declared inside another class, which allows it to access the private properties/methods of that class.

Both Kotlin and Java provides [abstract class](https://kotlinlang.org/docs/reference/classes.html#abstract-classes). This, coupled with the (historic) lack of flexibility on interfaces and extensions, has led to many BaseClasses for sharing common functionalities. Kotlin and newer version of Java allows for default implementation within interfaces. However, since it’s kinda new, the pattern of using interfaces to implement common functionality over base class is not well adopted yet.

## Generics
Java and Kotlin generic has [type erasure](https://stackoverflow.com/a/339708/4051916) (mainly to provide backwards compatibility), which causes the generic's type info to be lost at runtime and limits its usability. Kotlin inline functions does allow reified generic to provide generic type info at runtime.

In Swift, the generic's type info is available at runtime. So you can get do class check, call its init, etc from the generic class.

## Enum
Swift’s enum is much more powerful than Java/Kotlin’s enum as they can hold [associated values](https://docs.swift.org/swift-book/LanguageGuide/Enumerations.html). However, Kotlin’s [sealed class](https://kotlinlang.org/docs/reference/sealed-classes.html) basically function the same way as Swift enums.

## Namespace
Java and Kotlin classes/methods/extensions/etc are grouped into [packages](https://www.protechtraining.com/content/java_fundamentals_tutorial-packaging), which usually (but don't have to) mirrors the file folder structure. A module can and usually do contain multiple packages. As such, a module can have multiple files/classes/methods/extensions/etc of the same name if the files reside in different packages. Selecting the correct version can be done by [importing the desired package](https://kotlinlang.org/docs/reference/packages.html#imports) near the top of file or using the full package name when referencing it.

Swift is namespaced by module, so it's not possible to have multiple files, classes, or top-level methods/variables of the same name in a module, but it's okay if they are from different modules. Selecting the correct version works similarly as Java/Kotlin by either adding [import statements](https://docs.swift.org/swift-book/ReferenceManual/Declarations.html#ID354) or using the full module name when reference it.\
Objective-C doesn't have namespace, so it's common to see legacy code adding prefixes to class names, ex NSString.

## Other Kotlin features
* `if` and `when` statements can also return value. ex: `val z = if (x>y) 5 else 10`
* [Class](https://kotlinlang.org/docs/reference/delegation.html) and [Property](https://kotlinlang.org/docs/reference/delegated-properties.html) Delegation.
* [object](https://kotlinlang.org/docs/reference/object-declarations.html#object-declarations) declaration for  declaring single instance classes. Useful for singletons or collection of static methods.
* Static methods/properties are not supported, use [companion object](https://kotlinlang.org/docs/reference/object-declarations.html#companion-objects) instead.
* [Scoping](https://kotlin.guide/scoping-functions) functions to streamline operations on variables.
* [Coroutines](https://kotlinlang.org/docs/reference/coroutines.html) for easier threading / async execution.
* Extensive [annotation](https://kotlinlang.org/docs/reference/annotations.html) support.

## Other Swift features
* [Guard](https://docs.swift.org/swift-book/ReferenceManual/Statements.html#ID434) statements for more readable early return.
* [Tuples](https://docs.swift.org/swift-book/LanguageGuide/TheBasics.html#ID329) for returning multiple values. (Kotlin recommends using `data class` instead).
* Protocol can also specify static variable/property and method requirements.
* [`class` methods](https://docs.swift.org/swift-book/LanguageGuide/Methods.html#ID241), which is basically static method but can also be overidden by subclasses and behaves polymorphicly.

# Framework

## Lifecycle
Android [lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle) is quite [convoluted](https://raw.githubusercontent.com/xxv/android-lifecycle/master/complete_android_fragment_lifecycle.png). The Activity and Fragment lifecycle methods (`onCreate()`, `onStart()`, `onPause()`, etc) are quite generic, and can be triggered by many different reasons, which include app backgrounding and resuming, navigating to another Activity/Fragment, device rotation, overlay from system or another app, etc. Often times, it's quite difficult to determine programmatically what triggered the lifecycle event. The theory is that the app should be able to handle the events the same way regardless of what the cause is. However, that is often times not the case in practice.

When an Activity instance is destroyed (regardless of if it's due to device rotation or going to another screen), the instance is considered obsolete and it should not be called anymore (calling its UI methods would trigger a crash, and and holding a reference to it is a memory leak). When the screen is shown again, a new instance is created. If the Activity is only being destroyed temporarily (ex due to device rotation or backgrounded, but not when navigating to another activity), the OS will attempt to pass some of the data from the old instance to the new instance. However, only some of the data is passed/restored automatically (mostly the UI widget state such as EditText's text), any extra variables in the Activity would need to be manually saved and restored by the developer through [saveInstanceState bundle](https://developer.android.com/guide/components/activities/activity-lifecycle#saras), which requires the data to be either Serializable or Parcelable. Also note that often times when an app is backgrounded and the Activity is destroyed, the application itself is still alive and remains in memory. When the app is brought back to foreground, it will recreate and launch the destroyed Activity instead of starting from the initial Activity (it's even possible for the application to also be killed by the OS, which resets the static variables, and the OS would still relaunch app from the Activity where it left off instead of from the initial Activity).

Example 1: User navigates from Activity A to Activity B (Activity A is destroyed at this point). Activity B has a button which when clicked will update the `count` variable and also set an EditText's text to the current count. User clicks on the button 5 times, and then backgrounds the app. The app is left in the background for a while which destroys the Activity B. When user opens the app again, Activity B is recreated and launched. The EditText's text would still say 5 since the OS automatically restores that UI state. However, the variable `count` would be resetted to 0, unless the developer manually saves and restores it.\
Example 2: An Activity sends a long network request with the intend of using the response to update the UI. The device is then rotated before the response comes back, which caused the old instance to be destroyed and a new instance to be created and shown. However, the old network request is still alive and still holds the reference to the old Activity instance, which would crash the app when the response comes back and tries to call the UI method on the old Activity reference. The developer would need a way to either cancel the old request or decouple the response handling from the Activity/UI.

Side note: Fragment can be though of as a mini Activity. They behave similarly in many ways. An Activity can host one or more fragments.


iOS's [lifecycle](https://developer.apple.com) is much simpler compared to Android, partly due to the fact that the ViewController and View's lifecycle is separate from the application lifecycle. The VC's lifecycle methods (`viewDidLoad()`, `viewWillAppear()`, `viewDidDisappear`, etc) are triggered based on the VC's view state (ex: if the user has just entered the VC or is navigating to another VC). Whether the app is backgrounded or returned to the foreground has no bearing and won't trigger these methods.\
If a ViewController (or any other class) wants to handle when the app is backgrounded or resumed, they can subscribe to the `UIApplicationDidBecomeActive` and `UIApplicationWillResignActive` notification.\
When the app is backgrounded, code execution is paused and the whole app state is basically saved/ remain in memory. When the user returns to the app, the paused code just resumes from where it left off as if the backgrounding never happened (if the hasn’t been killed by OS yet). If the app has been backgrounded for too long and the OS is running out of memory, the OS would just kill the app and user will have to start from the beginning when they relaunch the app. iOS does provide some way to [preserve app state](https://developer.apple.com/documentation/uikit/view_controllers/preserving_your_app_s_ui_across_launches) across relaunches, but that seems to be rarely used.
Also, the app and ViewController state is not lost when performing a device rotation.

A **very rough approximation** of corresponding lifecycle calls between the two platforms:

|Android | iOS|
|---|---|
|`onCreate()` | `viewDidLoad()`|
|`onStart()` | `viewWillAppear()`|
|`onResume()` | `viewDidAppear()` / `UIApplicationDidBecomeActive` notification|
|`onPause()` | `viewWillDisappear()` / `UIApplicationWillResignActive` notification|
|`onStop()` | `viewDidDisappear()`|
|`onDestroy()` | n/a, `deinit()` |

## Background execution
On Android, when an app is backgrounded, the Activity is still technically alive and can still keep running its operations. However, it is recommended not to have Activity run tasks while it's backgrounded, as this could lead to memory leaks, and calling certain methods while backgrounded will crash the app. Android provides a [Service](https://developer.android.com/guide/components/services) class for long running background jobs that do not require an UI. They are independent from Activities and can be run without one or alongside one. Multiple Services can also be run at the same time. Historically, Service has a lot of freedom and can perform all the operations that an Activity can perform (minus the UI stuff). However, recent versions of Android has begin to [limit some of its capabilities](https://developer.android.com/about/versions/oreo/background). This can be overcome by making a Service [foreground](https://developer.android.com/guide/components/services#Foreground), which requires it to show a notification while running. [WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager/) can be used to schedule a Service to start even when the app is not running.

On iOS, when an app is [backgrounded](https://developer.apple.com/library/archive/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/BackgroundExecution/BackgroundExecution.html), all of its code execution is paused, though apps have [approximately five seconds](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622997-applicationdidenterbackground) to finish its current operations and clean up. Apps can request some additional time (up to about 3 minutes) for [finite-length tasks](https://developer.apple.com/library/archive/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/BackgroundExecution/BackgroundExecution.html).\
Apps can declare support for certain background modes to run some specific task while backgrounded (such as location updates, bluetooth communication, audio management). The number of [supported background modes](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/iPhoneOSKeys.html#//apple_ref/doc/uid/TP40009252-SW22) is limited, there's no equivalent of free-for-all execution like Android's Service.

## Communication between screens
Android's Activities were designed to be independent from each other and thus do not have direct references to each other. To [start a new Activity](https://developer.android.com/training/basics/firstapp/starting-activity), the initiating Activity sends an intent message to the OS instead of initiating the new Activity directly. Activities are then instantiated by the system some times later using a no arg constructor, so Activities cannot have custom constructors. Data must be passed through a Bundle (similar to the saveInstanceState bundle) as part of the intent message.\
Example of starting a new Activity and passing data to it, notice the Activity's constructor is not called:
```
Intent intent = new Intent(this, ActivityTwo.class);
intent.putExtra("EXTRA_KEY_COUNT", 1);
startActivity(intent);
```

In iOS, the presenting VC can have a direct reference to the presented VC, and often times the presenting VC directly calls the presented VC’s initializer and pass any parameters it needs. This also means that it can call the new VC's methods and modify its properties before showing it. `prepareForSegue` can also be overridden to modify the transition or handover the data as it has references to both the outgoing and incoming VC.

## Layout building
iOS layouts are done using [Auto Layout](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/index.html), which dynamically calculates the size and position of views based on a set of constraints. All views implicitly uses Auto Layout, so there's no explicit declaration of what layout is being used like Android.\
iOS layouts are usually built through the XCode interface builder, though building them programmatically with Swift is not uncommon. Editing through xml is almost never done other than when resolving merge conflicts. xibs are preferred over storyboards for larger projects as it is less prone to merge conflicts and is more flexible (especially in regards to MVVM).

Modern Android layouts are typically done using [ConstraintLayout](https://developer.android.com/reference/android/support/constraint/ConstraintLayout), which is very similar to iOS's Auto Layout. [LinearLayout](https://developer.android.com/guide/topics/ui/layout/linear) and [FrameLayout](https://developer.android.com/reference/android/widget/FrameLayout) are occasionally used for simpler views, and [RelativeLayouts](https://developer.android.com/guide/topics/ui/layout/relative) were used on older projects as it is deprecated by ConstraintLayout. A Layout is just a container that dictates how its children are positioned. Each layout file will have one of these layouts as the top level container, and it is possible (and quite common) for a layout to contain another layout.\
Historically, layouts are generally built by writing xml instead of using the interface builder, partly due to Android Studio's interface builder being terrible/inadequate. The interface builder has improved quite a lot recently with the introduction of ConstraintLayout, so it has more usage nowadays. However, building the layout via by xml might still be more preferable to a lot of people since it offers more control, and Android Studio can help autocomplete many of the fields. A hybrid approach is to write using xml but also use Android Studio's interface builder to preview the changes.

## Libraries
[Gradle](https://developer.android.com/studio/build/), the official build system for Android, includes the ability to manage libraries and dependencies.\
iOS projects generally use [CocoaPods](https://cocoapods.org/) for managing libraries. [Swift Package Manager](https://swift.org/package-manager/) is the official dependency manager for Swift that was released somewhat recently, although Cocoapods is still more widely used.

Due to slow/nonexistent updates from Android device manufacturers, many Android devices are stuck on older version of Android. This makes it very difficult to develop for as certain features might only be available on newer version Android and certain method calls behave differently on different OS versions. Google provides [Android Support Library](https://developer.android.com/topic/libraries/support-library/) that backports certain new features to older OS version, provides consistent behavior across different OS version, and generally abstracts away a lot of boilerplate when dealing with backwards compatibility. **It is highly recommended to use the support library calls/classes instead of platform version whenever possible.** Additionally, Google recently introduces [Architecture Components](https://developer.android.com/topic/libraries/architecture/) that tries solve some common headaches in Android development such as dealing with lifecycle and database.\
There are no equivalent of these on iOS as it has significantly higher adoption rate to newer OS versions. Faster updates and forced obsolescence of older OS version means that new APIs trickle down much faster and deprecated things don't need to be supported indefinitely.

## Testing
Android runs [unit tests](https://developer.android.com/training/testing/unit-testing/local-unit-tests) on the computer’s JVM, without Android device or emulator. All Android calls are stubbed out and often just throws an exception when invoked in tests. This means testable classes (Presenter, ViewModels) should not directly include any Android classes/calls. There is a library called [Robolectric](http://robolectric.org/) which tries to reimplement all the Android calls in JVM, but it should be used sparingly since it’s slower and relies too much on “fake” Android code.\
[Espresso](https://developer.android.com/training/testing/espresso/) is the official framework for UI testing. It can interact and verify UI elements as a user would (clicking, checking text, etc). UI tests are run in a separate process, but they can still directly access the code of the app that’s being tested.\
[Mockito](https://site.mockito.org/) is widely used for test mocks.

iOS runs [unit tests](https://developer.apple.com/documentation/xctest) on device/simulator, so it’s fine to call iOS methods in unit tests.\
Apple offers [UI test target](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/testing_with_xcode/chapters/09-ui_testing.html) for running UI tests. Similar to Espresso, it runs in a separate process and can interact and verify UI elements as a user would (clicking, checking text, etc). However, it cannot access the app code and is meant for blackbox testing. Due to this, it might be more preferable to run UI tests on a unit test target instead of UI test target. The most popular UI testing frameworks ([KIF](https://github.com/kif-framework/KIF) and [EarlGrey](https://github.com/google/EarlGrey/)) are run on unit test target.\
iOS developers generally write all mocks manually, partly due to lack of a mature and widely-used mocking framework for Swift. There is a library called [Cuckoo](https://github.com/Brightify/Cuckoo) which seems to be slightly more limited version of Mockito.

# Other stuff
## Equivalent terminologies/classes/frameworks
|Android/Kotlin | iOS/Swift|
|---|---|
|`val` | `let`|
|`fun` | `func`|
|`when` | `switch`|
|`null` | `nil`|
|`dp` | point (resolution)|
|Constructor | Init|
|Interface | Protocol|
|Lambda | Closure|
|Kotlin sealed class | Enum|
|Activity | ViewController|
|layout xml | xib|
|ConstraintLayout | Auto Layout|
|LinearLayout | UIStackView (but more limited)|
|TextView | UILabel|
|EditText | UITextField / UITextView|
|ListView (deprecated, use RecyclerView) | UITableView|
|RecyclerView | UICollectionView|
|RxJava | RxSwift|
|RxBinding | RxCocoa|
|LiveData | Driver/BehaviorRelay|
|Retrofit | Alamofire (simple network calls can be done easily without a library)|
|Gson/Jackson/Moshi | Codable|
|Picasso/Glide | Kingfisher|
|Timber | CocoaLumberjack|

## Miscellaneous tidbits
Since Android is open source, sometimes it's very helpful to look into the source code of framework classes when debugging issues.

AppCode (as of version 2018.2) is not much better than XCode, it’s definitely nowhere near the quality of other JetBrains IDEs like IntelliJ or Android Studio. It’s noticeably slower, can't find code usage sometimes, has issues autocompleting certain extensions, and generally feels unreliable when refactoring. It also currently doesn't support interface building, so you would need to switch back to XCode when working on UI.

On Android, Button is just a TextView with a different default styling (same with ImageView/ImageButton). On iOS, UIButton and UILabel are completely different classes. Image button on iOS is just an UIButton with image set instead of text.

On iOS, there are two different views for entering text: UITextField (for single line, and doesn’t support multiline) and UITextView (for multiline, but doesn’t support placeholder). On Android, there’s just EditText with supports both multiline and hints.

Swift has a lot of breaking changes in between major versions (XCode does provide migration tools). Whereas nothing is ever really removed in Java.

iOS 11 finally added ability to use named colors (similar to colors.xml on Android) in the interface builder. Before that, you need to specify the color RGB manually every time…
