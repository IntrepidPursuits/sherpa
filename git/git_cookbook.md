# Git cookbook
Handy recipes for git'n it done.


#### Bash Completions
Get tab-completion for all your git commands, including branch names!

##### If you're using homebrew:

1. [Install homebrew](https://github.com/Homebrew/homebrew/wiki/Installation), if you haven't already.
2. Install git and bash-completion via homebrew _(you must install git via homebrew for this to work)_
   1. `brew install git`
   2. `brew install bash-completion`
3. Add bash-completion to your `~/.bash_profile` in accordance with the message printed during installation, which probably looks like this:

   ```
   if [ -f `brew --prefix`/etc/bash_completion ]; then
        . `brew --prefix`/etc/bash_completion
   fi
   ```

##### Otherwise, you can just download and install a shell script:

1. Download the git-completion.bash file [here](https://github.com/git/git/blob/master/contrib/completion/git-completion.bash). This is usually stored in the home directory: ~/git-completion.bash
2. In your  ~/.bash_profile or ~/.bashrc or ~/.zshrc, add this line:

  ```
  source ~/.git-completion.bash
  ```
3. Make sure to restart terminal.

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
For use with your shell's `alias` command, or you can copy and paste them into your ~/.bash_profile.

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
alias gca='git commit --amend'
```

#### A less verbose status command
Includes only the files that changed and omits the boilerplate about the branch, etc.  Alias as `git s`, using git's built-in alias functionality.
```
git status -s
```

#### A better overview of history
This command lists the most recent 100 commits one-per-line, in color, with a graph of the history on the left.  Very handy for quickly looking at history or checking the relationships between branches.  Alias it as `git lg`.  Change the `-100` to any number of commits you'd like, or omit it entirely to see the whole history.

```
git log --oneline --decorate --graph --all -100
```

#### Easier submodules
One of the most common frustrations with submodules is failing to update them or forgetting to init them.  This command covers all those edge cases.  It's easiest to get into the habit of running it after every pull on a repo that has submodules.  Alias it as `git subup`.

```
git submodule update --init --recursive
```

#### Copy the current short hash into the paste buffer

```
git log -n 1 --oneline | awk "{print \$1}" | tr -d \\n | pbcopy
```
