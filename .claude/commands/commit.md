---
description: "Add all changed files and create a git commit with conventional commit message"
allowed-tools: ["Bash", "Read", "Grep"]
---

I'll analyze the changed files and create a conventional commit message. Let me start by checking the git status and examining the changes.

!git status

Now let me examine the changes to understand what type of commit this should be:

!git diff --cached
!git diff

Based on the changes, I'll analyze the type of modifications:
- New features (feat:)
- Bug fixes (fix:) 
- Documentation changes (docs:)
- Code refactoring (refactor:)
- Performance improvements (perf:)
- Tests (test:)
- Build/tooling changes (build:, chore:, ci:)
- Code style changes (style:)

Let me add all changes and create an appropriate conventional commit:

!git add .

Now I'll create a conventional commit message based on the analysis of the changes and commit:

!git commit