"use client";

import { useSubgroupsServerSide, useCategories } from "../hooks/use-equipments";
import { CategoryEquipmentManager } from "../components/category-equipment-manager";
import type { Subgroup } from "../types/equipment";
import { useTranslation } from "@/services/i18n/client";

function SubgroupEquipment({ subgroup }: { subgroup: Subgroup }) {
  const { t } = useTranslation("module-equipment");
  const { data, isLoading } = useCategories(subgroup.id, 1, 50);
  const categories = data?.data ?? [];
  return <section className="rounded-lg border p-4 space-y-3">
    <div><h2 className="font-semibold">{subgroup.name}</h2><p className="text-xs text-muted-foreground">{subgroup.description || "—"}</p></div>
    {isLoading ? <p className="text-sm text-muted-foreground">{t("table.loading")}</p> : categories.length === 0
      ? <p className="text-sm text-muted-foreground">{t("detail.categories_empty")}</p>
      : categories.map(category => <div key={String(category.id)} className="rounded-md border p-3">
          <div className="mb-2"><h3 className="text-sm font-medium">{category.name}</h3><p className="text-xs text-muted-foreground">{category.description || "—"}</p></div>
          <CategoryEquipmentManager category={category} />
        </div>)}
  </section>;
}

export function EquipmentTypesPage() {
  const { t } = useTranslation("module-equipment");
  const { data, isLoading, error } = useSubgroupsServerSide();
  return <div className="page-content--wide"><div className="page-content--body space-y-4">
    <header><h1 className="page-title">{t("equipment_page_title")}</h1><p className="page-subtitle">{t("equipment_page_subtitle")}</p></header>
    {isLoading ? <p className="text-sm text-muted-foreground">{t("table.loading")}</p> : error ? <p className="text-sm text-destructive">{t("table.error")}</p> : (data ?? []).map(subgroup => <SubgroupEquipment key={String(subgroup.id)} subgroup={subgroup} />)}
  </div></div>;
}
