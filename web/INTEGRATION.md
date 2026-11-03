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

## 2. Daftarkan route host

Next.js membutuhkan route entry fisik di host. Route ini hanya adapter tipis;
implementasi halaman tetap berada di package:

`src/app/admin/equipment/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import { getRequestLanguage } from "@/services/i18n/get-request-language";
import Equipment from "@/app/[language]/admin/equipment/page-content";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getRequestLanguage();
  const { t } = await getServerTranslation(language, "module-equipment");
  return { title: t("module-equipment:title") };
}

export default function Page() {
  return <Equipment />;
}
```

`src/app/[language]/admin/equipment/page-content.tsx`:

```tsx
"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { EquipmentPage } from "@wasnaker/module-equipment";

function Equipment() {
  return <EquipmentPage />;
}

export default withPageRequiredAuth(Equipment, { roles: [RoleEnum.ADMIN] });
```

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
| List provinsi | `GET /v1/equipment/provinces?page&limit&filters&sort` |
| Detail provinsi | `GET /v1/equipment/provinces/:id` |
| CRUD provinsi | `POST/PATCH/DELETE /v1/equipment/provinces` |
| List kab/kota | `GET /v1/equipment/regencies?filters=...` |
| Detail kab/kota | `GET /v1/equipment/regencies/:id` |
| CRUD kab/kota | `POST/PATCH/DELETE /v1/equipment/regencies` |

## 5. Pengembangan lokal

Edit kode hanya di repository `bc-equipment`. Setelah perubahan diuji, buat
commit/tag baru dan perbarui ref dependency di host. Jangan melakukan hotfix
pada salinan package di repository frontend.
