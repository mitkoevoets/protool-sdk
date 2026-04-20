# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-04-20

### Changed

- Replaced placeholder `users` and `projects` SDK modules with public API-aligned modules.
- Added `company.search`, `company.export`, and `company.exportWithScroll` methods.
- Added lookup methods for `cities`, `provinces`, `regions`, and `countries`.
- Updated query serialization to support nested range filters (for example `postalCodeInteger[min]`).
- Rewrote README and examples to match public API documentation.

## [0.1.0] - 2026-04-13

### Added

- Initial public SDK scaffolding for Node.js + browser.
- `ApiClient` with `users` and `projects` endpoint modules.
- Shared `fetch` HTTP layer with retries, timeout, and normalized `ApiError`.
- TypeScript build pipeline with dual ESM/CJS output and declaration files.
- Unit tests, quickstart example, and CI release workflow.
