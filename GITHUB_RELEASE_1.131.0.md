# TaxCode 1.131.0

TaxCode `1.131.0` updates the project baseline to VS Code OSS `1.131.0`.

## Versioning

TaxCode follows the upstream VS Code major/minor number and reserves the rightmost patch number for TaxCode-specific revisions.

| Version | Meaning |
| --- | --- |
| `1.131.0` | First TaxCode release based on VS Code OSS `1.131.0` |
| `1.131.1` | TaxCode-only update on the same VS Code `1.131` base |
| `1.132.0` | First TaxCode release after moving to VS Code `1.132` |

## Release Assets

| Asset | Profile |
| --- | --- |
| `TaxCodeVDSUserSetup.exe` | Remote desktop / low RAM, plugins hidden, telemetry disabled |
| `TaxCodeLiteUserSetup.exe` | Lightweight, plugins hidden, telemetry disabled |
| `TaxCodeNoTelemetryUserSetup.exe` | Plugin-capable editor surface, telemetry disabled |
| `TaxCodePluginsUserSetup.exe` | Marketplace/plugin-enabled, telemetry disabled |
| `SHA256SUMS.txt` | SHA256 checksums for the installer assets |
| `SECURITY-AUDIT.md` | Dependency and release-configuration audit notes |

## Highlights

- Updated the source baseline to upstream VS Code OSS `1.131.0`.
- Kept the main TaxCode source product as the plugin-enabled, telemetry-disabled build.
- Preserved the four Windows profile builds: VDS, Lite, NoTelemetry, and Plugins.
- Preserved TaxCode branding, application IDs, profile-specific data folders, and installer naming.
- Removed an obsolete sessions Git contribution file that no longer exists in upstream `1.131.0`.
- Added a runtime security override for `adm-zip` `0.6.0` to clear the high-severity `foundry-local-sdk -> adm-zip` audit finding.
- Filtered non-target native addon payloads from Windows x64 packages, including Linux/macOS Copilot Claude audio-capture binaries and non-target `node-pty` prebuilds.
- Hardened Windows installer packaging by keeping the generated installer `product.json` outside the Inno Setup output directory.

## Validation

- `npm.cmd run typecheck-client` passed.
- Root runtime audit after remediation reports no high or critical runtime findings.
- Built all four Windows x64 user installers for `TaxCodeVDS`, `TaxCodeLite`, `TaxCodeNoTelemetry`, and `TaxCodePlugins`.

## Known Release Build Requirement

The Windows machine used for packaging must have Node.js `24.x`, Visual Studio 2022 Build Tools with the "Desktop development with C++" workload, and Windows SDK signing tools available on `PATH`. Without those tools, native npm modules and installer packaging cannot be completed.
