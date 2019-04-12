# CocoaPods Best Practices

CocoaPods is a vital tool within our iOS ecosystem, and one that is used on almost every project built at Intrepid. For that reason it's important that we also have a set of guidelines and best practices in place for working with CocoaPods to ensure relative conformity across various projects.

### Takeaways
* Check in your `Podfile`, `Podfile.lock`, and `/Pods` directory to git.
* Be as specific as possible with Pod versions.
* Include test-only Pods in their own target.

## Structuring a Podfile

Podfiles should have as much structure to them as possible. CocoaPods makes things very easy and very straightforward to get started, and you aren't required to be restrictive in the versions you use, but that can easily cause chaos on a project when a new developer rolls on or a new version of the pod is released without being fully tested. For those reasons it's strongly encouraged to be as exact as possible. 

#### Bad Podfile example
```ruby
target 'Project' do
    pod 'RxCocoa'
    pod 'RxSwift'
    pod 'Analytics'
    pod 'Crashlytics'
    pod 'OHHTTPStubs/Swift'
    pod 'Firebase/Core'
    pod 'Alamofire'
    pod 'Fabric', '~> 1.7'
    pod 'IGListKit', '~> 3.1'
end
```
This Podfile is very quick to set up, and very easy to use. That ease comes with a tradeoff though where you aren't guaranteeing the version that will be installed when `pod upgrade` is run. Sure, for Fabric and IGListKit you are giving a version, but they will bring in any version up to `2.0` and `4.0` respectively. Granted the maintainers should be adhering to [semver style](https://semver.org/) and shouldn't be introducing any major breaking changes in those versions, but in the event of that happening your project could be broken unexpectedly.

#### Good Podfile example
```ruby
platform :ios, '10.0'

# List pods in alphabetical order
# Specify specific pod versions
target 'Project' do
    use_frameworks!
    pod 'Alamofire', '4.7.2'
    pod 'Analytics', '3.6.9'
    pod 'Crashlytics', '3.10.2'
    pod 'Fabric', '1.7.7'
    pod 'Firebase/Core', '5.2.0'
    pod 'IGListKit', '3.4.0'
    pod 'RxCocoa', '4.2.0'
    pod 'RxSwift', '4.2.0'

    target 'ProjectUnitTests' do
        inherit! :search_paths
        pod 'OHHTTPStubs/Swift', '6.1.0'
    end
end
```
Here's an example of a very specific Podfile. Every pod that is used has a specific version that has been used in the project and verified to be functionally correct. The pods are also listed out in alphabetical order which helps a lot on larger projects to keep track of what pods are included when the list grows and grows. You'll also notice that the pods that are only used for testing are specified within the test target and not included within the main project target. This helps to keep things organized, especially when a test pod will never be used in normal operation. Being this specific can sometimes feel like overkill, but in cases where things have to be nuked or reset it can be vitally important to maintain correct operation of the project.

## Importance of the .lock file

Now that we've covered the Podfile let's talk a little bit about the `.lock` file. This is the "source of truth" file which indicates what pod versions are being used, details about the workspace, version of CocoaPods that was used, among other things. This ensures that pod state is the same between project instances. Sometimes you will need to refresh this lock file though, such as:   
- Adding a new pod to the project
- Updating the workspace, such as a new scheme or configuration
- Something broke and the Pods project needs to be refreshed

In those cases you'll want to run `pod install` again to generate a new lock file, and sync with your team about its changes.

## Checking in your Pods

It's preferable to check your `/Pods` directory into the git repo for your project so that the project's Cocoapods state is more easily maintained across instances and developers. The tradeoff here is that it will take longer to initially clone the repo, but that is worth it for the security gained by maintaining the pod state. 
For some context imagine this scenario. You're bringing a new developer onto the project or you are versioning a new workstation and need to install all of the project pods from scratch. The project has a well defined podfile so you aren't worried about version mismatches or breaking changes from new releases. When you run `pod install` though CocoaPods throws an error saying that a particular pod at the core of your project isn't found. It was removed from the database and is no longer available. Not likely right? You'd think, but that's [exactly what happened in the Node world](https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm) not long ago. **This is why it's so important to include your pods in the git repo when checking it in**. If the worst case scenario happens the project won't be dead in the water. Sure it takes longer to clone the repo at first, but the extra time is well worth the reassurance.
