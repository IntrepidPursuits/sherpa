# Configure iOS Project To Track Code Coverage
This setup is for both your Pull Request Jenkins projects as well as your main OTA build, as the process is identical for these two configurations.

# Setup Jenkins
Following either the Pull Request template found [here](http://ci.intrepid.io:8080/view/Templates/job/ios-pull-request-template/) or the OTA template found [here](http://ci.intrepid.io:8080/view/Templates/job/ios-template/), ensuring code coverage is reported for your iOS projects is straight forward.

## Using [Scan](https://github.com/fastlane/fastlane/tree/master/scan) To Run Test
You should have a section of code in your 'Execute Shell' Build Phase within your Jenkins project that looks like this:
```
scan --configuration "Debug" \
--skip_build true \
--code_coverage true \
--scheme "${XCODE_SCHEME}" \
--device "${TESTING_DEVICE}" \
--clean
```
To ensure that you are collecting code coverage information, make sure that `--code_coverage` has the value of `true`.

Additionally, after your scan call, you must make sure that you also call this line after scan:
```
ruby ${SCRIPT_DIR}/coverage.rb ${XCODE_SCHEME}
```
**NOTE:** You must ensure that this line comes AFTER the scan command.

Therefore, you need to ensure that this section of code matches:
```
scan --configuration "Debug" \
--skip_build true \
--code_coverage true \
--scheme "${XCODE_SCHEME}" \
--device "${TESTING_DEVICE}" \
--clean

ruby ${SCRIPT_DIR}/coverage.rb ${XCODE_SCHEME}
```

## Using Jenkins Xcode Plugin
If you have yet to transition your Jenkins project over to using the script we have in the templates, please do so and then refer to the above section if you have questions.

# Help
For any help setting this up, please reference the Jenkins project templates or ask **David Brooks (dbrooks@intrepid.io)** for assistance.
