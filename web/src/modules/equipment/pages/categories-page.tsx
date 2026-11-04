"use client";

import { useState } from "react";
import { useSubgroupsServerSide, useCategories, useDeleteCategory } from "../hooks/use-equipments";
import { CategoryFormDialog } from "../components/category-form-dialog";
import { CategoryEquipmentManager } from "../components/category-equipment-manager";
import type { Category, Subgroup } from "../types/equipment";
import { useTranslation } from "@/services/i18n/client";
import { Button } from "@/components/ui/button";

function SubgroupCategories({ subgroup }: { subgroup: Subgroup }) {
  const { t } = useTranslation("module-equipment");
  const { data, isLoading } = useCategories(subgroup.id, 1, 50);
  const remove = useDeleteCategory();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [activeTabs, setActiveTabs] = useState<Record<string, "overview" | "equipment">>({});
  const categories = data?.data ?? [];

  async function deleteCategory(id: Category["id"]) {
    if (!window.confirm(t("confirm.delete.message"))) return;
    await remove.mutateAsync({ id });
  }

  return <section className="rounded-lg border p-4 space-y-3">
    <div className="flex items-center justify-between gap-3">
      <div><h2 className="font-semibold">{subgroup.name}</h2><p className="text-xs text-muted-foreground">{subgroup.description || "—"}</p></div>
      <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}>{t("actions.create_category")}</Button>
    </div>
    {isLoading ? <p className="text-sm text-muted-foreground">{t("table.loading")}</p> : categories.length === 0
      ? <p className="text-sm text-muted-foreground">{t("detail.categories_empty")}</p>
      : <div className="space-y-3">{categories.map(category => {
          const activeTab = activeTabs[String(category.id)] ?? "overview";
          return <article key={String(category.id)} className="rounded-md border p-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-sm font-medium">{category.name}</p><p className="text-xs text-muted-foreground">{category.description || "—"}</p></div>
              <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setEditing(category); setOpen(true); }}>{t("actions.edit")}</Button><Button size="sm" variant="outline" className="text-destructive" disabled={remove.isPending} onClick={() => deleteCategory(category.id)}>{t("actions.delete")}</Button></div>
            </div>
            <div role="tablist" aria-label={category.name} className="flex gap-1 border-b">
              <button type="button" role="tab" aria-selected={activeTab === "overview"} className={`px-3 py-2 text-sm border-b-2 ${activeTab === "overview" ? "border-primary font-medium" : "border-transparent text-muted-foreground"}`} onClick={() => setActiveTabs(current => ({ ...current, [String(category.id)]: "overview" }))}>{t("detail.overview")}</button>
              <button type="button" role="tab" aria-selected={activeTab === "equipment"} className={`px-3 py-2 text-sm border-b-2 ${activeTab === "equipment" ? "border-primary font-medium" : "border-transparent text-muted-foreground"}`} onClick={() => setActiveTabs(current => ({ ...current, [String(category.id)]: "equipment" }))}>{t("equipment.title")}</button>
            </div>
            {activeTab === "overview" ? <dl className="grid gap-2 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">{t("table.name")}</dt><dd>{category.name}</dd></div><div><dt className="text-muted-foreground">{t("table.status")}</dt><dd>{category.isActive ? t("status.active") : t("status.inactive")}</dd></div><div className="sm:col-span-2"><dt className="text-muted-foreground">{t("table.description")}</dt><dd>{category.description || "—"}</dd></div></dl> : <CategoryEquipmentManager category={category} />}
          </article>;
        })}</div>}
    <CategoryFormDialog open={open} onOpenChange={value => { setOpen(value); if (!value) setEditing(null); }} editItem={editing} subgroupId={subgroup.id} onSuccess={() => setEditing(null)} />
  </section>;
}

export function CategoriesPage() {
  const { t } = useTranslation("module-equipment");
  const { data, isLoading, error } = useSubgroupsServerSide();
  return <div className="page-content--wide"><div className="page-content--body space-y-4">
    <header><h1 className="page-title">{t("categories_title")}</h1><p className="page-subtitle">{t("categories_subtitle")}</p></header>
    {isLoading ? <p className="text-sm text-muted-foreground">{t("table.loading")}</p> : error ? <p className="text-sm text-destructive">{t("table.error")}</p> : (data ?? []).map(subgroup => <SubgroupCategories key={String(subgroup.id)} subgroup={subgroup} />)}
  </div></div>;
}
