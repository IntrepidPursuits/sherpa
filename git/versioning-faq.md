## Versioning FAQ
--------------------------------------------------------------------------------

### Terminology

#### commit

As a noun: A single point in the Git history; the entire history of a project is
represented as a set of interrelated commits.

As a verb: The action of storing a new snapshot of the project’s state in the
Git history, by creating a new commit representing the current state of the
index.

#### branch
A "branch" is an active line of development. The most recent commit on a branch
is referred to as the tip of that branch. The tip of the branch is referenced by
a branch head, which moves forward as additional development is done on the
branch. A single Git repository can track an arbitrary number of branches, but
your working tree is associated with just one of them (the "current" or "checked
out" branch), and HEAD points to that branch.

#### merge
As a verb: To bring the contents of another branch into the current branch. This
combination of fetch and merge operations is called a pull. Merging is performed
by an automatic process that identifies changes made since the branches
diverged, and then applies all those changes together. In cases where changes
conflict, manual intervention may be required to complete the merge.

As a noun: unless it is a fast-forward, a successful merge results in the
creation of a new commit representing the result of the merge, and having as
parents the tips of the merged branches. This commit is referred to as a "merge
commit", or sometimes just a "merge".

All terminology adapted from or taken directly from: https://git-scm.com/docs/gitglossary#Documentation/gitglossary.txt

--------------------------------------------------------------------------------

### Committing

There are many different philosophies and practices for version control. This
document provides some guidance on what practices we implement and why.

#### What does a good commit message look like?

> 1. Separate subject from body with a blank line
> 1. Limit the subject line to 50 characters
> 1. Capitalize the subject line
> 1. Do not end the subject line with a period
> 1. Use the imperative mood in the subject line
> 1. Wrap the body at 72 characters
> 1. Use the body to explain what and why vs. how

Source: https://chris.beams.io/posts/git-commit/

__Have meaningful commits__

Other people including your future self will be reading your history. Make them
useful.

An example of what not to do:
- "Save work"
- "Save more work"
- "Finished feature"

Further Reading: [Commit Message Guide](./commit_message_guide.md)

#### How big should a commit be?

A commit should be a logical chunk of work. The meaning of this can vary from
team to team, so make sure you are all aligned.

> A properly formed Git commit subject line should always be able to complete
the following sentence:
> - If applied, this commit will __your subject line here__

This can be used as a helpful guiding principle of how big a commit should be.

For example a helpful commit could look like
- "Implement the login screen"
- "Extract a class"
- "Update dependencies"
- "Fix typo on landing page"
- "Apply look and feel to the landing page"

In the same regard, if you cannot succinctly describe that sentence, then your
commit might be too small or too large.

__Break down large commits__
- "Add the login page, onboarding flow, settings page, and networking layer"

This commit is large! You could consider instead breaking this down into four
smaller commits
- "Implement the networking layer"
- "Implement the login page"
- "Implement the onboarding flow"
- "Implement the settings page"

__Combine small commits__
- "Add function to modify text"
- "Add test for function"
- "Connect user properties and labels"

Instead this could be:
- "Hook up the user profile page"

#### When should I commit?

Similar to the above, you should commit when you have created a logical chunk of
work. If you are actively working, you will likely want to commit at least
several times a day.

If you practice rewriting history, commit as frequently as you desire as long as
history looks good in the end.

--------------------------------------------------------------------------------

### Workflow

For further information on this see [this sherpa page.](https://github.com/
IntrepidPursuits/sherpa/blob/master/git/git_workflow_quick_reference.md)

#### When should I branch?
Generally speaking, when you need to work in parallel with another ongoing set
of work.
- You and someone else are working on different features (Branch from the main
  branch)
- You and someone else are working on the same feature (Have a feature branch
  off the main one, then each have individual branches)
- You want to have two different streams of work going at the same time (Same as
  above, but replace "someone else" with "yourself)

#### When should I merge into the shared branch?
When your work is done and reviewed.  In some cases, you may have incomplete
changes that need to be shared, just make sure to coordinate with your team
indicating that changes are not complete, and why they should be merged sooner.

#### When should we use a shared feature branch?
When you need to work in parallel with another ongoing set of work. e.g. Two
people are working on the same feature
