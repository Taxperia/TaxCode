# TaxCode

<p align="center">
  <img src="icon.png" alt="TaxCode logo" width="120" />
</p>

<p align="center">
  <strong>A privacy-focused Windows desktop code editor distribution built from VS Code OSS.</strong>
</p>

<p align="center">
  <a href="https://github.com/Taxperia/TaxCode/releases"><img alt="Release" src="https://img.shields.io/github/v/release/Taxperia/TaxCode?include_prereleases&label=release"></a>
  <a href="LICENSE.txt"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue"></a>
  <img alt="Platform" src="https://img.shields.io/badge/platform-Windows-0078D4">
  <img alt="Telemetry" src="https://img.shields.io/badge/telemetry-disabled-2E7D32">
  <img alt="Upstream" src="https://img.shields.io/badge/upstream-VS%20Code%20OSS-1f6feb">
</p>

TaxCode is a customized distribution of [VS Code OSS](https://github.com/microsoft/vscode) for users who want a familiar editor with a stricter release profile: telemetry disabled, reproducible Windows variants, clear release artifacts, and documented security checks.

The default source tree represents the **plugin-enabled, telemetry-disabled** edition. Other editions are produced from the same source by build profiles; they are not separate forks.

## Editions

| Edition | Telemetry | Built-in chat / Copilot | Marketplace / plugins | Intended use |
| --- | --- | --- | --- | --- |
| `TaxCodePlugins` | Disabled | Enabled | Enabled | Main distribution and default source profile |
| `TaxCodeNoTelemetry` | Disabled | Enabled | Restricted profile | Users who want chat features without telemetry |
| `TaxCodeLite` | Disabled | Excluded | Minimal profile | Lightweight local editing and collaboration |
| `TaxCodeVDS` | Disabled | Excluded | Disabled/minimal | Remote desktop and low-RAM environments |

## Releases

Each upstream VS Code version is published as one GitHub Release.

Example:

```text
TaxCode 1.121.0
  TaxCodePluginsUserSetup.exe
  TaxCodeNoTelemetryUserSetup.exe
  TaxCodeLiteUserSetup.exe
  TaxCodeVDSUserSetup.exe
  SHA256SUMS.txt
  SECURITY-AUDIT.md
```

The GitHub-generated source archive for the release tag is the source for all editions. Installer files are uploaded as Release assets and are not committed to git.

## Security Posture

- Telemetry is disabled in every packaged edition.
- Runtime dependency audits are performed before release.
- Release notes include SHA-256 checksums for installer verification.
- Signing keys, local profiles, build caches, and installer outputs are excluded from source control.

See [SECURITY.md](SECURITY.md) and [SECURITY-AUDIT.md](SECURITY-AUDIT.md) for details.

## Build Notes

TaxCode follows the VS Code OSS build system and adds profile-driven Windows packaging.

Useful profile names:

```powershell
vds
lite
notelemetry
plugins
all
```

The release workflow is intentionally source-first:

1. Update the VS Code OSS baseline.
2. Reapply TaxCode profile and privacy customizations.
3. Run dependency and build checks.
4. Produce Windows installers.
5. Publish all installers under one versioned GitHub Release.

## Repository Hygiene

The working directory can become very large because VS Code builds generate dependency trees, extension bundles, compiled outputs, upstream snapshots, and installer folders. These are intentionally excluded from git:

- `node_modules/`
- `.tmp/`
- `.build/`
- `out*/`
- `.artifacts/`
- generated `TaxCode*-win32-x64/` folders
- installer `.exe` files
- local signing material

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a change.

## Upstream

TaxCode is based on VS Code OSS. Microsoft Visual Studio Code and VS Code are trademarks of Microsoft Corporation. TaxCode is an independent distribution and is not affiliated with, endorsed by, or sponsored by Microsoft.

## License

The source remains under the [MIT License](LICENSE.txt), following the upstream VS Code OSS license.
