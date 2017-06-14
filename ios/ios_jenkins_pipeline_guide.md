# iOS Project Integration Guide
---

This guide will walk you through getting your iOS project set up on Jenkins.

There is no setup you need to perform on Jenkins itself -- everything is handled via a `Jenkinsfile`, a text file named `Jenkinsfile`, that lives in the root of your repository.

Jenkins is configured to scan Intrepid's Github Organization and look for projects that satisfy the requirements of being considered an iOS project. Those 2 requirements are simply:
1. Have a repository whose name ends with `-ios`
1. Have a `Jenkinsfile` in the root of your repo.

---
# Pipeline Basics

A Pipeline is an abstract concept that describes a set of steps to go from raw code, to a delivered product. In the case of iOS projects, our pipeline handles code review, tests, and deploying binaries to our OTA server -- as well as reports, and metric collection.

It's helpful to understand at a basic level what a Jenkins Pipeline is, but not strictly necessary for getting your project up and running. [Click for more information on Pipelines](https://jenkins.io/doc/book/pipeline/)

Instead of having users write full Jenkinsfiles themselves, the Intrepid Pipeline Library serves as a wrapper, abstracting away all of the complexity of the build script itself, and having users just define their project model.

---
# Integration Steps

#### 1. Create the Jenkinsfile

Create an empty text file in the root of your repo named `Jenkinsfile`

A Jenkinsfile is just a text file that's created on a per-project basis, and added to the repo by someone on the team. The Jenkinsfile usually has some Java/Groovy code which defines the pipeline (the build code) to be run for the project. There's a bunch of default functions (like sh which runs a shell command) available for all Jenkinsfiles.

Our library extends the available methods to use in the Jenkinsfile. In particular, it provides some classes which define the Project model (XcodeProject), and a class which acts as a wrapper around all of the Java/Groovy pipeline code you would need to write, if we didn't have a library to wrap it with.

This allows us to greatly simplify the Jenkinsfile that teams write. In our case, we only require that an `XcodeProject` object is defined, and then passed to the `xcodePipeline` function.

#### 2. Define your Xcode Project model

At the top of your `Jenkinsfile` (But below any library import statements), add the following line to declare your XcodeProject object:

    def xcodeProject = new io.intrepid.XcodeProject()

This simply creates a new XcodeProject instance, which is a [class defined in the Intrepid Pipeline library](https://github.com/IntrepidPursuits/jenkins-pipeline-library/blob/master/src/io/intrepid/XcodeProject.groovy).

At the minimum, you must provide the name of your project. This should be the same name that you used when creating the Xcode project. Add this line to your Jenkinsfile

    xcodeProject.name = "MyAppName"

By default, the Pipeline library will use this name to try and determine all of the other parameters of your build based on the typical Xcode Project. If you want to specify additional parameters, or have a project with a slightly different configuration, there are a number of parameters to override, such as the OTA path, the directory where tests are contained, or the xcworkspace name.

See the section below on Build Parameters for information on all the available parameters.

#### 3. Add Builds To Deploy

After defining your model and adding parameters, you must add builds to deploy. You define a build by calling `xcodeProject.addBuild()` and passing a map of parameters. The same parameters you can use for the XcodeProject can be used to define a build. By default, a build will use all the same parameters defined in the XcodeProject model, except those explicitly specified.

These are the builds that will be built and uploaded to the OTA server whenever a "master" branch is pushed. Checked the section below entitle `Deploying to the OTA` for more information.

If you wanted to deploy both a release, and debug configuration of your build at the same time, you could add the following:

```java
xcodeProject.addBuild([
  configuration: "Debug"
])

xcodeProject.addBuild([
  configuration: "Release",
  bundleIdentifier: "org.companyA.appName"
])
```

In this scenario, the pipeline now has two builds, defined with the same parameters as the XcodeProject, except the few specified.

#### 4. Define additional configuration

If you project needs additional configuration, such as git submodule initialization, or slack notifications, you can define a new map, with the appropriate keys and values.

```java
def config = [
  git: [
    submodules: true
  ]
  tests: false,
  slack: [
    enabled: true,
    channel: "#mySlackChannel"
  ]
]
```

A list of all the additional configuration that can be applied is listed below in the [Additional Configuration](#additional-configuration) section

#### 5. Run the pipeline

At the bottom of your `Jenkinsfile` add the following to trigger the actual Pipeline run. If you haven't defined a configuration, you may omit that parameter completely.

    xcodePipeline(this, xcodeProject, config)

`xcodePipeline` is a special global command that serves as a wrapper around the iOS pipeline code.

---
# Examples

[You can see an example of a Jenkinsfile here](https://github.com/IntrepidPursuits/jenkins-pipeline-library/blob/master/jenkinsfiles/ios.jenkinsfile)

---
# Build Parameters

The following parameters can be set on **either** the XcodeProject model object, OR passed into the `addBuild` method as build parameters.

**binaryName** \
_Default:_ _empty_\
The name of the binary generated by Xcode. Generally you won't need to specify this unless you're getting errors where the wrong target's code coverage is being analyzed by Slather & Sonar.

**bundleIdentifier** \
_Default: "io.intrepid.<project.name>"_\
The bundleIdentifier to use for this build or project. The default appends the project name to `io.intrepid`

**configuration** \
_Default: "Debug"_\
The Xcode configuration to use for this build.

**deploymentType**\
_Default: "enterprise"_\
This value should correspond to the type of provisioning profile you're using to sign the build. Valid options are `enterprise`, `ad-hoc`, `app-store`, and `development`.

**derivedDataPath**\
_Default: "./DD"_\
The path, relative to your workspace directory, where derived data should live. You most likely won't need to change this.

**identity**\
_Default: "iPhone Distribution: Intrepid Pursuits, LLC"_\
This value is the codesign identity. This value needs to match the certificate name in your keychain.

**keychain**\
_Default: "CI.keychain"_\
The name of the keychain you want to use for builds. Ask a JenkinsAdmin for the correct name for your project.

**name**\
_Default: empty_\
The name of the project as it was entered when the Xcode Project was created. This should match the name of your `.xcodeproject` or `.xcworkspace` file if possible. If that's not possible, or your project is oddly named, make sure to add additional parameters besides Name.

**profile**\
_Default: "Intrepid Enterprise Distribution.mobileprovision (f061774d-bfe1-4c8a-b5a2-0425648291d2)"_\
The profile field is a string containing the name of the provisioning profile (the name stored by Jenkins), and the UUID of the profile in the format "<filename> (<UUID>)". Both of these values are listed in the Keychains and Profile Management section of the Jenkins management console. Ask a Jenkins Admin for these values after having your profile uploaded.

**scheme**\
_Default: "<project.name>"_\
The scheme of the XcodeProject that should be built. You'll need to ensure that this scheme is marked as "Shared" in your XcodeProject.

**simulator**\
_Default: "iPhone 7 (10.3)"_\
The simulator name that you wish to use for tests. You can find a list of simulator names by running `instruments -s devices` from the command line.

**teamIdentifier**\
_Default: "THP5EV5EJ9"_\
This is the identifier of the team who owns the provisioning profile in use. If you're using a non-intrepid provisioning profile, this MUST change.


## Project Only Parameters

The following parameters can be set **ONLY** on the XcodeProject model. That is, they cannot be passed into the `addBuild` function.

**buildDirectory**\
_Default: "build"_\
The directory, relative to the workspace, where the xcodebuild command will store all the build's intermediate files.

**excludedPaths**\
_Default: ".*Pods.*"_\
A comma separated list of regex patterns, describing what paths to exclude from any kind of linting, code review, etc.

**language**\
_Default: "swift"_\
A string representing the language to use for building. Only `swift` is currently supported.

**otaPath**\
_Default: "<project.name>"_\
The root path where your project will be uploaded. By default, the projects name concatenated with "-ios" will be used. The result will be that your IPA is uploaded to `intrepid.io/ota/<otaPath>`

**project**\
_Default: "<project.name>"\
The name of the `.xcodeProject` file in the repository. Generally this will be the same name as your scheme, workspace, and app name, but if it's different, you should explicitly set it.

**sourceDirectory**\
_Default: "<project.name>"_\
The directory, relative to your project's root, where the source files live. Generally this folder is named the same as your Xcode Project.

**testDirectory**\
_Default: "<project.name>Tests"_\
The directory, relative to your project's root, where the test files live. Generally this folder is named the same as your Xcode Project but concatenated with `Tests` at the end. Older versions of xcode may have created a folder named `UnitTests` instead.

**workspace**\
_Default: "<project.name>"_\
The name of your `.xcworkspace` file in your project repo.

**xcodeVersion**\
_Default: empty_\
By default, the latest, non-beta version of Xcode will be used to build your project. If you need an older version, just specify the version number here. For example, use `7.3.1` to build Swift 2.3 projects using Xcode 7.

---
# Additional Configuration

You may optionally pass a map of key-values to the `xcodePipeline` call with additional options and configuration for your project. Any options that are specified will override the default configuration. The default configuration for each option is listed below:

```java
[
 cocoapods: [
    enabled: true,
    repoUpdate: false,
    podUpdate: false,
    version: "",
 ],
 deploy: true,
 email: [
    enabled: false,
    pullRequests: false,
    recipients: [],
 ],
 failFast: true,
 git: [
   submodules: false
 ],
 metrics: true,
 tests: true,
 slack: [
   enabled: true,
   pullRequests: false,
   channel: "#jenkins-ether",
 ]
]
```

### cocoapods
The cocoapods key expects a map with various options for when cocoapods is run during your job

**enabled** - Whether pod install should be called after checking out code from your repo

**repoUpdate** - Whether `pod install` is called with the `--repo-update` option.

**podUpdate** - Whether `pod update` is called before running `pod install`

**version** - The version string of Cocoapods to use. For example, if your project needs version 0.39.0 of Cocoapods. You would use set this value to be `0.39.0`

### deploy

The deploy key is used to override whether or not the resulting `ipa` binaries from the build are uploaded to the OTA server. Setting this to `true` does **not** guarantee that an upload will happen. You are still limited to deploying from "master" branches, such as `master`, `develop`, `release/*`, or `test/*`.

### email
Email expects a map of options similar to the cocoapods options.

**enabled** - Whether email is sent at the end of the build.

**pullRequests** - Whether emails are sent for pull requests

**recipients** - An array of strings, where each string is an email address to send notifications to.

### failFast

This key determines how long your pipeline should run should one of the parallel tasks fail. If this key is set to `true`, your entire pipeline will fail if a parallel stage fails. If this key is false, your parallel tasks will continue to run until finished.

### git

The git key holds all options related to checking out from Github.

**submodules** - A boolean to determine whether submodules should be initialized after checking out code.

### metrics

Determines if metrics like code coverage and linting are collected and uploaded to Sonar during the build.

### tests

Determines whether or not tests are run during the build.

### slack

The slack key is a map of options related to notifications on Slack.

**enabled** - Whether slack notifications are enabled

**pullRequests** - Whether notifications should be posted for pull requests

**channel** - The channel where notifications should be posted to.

---
# Deploying to the OTA

When defining builds in your Jenkinsfile by using `addBuild` you're telling the Pipeline that you want these Xcode configurations built, and uploadedd to the OTA when a "master" branch is built.

**Q. What's a "master" branch?**
A. A master branch is a concept defined by the Pipeline. In this case a master branch means a branch named `master`, `develop`, ANY branch under a `release/` folder, ANY branch under a `test/` folder.

You may also use `test/` and `release/` tags to deploy to the OTA.

For example, let's say we have a project with a branch named `develop` where all our code that's used for builds to the OTA are made from. Someone else on your project team may be working on a feature branch that also needs to be uploaded to the OTA. In order to get the feature branch to build and upload to the OTA you have a few options:

1. Name the branch `release/my-feature-branch`. Where `my-feature-branch` is the subfolder where this build will be on the OTA. For example, if your master OTA is located at `intrepid.io/ota/myApp`, this feature branch would be located at `intrepid.io/ota/release/my-feature-branch`

1. Name the branch `test/my-feature-branch`. Same as above, except the resulting OTA URL would be `intrepid.io/ota/test/my-feature-branch`.

1. Push a tag to git using the same naming structure as branches. e.g. a tag named `test/my-test-build` or `release/client-test`

**Q. What about Pull Requests?**
A. Pull requests are never deployed to the OTA. In fact, pull requests never even build an IPA from your code. Only code review, tests, and reporting is done to pull requests. Pull requests reviews are automatically configured when you commit a Jenkinsfile to your project.

---
# Contributing

Find a bug in the library? A certain configuration not working? Have a suggest for a more optimized way of building? Join us in the [#DevOps](slack://channel?id=C4EQ2LSBS&team=T026B13VA) Slack Channel.
