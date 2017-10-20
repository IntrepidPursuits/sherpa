# Project setup
If you haven't already, make sure you import the [Intrepid Style Template](android/code_style.md) into Android Studio.

## Skeleton project
TBD

## Lint
Android Studio supports many static analysis checks to help you write better code and avoid common problems.
The primary way we enforce these are via the "lint.xml" file which can be automatically added to every project by including the [Static Analysis Gradle Plugin](https://github.com/IntrepidPursuits/static-analysis-gradle-plugin).

This file supports:
* Lint checks in the IDE (the colored lines that show up on the far-right of the editor window)
* Commit-time reporting of warnings/errors (if the "Perform code analysis" box is checked)
* Command-line lint checking (via the "lint" gradle task)
* Automated lint checking via [Jenkins](android/android_jenkins.md)

The default lint.xml file we use is located here, within the Static Analysis Gradle Plugin project: [lint.xml](https://raw.githubusercontent.com/IntrepidPursuits/static-analysis-gradle-plugin/master/src/main/resources/default-lintConfig.xml)

#### Adding Lint to your project
1. See the README for the [Static Analysis Gradle Plugin](https://github.com/IntrepidPursuits/static-analysis-gradle-plugin) project for how to apply this plugin to your project.

2. Run the Gradle task to analyze the code, which will generate the lint.xml file in the correct location in your project: `./gradlew analyze${buildVariant}` (e.g. `analyzeDevDebug`)

3. Add this lint.xml file to Git and check it in.

That's it!  Your project should now be configured to check against the recommended lint inspections.  You may modify this lint.xml file if needed to suit your project, but this should only be considered in exceptional circumstances.

<b>Note:</b> If you ever want to update the lint.xml file to the latest version, do the following:
1. Upgrade to the newest version of the `static-analysis-gradle-plugin`
2. Delete the `lint.xml` file
3. Re-run the `./gradlew analyze${buildVariant}` command

This will re-generate the lint.xml file with the latest changes.

#### Lint levels
Lint supports the following levels for each inspection:

* ignore (do not report)
* informational (will show in a lighter color, and will not show up at commit-time)
* warning (highlight in yellow - will block commits)
* error (red - will block commits)
* fatal (will cause the gradle build to fail if the `lintAbortOnError` option was set to `true` in the `staticAnalysis` block in your build.gradle file - will block commits)