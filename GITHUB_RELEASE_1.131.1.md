# TaxCode 1.131.1

TaxCode `1.131.1` is a TaxCode-only update on the VS Code OSS `1.131` baseline.

## Highlights

- Added a GitHub Releases update checker that runs after startup.
- Added the `TaxCode: Check for Updates...` command for manual checks.
- Added `taxcode.update.checkOnStartup` so users can disable startup update checks.
- Kept update checks telemetry-free by using the request service `NO_FETCH_TELEMETRY` call site.
- Kept the updater intentionally conservative: it opens the GitHub Release page and does not silently install code.

## Release Assets

| Asset | Profile |
| --- | --- |
| `TaxCodeVDSUserSetup.exe` | Remote desktop / low RAM, plugins hidden, telemetry disabled |
| `TaxCodeLiteUserSetup.exe` | Lightweight, plugins hidden, telemetry disabled |
| `TaxCodeNoTelemetryUserSetup.exe` | Plugin-capable editor surface, telemetry disabled |
| `TaxCodePluginsUserSetup.exe` | Marketplace/plugin-enabled, telemetry disabled |
| `SHA256SUMS.txt` | SHA256 checksums for the installer assets |
| `SECURITY-AUDIT.md` | Dependency and release-configuration audit notes |

## Versioning

TaxCode follows the upstream VS Code major/minor number and reserves the rightmost patch number for TaxCode-specific revisions.

| Version | Meaning |
| --- | --- |
| `1.131.0` | First TaxCode release based on VS Code OSS `1.131.0` |
| `1.131.1` | TaxCode-only update on the same VS Code `1.131` base |
| `1.132.0` | First TaxCode release after moving to VS Code `1.132` |

## Validation

- `npm.cmd run typecheck-client`
- Windows installer builds for all four TaxCode editions before publishing.
