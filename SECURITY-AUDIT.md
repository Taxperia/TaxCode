# TaxCode Security Audit

Date: 2026-08-01

## Scope

This review covers the TaxCode source updated to VS Code OSS `1.131.0`, the root application lockfile, the `remote` lockfile, and built-in extension lockfiles that are relevant to the Windows desktop release profile set. It is a dependency and release-configuration review, not a penetration test.

Upstream baseline: [VS Code 1.131 release notes](https://code.visualstudio.com/updates/v1_131/) and tag [`1.131.0`](https://github.com/microsoft/vscode/tree/1.131.0).

## Build Environment

| Tool | Version / status |
| --- | --- |
| Node.js | `24.18.0`, repo-local zip under `.tmp` |
| npm | `11.16.0` from Node `24.18.0` |
| Visual Studio Build Tools | Visual Studio Build Tools 2022 `17.14.37` |
| VC++ toolset | MSVC `14.44.35207`, including Spectre-mitigated libraries |

## Packaged Profiles

| Profile | Built-in Copilot/chat | Extensions/Marketplace | Telemetry | Intended use |
| --- | --- | --- | --- | --- |
| `TaxCodeVDS` | No | Hidden/disabled | Disabled | Remote desktop / low RAM |
| `TaxCodeLite` | No | Hidden/disabled | Disabled | Lightweight local editor |
| `TaxCodeNoTelemetry` | Yes | Built-in extension support | Disabled | Full editor features without telemetry |
| `TaxCodePlugins` | Yes | Marketplace enabled | Disabled | Plugin-enabled TaxCode build |

The default source product is the plugin-enabled, telemetry-disabled TaxCode distribution. The other three variants are generated from `build/win32/profiles/*.json`.

## Commands Completed

```powershell
npm.cmd install --no-audit
npm.cmd run typecheck-client
npm.cmd audit --package-lock-only --json
npm.cmd audit --omit=dev --package-lock-only --json
npm.cmd audit fix --omit=dev
npm.cmd audit fix --package-lock-only --omit=dev
.\scripts\build-taxcode-profiles.ps1 -Profile all -Arch x64 -Setup
```

The audit scan was also run across release-scope lockfiles: root, `remote`, and `extensions/**`, excluding `node_modules`, `.tmp`, `.build`, `out*`, `__upstream_vscode`, `build`, `test`, and `.vscode` helper packages.

## Final Results

| Lockfile scope | Critical | High | Moderate | Low | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Root, all dependencies | 0 | 7 | 14 | 0 | 21 |
| Root, runtime only | 0 | 0 | 3 | 0 | 3 |
| Release-scope runtime aggregate, 45 lockfile scopes | 0 | 0 | 16 | 0 | 16 |

`npm.cmd run typecheck-client` passes on the updated source tree.

All four Windows x64 user installers were built locally for `TaxCodeVDS`, `TaxCodeLite`, `TaxCodeNoTelemetry`, and `TaxCodePlugins`.

## Remediation Applied

| Change | Result |
| --- | --- |
| Updated the source baseline to VS Code OSS `1.131.0` | Pulls in upstream security, Electron, dependency, and workbench changes from the 1.131 release line. |
| Added a root npm override for `adm-zip` `0.6.0` | Removes the high-severity runtime advisory reported through `foundry-local-sdk -> adm-zip <0.6.0`. |
| Applied compatible runtime audit fixes for built-in extension lockfiles | Removes high-severity `brace-expansion` findings from language/npm extensions and a high-severity `postcss` finding from Mermaid Markdown features. |
| Applied compatible `tar` runtime fixes | Clears `tar` runtime findings from root/remote release-scope audits where npm offered a safe fix. |
| Preserved hard telemetry disable configuration | `enableTelemetry` remains false, telemetry opt-out UI is hidden, and source-level telemetry support resolves to disabled. |
| Preserved low-RAM/no-plugin profiles | `TaxCodeVDS` and `TaxCodeLite` continue to hide chat/accounts/extensions entry points and exclude heavy built-in Copilot packaging paths. |
| Filtered non-target native addon payloads | Removes Linux/macOS Copilot Claude audio-capture binaries, non-target `node-pty` prebuilds, and non-target js-debug native token binaries from Windows x64 packages. |
| Isolated installer `product.json` from the Inno output directory | Prevents local Inno Setup packaging from locking its own output folder while embedding profile-specific product metadata. |

## Remaining Runtime Findings

| Dependency chain | Severity | Affected scope | Status / next action |
| --- | --- | --- | --- |
| `@anthropic-ai/sdk` | Moderate | Root and Copilot runtime paths | Automatic fix requires a semver-major SDK move in at least one path. Evaluate and test that migration separately. |
| `@microsoft/dev-tunnels-connections -> uuid` | Moderate | Root runtime | No automatic compatible fix reported. Track upstream and avoid exposing tunnel features in hardened deployments. |
| `@opentelemetry/*` through `applicationinsights` | Moderate | Copilot and Copilot chat-lib runtime paths | npm reports fixes that require breaking updates. Keep pinned until Copilot compatibility is verified. |

There are no known high or critical npm audit findings in the release-scope runtime audit after the applied compatible fixes.

## Local Release Risks

1. Build-only and test-only dependency trees still report high findings. They are excluded from runtime release scope and should stay isolated to build machines.
2. Signing keys, local profiles, caches, `.tmp`, `.artifacts`, `node_modules`, `__upstream_vscode`, and generated output folders must not be uploaded as source artifacts.
3. The plugin-enabled builds intentionally expose a larger extension and account/authentication surface than `TaxCodeVDS` and `TaxCodeLite`.

## Release Gate Status

1. Completed: all four Windows installer profiles build successfully.
2. Completed at publish time: SHA256 hashes are generated by `scripts/publish-taxcode-release.ps1` and attached as `SHA256SUMS.txt`.
3. Recommended: keep `TaxCodeVDS` and `TaxCodeLite` as the preferred builds for restricted remote desktop environments.
4. Remaining work: handle the moderate Copilot/OpenTelemetry/Anthropic dependency upgrades in a separate compatibility pass.
