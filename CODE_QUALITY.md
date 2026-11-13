# Code Quality and Security Checks

This document is the contributor-facing reference for the automated checks run by the **Code Quality** GitHub Actions workflow. It explains what each tool examines, what a passing or failing result means, how to reproduce checks locally, and how to handle findings.

## 1. When the checks run

The workflow is defined in `.github/workflows/code-quality.yml` and runs on:

- Every pull request whose target branch is `main`.
- Every push to `main`.
- A manual run through **Actions → Code Quality → Run workflow**.

The checks intentionally analyze the project, not only the files changed in a pull request. This is necessary because unused code, dependency vulnerabilities, and duplicated code can involve files or packages outside the pull request's diff.

The workflow currently uses **Node.js 20** for Node-based checks.

## 2. How the workflow behaves

There are seven independent jobs:

1. ESLint
2. Knip
3. jscpd
4. Semgrep
5. Production build
6. Gitleaks
7. OSV-Scanner

They do not depend on one another. A failure in one job does not prevent the other jobs from starting or completing. This is deliberate: reviewers and developers should receive the complete set of results from a run, rather than only the first failure.

**The overall workflow passes only when every job passes.** A single failed job makes the workflow fail. Findings are not automatically ignored, converted to warnings, or treated as successful results.

A failed job can mean either:

- The tool ran successfully and found something that violates its configured policy; or
- The tool could not complete because of an execution, installation, configuration, permission, or infrastructure problem.

Always inspect the job log to distinguish these cases. A red status by itself does not prove that the application is broken or that every reported finding is an exploitable vulnerability.

## 3. Checks and pass/fail criteria

### 3.1 ESLint — code linting

**Command:** `npm run lint`

**Scope:** The files covered by the repository's ESLint configuration and lint script.

**What it checks:**

- JavaScript/JSX code against the project's configured lint rules.
- Common coding mistakes and suspicious patterns.
- Rule violations such as invalid or disallowed constructs, where enabled by the repository configuration.

**Pass criteria:** The lint command completes successfully and exits with code `0`.

**Failure criteria:** ESLint reports errors, or the command cannot run because of a script, dependency, or configuration problem. Warnings only fail the job if the project's lint command/configuration treats them as errors (for example, through a max-warnings setting).

**How to fix:** Follow the rule name and file/line location in the log. Prefer correcting the underlying code. Do not disable a rule globally just to make the check green. If a rule is genuinely unsuitable for a specific line, use the narrowest justified suppression and explain why.

### 3.2 Knip — unused and unlisted code/dependencies

**Command:** `npx --yes knip --no-progress`

**Scope:** The project, using Knip's automatically detected entry points and configuration.

**What it checks:**

- Unused files.
- Unused exports.
- Unused dependencies and development dependencies.
- Dependencies used by the code but not declared in the relevant package manifest (unlisted dependencies).

**Pass criteria:** Knip completes and reports no findings that cause a non-zero exit code.

**Failure criteria:** Knip reports unused or unlisted items, or cannot analyze the project due to a configuration/runtime problem.

**How to fix and review safely:**

1. Check whether the reported file/export/package is genuinely unused.
2. Search for dynamic imports, runtime registration, framework conventions, scripts, build tooling, and deployment references that static analysis may not discover.
3. Check whether the item is used by code outside Knip's detected entry-point graph.
4. Remove genuinely dead code or dependencies, or declare a genuinely used but unlisted dependency in the correct manifest.
5. If the item is intentionally retained, document the reason and make a narrow, maintainable Knip configuration adjustment where appropriate.

**Important:** Do not delete every item in a Knip report automatically. A reported item is a candidate for review, not proof that removing it is safe.

### 3.3 jscpd — duplicated code

**Command:** `npx --yes jscpd src --min-lines 5 --min-tokens 50 --threshold 5 --reporters console`

**Scope:** The `src/` directory.

**Configured detection limits:**

- A candidate duplicate must meet the tool's minimum of **5 lines** and **50 tokens**.
- The allowed duplication threshold is **5%**.
- The console reporter is used in CI.

**What it checks:** Repeated code fragments that may indicate copy/paste implementation, inconsistent maintenance, or opportunities for a shared function/component.

**Pass criteria:** The detected duplication percentage is at or below **5%**, and jscpd exits successfully.

**Failure criteria:** The measured duplication exceeds **5%**, or jscpd cannot complete.

**How to fix:** Review each reported pair in context. Refactor genuinely repeated behavior into a shared utility, component, hook, or module when doing so improves clarity and does not create inappropriate coupling. Similar-looking code is not always the same behavior; avoid extracting abstractions that make the code harder to understand. If duplication is intentional or generated, use a narrowly scoped exclusion only when justified and documented.

### 3.4 Semgrep — static security analysis

**Command:**

```bash
semgrep scan --config p/react --config p/security-audit --error src
```

**Scope:** The `src/` directory.

**Rule packs:** Semgrep's `p/react` and `p/security-audit` rule collections.

**What it checks:** Static patterns associated with React-specific risks and security issues. Depending on the matched rule, findings may include unsafe HTML rendering, injection risks, or other suspicious security-sensitive code patterns.

**Pass criteria:** Semgrep completes the scan and reports no findings that cause a non-zero exit code.

**Failure criteria:** A configured rule matches code and Semgrep exits non-zero, or the scanner/rule configuration cannot run.

The `--error` option is intentional: findings are treated as errors for CI status. The scan is not configured as warning-only.

**How to fix and review safely:**

1. Read the rule ID, severity, message, and source location.
2. Trace the data flow: identify whether the value is trusted, user-controlled, sanitized, encoded, or otherwise validated.
3. Prefer safe APIs and context-appropriate output encoding/sanitization.
4. Verify that any sanitizer is actually applied to the exact value reaching the dangerous sink and that it is suitable for the relevant context.
5. Add or update tests where the change affects security-sensitive behavior.
6. If the match is a false positive, document the evidence and use a narrow inline suppression or narrowly scoped configuration exception. Do not suppress an entire rule or directory merely to obtain a green result.

**Important:** A Semgrep finding is a security signal requiring triage. It is not, by itself, proof that an exploitable vulnerability exists. Conversely, the absence of findings does not prove that the code is completely secure.

### 3.5 Production build — compilation/build validation

**Command:** `npm run build`

**Scope:** The complete production build as defined by the repository's build script and Vite configuration.

**What it checks:**

- Whether the project can produce its production build.
- Compilation and bundling errors detected by the configured build toolchain.
- Build-time configuration or import problems encountered during the production build.

**Pass criteria:** The production build completes and exits with code `0`.

**Failure criteria:** The build reports compilation/bundling errors or cannot complete because of missing dependencies, invalid configuration, or environment problems.

**How to fix:** Reproduce the build locally, inspect the first meaningful error in the log, and correct the source/configuration issue. A successful build does not replace linting, security analysis, runtime testing, or browser testing.

### 3.6 Gitleaks — secret and credential scanning

**Action:** `gitleaks/gitleaks-action@v3`

**Scope:** The repository checkout includes the **full Git history** (`fetch-depth: 0`), allowing the action to inspect historical commits as well as the checked-out content.

**What it checks:** Patterns that resemble secrets and credentials, such as API tokens, passwords, private keys, and other sensitive values committed to the repository.

**Pass criteria:** Gitleaks completes without an unaccepted secret finding and the action succeeds.

**Failure criteria:** A potential secret is detected, or the action cannot run because of an execution/configuration/permission problem. The organization-owned repository also needs the GitHub Actions secret `GITLEAKS_LICENSE` configured as described below.

**How to handle a finding:**

1. Treat a detected credential as potentially exposed until verified otherwise.
2. Determine what service/account it belongs to and whether it is real, active, and sensitive.
3. If it is real, revoke or rotate it immediately. Removing it from the latest commit is not enough.
4. Remove the secret from the current source and move it to an approved secret store or GitHub Actions secret as appropriate.
5. Follow the repository's incident and history-cleanup process if the secret was committed. Rewriting Git history does not replace revoking the credential.
6. For a verified false positive, use a narrow documented allowlist/ignore with an explanation. Never broadly disable secret scanning.

**Important:** Gitleaks detects secret-like patterns. Each result must be triaged, but a suspected real credential must be handled urgently.

### 3.7 OSV-Scanner — dependency vulnerability scanning

**Workflow:** Google's reusable OSV-Scanner workflow, pinned to `google/osv-scanner-action/.github/workflows/osv-scanner-reusable.yml@v2.7.1`.

**Input:** `package-lock.json` (the lockfile is scanned, rather than relying only on direct dependencies listed in `package.json`).

**Configuration:** `fail-on-vuln: true` and `upload-sarif: true`.

**What it checks:** Known vulnerabilities recorded in the OSV database for dependency versions represented in the lockfile, including transitive dependencies where they are present in the dependency graph.

**Pass criteria:** The scanner completes and finds no vulnerability that causes the configured reusable workflow to fail.

**Failure criteria:** One or more vulnerabilities are detected with the current fail-on-vulnerability policy, or the scan cannot complete. SARIF upload is enabled so supported results can also appear in GitHub Code Security/Code Scanning.

**How to fix and triage:**

1. Identify the affected package, installed version, vulnerability identifier (such as a GHSA/CVE), and affected version range.
2. Check whether a fixed version is available and whether the dependency is direct or transitive.
3. Upgrade the direct dependency where possible; otherwise update the parent package or use a safe, supported override/resolution if appropriate.
4. Regenerate and commit `package-lock.json` using the repository's package manager.
5. Run the relevant tests and production build, then rerun the scanner.
6. If no safe upgrade is currently available, document the exposure, impact, owner, and mitigation plan. Any exception must be explicit and reviewed; do not change `fail-on-vuln` to `false` simply to turn the job green.

**Important:** OSV reports known vulnerabilities associated with dependency versions. A finding does not automatically prove that the vulnerable code path is reachable or exploitable in this application. It still requires assessment and a documented remediation/acceptance decision.

## 4. Local execution

Use Node.js 20 and npm, matching the Node-based CI jobs.

### 4.1 Install project dependencies

```bash
npm ci
```

### 4.2 Run the Node-based checks

```bash
npm run lint
npx --yes knip --no-progress
npx --yes jscpd src --min-lines 5 --min-tokens 50 --threshold 5 --reporters console
npm run build
```

### 4.3 Install and run Semgrep

Install Semgrep using a supported installation method for your operating system. For example, with Python pipx:

```bash
python -m pip install --user pipx
python -m pipx ensurepath
python -m pipx install semgrep
semgrep scan --config p/react --config p/security-audit --error src
```

Restart the terminal if required so the pipx executable directory is on `PATH`.

### 4.4 Run Gitleaks locally

Install Gitleaks using the official instructions: <https://github.com/gitleaks/gitleaks>.

From the repository root, scan the Git history:

```bash
gitleaks git .
```

The GitHub Action may have organization/license requirements that do not apply to a local CLI run.

### 4.5 Run OSV-Scanner locally

Install OSV-Scanner using the official instructions: <https://github.com/google/osv-scanner>.

From the repository root:

```bash
osv-scanner scan --lockfile=./package-lock.json
```

The local CLI output is useful for diagnosis. The GitHub reusable workflow remains the authoritative CI result for the configured action version and options.

## 5. GitHub configuration and required checks

For the workflow to run successfully in this organization-owned repository:

- Configure the repository Actions secret named `GITLEAKS_LICENSE` with the valid license value required by Gitleaks.
- Ensure the workflow has the permissions it needs to upload OSV SARIF results (`security-events: write` is configured in the workflow).
- If branch rules are used, configure the intended Code Quality jobs as required checks for pull requests targeting `main`. Confirm the exact check names shown by GitHub after the workflow has run; job names can differ from the workflow display name.

Do not require a check name that is not actually reported by GitHub. Review the branch rules after any job rename.

## 6. What developers should do when a pull request fails

1. Open the pull request's **Checks** tab and wait for all seven jobs to finish.
2. Open every failed job. Because jobs are independent, one run can contain multiple unrelated findings.
3. Classify each failure:
   - **Finding:** the tool ran and reported a policy violation or candidate issue.
   - **Execution failure:** the tool did not complete because of installation, configuration, permissions, network, or runner problems.
4. For findings, review the evidence and fix the underlying issue. Do not assume every static-analysis match is a confirmed vulnerability, and do not delete or suppress findings without review.
5. For execution failures, fix the workflow/tooling problem rather than changing application code to work around it.
6. Push the fix to the same pull request. The workflow runs again automatically.
7. Confirm all required jobs pass and request review/merge according to the repository's contribution and branch-protection rules.

A pull request may expose pre-existing issues that are outside its diff. Those findings should be assigned and tracked, not silently ignored. If the team decides to accept a specific existing risk temporarily, record the rationale, owner, and follow-up plan, and use only a narrowly scoped, reviewable exception where the tool supports one.

## 7. Policy: do not hide or weaken checks to obtain a green build

The purpose of this workflow is to make code-quality and security findings visible to the team and to re-run the checks as developers address them.

- Do not add `continue-on-error` to required scan jobs just to make the workflow green.
- Do not set OSV `fail-on-vuln` to `false` to ignore dependency vulnerabilities.
- Do not broadly exclude source directories or disable rule packs without a documented technical reason.
- Do not remove a finding from a report without verifying and recording why it is a false positive or accepted exception.
- Keep the jobs independent so a failure in one scan does not hide results from the others.

The workflow is a quality gate, not a guarantee that software is defect-free. Passing all checks means the configured checks passed at that commit; it does not replace code review, tests, threat modeling, or runtime monitoring.

## 8. Updating this document

Whenever the workflow changes, update this document in the same pull request. Keep commands, scopes, thresholds, rule packs, action versions, permissions, and pass/fail behavior aligned with `.github/workflows/code-quality.yml`.
