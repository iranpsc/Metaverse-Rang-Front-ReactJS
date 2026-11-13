# Code Quality and Security Checks

The repository is checked as a whole on every pull request to `main`. These checks are not limited to changed files because unused-code detection, dependency analysis, and duplicate-code detection need project-wide context.

## Pull request checks

| Tool | Purpose | Scope |
| --- | --- | --- |
| Knip | Detect unused files, exports, dependencies, and devDependencies | Whole project |
| jscpd | Detect duplicated code | `src/`, minimum 5 lines and 50 tokens; fail above 5% duplication |
| Gitleaks | Detect secrets in repository history and content | Full Git history |
| OSV-Scanner | Detect known vulnerable dependencies | `package-lock.json` |
| Semgrep | React and security static-analysis rules | `src/` |
| ESLint | Enforce existing JavaScript/JSX lint rules | Whole project |
| Vite | Verify production compilation | Whole project |

A failed required check must be resolved or explicitly reviewed before merging. Do not automatically delete code reported by Knip: confirm that it is not loaded dynamically, referenced by deployment tooling, or used outside the detected entry-point graph.

## Local setup

The project uses Node.js 20 and npm.

1. Install project dependencies:

   ```bash
   npm ci
   ```

2. Install Lefthook and register Git hooks:

   ```bash
   npx --yes lefthook install
   ```

3. Install the command-line tools required by the pre-push hook:
   - Gitleaks: https://github.com/gitleaks/gitleaks
   - OSV-Scanner: https://github.com/google/osv-scanner
   - Semgrep: https://semgrep.dev/docs/getting-started/

   For this repository under the `iranpsc` organization, add the Gitleaks Action license as an Actions secret named `GITLEAKS_LICENSE` (Settings → Secrets and variables → Actions). The action requires this secret for organization-owned repositories.
   Knip and jscpd are invoked through `npx`, so they do not need to be added to the application's runtime dependencies.

4. Run all pre-push checks manually:

   ```bash
   npx --yes lefthook run pre-push
   ```

## Important notes

- Gitleaks findings must be investigated. If a real credential was committed, revoke/rotate it; removing it from the latest version does not invalidate a leaked credential or erase it from Git history.
- OSV-Scanner reports known vulnerabilities, not proof that vulnerable code is exploitable. Review the affected package, version range, and available remediation.
- Semgrep and duplication thresholds may need tuning after the first full baseline run. Do not silence findings broadly; use narrow, documented suppressions.
- The workflow runs on pull requests targeting `main`, pushes to `main`, and manual dispatch.
- GitHub branch protection must require the `Static analysis and build`, `Secret scanning`, and `Dependency vulnerability scan` checks. Configure this in repository Settings → Rules → Rulesets (or Branch protection rules).
