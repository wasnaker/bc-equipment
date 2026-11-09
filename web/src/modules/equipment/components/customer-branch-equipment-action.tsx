"use client";

import Link from "next/link";
import { useTranslation } from "@/services/i18n/client";
import type { ModuleExtensionProps } from "@/core/modules/types";

/**
 * Equipment-owned action contributed to Customer's branch detail panel.
 * The host owns the slot placement and permission check; this package owns
 * the action and its destination.
 */
export function CustomerBranchEquipmentAction(_props: ModuleExtensionProps) {
  const { t } = useTranslation("module-equipment");

  return (
    <Link
      href="/admin/equipment/items"
      className="inline-flex h-8 items-center rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
    >
      {t("equipment_page_title")}
    </Link>
  );
}
