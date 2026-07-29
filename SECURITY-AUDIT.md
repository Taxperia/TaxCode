# TaxCode Security Audit

Date: 2026-05-27

## Scope

This review covers the Windows desktop packages updated to VS Code OSS `1.121.0`, the root application lockfile, and all built-in extension lockfiles included in the source tree. It is a dependency and release-configuration review, not a penetration test.

Upstream baseline: [VS Code 1.121 release notes](https://code.visualstudio.com/updates/v1_121), published May 20, 2026, and tag [`1.121.0`](https://github.com/microsoft/vscode/tree/1.121.0).

## Packaged Profiles

| Profile | Built-in Copilot/chat | Telemetry | Intended use |
| --- | --- | --- | --- |
| `TaxCodeVDS` | No | Disabled | Remote desktop / low RAM |
| `TaxCodeLite` | No | Disabled | Lightweight, extension UI hidden |
| `TaxCodeNoTelemetry` | Yes | Disabled | Built-in chat with telemetry disabled |
| `TaxCodePlugins` | Yes | Disabled | Marketplace/plugins with telemetry disabled |

## Commands

```powershell
npm.cmd audit --package-lock-only --json
npm.cmd audit --omit=dev --package-lock-only --json
cd extensions/copilot
npm.cmd audit --package-lock-only --json
npm.cmd audit --omit=dev --package-lock-only --json
# Runtime scan was also run for each extensions/*/package-lock.json.
```

## Final Results

| Lockfile scope | Critical | High | Moderate | Low | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Root, all dependencies | 0 | 5 | 18 | 0 | 23 |
| Root, runtime only | 0 | 0 | 4 | 0 | 4 |
| Built-in Copilot, all dependencies | 0 | 8 | 8 | 1 | 17 |
| Built-in Copilot, runtime only | 0 | 0 | 4 | 0 | 4 |
| All 37 distributed runtime lockfiles, aggregate | 0 | 0 | 8 | 0 | 8 |

The aggregate scan covers the root lockfile and 36 built-in extension lockfiles after compatible remediations. The eight remaining runtime findings are the root and built-in Copilot moderate dependency chains listed below. There are no known `high` or `critical` npm advisory findings in dependencies included for runtime use. Build and test dependencies still contain high findings and must be isolated in CI rather than installed on end-user machines.

## Remediation Applied

| Change | Result |
| --- | --- |
| Upgraded root and built-in extension `@github/copilot` from `1.0.39` to `1.0.54` | Removes the high-severity nested bare repository command-execution advisory [GHSA-9ccr-r5hg-74gf](https://github.com/advisories/GHSA-9ccr-r5hg-74gf) from runtime audit results. |
| Upgraded root `ws` from `^8.19.0` to `^8.20.1` | Removes the `ws` runtime advisory from the root audit result. |
| Applied compatible lockfile fixes in Copilot, Microsoft Authentication, Markdown, and affected built-in extensions | Removes the runtime `@nevware21/ts-utils` high advisory [GHSA-x7j8-49r8-mr43](https://github.com/advisories/GHSA-x7j8-49r8-mr43), and compatible `brace-expansion` findings, across all distributed runtime scans. |
| Filtered non-Windows Copilot and `node-pty` native binaries from Windows packages | Avoids executing or rewriting irrelevant native modules during packaging and reduces shipped attack surface. |
| Preserved hard telemetry disable configuration in every profile | `enableTelemetry` is false and source-level telemetry resolution returns no supported telemetry level. |

## Remaining Runtime Findings

| Dependency chain | Severity | Affected package scope | Status / next action |
| --- | --- | --- | --- |
| `@anthropic-ai/sdk` | Moderate | Root and built-in Copilot paths | Local filesystem memory-tool permission advisory [GHSA-p7fg-763f-g4gf](https://github.com/advisories/GHSA-p7fg-763f-g4gf). The root automatic fix requires a semver-major SDK move; evaluate and test that migration before release. |
| `uuid` through `@microsoft/dev-tunnels-connections` and `@vscode/deviceid` | Moderate | Root runtime | Missing buffer bounds check advisory [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq). The tunnel chain currently reports no automatic fix; track upstream and avoid exposing unneeded tunnel features in hardened deployments. |
| `uuid` through `gaxios` | Moderate | Built-in Copilot runtime | Track an upstream compatible dependency update and re-run the Copilot runtime audit after upgrading. |

## Local Release Risks

1. `miyotu-codesign.pfx` is present in the project root. A PFX may contain a private signing key. Move it to protected release secrets, remove it from distributable archives, and rotate the certificate if it was ever shared.
2. `.vds-profile` exists locally and may contain runtime state, logs, tokens, or installed extension data. Do not include it in installers or source release archives.
3. The profiles intentionally offer different capability surfaces. `TaxCodeVDS` and `TaxCodeLite` exclude the built-in Copilot package; this is preferable for restricted remote desktop environments.

## Recommended Release Gate

1. Exclude signing keys, local profiles, logs, caches, and `.tmp` material from any release upload.
2. Run runtime dependency audit and secret scanning on every produced artifact.
3. Generate an SBOM and publish hashes for the four installer executables.
4. Run dependency updates for remaining moderate runtime findings in a separate compatibility pass.
5. Build in an isolated CI runner because build-only advisories remain in upstream tooling dependencies.
