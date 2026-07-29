# Security Policy

TaxCode is a VS Code OSS-based desktop distribution with a privacy-focused release profile. Security reports are taken seriously, especially issues involving installer integrity, telemetry bypasses, dependency vulnerabilities, extension packaging, update handling, and credential exposure.

## Supported Versions

Only the latest published TaxCode release is actively supported with security fixes.

| Version | Supported |
| --- | --- |
| Latest GitHub Release | Yes |
| Older releases | Best effort |

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues.

Use a private channel with the maintainers first. If GitHub private vulnerability reporting is enabled for this repository, use that. Otherwise, contact the project owner through the GitHub organization profile and include:

- affected TaxCode version
- affected edition (`TaxCodePlugins`, `TaxCodeNoTelemetry`, `TaxCodeLite`, or `TaxCodeVDS`)
- operating system and architecture
- clear reproduction steps
- impact assessment
- logs, hashes, or proof-of-concept details when safe to share

We will acknowledge valid reports as soon as possible and coordinate a fix before public disclosure when the issue creates user risk.

## Release Integrity

Every release should include SHA-256 checksums for installer assets. Users should verify downloaded installers before distribution inside managed environments.

## Dependency Audits

Runtime dependency audits are performed before release and summarized in `SECURITY-AUDIT.md`. Build-only advisories are tracked separately because the VS Code OSS build toolchain is large and not shipped directly to end users.

## Sensitive Files

Never commit or upload:

- signing keys or certificates with private keys
- local user profiles
- extension caches
- access tokens
- build logs containing credentials
- generated installer folders
- `.tmp`, `.build`, `node_modules`, or `out*` folders
