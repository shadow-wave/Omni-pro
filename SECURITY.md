# Security policy

## Threat model

Python executes in the browser’s WebAssembly sandbox, not on the host operating system. It can still consume device memory/CPU, access data the user explicitly loads into the app, and make browser-permitted network requests. Do not treat it as a security boundary for hostile code.

## Deployment guidance

- Serve only over HTTPS.
- Never place API keys, tokens, or private data in browser files or local storage.
- Keep external dependencies pinned and review their licences.
- If learners may run untrusted code, deploy with a restrictive Content Security Policy and consider disabling arbitrary `micropip` installation or enforcing an allow-list.
- Update Pyodide, CodeMirror, and CDN references deliberately and test offline caching after every release.

## Reporting

Please report vulnerabilities privately to the repository maintainer. Include reproduction steps, affected browser/version, and a minimal proof of concept. Do not open a public issue until a fix is available.
