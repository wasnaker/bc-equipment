# Frontend package

Frontend module Equipment diekspos sebagai package `@wasnaker/module-equipment`
dari repository Git ini. Package dipasang langsung dari GitHub pada ref yang
dikunci; publikasi ke npm registry tidak diperlukan.

## Release / versioning

1. Implementasi dan uji perubahan di repository ini.
2. Buat commit lalu tag release (atau gunakan commit SHA immutable).
3. Di host, jalankan:

   ```bash
   npm run module:add -- equipment --ref <tag-atau-commit-sha>
   ```

4. Commit perubahan `package.json` dan `package-lock.json` di host.

## Package exports

- `@wasnaker/module-equipment`: public page/component API
- `@wasnaker/module-equipment/manifest`: module manifest
- `@wasnaker/module-equipment/locales/<language>`: locale resource JSON

Host mentranspilasi package TypeScript dan menyediakan runtime peer dependencies
serta alias `@/*`. Source module tidak disalin ke repository host.
