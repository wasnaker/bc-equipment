# Wasnaker Equipment module

The Equipment module is the pilot implementation of the Wasnaker modular package
contract. This repository is the **single source of truth** for the module's
backend and frontend capabilities.

## Capabilities

- `@wasnaker/module-equipment/api` — NestJS module, group/subgroup CRUD, entities and PostgreSQL migrations.
- `@wasnaker/module-equipment/api/manifest` — backend module metadata and permissions.
- `@wasnaker/module-equipment/api/migrations` — PostgreSQL migration classes.
- `@wasnaker/module-equipment/api/seeds` — idempotent seed providers for K3
  groups, subgroups, categories and equipment catalog.
- `@wasnaker/module-equipment/web` — React/Next.js page and UI exports.
- `@wasnaker/module-equipment/manifest` — frontend navigation and dashboard manifest.
- `@wasnaker/module-equipment/locales/<language>` — module-owned translations.

A module may expose API, web, or both. Hosts install the same package and import
only the capability they use. API and web dependencies are optional peers so an
API-only host does not install a React runtime, and a web-only host does not
install NestJS.

## Backend build and host integration

See [API integration](api/INTEGRATION.md). The API is compiled to CommonJS
because the current NestJS host uses CommonJS. The nested `api/package.json`
sets the package scope to CommonJS without changing the ESM web package scope.

Install with an immutable Git commit SHA. Git dependency installation runs the
package `prepare` script to build the backend output. The host owns the
PostgreSQL connection, authentication strategy, role IDs, migration runner and
seed lifecycle. The module owns its API implementation, schema migrations and optional seed providers.

## Seed data

Seed providers run through the host relational seed lifecycle
(`npm run seed:run:relational`) and are safe to run repeatedly:

- **Groups & subgroups** — 6 groups, 20 subgroups.
- **Categories & equipment** — 31 categories and 91 equipment items imported
  from `wasnaker/prfx-equipments` (`CategoriesSeeder.php`, `EquipmentsSeeder.php`).

Rows carry explicit ids (categories `1..31`, equipment `1..91`) and
deterministic ULIDs, so ids and trigger-generated equipment codes are identical
in every environment. Natural-key upserts preserve user edits. The source's
`long_description` has no target column; `equipment.description` stores its
first paragraph, capped at 500 characters.

## Frontend integration

See [Frontend package](web/PACKAGE.md). Next.js hosts transpile the web source
package and load locale resources directly from its exports.

## Development

```bash
npm install
npm run build:api
npm run verify:api-package
```
