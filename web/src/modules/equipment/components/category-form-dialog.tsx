"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import { FormDialogLayout } from "@/components/form/form-dialog-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateCategory, useUpdateCategory } from "../hooks/use-equipments";
import type { Category, Subgroup } from "../types/equipment";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: Category | null;
  subgroupId: Subgroup["id"];
  onSuccess: (savedId: Category["id"]) => void;
}

export function CategoryFormDialog({ open, onOpenChange, editItem, subgroupId, onSuccess }: Props) {
  const { t } = useTranslation("module-equipment");
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isEditing = Boolean(editItem);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(editItem?.name ?? "");
    setDescription(editItem?.description ?? "");
    setIsActive(editItem?.isActive ?? true);
    setError("");
  }, [open, editItem]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError(t("form.validation.required")); return; }
    setError("");
    const payload = { subgroupId: Number(subgroupId), name: name.trim(), description: description.trim() || null, isActive };
    const result = isEditing && editItem
      ? await updateMutation.mutateAsync({ id: editItem.id, data: payload })
      : await createMutation.mutateAsync(payload);
    onOpenChange(false);
    onSuccess(result.id);
  }

  return (
    <FormDialogLayout open={open} onOpenChange={onOpenChange}
      title={isEditing ? t("actions.edit_category") : t("actions.create_category")}
      onSubmit={handleSubmit}
      footer={<>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>{t("actions.cancel")}</Button>
        <Button type="submit" disabled={isPending}>{isPending ? t("actions.saving") : t("actions.save")}</Button>
      </>}>
      <div className="space-y-1.5">
        <Label htmlFor="category-name">{t("form.field.name")} <span className="text-destructive">*</span></Label>
        <Input id="category-name" value={name} onChange={e => setName(e.target.value)} maxLength={190} aria-invalid={Boolean(error)} />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="category-description">{t("form.field.description")}</Label>
        <Input id="category-description" value={description} onChange={e => setDescription(e.target.value)} maxLength={500} />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="category-active" checked={isActive} onCheckedChange={value => setIsActive(Boolean(value))} />
        <Label htmlFor="category-active" className="cursor-pointer text-sm font-normal">{t("form.field.isActive")}</Label>
      </div>
    </FormDialogLayout>
  );
}
