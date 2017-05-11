# Inspecting an .ipa file

Often it can be useful to know to what is actually being bundled with your application's .ipa file. While this file might appear to be atomic, you are actually able to extract and observe it's contents. Doing so is as simple as right clicking on the .ipa file and opening it with *Archive Utility*, unzipping it as a folder named `Payload`. If *Archive Utility* is not available, it's likely because your OS doesn't realize the .ipa is actually a zip format. Changing the .ipa extension to .zip should be enough to fool the OS into making it unzippable.

You can also use [ProvisionQL](https://github.com/ealeksandrov/ProvisionQL), a helpful *QuickLook* plugin, to inspect some of the details of the .ipa file and its contents without having to unzip it.

#### Inspecting an .ipa can be useful for:
* Debugging issues in your app's build process
* Discovering what images/fonts/strings/etc. an app on the AppStore uses
* Discovering what frameworks an app on the AppStore depends on

## Determining whether or not an .ipa is provisioned for a given device

Occasionally, when you need to manually install an .ipa on your test device, you'll run in to the error "A valid provisioning profile for this executable was not found." If you encounter this error, inspect the ipa's embedded profile to verify the device's ID is included as a sanity check.

1. Open the `embedded.mobileprovision` file in a text editor (`Payload` > *Application-file* > `embedded.mobileprovision`). This is a binary file with an ascii plist embedded in the middle. Your average text editor will be able to display its contents with a mangled format; however, Atom does a pretty good job at making the plist portion readable.
2. Look for the array with the key `ProvisionedDevices`. This array includes the IDs for all of the provisioned devices and presumably your device's ID is missing.

### If your device's ID is missing:
* You may have an out of date version of the given provisioning profile - verify this by checking its list of devices against the version on the Apple Developer portal
* The wrong profile may have been selected (automatically or manually) - verify this by checking the other values in plist, notably: `application-identifier`, `Name`, `TeamIdentifier`, and `TeamName`
