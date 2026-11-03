"use client";

import { useRegencies } from "../hooks/use-equipments";
import { useTranslation } from "@/services/i18n/client";
import type { Group } from "../types/equipment";
import type { DetailTab } from "@/components/small-table";

interface GroupOverviewTabProps {
  item: Group;
}

interface GroupRegenciesTabProps {
  item: Group;
}

export function GroupOverviewTab({ item }: GroupOverviewTabProps) {
  const { t } = useTranslation("module-equipment");

  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
      <div>
        <dt className="text-muted-foreground">{t("table.isoCode")}</dt>
        <dd className="font-mono font-medium text-foreground">
          {item.isoCode ?? "—"}
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">{t("table.latitude")}</dt>
        <dd className="font-mono text-foreground">
          {item.latitude != null ? item.latitude.toFixed(6) : "—"}
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">{t("table.longitude")}</dt>
        <dd className="font-mono text-foreground">
          {item.longitude != null ? item.longitude.toFixed(6) : "—"}
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">{t("table.name")}</dt>
        <dd className="font-medium text-foreground">{item.name}</dd>
      </div>
    </dl>
  );
}

export function GroupRegenciesTab({ item: group }: GroupRegenciesTabProps) {
  const { t } = useTranslation("module-equipment");
  const { data, isLoading } = useRegencies(String(group.id), 1, 50);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-8 w-full animate-pulse rounded bg-muted"
          />
        ))}
      </div>
    );
  }

  const regencies = data?.data ?? [];

  if (regencies.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        {t("detail.regencies_empty")}
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {regencies.map((reg) => (
        <li
          key={String(reg.id)}
          className="flex items-center gap-2 text-sm"
        >
          <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
            {reg.type === "kabupaten" ? "Kab." : "Kota"}
          </span>
          <span className="font-medium text-foreground">{reg.name}</span>
        </li>
      ))}
    </ul>
  );
}

// Custom tab body map for SmallTable — exported as a factory so page can spread it
export function buildGroupTabBodies(
  _group: Group | null,
  _tab: DetailTab
): Record<string, (item: Group, tab: DetailTab) => React.ReactNode> {
  return {
    overview: (item) => <GroupOverviewTab item={item} />,
    regencies: (item) => <GroupRegenciesTab item={item} />,
  };
}