"use client";

import { useState } from "react";
import { useSubgroupsServerSide, useCategories } from "../hooks/use-equipments";
import { CategoryEquipmentManager } from "../components/category-equipment-manager";
import type { Subgroup } from "../types/equipment";
import { useTranslation } from "@/services/i18n/client";

function SubgroupEquipment({ subgroup }: { subgroup: Subgroup }) {
  const { t } = useTranslation("module-equipment");
  const { data, isLoading } = useCategories(subgroup.id, 1, 50);
  const categories = data?.data ?? [];
  const [activeTabs, setActiveTabs] = useState<Record<string, "overview" | "equipment">>({});
  return <section className="rounded-lg border p-4 space-y-3">
    <div><h2 className="font-semibold">{subgroup.name}</h2><p className="text-xs text-muted-foreground">{subgroup.description || "—"}</p></div>
    {isLoading ? <p className="text-sm text-muted-foreground">{t("table.loading")}</p> : categories.length === 0
      ? <p className="text-sm text-muted-foreground">{t("detail.categories_empty")}</p>
      : categories.map(category => {
          const activeTab = activeTabs[String(category.id)] ?? "equipment";
          return <div key={String(category.id)} className="rounded-md border p-3 space-y-3">
            <div><h3 className="text-sm font-medium">{category.name}</h3><p className="text-xs text-muted-foreground">{category.description || "—"}</p></div>
            <div role="tablist" aria-label={category.name} className="flex gap-1 border-b">
              <button type="button" role="tab" aria-selected={activeTab === "overview"} className={`px-3 py-2 text-sm border-b-2 ${activeTab === "overview" ? "border-primary font-medium" : "border-transparent text-muted-foreground"}`} onClick={() => setActiveTabs(current => ({ ...current, [String(category.id)]: "overview" }))}>{t("detail.overview")}</button>
              <button type="button" role="tab" aria-selected={activeTab === "equipment"} className={`px-3 py-2 text-sm border-b-2 ${activeTab === "equipment" ? "border-primary font-medium" : "border-transparent text-muted-foreground"}`} onClick={() => setActiveTabs(current => ({ ...current, [String(category.id)]: "equipment" }))}>{t("equipment.title")}</button>
            </div>
            {activeTab === "overview" ? <dl className="grid gap-2 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">{t("table.name")}</dt><dd>{category.name}</dd></div><div><dt className="text-muted-foreground">{t("table.status")}</dt><dd>{category.isActive ? t("status.active") : t("status.inactive")}</dd></div><div className="sm:col-span-2"><dt className="text-muted-foreground">{t("table.description")}</dt><dd>{category.description || "—"}</dd></div></dl> : <CategoryEquipmentManager category={category} />}
          </div>;
        })}
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
