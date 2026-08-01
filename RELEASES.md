# Release Strategy

TaxCode publishes one GitHub Release per upstream VS Code baseline.

## Release Naming

| Item | Format | Example |
| --- | --- | --- |
| Release title | `TaxCode <version>` | `TaxCode 1.131.0` |
| Git tag | `taxcode-v<version>` | `taxcode-v1.131.0` |
| Main installer | `TaxCodePluginsUserSetup.exe` | plugin-enabled, telemetry-disabled |
| Lightweight installer | `TaxCodeLiteUserSetup.exe` | lightweight profile |
| Remote desktop installer | `TaxCodeVDSUserSetup.exe` | low-RAM profile |
| No telemetry installer | `TaxCodeNoTelemetryUserSetup.exe` | chat-enabled, telemetry-disabled |

## Source Code

Do not create separate source archives for each edition. The GitHub source archive attached to the release tag is the source for every TaxCode edition. Editions are produced by build profiles.

TaxCode uses the VS Code upstream major/minor as the first two numbers and the TaxCode revision as the last number. For example, `1.131.0` is the first TaxCode release on the VS Code `1.131` baseline, and later TaxCode-only changes on that same baseline become `1.131.1`, `1.131.2`, and so on.

## Release Assets

Every release should include:

- four Windows installer executables
- SHA-256 checksums
- the current security audit summary
- clear notes about the upstream VS Code baseline

Installer executables should never be committed to git.
