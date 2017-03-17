# Setting up Jenkins CI for Android

### Templates
There are three templates for creating Android Jenkins projects:
* `android-template`: This is run every time something is merged into the develop branch. It runs the unit tests, generates a QA build, and uploads it to the OTA link.
* `android-pr-template`: This is run every time a PR is created. It runs the unit tests and reports the result back to the GitHub PR page.
* `android-nightly-template`: This is run once every weeknight between 12am and 8am. It runs both the unit tests and UI tests (currently the UI tests will run on a physical device attached to the Jenkins machine) and reports the test coverage.

### Setup instructions for all templates
1. In the Jenkins homepage, click `New Item`
1. Enter the project name. The name should be in the form of `project-android`, `project-android-pr`, or `project-android-nightly`.
1. In the `Copy from` box, enter one of the template names above.
1. Click OK, and you will be directed to the project configuration page.
1. Under the `Source Code Management` settings, set the proper `Repository URL` (this is basically the same as the Project url, but might be in slightly different format)
1. Change the `Branches to build` if your main branch is not master.
1. Under the Gradle Wrapper settings, configure the `Tasks` if you want to run different commands (ex: `assembleDebug` instead of `assembleQa`).
1. The default gradle tasks also runs lint. Make sure your project either doesn't contain any lint errors or add `lintOptions {abortOnError false}` to your `build.gradle` to prevent lint from failing the whole build. It is also a good idea to include a lint configuration file to suppress lint warnings that we don't care about. See [this](https://github.com/IntrepidPursuits/AndroidSkeleton/pull/30/files) for an example.
1. Click `Save`.

### Additional instructions for `android-template`
1. In the `Project Content` settings, update the `SHORT_NAME` to your project's name. The `SHORT_NAME` will be used as the url of the ota build, i.e. `http://intrepid.io/ota/SHORT_NAME`
1. If you changed the build variant in the gradle task field (ex: `assembleDebug` instead of `assembleQa`), also change the build variant in the last `Execute shell` command (ex: `app-debug.apk` instead of `app-qa.apk`)
1. If desirable, click on `Add Post Build Action` button and select Email Notification and/or Slack Notifications to receive notification whenever a build passes/failed. 

Note: the test coverage portion expects the project to contain `coverage.gradle`. See android-nightly-template section for more info. 

### Additional instructions for `android-pr-template`
1. In the project configuration screen, make sure `GitHub project` is checked, and set the proper `Project url`
1. Go to the Github page for your project
1. Click `Settings` (the one for the project, not your user)
1. Click `Branches` (the url should be something like https://github.com/IntrepidPursuits/partyalbum-android/settings/branches)
1. Choose a branch for `Protected branches` (usually master or develop)
1. Click the `Edit` button for that branch.
1. Check `Protect this branch` and `Require status checks to pass before merging`
1. Click `Save changes`
1. You should be all set! Jenkins will now build every PR (including every time the PR is updated), and will show the build status on the PR page.

Note: if you wish to rebuild a PR without pushing new commits, you can type `restart jenkins build` as a comment on the Github PR page to force a rebuild.

### Additional instructions for `android-nightly-template`
The `android-nightly-template` expects the project to contain [coverage.gradle](https://github.com/IntrepidPursuits/AndroidSkeleton/blob/master/app/coverage.gradle). If your project is based off [Android Skeleton](https://github.com/IntrepidPursuits/AndroidSkeleton), you should be all set. If not, you can simply copy that file to your project and add `apply from: 'coverage.gradle'` in your app `build.gradle` file (note that you will also need the [spoon plugin](https://github.com/stanfy/spoon-gradle-plugin)).
Additional info can be found [here](https://github.com/IntrepidPursuits/sherpa/blob/master/android_cobertura.md).
