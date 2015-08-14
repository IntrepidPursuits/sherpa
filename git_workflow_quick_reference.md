# Developer Workflow

## General git setup

Main branch(es)
- Usually named master and/or develop
- Contains all reviewed changes
- Starting point for new features

Feature branches
- Named after the feature or person (phil-profile)
- Used to keep unreviewed changes off of the main branches
- Should be closed after no longer applicable (feature complete, reviewed, and merged into master/develop)
- These are where you commit your personal changes

When starting a new project
- Agree on the “main” branch (master, develop, etc.)
- Agree on feature branch naming conventions ([name]/[jira number]/[description])
- Make sure there are both local and remote copies of the “main” branch and your personal/feature branches
- Agree on pull request flow (who’s reviewing, who merges when complete)

## General git workflow

The beginning (no local changes)
- Update your main branch by pulling from the remotegit pull origin master
- Create a new feature branch git checkout -b phil-profile

Now you are on your feature branch with the most recent version!
Begin making your changes!

Done with personal changes
Add and commit the files you wish to change (Android Studio is very useful for adding and committing)
- git add [files]
- git commit -m “[commit message]”
Switch to the main branch and update it
- git checkout master
- git pull origin master
Switch back to yourfeature branch and update it with the changes from the main branch (AS also useful for switching branches)
- git checkout phil-profile
- git rebase -i master (-i is for interactive rebase where you can choose which of your commits get applied and/or change their commit messages)
Now that our branch is updated push it to the remote
- git push origin phil-profile

Changes live on server on feature branch
- On Github, create a pull request comparing master to your feature branch describing your changes on a high level (individual commit messages should be more specific)
- Wait for someone to review it and merge it in, but in the mean time rinse and repeat!











