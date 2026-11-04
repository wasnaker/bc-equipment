"use client";

import { useState } from "react";
import { useSubgroupsServerSide, useCategories, useDeleteCategory } from "../hooks/use-equipments";
import { CategoryFormDialog } from "../components/category-form-dialog";
import type { Category, Subgroup } from "../types/equipment";
import { useTranslation } from "@/services/i18n/client";
import { Button } from "@/components/ui/button";

function SubgroupCategories({ subgroup }: { subgroup: Subgroup }) {
  const { t } = useTranslation("module-equipment");
  const { data, isLoading } = useCategories(subgroup.id, 1, 50);
  const remove = useDeleteCategory();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
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
      : <div className="divide-y rounded-md border">{categories.map(category => <div key={String(category.id)} className="flex items-center justify-between gap-3 p-3">
          <div><p className="text-sm font-medium">{category.name}</p><p className="text-xs text-muted-foreground">{category.description || "—"}</p></div>
          <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setEditing(category); setOpen(true); }}>{t("actions.edit")}</Button><Button size="sm" variant="outline" className="text-destructive" disabled={remove.isPending} onClick={() => deleteCategory(category.id)}>{t("actions.delete")}</Button></div>
        </div>)}</div>}
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
