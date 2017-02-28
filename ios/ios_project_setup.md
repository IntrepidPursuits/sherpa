# How To Create A New Project
## Create Xcode project and Github repo
1. Create repo on Github with `.gitignore` and `README.md`. Usually, repos should be named with the format `<project-name>-ios` e.g `bose-stetson-ios`

1. Create Xcode Project

1. In the Xcode project directory, run:
    ```
    git init
    git remote add origin <remote-url>
    git pull origin master
    git push --set-upstream origin master
    ```
    > Pull before pushing to get the Github-generated `.gitignore` so ignored files don't end up in the repo

1. Update `README.md` to use [Intrepid README template](https://github.com/IntrepidPursuits/sherpa/blob/master/readme-template)
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

## Jenkins

1. In Xcode, click on the project target icon next to the play button, then click "Manage Schemes...". Click the checkbox to set your project scheme to `Shared`. This is required for Jenkins

1. Add, commit and push the changes.

1. Setup Jenkins jobs
    - Copy `ios-template` and replace the variables as directed. Add the "Record Master Coverage" post-build step to get code coverage comparisons.
    - Copy `ios-pull-request-template` on Jenkins and replace the variables as directed. Jenkins is already configured to re-test a pull request if you comment "retest this please" on a PR in Github. To change this phrase, go to Build Triggers and click Advanced, then fill in the "Trigger phrase" field with your desired phrase.
    - To add Slack notifications:
        - Go to the "Slack Notifications" post-build step and confirm you want the notifications selected.
        - Then click the "Advanced" button and set the project channel to be your project's Slack channel.
        - Fill in the fields in the main job to match the pull request job (including team subdomain, integration token and project channel)
        - Click "Test Connection" to confirm that the notifications are sent to the right channel. You should see a message from Jenkins that says `Slack/Jenkins plugin: you're all set on https://ci.intrepid.io/`

## Troubleshooting
- **Pushing to Github/putting up a PR doesn't trigger a new Jenkins build**
Check that the webhooks on your repo are properly configured. Go to your repo settings and confirm that you can see the following under "Webhooks"
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
