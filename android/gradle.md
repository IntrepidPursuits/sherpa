# Reusable Gradle Files
Gradle scripts and tasks that might be useful for other projects can be 
extracted out into their own files so that they can be reused. They can 
be included by simply adding `apply from: 'example.gradle'` to the main 
gradle file. Some of the gradle files that we use can be found under the 
[gradle](gradle) folder.

### [version.gradle](gradle/version.gradle)
Often times it is useful for an app to indicate which git hash or
Jenkins job it was build from so that QA can record the affected 
builds when logging bugs and developers can go back to the appropriate 
commit when trying to reproduce and fix them. [version.gradle](gradle/version.gradle) 
include tasks to automatically append git short hash (if build locally) or the jenkins build number 
(if build by Jenkins CI) to the original version name.
