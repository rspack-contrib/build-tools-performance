---
name: "benchmark-readme-sync"
description: "Use when a user wants to refresh benchmark results in `README.md` from the latest successful GitHub Actions `Benchmark` workflow run for the current repository. Automatically find the newest successful run, extract the final Markdown tables for each benchmark case from the job logs, and update the README action URL, date, tool versions, and benchmark tables."
---

# Benchmark README Sync

## When to use
- Update `README.md` benchmark results from GitHub Actions.
- Replace stale benchmark tables, versions, run links, or dates.
- The user does not need to provide an Actions URL.

## Workflow
1. Read `README.md` and `.github/workflows/benchmark.yml` to confirm the benchmark cases and the current results layout.
2. Resolve the canonical GitHub repository and default branch with `gh repo view`, then find the latest successful `Benchmark` workflow run on that branch.
3. List the jobs for that run and map each matrix case to its job ID.
4. For each case job, fetch the log for the `Run Benchmark` step, remove ANSI escape codes, and extract the final Markdown tables printed at the end:
   - Keep both `Development metrics` and `Build metrics` when present.
   - Keep only `Build metrics` for build-only cases.
   - Start output at the first `Development metrics:` or `Build metrics:` heading so earlier log noise is excluded.
   - Do not recalculate rankings or rewrite the numbers manually.
5. Update `README.md`:
   - Replace the GitHub Actions run URL with the latest run URL.
   - Replace the date with today's local date.
   - Replace each case table with the extracted table from the matching job.
   - If a case section exists without a table, insert the extracted table under that case.
   - Preserve surrounding prose unless the benchmark output itself changes the tool names or versions shown in the tables.
6. Validate the result:
   - Every case in the workflow matrix is represented in `README.md`.
   - No duplicated headings, tables, or rows were introduced.
   - The diff only changes benchmark data, the run URL, and the date.

## Commands
Prefer `gh` because it is authenticated and exposes both run metadata and logs.

Resolve the canonical repository and default branch:

```bash
repo=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
branch=$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name)
```

Find the latest successful benchmark run:

```bash
gh run list \
  --workflow Benchmark \
  --branch "$branch" \
  --limit 20 \
  --json databaseId,conclusion,url,createdAt \
  --jq 'map(select(.conclusion == "success")) | sort_by(.createdAt) | last' \
  -R "$repo"
```

Fetch jobs for a run:

```bash
gh api repos/<owner>/<repo>/actions/runs/<run_id>/jobs --paginate
```

Extract a job's final benchmark tables:

```bash
gh run view <run_id> --job <job_id> --log \
  -R <owner>/<repo> \
  | awk -F '\t' '$2=="Run Benchmark"{ sub(/^﻿/, "", $3); sub(/^[^ ]* /, "", $3); print $3 }' \
  | perl -pe 's/\e\[[0-9;]*[A-Za-z]//g' \
  | awk 'BEGIN{capture=0} /^Development metrics:$/ || /^Build metrics:$/ {capture=1} capture {print}'
```

## Failure handling
- If no successful `Benchmark` run exists, stop and report that blocker.
- If a job log is missing or truncated, stop and report which case could not be extracted.
- If the workflow matrix and README sections do not match, update only the cases backed by logs and call out the mismatch clearly.
- If `README.md` already points to the latest successful run and the extracted tables match, the expected result is an empty diff.
