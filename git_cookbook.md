# Git cookbook
Handy recipes for git'n it done.

#### Listing branches in most-recently-changed order

```
git for-each-ref --sort=-committerdate --format='%(committerdate:short) %(refname)' refs/heads
```
(also add refs/remotes to include remote branches)

