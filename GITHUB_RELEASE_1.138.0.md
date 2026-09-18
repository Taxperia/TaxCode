# TaxCode 1.138.0

TaxCode 1.138.0 updates the project to the VS Code OSS 1.138.0 baseline while keeping the TaxCode privacy and packaging profile.

## Editions

- `TaxCodePluginsUserSetup.exe` - plugin-enabled, telemetry disabled.
- `TaxCodeLiteUserSetup.exe` - plugin-free/lightweight, telemetry disabled.
- `TaxCodeVDSUserSetup.exe` - low-RAM remote desktop profile, telemetry disabled.

## Privacy

- Telemetry remains disabled in every TaxCode edition.
- GitHub release update checks use a non-telemetry request and can be disabled with `taxcode.update.checkOnStartup`.
- Plugin-free editions hide the extensions surface and remove Marketplace gallery configuration.

## Verification

Verify installer downloads with the attached `SHA256SUMS.txt` file before redistribution.

## Security Notes

The release includes `SECURITY-AUDIT.md` with the current dependency audit result and tracked runtime advisories.
