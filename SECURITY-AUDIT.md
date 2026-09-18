# Security Audit - TaxCode 1.138.0

## Overview

This document tracks the security review for TaxCode 1.138.0, based on VS Code OSS 1.138.0.

## Scope

- TaxCode-specific telemetry shutdown paths
- GitHub release update check behavior
- Windows profile packaging for `TaxCodePlugins`, `TaxCodeLite`, and `TaxCodeVDS`
- Added release scripts, profile files, and documentation
- Dependency advisories reported by npm/GitHub before release

## Current Posture

- Telemetry is disabled by product configuration and by the TaxCode telemetry service hardening.
- Plugin-free profiles disable Marketplace gallery configuration and hide extension/chat entry points.
- The update checker only reads public GitHub release metadata and opens the release page after user action.
- Installer executables are release assets only and must not be committed to git.

## Known Risk Areas

1. Upstream VS Code OSS is a large application and may contain inherited advisories that should be tracked against Microsoft VS Code security updates.
2. Seeded third-party extensions, if used for Lite/Plugins packaging, must be refreshed before release.
3. Build-time dependency alerts should be reviewed separately from shipped runtime code.
4. Release installers should be checked with SHA-256 hashes before publication.

## Verification - 2026-09-18

| Check | Result |
| --- | --- |
| `npm run gulp compile` | Passed |
| `.\scripts\build-taxcode-profiles.ps1 -Profile all -Arch x64` | Passed; produced `TaxCodePlugins`, `TaxCodeLite`, and `TaxCodeVDS` win32-x64 app folders |
| `npm audit --omit=dev` | 5 total: 2 high, 3 moderate, 0 critical |
| `npm audit` | 32 total: 13 high, 19 moderate, 0 critical |
| Markdown extension dependency audit | 0 vulnerabilities after `npm ci --ignore-scripts` in `extensions/markdown-language-features` |

## Runtime Advisories

These advisories are present in production dependency audit output and must be reviewed before publishing installer assets:

| Package | Severity | Notes |
| --- | --- | --- |
| `adm-zip` via `foundry-local-sdk` | High | npm suggests `foundry-local-sdk@2.0.1`, which is a major update and needs compatibility review. |
| `foundry-local-sdk` | High | Direct dependency pinned to `1.2.3`; major upgrade should be tested with VS Code's Foundry integration. |
| `@anthropic-ai/sdk` | Moderate | npm suggests `0.126.0`, a major update from the current `^0.82.0` range and needs API review. |
| `@microsoft/dev-tunnels-connections` via `uuid` | Moderate | No npm fix currently available. Track upstream Microsoft package updates. |
| `uuid` | Moderate | No npm fix currently available through the current dependency path. |

## Build/Dev Advisories

Full audit includes additional build/test toolchain findings, mostly around `gulp`, `gulp-sourcemaps`, `svgo`, `browserslist`, `@xmldom/xmldom`, and related transitive packages. Several automatic fixes require major version changes, so they should be handled as a separate dependency-maintenance pull request instead of mixed into the VS Code baseline update.

## Remaining Pre-Release Checks

Run these before publishing a release:

```powershell
.\scripts\build-taxcode-profiles.ps1 -Profile all -Arch x64 -Setup
```

`-Setup` requires Inno Setup (`ISCC.exe`) on the build machine. Do not attach release installers until the runtime advisories above are fixed or explicitly accepted with a documented risk decision.
