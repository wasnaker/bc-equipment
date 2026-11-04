"use client";

import { useState } from "react";
import { useCategories, useDeleteCategory } from "../hooks/use-equipments";
import { useTranslation } from "@/services/i18n/client";
import { Button } from "@/components/ui/button";
import type { Category, Subgroup } from "../types/equipment";
import type { DetailTab } from "@/components/small-table";
import { CategoryFormDialog } from "./category-form-dialog";
import { CategoryEquipmentManager } from "./category-equipment-manager";

export function SubgroupOverviewTab({ item }: { item: Subgroup }) {
  const { t } = useTranslation("module-equipment");
  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
      <div><dt className="text-muted-foreground">{t("table.name")}</dt><dd className="font-medium text-foreground">{item.name}</dd></div>
      <div><dt className="text-muted-foreground">{t("table.description")}</dt><dd className="text-foreground">{item.description || "—"}</dd></div>
      <div><dt className="text-muted-foreground">{t("table.status")}</dt><dd className="text-foreground">{item.isActive ? t("status.active") : t("status.inactive")}</dd></div>
    </dl>
  );
}

export function SubgroupCategoriesTab({ item }: { item: Subgroup }) {
  const { t } = useTranslation("module-equipment");
  const { data, isLoading, isFetching } = useCategories(item.id, 1, 50);
  const deleteMutation = useDeleteCategory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);

  function createCategory() { setEditItem(null); setDialogOpen(true); }
  function editCategory(category: Category) { setEditItem(category); setDialogOpen(true); }
  async function deleteCategory(id: Category["id"]) {
    if (!window.confirm(t("confirm.delete.message"))) return;
    await deleteMutation.mutateAsync({ id });
  }

  const categories = data?.data ?? [];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{t("detail.categories")}</p>
        <Button size="sm" onClick={createCategory}>{t("actions.create_category")}</Button>
      </div>
      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-8 w-full animate-pulse rounded bg-muted" />)}</div>
      ) : categories.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">{t("detail.categories_empty")}</p>
      ) : (
        <ul className="space-y-2">{categories.map(category => (
          <li key={String(category.id)} className="flex items-center justify-between gap-3 rounded-md border p-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">{category.name}</p>
              {category.description && <p className="text-xs text-muted-foreground">{category.description}</p>}
              <p className="text-xs text-muted-foreground">{category.isActive ? t("status.active") : t("status.inactive")}</p>
              <CategoryEquipmentManager category={category} />
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button size="sm" variant="outline" onClick={() => editCategory(category)}>{t("actions.edit")}</Button>
              <Button size="sm" variant="outline" className="text-destructive" disabled={deleteMutation.isPending} onClick={() => deleteCategory(category.id)}>{t("actions.delete")}</Button>
            </div>
          </li>
        ))}</ul>
      )}
      {isFetching && !isLoading && <p className="text-xs text-muted-foreground">{t("table.loading")}</p>}
      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={open => { setDialogOpen(open); if (!open) setEditItem(null); }}
        editItem={editItem}
        subgroupId={item.id}
        onSuccess={() => setEditItem(null)}
      />
    </div>
  );
}

export function buildSubgroupTabBodies(_subgroup: Subgroup | null, _tab: DetailTab): Record<string, (item: Subgroup, tab: DetailTab) => React.ReactNode> {
  return { overview: item => <SubgroupOverviewTab item={item} />, categories: item => <SubgroupCategoriesTab item={item} /> };
}
