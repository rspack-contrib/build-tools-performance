---
name: "benchmark-readme-sync"
description: "Use when a user wants to refresh benchmark results in `README.md` from the latest successful GitHub Actions `Benchmark` workflow run for the current repository. Use a robust `gh` and shell workflow to find the newest successful run, extract final Markdown tables from job logs, and update the README run URL, date, versions, and tables."
---

# Benchmark README Sync

## When to use
- Update `README.md` benchmark results from GitHub Actions.
- Replace stale benchmark tables, versions, run links, or dates.
- The user does not need to provide an Actions URL.

## Workflow
1. Read `README.md` and `.github/workflows/benchmark.yml` to confirm the benchmark cases and the current results layout.
2. Resolve the canonical GitHub repository and default branch with `gh repo view`, then find the latest successful `Benchmark` workflow run on that branch unless the user gave a specific run ID.
3. List the jobs for that run and map each matrix case to its job ID before touching `README.md`.
4. For each case job, extract only the final benchmark tables from the log using the robust shell pipeline below.
5. Update `README.md` carefully:
   - Replace the GitHub Actions run URL with the latest run URL.
   - Replace the date with today's local date.
   - Replace each case table with the extracted table from the matching job.
   - Preserve the case heading, prose, command block, and the final `---` separator before `## Run locally`.
   - Do not recalculate rankings or rewrite the numbers manually.
6. Validation is required after the edit:
   - Every case in the workflow matrix is represented in `README.md`.
   - No duplicated headings, tables, or rows were introduced.
   - The separator before `## Run locally` is still present.
   - The diff only changes benchmark data, the run URL, and the date.

## Commands
Prefer `gh` because it is authenticated and exposes both run metadata and logs. Use these to execute or debug the workflow manually.

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

Map case names to job IDs:

```bash
gh api repos/<owner>/<repo>/actions/runs/<run_id>/jobs --paginate \
  | jq -r '.jobs[] | [.id, .name] | @tsv'
```

Extract a job's final benchmark tables:

```bash
gh run view <run_id> --job <job_id> --log \
  -R <owner>/<repo> \
  | cut -f3- \
  | perl -pe 's/\e\[[0-9;]*[A-Za-z]//g' \
  | sed -E 's/^\xef\xbb\xbf//; s/^[0-9T:.\-]+Z //' \
  | awk 'BEGIN{capture=0} /^Development metrics:$/ || /^Build metrics:$/ {capture=1} capture && $0!="Post job cleanup." {print} $0=="Post job cleanup." {exit}'
```

Notes:
- Do not rely on the second log column being `Run Benchmark`. Current `gh run view --log` output may label lines as `UNKNOWN STEP`, while the third column still contains the benchmark output you need.
- Capture starts at the first `Development metrics:` or `Build metrics:` heading so preamble noise is excluded.
- Stop at `Post job cleanup.` so cleanup lines do not leak into the tables.
- Keep both `Development metrics` and `Build metrics` when present, and only `Build metrics` for build-only cases.
- Prefer replacing one case section at a time or using a temporary one-off local command; do not add repository scripts just to complete a single sync.
- The brittle part of the edit is preserving section boundaries, especially the final `---` before `## Run locally`.

## Failure handling
- If no successful `Benchmark` run exists, stop and report that blocker.
- If a job log is missing or truncated, stop and report which case could not be extracted.
- If the workflow matrix and README sections do not match, update only the cases backed by logs and call out the mismatch clearly.
- If `README.md` already points to the latest successful run and the extracted tables match, the expected result is an empty diff.
- If the workflow breaks down, include the failing step in the report: repo resolution, run lookup, job mapping, log extraction, README replacement, or structural validation.
