# TaxCode 1.121.0 GitHub Release Notes

Release tag: `taxcode-v1.121.0`

This release packages the TaxCode desktop variants rebuilt on top of VS Code OSS `1.121.0`.

## Assets to Upload

Upload these files as GitHub Release assets, not as normal git-tracked repository files:

| File | Size | SHA-256 |
| --- | ---: | --- |
| `TaxCodeVDSUserSetup.exe` | 194,977,469 bytes | `E4E2ABC556224EB395C2A24B0D6A57CE5FE7C5057F7DE73C86FF4A1AA149B8E5` |
| `TaxCodeLiteUserSetup.exe` | 198,971,637 bytes | `56DF2331112EA9529AAC0E437E662BF61BAC6A360FC9F8A2340D5BB7CDB722EF` |
| `TaxCodeNoTelemetryUserSetup.exe` | 249,240,552 bytes | `8F63FB6689412769612639D7C9A0DD3A8F70886C90FD60E17B0AEF72AB9A16C9` |
| `TaxCodePluginsUserSetup.exe` | 253,168,168 bytes | `DCB9DA58A2F237F19D6708FE2DB0A07E3F0B99A9A2E81B440E1DFA5D2C2FAF3D` |

## Variants

- `TaxCodeVDS`: Remote desktop / low RAM profile. Telemetry disabled. Built-in chat and Copilot package excluded.
- `TaxCodeLite`: Lightweight profile. Telemetry disabled. Built-in chat and Copilot package excluded. Existing Live Share support is preserved.
- `TaxCodeNoTelemetry`: Chat/Copilot profile with telemetry disabled.
- `TaxCodePlugins`: Marketplace/plugins profile with telemetry disabled.

## Security Summary

Runtime dependency audit after compatible fixes:

```text
Critical: 0
High:     0
Moderate: 8
```

See `SECURITY-AUDIT.md` for the full dependency review and remaining moderate findings.

## Validation

- Source TypeScript check passed.
- Build TypeScript check passed.
- No unresolved merge markers found.
- `idea.md` contains 200 numbered feature ideas.
- All four packaged apps report version `1.121.0` and telemetry disabled.

## Release Handling Notes

- Do not commit the installer `.exe` files directly into git. They exceed GitHub's normal file-size limit and belong in a GitHub Release.
- Do not upload `miyotu-codesign.pfx`, local profiles, logs, caches, `.tmp`, `node_modules`, or build working folders as release assets.
