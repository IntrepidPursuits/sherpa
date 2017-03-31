# Configure Android Project To Track Code Coverage With Cobertura
These are the steps required to set up your Jenkins project to output code coverage reports in the Cobertura format. The main argument for doing this is to align both iOS and Android projects and have them all report code coverage via Cobertura instead of separate plugins. **Note:** We are not eliminating JaCoCo from the Android project. We are using JaCoCo to calculate the actual code coverage, but then converting its results into a format that Cobertura can understand for the purposes of reporting the code coverage.

# Jenkins Setup

## coverage.gradle File
**Note:** This file has been included in the AndroidSkeleton project found [here](https://github.com/IntrepidPursuits/AndroidSkeleton/blob/develop/app/coverage.gradle).
This file needs to be located at `/project-dir/app/coverage.gradle`.

Additionally, you need to add `apply from: 'coverage.gradle'` to your `build.gradle` file located in `/project-dir/app/`.

The main takeaway from this coverage.gradle is the addition of these lines within the `unitTestCoverage` task:
```
reports {
    xml.enabled true
    xml.destination "${buildDir}/reports/jacoco/unitTestCoverage/coverage.xml"
}
```
This code snippet tells JaCoCo to output its results in XML format. This XML will then be converted to a format that Cobertura can read. `unitTestCoverage` will then be added to the Gradle script (see below) to perform the code coverage reporting.

# Jenkins Build Phase
These are the Build Steps to add to the Build Phase. **They must be added in the order written here!**

## Invoke Gradle script
Add this build step and choose `Use Gradle Wrapper`.

Check `From Root Build Script Dir`.

Under Tasks, please put: `clean unitTestCoverage assembleQa`. **Note:** assembleQa is needed for Northeastern, but might not be needed for your Android project.

## Execute shell
Please place the following code in the shell you added to the Build Phase:
```
cd ${WORKSPACE}/app/build/reports && mkdir cobertura && ${SCRIPT_DIR}/jacoco2cobertura.py ${WORKSPACE}/app/build/reports/jacoco/unitTestCoverage/coverage.xml src/main/java > ${WORKSPACE}/app/build/reports/cobertura/coverage.xml
```

This shell creates a new directory where out Cobertura formatted code coverage report will go. Then, using the jacoco2cobertura Python script, performs the actual conversion from JaCoCo XML to Cobertura XML.

# Post-build Actions
These are the Post-Build Actions to add to the Post-build Action Phase.

## Publish Cobertura Coverage Report
Cobertura xml report pattern: `**/app/build/reports/cobertura/coverage.xml`

## Publish JUnit test result report
Test report XMLs: `**/test-results/testDebugUnitTest/debug/*.xml`

# Help
For any help setting this up, please reference the `android-template` Jenkins project or ask **David Brooks (dbrooks@intrepid.io)** or **David Zou (david2@intrepid.io)** for assistance.
