"use client";

import { useTranslation } from "@/services/i18n/client";
import { Category } from "../types/equipment";

/**
 * Tab Overview di CategoriesPage — field dasar kategori.
 *
 * Tab "Equipment type" (CRUD peralatan) kini di-render oleh
 * `CategoryEquipmentTab` (component terpisah) yang mengelola state-nya
 * sendiri dan memakai `EquipmentItemFormDialog` — pola yang sama dengan
 * halaman Equipment Types. Komponen ini hanya Overview.
 */
export function CategoryOverviewTab({ item }: { item: Category }) {
  const { t } = useTranslation("module-equipment");
  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
      <div><dt className="text-muted-foreground">{t("table.name")}</dt><dd className="font-medium text-foreground">{item.name}</dd></div>
      <div><dt className="text-muted-foreground">{t("table.description")}</dt><dd className="text-foreground">{item.description || "—"}</dd></div>
      <div><dt className="text-muted-foreground">{t("table.status")}</dt><dd className="text-foreground">{item.isActive ? t("status.active") : t("status.inactive")}</dd></div>
    </dl>
  );
}