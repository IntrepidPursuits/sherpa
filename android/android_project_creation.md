# Project setup
If you haven't already, make sure you import the [Intrepid Style Template](android/code_style.md) into Android Studio.

## Skeleton project
TBD

## Lint
Android Studio supports many static analysis checks to help you write better code and avoid common problems.
The primary way we enforce these are via the "lint.xml" file which should exist in every project.
This file supports:
* Lint checks in the IDE (the colored lines that show up on the far-right of the editor window)
* Commit-time reporting of warnings/errors (if the "Perform code analysis" box is checked)
* Command-line lint checking (via the "lint" gradle task)
* Automated lint checking via [Jenkins](android/android_jenkins.md)

#### Adding Lint to your project
1. In your module's build.gradle file (often this will be under the "app" directory, though it may vary for your project), add the following to the `android` block:
```
android {
    lintOptions {
        quiet false
        abortOnError true
        ignoreWarnings false
        checkReleaseBuilds true
    }
    ...
}
```

2. In the same directory as your module's build.gradle file, add the following file: [lint.xml](android/lint.xml)

That's it!  Your project should not be configured to check against the recommended lint inspections.

#### Lint levels
Lint supports the following levels for each inspection:

* ignore (do not report)
* informational (will show in a lighter color, and will not show up at commit-time)
* warning (highlight in yellow - will block commits)
* error (red - will block commits)
* fatal (**should** cause the gradle build to fail if the `abortOnError` option was set to `true` above - will block commits)