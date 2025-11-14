You are tasked with generating a comprehensive pull request description and either creating a new PR or updating an existing one.

Follow these steps:

## 1. Gather Branch Information

Run these git commands in parallel to understand the current state:

```bash
# Get current branch name
git rev-parse --abbrev-ref HEAD

# Get the default branch (usually main or master)
git remote show origin | grep 'HEAD branch' | cut -d' ' -f5

# Get git status
git status
```

## 2. Find the Base Branch

Determine which branch this was forked from. First, try to find the tracking branch:

```bash
# Get the upstream branch if it exists
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo "No upstream"
```

If there's no upstream, assume the base branch is the default branch (main/master).

## 3. Check for PR Template

Check for the repository's PR template:

```bash
# Check for PR template in common locations
if [ -f .github/PULL_REQUEST_TEMPLATE.md ]; then
  cat .github/PULL_REQUEST_TEMPLATE.md
elif [ -f .github/pull_request_template.md ]; then
  cat .github/pull_request_template.md
elif [ -f docs/PULL_REQUEST_TEMPLATE.md ]; then
  cat docs/PULL_REQUEST_TEMPLATE.md
elif [ -f PULL_REQUEST_TEMPLATE.md ]; then
  cat PULL_REQUEST_TEMPLATE.md
else
  echo "No PR template found"
fi
```

## 4. Analyze the Changes

Get comprehensive information about all changes since the branch point:

```bash
# Get all commits in this branch (not in base branch)
git log <base-branch>..HEAD --oneline

# Get the full diff between base branch and current branch
git diff <base-branch>...HEAD

# Get list of changed files with stats
git diff <base-branch>...HEAD --stat
```

## 5. Generate PR Description

**If a PR template was found in step 3:**
- Use the template structure as the base
- Fill in each section of the template with relevant information from the commits and diff
- Replace HTML comments with actual content
- Keep all template sections, even if some are brief

**If no PR template was found:**
- Generate a description with these sections: Summary, Changes, Technical Details, Testing, Breaking Changes

**In both cases:**
- Analyze the full diff, not just commit messages
- Be thorough but concise
- Use proper markdown formatting
- Include checkboxes for testing items
- Add the Claude Code footer: `---\n🤖 Generated with [Claude Code](https://claude.com/claude-code)`

## 6. Check for Existing PR

Check if a PR already exists for this branch:

```bash
gh pr view --json number,title,body 2>&1
```

## 7. Create or Update PR

**If PR exists:**
- Update the PR description with the generated content using:
```bash
gh pr edit --body "$(cat <<'EOF'
[generated description]
EOF
)"
```
- Display the PR URL to the user

**If no PR exists:**
- Ask the user if they want to create a PR now
- If yes, ask what base branch to target (default to the branch found in step 2)
- Create the PR with:
```bash
gh pr create --base <base-branch> --title "[generated title]" --body "$(cat <<'EOF'
[generated description]
EOF
)"
```
- Display the created PR URL

## Important Notes

- NEVER run `git push` without explicit user permission
- If the current branch is not pushed to remote, inform the user and ask if they want to push it first
- Be thorough in analyzing the diff - look at all changes, not just commit messages
- If there are a large number of changes, summarize by file/module rather than listing every single change
- Ensure the PR description is well-formatted and professional
