## Why do we do pull requests?

* Catching and reducing technical debt
* Catching mistakes
* Improving development skills
* Familiarity with the whole codebase
* Maintaining consistency

## Pull Request Software

* We do all our PR's through GitHub.

## Creating Pull Requests

* Pull request granularity (how big should my pull requests be?)
  * Try to keep them under 500 lines.
  * Extremely short PR's of a couple lines are OK too. We always want someone to review, even on a tiny change.
* Pull request “single responsibility principle”
  * Pull requests should have one focus, for example: Adding a new model. Or updating an API.
  * This will also help keep them short.
* Pull request description
  * You should provide bullet points of the changes you are making.
  * It is an opportunity to offer up any explanation for why you want to make these changes.
  * Add a Jira ticket number or a Zeplin link if the PR applies to a specific story/bug.
  * Github allows you to use markdown in here, so format it well.
* When should screenshots be included?
  * This is usually not necessary in creating a request.
  * Maybe if the fix you are making is impossible to explain in words?
* [Git process, feature branches](git/git_workflow_quick_reference.md)
* Assigning people vs. posting in slack
  * Before you post in slack or assign a reviewer, make sure you review the PR yourself to catch any obvious errors.
  * When you're on a team, or working with a another specific dev, it's best to directly assign them. (Maybe send them a slack message too)
  * When the PR is more general, post in slack to get someone else's eyes on it.

* iOS Pull Request Description Template
  * Provided below is an example template for a PR description for the iOS Team. Standardizing the information included in a PR description can help team members more effectively review a PR. This template can be pasted directly into Github and completed with the relevant information. If any of the fields are not relevant simply fill in with `NA`.
  ```
    ## Summary:

    ### Link to JIRA Ticket:

    ### Zeplin screen(s) or link to Zeplin screen(s):

    ### Notes for verifying PR:

    ### Story closing PR: YES/NO
  ```

  The `Summary` should describe the general feature implemented or bug fixed. Include any information that would be helpful to the developer reviewing your PR. 

  The `Notes for verifying PR` should describe any actions required in order to put the app in a state to verify implementation of the feature or bug fix. If the PR should be verified on a device/OS version other than the standard device/OS version for the project, call that out in `Notes for verifying PR`.   

  The `Story closing PR` field should be marked as `YES` if after merging this PR the corresponding story will be moved to QA. 

## Reviewing Pull Requests

* Make comments on the Pull Request itself and not on the individual commits. Basically, use the `Files Changed` tab to make comments.
* What type of feedback should be given?
  * Formatting corrections. i.e. spacing and parentheses, spelling errors
  * Structural suggestions. i.e. order of methods, refactoring ideas
  * Obvious mistakes. i.e. unused variables or misused APIs
  * Or just ask clarifying questions if something is confusing.
  * There are no dumb comments, but there is dumb code.
* Correctness
  * There may not be a correct way to do something yet, either because it's not defined in our style guide or multiple ways are acceptable. Go with your gut!
* When is it necessary to run the code?
  * It never hurts...
  * It should be run and tested when there are heavy UI changes or if you are unsure of any particular change.
  * If there are unit tests, run the tests locally.

## Architecture

* When is it necessary to look at the whole codebase rather than just the diff?
  * If changes touch or reference a piece of code you're unfamiliar with -- go check it out!
  * When files are added, you may want to go verify the file structure is still organized correctly.

## Style

* When should we be nit-picky about style?
  * ALWAYS!
  * It makes you better and it makes your code easier for others to read.
* **Note on tone**: Please don't be offended by lots of style corrections and other comments. Reviewers are not being mean, they are just making you and the code better. :)

## Responding to Feedback

* When to make changes
  * Make easy changes as they come in, and push a commit with a few changes at once.
  * If there's something that needs discussion, don't change it right away because it will hide the existing comments in the PR if you edit that line.
* How to update the PR (force push)
  * Pushing new commits will update the PR automatically.
  * If you're rebasing, you will have to force push.
    * WARNING: Force pushes re-write history, so be very careful that you are pushing to the correct branch.
* When master moves forward, rebase your changes.
* If you have additional changes to make outside the commented suggestions, you should request a second review or save them for another pull request.

## Merging Pull Requests

* When to merge (how many people need to approve)
  * On small teams, everyone on the team should approve before merging.
  * On large teams (of 4 or more) two approvals should be good enough.
  * In the end, the author of the pull should be honest and use their best judgment to get the right amount of feedback before merging.
* Size of the team vs. size of the PR
* Rebase before merging with `--no-ff`
* Who performs the merge?
  * The requester should merge.
* Should the github “big green button” be used?
  * Yes, this is the preferred method of merging because of the merge commit that it creates. It makes a cleaner history.
  * Then delete the branch.
