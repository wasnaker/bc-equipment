# Integrasi Module Equipment ke brocoders-react-web

Module Equipment dipasang sebagai package, bukan disalin ke source host. Repository
ini adalah satu-satunya source of truth untuk halaman, komponen, hooks, service,
manifest, dan resource bahasa Equipment.

## 1. Pasang package

Dari root `brocoders-react-web`:

```bash
npm run module:add -- equipment --ref <tag-atau-commit>
```

Perintah tersebut memasang `@wasnaker/module-equipment` sebagai dependency Git
yang dikunci ke ref yang diberikan, lalu membangkitkan manifest registry dan
registry resource i18n. Jangan menyalin atau mengedit isi package di frontend.

Untuk menghapus:

```bash
npm run module:rm -- equipment
```

## 2. Halaman dideklarasikan di manifest

Host tidak membutuhkan file route per modul. Semua halaman admin didaftarkan di
`web/src/modules/equipment/module.manifest.ts` melalui `pages`:

| Path | Komponen | Permission |
|------|----------|------------|
| `/admin/equipment` | `EquipmentPage` (Group) | `read:equipment` |
| `/admin/equipment/subgroups` | `SubgroupsPage` | `read:equipment` |
| `/admin/equipment/categories` | `CategoriesPage` | `read:equipment` |
| `/admin/equipment/items` | `EquipmentTypesPage` | `read:equipment` |

Host menyediakan satu route generik
(`src/app/[language]/admin/[...modulePath]/page.tsx` dan varian tanpa locale)
yang mencocokkan URL kanonik ke `pages[].path`, merender komponen package,
memakai `pages[].title` untuk metadata, dan menerapkan `withPageRequiredAuth`
(role ADMIN) **plus** `pages[].permission` (fail-closed, sama konsistensi
dengan `resolveMenu()` di sidebar). Jangan membuat route adapter
`src/app/**/admin/equipment/*` di host.

## 3. Kontrak package

- Manifest: `@wasnaker/module-equipment/manifest`
- Public API halaman/komponen: `@wasnaker/module-equipment`
- Resource bahasa: `@wasnaker/module-equipment/locales/<language>`
- Host menyediakan alias `@/*`, auth, API client, routing, UI primitives,
  React Query, dan peer dependencies.
- Host menjalankan `transpilePackages` untuk module packages.
- Manifest dan locale registry dibangkitkan dari dependency package; tidak ada
  source module yang disalin ke `src/modules` atau folder locale host.

## 4. Endpoint API

Semua request menggunakan API_URL host (`/api/v1`):

| Aksi | Endpoint |
|------|----------|
| List grup | `GET /v1/equipment/groups?page&limit&filters&sort` |
| Detail grup | `GET /v1/equipment/groups/:id` |
| CRUD grup | `POST/PATCH/DELETE /v1/equipment/groups` |
| List subgroup | `GET /v1/equipment/subgroups?filters=...` |
| Detail subgroup | `GET /v1/equipment/subgroups/:id` |
| CRUD subgroup | `POST/PATCH/DELETE /v1/equipment/subgroups` |
| List Category | `GET /v1/equipment/categories?filters=...` |
| Detail Category | `GET /v1/equipment/categories/:id` |
| CRUD Category | `POST/PATCH/DELETE /v1/equipment/categories` |

## 5. Pengembangan lokal

Edit kode hanya di repository `bc-equipment`. Setelah perubahan diuji, buat
commit/tag baru dan perbarui ref dependency di host. Jangan melakukan hotfix
pada salinan package di repository frontend.
