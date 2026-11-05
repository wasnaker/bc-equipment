"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import {
  useEquipmentItems,
  useCreateEquipmentItem,
  useUpdateEquipmentItem,
  useDeleteEquipmentItem,
} from "../hooks/use-equipments";
import { EquipmentItemFormDialog } from "./equipment-item-form-dialog";
import { Button } from "@/components/ui/button";
import PencilIcon from "lucide-react/dist/esm/icons/pencil";
import TrashIcon from "lucide-react/dist/esm/icons/trash";
import PlusIcon from "lucide-react/dist/esm/icons/plus";
import type { Category, EquipmentItem } from "../types/equipment";

interface Props {
  category: Category;
}

export function CategoryEquipmentTab({ category }: Props) {
  const { t } = useTranslation("module-equipment");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<EquipmentItem | null>(null);

  const { data: itemsResult, isLoading } = useEquipmentItems(category.id, 1, 50);
  const createMutation = useCreateEquipmentItem();
  const updateMutation = useUpdateEquipmentItem();
  const deleteMutation = useDeleteEquipmentItem();

  const list = useMemo(() => itemsResult?.data ?? [], [itemsResult?.data]);

  function openCreateDialog() {
    setEditItem(null);
    setFormOpen(true);
  }
  function openEditDialog(item: EquipmentItem) {
    setEditItem(item);
    setFormOpen(true);
  }
  async function handleDelete(item: EquipmentItem) {
    if (!window.confirm(t("confirm.delete.message"))) return;
    await deleteMutation.mutateAsync({ id: item.id });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-muted-foreground">
          {t("equipment.title")}
        </p>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">{list.length}</span>
          <Button
            size="sm"
            variant="outline"
            disabled={createMutation.isPending}
            onClick={openCreateDialog}
          >
            <PlusIcon className="size-3.5" />
            {t("equipment.create")}
          </Button>
          {editItem && (
            <Button
              size="sm"
              variant="outline"
              disabled={updateMutation.isPending}
              onClick={() => setFormOpen(true)}
            >
              <PencilIcon className="size-3.5" />
              {t("actions.edit")}
            </Button>
          )}
          {editItem && (
            <Button
              size="sm"
              variant="outline"
              disabled={deleteMutation.isPending}
              className="text-destructive hover:bg-destructive/10"
              onClick={() => handleDelete(editItem)}
            >
              <TrashIcon className="size-3.5" />
              {t("actions.delete")}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-xs text-muted-foreground">{t("table.loading")}</p>
      ) : list.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t("equipment.empty")}</p>
      ) : (
        <ul className="divide-y rounded-md border">
          {list.map((item) => (
            <li
              key={String(item.id)}
              className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 hover:bg-muted/50"
              onClick={() => openEditDialog(item)}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {item.name}
                </p>
              </div>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {item.code}
              </span>
            </li>
          ))}
        </ul>
      )}

      <EquipmentItemFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditItem(null);
        }}
        editItem={editItem}
        onSuccess={() => {}}
      />
    </div>
  );
}
