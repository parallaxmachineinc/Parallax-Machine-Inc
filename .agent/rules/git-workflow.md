# Git Workflow & Push Policy

## Critical Rule: No Unsolicited Git Push

1. **Commit vs. Push**:
   - Committing locally after verifying a feature or fix is acceptable when requested or during safe workflows.
   - **`git push` is STRICTLY prohibited without explicit user instruction.** Always prompt the user for confirmation before pushing to remote branches (`origin/main`).

2. **Commit Messages**:
   - Follow standard Conventional Commits convention:
     - `feat: ...` for new features or components
     - `fix: ...` for layout, styling, or bug fixes
     - `refactor: ...` for code cleanup without behavior changes
     - `docs: ...` for documentation updates
     - `chore: ...` for tooling and configuration updates

3. **Status Check**:
   - Always run `git status` to review modified and untracked files before proposing a commit.
