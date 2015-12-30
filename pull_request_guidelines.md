## Why do we do pull requests?

* Catching and reducing technical debt
* Catching mistakes
* Improving development skills
* Familiarity with the whole codebase
* Maintaining consistency

## Pull Request Software

* Reviewboard vs. Github

## Creating Pull Requests

* Pull request granularity (how big should my pull requests be?)
 * Try to keep them under 500 lines.
* Pull request “single responsibility principle”
 * Pull requests should have one focus, for example: Adding a new model. Or updating an API.
 * This will also help keep them short.
* Pull request description
 * You should provide bullet points of the changes you are making.
 * It is an opportunity to offer up any explanation for why you want to make these changes.
 * Github allows you to use markdown in here, so format it well.
* When should screenshots be included?
 * This is usually not necessary in creating a request.
 * Maybe if the fix you are making is impossible to explain in words?
* [Git process, feature branches](git_workflow_quick_reference.md)
* Assigning people vs. posting in slack
 * When you're on a team, or working with a another specific dev, it's best to directly assign them.
 * When the PR is more general, post in slack to get someone else's eyes on it.

## Reviewing Pull Requests

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

## Architecture

* When is it necessary to look at the whole codebase rather than just the diff?
 * If changes touch or reference a piece of code you're unfamiliar with -- go check it out!
 * When files are added, you may want to go verify the file structure is still organized correctly.

## Style

* When should we be nit-picky about style?
 * ALWAYS!
 * It makes you better and it makes your code easier for others to read.

## Responding to Feedback

* When to make changes
 * Is it best to get all the comments from someone before making changes? Or should you make push fixes for comments as they come in?
* How to update the PR (force push)
 * Pushing new commits will update the PR automatically.
 * If you're rebasing, you will have to force push.
* When master moves forward, when should the feature branch be rebased?
 * Always? Or just when conflicts are created?

## Merging Pull Requests

* When to merge (how many people need to approve)
 * Everyone on the team should approve before merging.
* Size of the team vs. size of the PR
* Rebase before merging with `--no-ff`
* Who performs the merge?
 * The requester should merge.
* Should the github “big green button” be used?
 * Yes, this is the preferred method of merging.
 * Then delete the branch.
