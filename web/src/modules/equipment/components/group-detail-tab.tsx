"use client";

import { useSubgroups } from "../hooks/use-equipments";
import { useTranslation } from "@/services/i18n/client";
import type { Group } from "../types/equipment";
import type { DetailTab } from "@/components/small-table";

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
  const { data, isLoading } = useSubgroups(String(item.id), 1, 50);
  if (isLoading) return <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-8 w-full animate-pulse rounded bg-muted" />)}</div>;
  const subgroups = data?.data ?? [];
  if (!subgroups.length) return <p className="py-4 text-center text-sm text-muted-foreground">{t("detail.subgroups_empty")}</p>;
  return <ul className="space-y-2">{subgroups.map(subgroup => (
    <li key={String(subgroup.id)} className="flex items-start justify-between gap-3 rounded-md border p-3">
      <div><p className="text-sm font-medium">{subgroup.name}</p>{subgroup.description && <p className="text-xs text-muted-foreground">{subgroup.description}</p>}</div>
      <span className="text-xs text-muted-foreground">{subgroup.isActive ? t("status.active") : t("status.inactive")}</span>
    </li>
  ))}</ul>;
}

export function buildGroupTabBodies(_group: Group | null, _tab: DetailTab): Record<string, (item: Group, tab: DetailTab) => React.ReactNode> {
  return { overview: item => <GroupOverviewTab item={item} />, subgroups: item => <GroupSubgroupsTab item={item} /> };
}
