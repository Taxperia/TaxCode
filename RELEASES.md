# Release Strategy

TaxCode publishes one GitHub Release per upstream VS Code baseline.

## Release Naming

| Item | Format | Example |
| --- | --- | --- |
| Release title | `TaxCode <version>` | `TaxCode 1.121.0` |
| Git tag | `taxcode-v<version>` | `taxcode-v1.121.0` |
| Main installer | `TaxCodePluginsUserSetup.exe` | plugin-enabled, telemetry-disabled |
| Lightweight installer | `TaxCodeLiteUserSetup.exe` | lightweight profile |
| Remote desktop installer | `TaxCodeVDSUserSetup.exe` | low-RAM profile |
| No telemetry installer | `TaxCodeNoTelemetryUserSetup.exe` | chat-enabled, telemetry-disabled |

## Source Code

Do not create separate source archives for each edition. The GitHub source archive attached to the release tag is the source for every TaxCode edition. Editions are produced by build profiles.

## Release Assets

Every release should include:

- four Windows installer executables
- SHA-256 checksums
- the current security audit summary
- clear notes about the upstream VS Code baseline

Installer executables should never be committed to git.
