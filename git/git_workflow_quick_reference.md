# Developer Workflow Quick-Reference

## Branch Organization

Main branch(es)
- Usually named `master` and/or `develop`
  - The `develop` branch is usually the most up-to-date version of the project.
  - The `master` branch is usually the most recent "stable" release of the project.
- Contains only reviewed changes
- Starting point for new features
- Generally do not ever commit or push directly to these branches.

Feature branches
- Named after the feature or person (e.g. phil-profile)
- Used to keep work in progress off of the main branches
- Should be closed after no longer applicable (feature complete, reviewed, and merged into master/develop)
- These are where you commit your personal changes

When starting a new project
- Agree on the “main” branch(es) (`master`, `develop`, etc.)
- Agree on feature branch naming conventions ([name]/[jira number]/[description])
- Make sure there are both local and remote copies of the “main” branch and your personal/feature branches
- Agree on pull request flow (who’s reviewing, who merges when complete)

## Workflow for a Single Feature

### The beginning (no local changes)
Update your main branch by pulling from the remote

```
git checkout develop
git pull origin develop
```

Create a new feature branch
```
git checkout -b phil/JIRA-1234/profile-page
```

Now you are on your feature branch with the most recent version!
Begin making your changes!

### Done with personal changes

First Add the files you wish to change.
- Add specific files like so:
```
git add SomeFile.java SomeOtherFile.java
```
- Or add all files reachable from the current directory like so:
```
git add .
```
There are many other advanced uses of `git add`, as outlined in the *FULL GIT GUIDE*.

Once changes have been added, commit them with a descriptive message.
```
git commit -m “Set up the profile screen”
```

### Combining changes on the main branch into your feature branch

Switch to the main branch and update it
```
git checkout develop
git pull origin develop
```

Switch back to your feature branch and update it with the changes from the main branch. Intrepid generally uses a "rebase" workflow for keeping feature branches up-to-date with the main branch. It's very important to understand exactly what rebase does, and so we recommend reading more *here*. (TODO: Add short description of rebase.) 

```
git checkout phil/JIRA-1234/profile
git rebase -i develop
```
Note: The rebase `-i` flag is for "interactive" rebase, where you can choose which of your commits get applied, change their commit messages, and much more. Even if you do not need any of these advanced features, we still advise using `-i` just so that you can confirm that the right set of commits are being applied.

At this point you may need to resolve conflicts.

### Resolving conflicts

First determine which files have conflicts.

```
git status
```

Conflicted files will be marked as "unmerged paths". (TODO: verify language.) To resolve the conflicts, open these files in your editor of choice and find where git has marked the conflict, which will look something like:
```
HEAD >>>>>>>>>>>>>>>>>
myVariable = someValue;
=====================
myVariable = someOtherValue;
[some commit] <<<<<<<<<<<<<<<<<<<
```
TODO: Get a more accurate example.

Manually fix the conflict by removing git's annotations, and making sure that the combined code is correct. Then mark the file as unconflicted by staging it to be committed:
```
git add SomeFile.java
```

After resolving conflicts, you should generally verify that the code runs as expected. Note that during a rebase, not all commits may have been applied yet, and so you should check for behavior that matches the current commit. When you are satisfied with the changes:

TODO: Talk more about fixing conflicts for an individual commit, and the various gotchas.

```
git rebase --continue
```

This should open an editor, to allow you to edit the commit message. Save and exit to continue. At this point the rebase will begin applying the next commit, which may cause more conflicts. Repeat until all commits have been applied, at which point git should show you the message "Rebase done." (TODO: Verify language.)

### Push your changes to the remote

Pushing your changes lets other developers access them, and also backs them up in the remote repository. Pushing regularly is good practice, as it keeps others in the loop and prevents you from losing work. To push your branch:

```
git push origin phil/JIRA-1234/profile-page
```

Note: If this command fails with a message "(TODO: Fill in this message.)" then that means that your local branch has diverged from a version previously pushed to the server. This may happen after a rebase. Read *this* for more on how to work around this issue.

### Post your changes for review

Once your branch is pushed, you should notifiy other developers to review it.
- Create a pull request on github, comparing your branch to the main branch. (See our *pull request guide* for specifics on how to create a good pull request.)
- Ask another developer to review your PR. Some teams may choose to use github's "assign" feature to assign a reviewer.

When reviewing someone else's changes:
- Look over the code and leave comments, or talk to them in person.
- If you have time, pull and run the feature branch to get a good understanding of what it does. This can sometimes be useful for gaining context before reading the code.
- After you are satisfied with the code, leave a "Ship it!" message. (TODO: Link various shipit squirrels, boats, thumbs-ups, etc.)

### Merging changes into the main branch

After your pull request has been reviewed and recieved a "ship it", it's time to merge. First check whether the main branch has been updated since the time that you created the pull request.

(TODO: Rewrite this next section to be more fool-proof, and to explain how to determine if you branch needs to be rebased again.)

If your branch needs to be rebased, do the following:
```
git checkout develop
git pull origin develop
git checkout phil/JIRA-1234/profile-page
git rebase -i develop
```

Now push the updated branch to the server.
```
git push -f origin phil/JIRA-1234/profile-page
```
Warning: Note that the `-f` flag is to "force" git to push the updated branch. Because `rebase` rewrites history, git will not allow you to push the new version of the branch by default. You should *never* use `-f` except when updating your own feature branches.

Revisit your pull request on github. There should be a green "merge" button telling you that your pull request can be automatically merged. Press this button to merge your changes into the remote branch.

TODO: Should we move away from using github's merge button, and instead merge branches locally? The advantages would be:
- It reduces the need to push with `-f`.
- It ensures that history remains linear, instead of possible edge-cases where two developers merge at the same time.

Android Developers: Android Studio is very useful for adding and committing, as outlined *here*.
