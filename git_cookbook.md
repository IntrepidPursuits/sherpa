# Git cookbook
Handy recipes for git'n it done.

#### Listing branches in most-recently-changed order

```
git for-each-ref --sort=-committerdate --format='%(committerdate:short) %(refname)' refs/heads
```
(also add refs/remotes to include remote branches)

#### Creating a Pull Request from your current branch
_Recommended that this is added to your ~/.bash_profile_

```
function pr () {
  local repo=`git remote -v | grep -m 1 "(push)" | sed -e "s/.*github.com[:/]\(.*\)\.git.*/\1/"`
  local branch=`git name-rev --name-only HEAD`
  echo "... creating pull request for branch \"$branch\" in \"$repo\""
  git push -u origin $branch
  open https://github.com/$repo/compare/$branch?expand=1
}
```

#### Convenience Alias Commands

```
alias gs='git status'
alias gb='git branch'
alias gg='git log --graph --oneline —all'
alias go='git checkout'
alias gom='git checkout master'
alias gob='git checkout -b'
alias grim='git rebase --interactive master'
alias gri='git rebase -i'
alias gra='git rebase --abort'
alias grc='git rebase --continue'
alias gs="git status"
alias gca='git commit --amend'
```
