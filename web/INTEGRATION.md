# Integrasi Module Region ke brocoders-react-web

Module Region dipasang sebagai package, bukan disalin ke source host. Repository
ini adalah satu-satunya source of truth untuk halaman, komponen, hooks, service,
manifest, dan resource bahasa Region.

## 1. Pasang package

Dari root `brocoders-react-web`:

```bash
npm run module:add -- region --ref <tag-atau-commit>
```

Perintah tersebut memasang `@wasnaker/module-region` sebagai dependency Git
yang dikunci ke ref yang diberikan, lalu membangkitkan manifest registry dan
registry resource i18n. Jangan menyalin atau mengedit isi package di frontend.

Untuk menghapus:

```bash
npm run module:rm -- region
```

## 2. Daftarkan route host

Next.js membutuhkan route entry fisik di host. Route ini hanya adapter tipis;
implementasi halaman tetap berada di package:

`src/app/admin/region/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import { getRequestLanguage } from "@/services/i18n/get-request-language";
import Region from "@/app/[language]/admin/region/page-content";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getRequestLanguage();
  const { t } = await getServerTranslation(language, "module-region");
  return { title: t("module-region:title") };
}

export default function Page() {
  return <Region />;
}
```

`src/app/[language]/admin/region/page-content.tsx`:

```tsx
"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { RegionPage } from "@wasnaker/module-region";

function Region() {
  return <RegionPage />;
}

export default withPageRequiredAuth(Region, { roles: [RoleEnum.ADMIN] });
```

## 3. Kontrak package

- Manifest: `@wasnaker/module-region/manifest`
- Public API halaman/komponen: `@wasnaker/module-region`
- Resource bahasa: `@wasnaker/module-region/locales/<language>`
- Host menyediakan alias `@/*`, auth, API client, routing, UI primitives,
  React Query, dan peer dependencies.
- Host menjalankan `transpilePackages` untuk module packages.
- Manifest dan locale registry dibangkitkan dari dependency package; tidak ada
  source module yang disalin ke `src/modules` atau folder locale host.

## 4. Endpoint API

Semua request menggunakan API_URL host (`/api/v1`):

| Aksi | Endpoint |
|------|----------|
| List provinsi | `GET /v1/region/provinces?page&limit&filters&sort` |
| Detail provinsi | `GET /v1/region/provinces/:id` |
| CRUD provinsi | `POST/PATCH/DELETE /v1/region/provinces` |
| List kab/kota | `GET /v1/region/regencies?filters=...` |
| Detail kab/kota | `GET /v1/region/regencies/:id` |
| CRUD kab/kota | `POST/PATCH/DELETE /v1/region/regencies` |

## 5. Pengembangan lokal

Edit kode hanya di repository `bc-region`. Setelah perubahan diuji, buat
commit/tag baru dan perbarui ref dependency di host. Jangan melakukan hotfix
pada salinan package di repository frontend.
