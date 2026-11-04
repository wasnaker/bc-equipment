# Backend package

The backend capability is built as CommonJS JavaScript plus TypeScript declarations.
This is intentional: the NestJS host currently compiles to CommonJS, while the web
entry point remains TypeScript source consumed by Next.js `transpilePackages`.

## Install

```bash
npm install github:wasnaker/bc-equipment#<immutable-commit-sha>
```

Pin an immutable commit SHA in both `package.json` and `package-lock.json`.

## Universal API package contract

Every backend-capable module exposes:

- `<package>/api`: its NestJS module and public API exports.
- `<package>/api/manifest`: named `moduleManifest`, including module ID,
  version, capabilities and permission definitions.
- `<package>/api/definition`: named `moduleDefinition`, the canonical host
  integration contract. It contains the manifest, `registerAsync()`, entity
  classes, migration classes and seed service classes.
- `<package>/api/entities`: named `moduleEntities` array.
- `<package>/api/migrations`: named `moduleMigrations` array.
- `<package>/api/seeds`: named `moduleSeedServices` array.

A module without entities, migrations or seed providers exports an empty array.
The package owns controllers, DTOs, domain, services, entities, repositories,
migrations and permission definitions. Equipment exports two idempotent seed services:

- `EquipmentMasterDataSeedService` — 6 groups and 20 subgroups.
- `EquipmentCatalogSeedService` — 31 categories and 91 equipment items
  (data imported from `wasnaker/prfx-equipments` `CategoriesSeeder.php` and
  `EquipmentsSeeder.php`; explicit ids and deterministic ULIDs).

The package never owns the host's database connection, JWT strategy, roles
table or permission persistence.

## Register in NestJS

The host scans installed `@wasnaker/module-*` dependencies and generates its
backend module registry. Each API package's `moduleDefinition.registerAsync()`
is called automatically with the host authorization adapter. The host should
not add a package-specific `EquipmentModule` import or manually list its entities,
migrations or seed services.

The module enforces `read:equipment`, `create:equipment`, `update:equipment` and
`delete:equipment` at the API boundary. The host supplies the authorization
adapter and resolves permissions from its PostgreSQL role-permission relation.

## PostgreSQL lifecycle

The host owns one PostgreSQL DataSource. Its generated registry automatically
collects each installed API module's entities and migration classes for both
NestJS runtime TypeORM configuration and the standalone TypeORM CLI DataSource.
Migration execution remains an explicit deployment operation; package install
and application startup never run migrations.

The host's explicit relational seed runner discovers module seed service
providers from the same definitions. Each module seed must be idempotent.
Permission definitions are seeded before module seeds, and the host's default
admin role receives newly registered permissions without overwriting existing
role assignments.

The Equipment master-data seed matches groups and subgroups by their natural
keys. Existing names, descriptions, active flags and custom non-default ordering
are retained; missing legacy metadata (codes, abbreviations, sort order and
subgroup color) is filled on repeated runs without replacing user values.

The catalog seed matches categories by `(subgroupId, name)` and equipment by
`(categoryId, lower(btrim(name)))`, then synchronizes `equipment_category_id_seq`
and `equipment_id_seq` to `MAX(id)`. Equipment `code` is still assigned by the
`bc_equipment_assign_code` trigger after insert, so explicit ids yield stable
codes across environments.

## Build locally

```bash
npm run build:api
npm run verify:api-package
```


## Category

Category merupakan child dari Subgroup. Entity, repository, migration, dan CRUD
Category dikelola oleh module ini. Host cukup mendaftarkan `CategoryEntity` dan
menjalankan migration module melalui package registry.

- `GET/POST /v1/equipment/categories`
- `GET/PATCH/DELETE /v1/equipment/categories/:id`
- Filter list menggunakan `filters={"subgroupId": <id>}`.
- Penghapusan Subgroup menghapus Category turunannya melalui foreign key
  `ON DELETE CASCADE`.
