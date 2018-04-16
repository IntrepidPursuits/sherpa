# How To Create A New Project
## Create Xcode project and Github repo
1. Create repo on Github with `.gitignore` and `README.md`. Repositories should be named with the format `<project-name>-ios`. The project name should be in `kebab-case` and must include the `-ios` suffix because it is important for other services.

1. Create Xcode Project

1. Ensure your Xcode Project is in the top level of the future git repo directory

1. In the Xcode project directory, run:
    ```
    git init
    git remote add origin <remote-url>
    git pull origin master
    git push --set-upstream origin master
    ```
    > Pull before pushing to get the Github-generated `.gitignore` so ignored files don't end up in the repo

1. Update `README.md` to use [Intrepid README template](https://github.com/IntrepidPursuits/sherpa/blob/master/readme-template.md)
1. Add and commit, then push to `master`

## Add Cocoapods
1. In project directory, run:
    ```
    pod init
    pod install
    ```
    > Use `.xcworkspace` instead of `.xcodeproj` for this project from now on

1. Decide whether Pods should be checked in or not. The automatically generated Podfile is set up to check them in. If they shouldn't be checked in, uncomment the `Pods` line in the Podfile.
    > `# Pods/` -- Pods checked in
    > `Pods/` -- Pods not checked in

1. Add, commit and push Pod files

## Add SwiftLint

1. Add Intrepid's [`.swiftlint.yml` file](https://github.com/IntrepidPursuits/swift-style-guide/blob/master/.swiftlint.yml) to the project directory

1. To see warnings and errors in Xcode, add a new "Run Script Phase" to the project containing the script below:
    ```
    if which swiftlint >/dev/null; then
      swiftlint
    else
      echo "warning: SwiftLint not installed, download from https://github.com/realm/SwiftLint"
    fi
    ```
## Jenkins

1. In Xcode, click on the project target icon next to the play button, then click "Manage Schemes...". Click the checkbox to set your project scheme to `Shared`. This is required for Jenkins

1. Follow the instructions in the [iOS Jenkins Pipeline Integration Guide](./ios_jenkins_pipeline_guide.md) to set up your Jenkinsfile in your repo.

1. Add, commit and push the changes.

1. At this point you should see your project building on Jenkins.

## Troubleshooting
- **Pushing to Github/putting up a PR doesn't trigger a new Jenkins build**
This only applies to legacy style Jenkins projects. Jenkins should handle adding and updating the necessary webhooks for your project automatically. To check that the webhooks on your repo are properly configured: Go to your repo settings and confirm that you can see the following under "Webhooks"
    - For pull requests
       ```
       https://ci.intrepid.io/ghprbhook/
       ```

   - For build deployment
       ```
       https://ci.intrepid.io/git/notifyCommit
       ```
- **Jenkins can't find your project scheme**
Check your project scheme in Xcode and make sure the "Shared" box is clicked
