# Build & Installation Errors

When building your project locally, or remotely on a CI server, there are some common errors you may run in to. Similarly, installing ad-hoc and distribution apps from an OTA server can also pose some problems. Some errors can be fixed within your project configuration, or within the code itself -- however, some errors may require administrator privileges.

## Build Errors

##### Q. My build fails with "ssh: Could not resolve hostname"
A. This is a general network error and indicates the network dropped at some point in the build. Restart the build to try it again.

##### Q. I see a lot of "error: unable to read module map contents"
A. This error happens when there was an issue installing Cocoapod dependencies. Ensure there weren't any odd changes to your Podfile committed. If you're referencing code that's been pushed since midnight of the last day, it's possible that the Cocoapods master-repo hasn't been updated yet, and doesn't contain spec information for the pod you're referencing.

##### Q. My build fails with "Step ‘Publish JUnit test result report’ failed"
A. Jenkins looks for a Junit test report after completing your build, and will complain if it doesn't find one. Chances are high that your tests didn't actually run, and thus didn't produce this report file. Check higher in the logs to make sure tests are running.

##### Q. My build fails with "Exit status: 65"
A. This is another general purpose exit status, and can be thrown for a number of errors. Check the logs for other errors that may have been thrown during the build process, and narrow it down from there.

##### Q. My build fails with "error: Embedded binary's bundle identifier is not prefixed with the parent app's bundle identifier."
A. When deploying an app that includes an app extension, or watch extension, etc, the bundle identifier for the extension must be prefixed with the parent apps bundle identifier. It's possible that Jenkins is overwriting your bundle identifiers during the build process. The top of the Jenkins logs contains information on what bundles are resigned, and what they're resigned to. Edit the build script accordingly to make sure these values match.

##### Q. My tests don't run and I see the error "iOSSimulator: Could not launch simulator: -10810"
A. Error "-10810" means that the SystemUIServer process is not running for the current user. You'll see this error when trying to run unit tests as a user who is **not** currently logged into the desktop (i.e. doesn't have a UI server). On Jenkins, this means that the Jenkins user executing the iOS simulator must be set to auto-login. A node reboot is usually required for nodes experiencing this issue.

## Installation Errors

There are some common pitfalls when installing applications from the OTA server. Here are some things to be aware of if you run into problems:

##### Q. I receive an error message immediately after tapping "Install" on the OTA
A. There's a number of factors that can contribute to this.
- An OTA application cannot be installed over an exisiting App Store version of the same application.
- Ensure the phone you're installing the app on meets the hardware requirements specified by the app itself. For example, if the app requires GPS to work, you won't be able to install it on older iPod touch devices or devices without any GPS.
- Ensure the phone meets the minimum OS Version requirements for the app.
- If you still have issues, read the [OTA Server](https://github.com/IntrepidPursuits/shhherpa/Infrastructure/OTA) Readme for information on what might be going wrong server side.


##### Q. My application begins loading on the phone, but fails around 75%
A. This is generally a codesigning issue. Specifically, this is common when the provisioning profile bundled with the app doesn't match the bundle identifier.

##### Q. Are there any logs I can read to figure out what's going wrong?
A. Yes, there is, sort of. Connect your device to your mac, and open up the `Console` application. Select your device from the left hand menu to view the console logs for your device. You can also view console logs, and application logs by connecting your device, and opening the "Devices" window in Xcode.
