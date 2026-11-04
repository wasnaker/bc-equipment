"use client";

import { useState } from "react";
import { useSubgroups, useDeleteSubgroup } from "../hooks/use-equipments";
import { useTranslation } from "@/services/i18n/client";
import { Button } from "@/components/ui/button";
import type { Group, Subgroup } from "../types/equipment";
import type { DetailTab } from "@/components/small-table";
import { SubgroupFormDialog } from "./subgroup-form-dialog";

export function GroupOverviewTab({ item }: { item: Group }) {
  const { t } = useTranslation("module-equipment");
  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
      <div><dt className="text-muted-foreground">{t("table.name")}</dt><dd className="font-medium text-foreground">{item.name}</dd></div>
      <div><dt className="text-muted-foreground">{t("table.description")}</dt><dd className="text-foreground">{item.description || "—"}</dd></div>
      <div><dt className="text-muted-foreground">{t("table.status")}</dt><dd className="text-foreground">{item.isActive ? t("status.active") : t("status.inactive")}</dd></div>
    </dl>
  );
}

export function GroupSubgroupsTab({ item }: { item: Group }) {
  const { t } = useTranslation("module-equipment");
  const { data, isLoading, isFetching } = useSubgroups(item.id, 1, 50);
  const deleteMutation = useDeleteSubgroup();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Subgroup | null>(null);

  function createSubgroup() { setEditItem(null); setDialogOpen(true); }
  function editSubgroup(subgroup: Subgroup) { setEditItem(subgroup); setDialogOpen(true); }

  async function deleteSubgroup(id: Subgroup["id"]) {
    if (!window.confirm(t("confirm.delete.message"))) return;
    await deleteMutation.mutateAsync({ id });
  }

  const subgroups = data?.data ?? [];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{t("detail.subgroups")}</p>
        <Button size="sm" onClick={createSubgroup}>{t("actions.create_subgroup")}</Button>
      </div>
      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-8 w-full animate-pulse rounded bg-muted" />)}</div>
      ) : subgroups.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">{t("detail.subgroups_empty")}</p>
      ) : (
        <ul className="space-y-2">{subgroups.map(subgroup => (
          <li key={String(subgroup.id)} className="flex items-center justify-between gap-3 rounded-md border p-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">{subgroup.name}</p>
              {subgroup.description && <p className="text-xs text-muted-foreground">{subgroup.description}</p>}
              <p className="text-xs text-muted-foreground">{subgroup.isActive ? t("status.active") : t("status.inactive")}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button size="sm" variant="outline" onClick={() => editSubgroup(subgroup)}>{t("actions.edit")}</Button>
              <Button size="sm" variant="outline" className="text-destructive" disabled={deleteMutation.isPending} onClick={() => deleteSubgroup(subgroup.id)}>{t("actions.delete")}</Button>
            </div>
          </li>
        ))}</ul>
      )}
      {isFetching && !isLoading && <p className="text-xs text-muted-foreground">{t("table.loading")}</p>}
      <SubgroupFormDialog
        open={dialogOpen}
        onOpenChange={open => { setDialogOpen(open); if (!open) setEditItem(null); }}
        editItem={editItem}
        defaultGroupId={item.id}
        onSuccess={() => setEditItem(null)}
      />
    </div>
  );
}

export function buildGroupTabBodies(_group: Group | null, _tab: DetailTab): Record<string, (item: Group, tab: DetailTab) => React.ReactNode> {
  return { overview: item => <GroupOverviewTab item={item} />, subgroups: item => <GroupSubgroupsTab item={item} /> };
}
