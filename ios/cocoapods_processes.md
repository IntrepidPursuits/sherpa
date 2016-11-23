# Cocoapods Processes

We like to make reusable code and cocoapods is a great way to distribute that code. Individual projects may be making their own pods, but we also maintain the [Intrepid pod](https://github.com/IntrepidPursuits/swift-wisdom) within the entire iOS team. This guide aims to cover the necessary steps for creating your own pod and also maintaining one, like we must do with the [Intrepid pod](https://github.com/IntrepidPursuits/swift-wisdom).

The goal of this doc is not to copy all the info available at [cocoapods.org](https://cocoapods.org/). This is specifically oriented towards helpful advice specific to Intrepid processes.

## Building Your Own Pod

The first thing to do is just start a new xcode project that holds all of your source components. There will really be two parts of your project. There will be the actual pod components that you are building to be reusable by others -- let's keep these in a folder called `Source`. Then there will be the rest of your project that should really act like a demo of the pod.

Your structure could end up looking something like this:
```
|-- MyPodName
    |-- Source
        |-- FooClass.swift
        |-- FooBar.swift
        |-- Extensions
            |-- Bundle+Extensions.swift
        |-- Resources
            |-- fooImage.png
            |-- fooSound.mp3
            |-- fooNib.xib
    |-- Demo
        |-- AppDelegate.swift
        |-- ViewController.swift
        |-- LaunchScreen.storyboard
        |-- Main.storyboard
        |-- Info.plist
|-- MyPodNameTests
    |-- FooClassTests.swift
    |-- FooBarTests.swift
    |-- ResourceTests.swift
```

### Including Resources

If your pod makes use of some bundled resources like images or xibs, then you'll need to be careful in how you access those in your library. When the pod is being used in another project, those resources will be kept in a separate bundle (as opposed to `Bundle.main`). So here is a handy way to access those.

**Bundle+Extensions.swift:**
```swift
private final class BundleFinderClass {}

private let podBundlePath: String = {
    let bundle = Bundle(for: BundleFinderClass.self) // just using any random class from this framework.
    
    // Use pod path if in a pod, but if that doesn't exist use the mainBundle because we're in the source project
    return bundle.path(forResource: "PodBundleName", ofType: "bundle") ?? Bundle.main.bundlePath // Replace "PodBundleName" with the name of your bundle that you use in the PodSpec.
}()

extension Bundle {
    static var podBundle: Bundle {
        return Bundle(path: podBundlePath) ?? Bundle.main
    }
}
```
**How to use that extension:**
```swift
// Ex: Grabbing a resource via it's path
extension UIImage {
    class func bundledImage(named bundledFilename: String) -> UIImage? {
        guard let imagePath = Bundle.podBundle.path(forResource: bundledFilename, ofType: "png") else { return nil }
        return UIImage(contentsOfFile: imagePath)
    }
}

// Ex: ViewController initialize by a nib
class FooViewController {
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: NSBundle?) {
        super.init(nibName: nil, bundle: Bundle.podBundle)
    }
}
```


### Podspec

Then you'll want to make a podspec file. You can start by just copying the text below and customizing. This should be saved in the top level of your project directory and be named like `[Your-pod-name].podspec`.

```ruby
Pod::Spec.new do |spec|
  spec.name         = 'MyPodName'
  spec.version      = '0.0.1'
  spec.license      = 'NO LICENSE' # Use MIT License for an open source pod.
  spec.homepage     = 'https://github.com/IntrepidPursuits/ThisRepoURL'
  spec.authors      = { 'John Smith' => 'JohnSmith@intrepid.io' }
  spec.summary      = 'Brief description of this pod'
  spec.source       = { :git => 'https://github.com/IntrepidPursuits/ThisRepoURL.git', :tag => "#{spec.version}" }
  spec.source_files = 'root/Source/**/*.{swift}'
  spec.ios.resource_bundle = {'BundleName' => 'root/Source/Resources/*'} # This is images, xibs, storyboards.
  spec.ios.deployment_target = "8.0"
  spec.requires_arc = true
  spec.dependency 'Intrepid', '~> 0.6.2' # If you're using pods within your pod, declare them here.
  spec.pod_target_xcconfig = { 'SWIFT_VERSION' => '3.0' }
  spec.screenshots  = "https://url.to.some.image1", "https://url.to.some.image2"
  spec.description	= <<-DESC
  # Title
  You can make a whole markdown page here if you want.

  DESC
end
```

## Use your pod locally

A good way to test integration without continually pushing up new commits to origin is to import the pod locally. In the project where you want to use your pod, change the line in your podfile where you import the pod.
```ruby
#remove your normal import line:
pod `MyPodName`, :git => 'git@github.com:IntrepidPursuits/ThisRepoURL', :tag => '7.0.1'
#replace with this line:
pod 'MyPodName', :path => '/Users/my/path/to/MyPodName'
```

This is also nice if you're making changes to someone else's pod. Just fork their repo and clone it to your local machine. Then change your podfile like above. Now, since you're using the pod locally, any changes you make in the pod will be tracked by git. Then you can submit a PR to merge back in your changes when you're happy with it.

**Gotcha:** If you add a new file to your target repo, you must re-run `pod install` or you won't see it.

## Updating Your Pod

The basic steps in most updates to pods:

1. Go through the prescribed contribution process on that project -- likely a pull request.
1. As a final step in that process, update the podspec's `spec.version` to a new version number. We recommend following the versioning rules here: http://semver.org/.
1. Lint your pod to make sure there are no errors with `$ pod spec lint`
1. After merging the change, tag the commit (on remote) with the new version. i.e. If the new version is `0.0.2` the new tag would be `0.0.2`. When tagging, please tag verbosely: `git tag -a 1.0.2 -m 'added test coverage for foobar class'`
1. If this is a public pod, being hosted through the cocoapods trunk, push the podspec to trunk. `$ pod trunk push`.

## Other resources:

- [See other pods on cocoapods.org](https://cocoapods.org/)
- [Pod spec reference on cocoapods.org](https://guides.cocoapods.org/syntax/podspec.html)
- [Pod trunk reference on cocoapods.org](https://guides.cocoapods.org/making/getting-setup-with-trunk.html)
- [Tweaking 3rd Party Libraries (by Ying)](http://blog.intrepid.io/cocoapods-tweaking-3rd-party-libraries)
