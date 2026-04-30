---
name: Git Behavior
description: Project-specific instruction for handling git commands
---

# Git Usage Rules
- **NEVER** run `git` commands (add, commit, push, checkout, etc.) unless specifically asked by the user in the current request.
- Default to letting the user handle version control.
- If an automated task requires a git action, ask for explicit permission first.

# Branch & PR Workflow
- **NEVER** commit directly to `main`. The repo has branch protection rules requiring pull requests.
- Always create a feature branch (e.g. `fix/description` or `feature/description`), commit there, push, and open a PR via `gh pr create`.
- After creating the PR, switch back to `main` and reset it to `origin/main` to keep it clean.

# GitHub CLI (`gh`) Account
- The `gh` CLI may have multiple accounts. This repo is owned by `evansabove`.
- Before running `gh` commands against this repo, switch to the correct account: `gh auth switch --user evansabove`
- Switch back to the previous account after finishing.
