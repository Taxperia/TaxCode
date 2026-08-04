# Security Audit - TaxCode 1.131.1

## Overview

This document summarizes the security audit performed on TaxCode 1.131.1, based on VS Code OSS 1.131.0.

## Changes in 1.131.1

### Dependency Updates (Dependabot)

The following dependency updates were merged to address known vulnerabilities:

| Package | Update | Directory |
|---------|--------|-----------|
| `github/codeql-action` | 4.37.3 → 4.37.4 | `.github/workflows` |
| `npm_and_yarn` group | 8 updates | Multiple directories |
| `fast-uri` | 3.1.2 → 3.1.5 | `build/agent-sdk/agents/claude` |
| `body-parser` | 2.2.2 → 2.3.0 | `build/agent-sdk/agents/claude` |
| `hono` | 4.12.25 → 4.13.0 | `build/agent-sdk/agents/claude` |
| `ip-address` | 10.2.0 → 10.4.0 | `build/agent-sdk/agents/claude` |
| `@vscode/markdown-editor` | 0.0.2-24 → 0.0.2-44 | `extensions/markdown-language-features` |

### Security Scan Results

GitHub CodeQL analysis identified the following categories of findings:

#### High Severity (requires attention)

- **ReDoS (js/redos)**: Regular expression patterns in several files may cause exponential backtracking. Most are in VS Code core utilities and are inherited from upstream.
- **Incomplete Sanitization (js/incomplete-sanitization)**: Multiple files use `replace()` which only replaces the first occurrence. These are mostly in VS Code core code paths.
- **XSS via DOM (js/xss-through-dom)**: Preview and media rendering extensions reinterpret DOM text as HTML. These are mitigated by VS Code's webview isolation model.

#### Medium Severity (informational)

- **Stack Trace Exposure (js/stack-trace-exposure)**: Error messages include stack traces in development/test environments.
- **Prototype Pollution Utility (js/prototype-pollution-utility)**: Object merge utilities lack prototype pollution guards. These are internal VS Code utilities not exposed to untrusted input.

#### Low Severity (accepted risk)

- **Test Files**: Many findings are in test files (`*.test.ts`, `*.spec.ts`) which are not included in production builds.
- **Upstream VS Code Code**: The majority of findings originate from the upstream VS Code OSS codebase and are tracked by the Microsoft security team.

## Recommendations

1. **Critical/High items in TaxCode-specific code** (`build/win32/taxcode-lite/`): The `port-forwarder-hub.js` file contains several sanitization issues. This is a third-party bundled extension (Live Share) and should be updated when a patched version is available.
2. **Upstream VS Code issues**: Track via the [VS Code security advisories](https://github.com/microsoft/vscode/security).
3. **Regular dependency audits**: Continue monitoring Dependabot alerts for timely updates.

## Verification

- `npm run typecheck-client` passed
- No new high-severity runtime audit findings after dependency updates
- All four Windows x64 user installers built successfully
