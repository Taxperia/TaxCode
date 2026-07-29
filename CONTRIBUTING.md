# Contributing to TaxCode

Thank you for helping improve TaxCode. This project is a privacy-focused VS Code OSS distribution with multiple Windows release profiles.

## Before You Start

Please keep changes focused and easy to review. TaxCode carries custom release, telemetry, and packaging behavior on top of a large upstream codebase, so small pull requests are much easier to maintain across VS Code updates.

## What Belongs Here

Good contributions include:

- fixes for TaxCode-specific build profiles
- telemetry hardening
- Windows installer and release improvements
- dependency security updates
- documentation improvements
- bug fixes inherited from upstream when they are needed before the next upstream merge
- features that work cleanly across the four TaxCode editions

Large upstream VS Code changes should normally be handled by updating the upstream baseline instead of rewriting them manually in this repository.

## Editions Must Stay Consistent

When changing product behavior, check the edition impact:

| Edition | Expected behavior |
| --- | --- |
| `TaxCodePlugins` | Full plugin-enabled, telemetry-disabled source profile |
| `TaxCodeNoTelemetry` | Chat/Copilot enabled, telemetry disabled |
| `TaxCodeLite` | Lightweight, telemetry disabled, built-in chat/Copilot excluded |
| `TaxCodeVDS` | Remote desktop / low RAM, telemetry disabled, minimal extension surface |

Do not add telemetry, analytics, background network reporting, or silent account flows without a clear opt-in design and explicit maintainer approval.

## Development Setup

This repository follows the VS Code OSS toolchain. Install Node.js and platform prerequisites expected by the upstream project, then install dependencies:

```powershell
npm install
cd build
npm install
```

Some built-in extensions have their own lockfiles. Install extension dependencies only when the extension is part of the change.

## Validation

Run the smallest checks that prove your change:

```powershell
npm run compile-check-ts-native
cd build
npm run typecheck
```

For release or profile changes, also verify the relevant build profile and inspect the produced `product.json`.

## Pull Request Checklist

- [ ] The change is scoped to TaxCode or a necessary upstream compatibility fix.
- [ ] Telemetry remains disabled in every release profile.
- [ ] Heavy generated folders and installer files are not committed.
- [ ] Security-sensitive files such as signing keys are not committed.
- [ ] Relevant checks were run and are listed in the pull request.
- [ ] Documentation was updated when behavior changed.

## Release Assets

Installer `.exe` files must be uploaded to GitHub Releases, not committed to git. Release notes should include SHA-256 hashes for every asset.

## Code of Conduct

All contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
