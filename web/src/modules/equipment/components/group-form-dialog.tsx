"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import { FormDialogLayout } from "@/components/form/form-dialog-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateGroup, useUpdateGroup } from "../hooks/use-equipments";
import type { Group } from "../types/equipment";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: Group | null;
  onSuccess: (savedId: Group["id"]) => void;
}

export function GroupFormDialog({ open, onOpenChange, editItem, onSuccess }: Props) {
  const { t } = useTranslation("module-equipment");
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();
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
    const payload = { name: name.trim(), description: description.trim() || null, isActive };
    const result = isEditing && editItem
      ? await updateMutation.mutateAsync({ id: editItem.id, data: payload })
      : await createMutation.mutateAsync(payload);
    onOpenChange(false);
    onSuccess(result.id);
  }

  return (
    <FormDialogLayout open={open} onOpenChange={onOpenChange}
      title={isEditing ? t("actions.edit_group") : t("actions.create_group")}
      onSubmit={handleSubmit}
      footer={<>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>{t("actions.cancel")}</Button>
        <Button type="submit" disabled={isPending}>{isPending ? t("actions.saving") : t("actions.save")}</Button>
      </>}>
      <div className="space-y-1.5">
        <Label htmlFor="group-name">{t("form.field.name")} <span className="text-destructive">*</span></Label>
        <Input id="group-name" value={name} onChange={e => setName(e.target.value)} maxLength={190} aria-invalid={Boolean(error)} />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="group-description">{t("form.field.description")}</Label>
        <Input id="group-description" value={description} onChange={e => setDescription(e.target.value)} maxLength={500} />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="group-active" checked={isActive} onCheckedChange={value => setIsActive(Boolean(value))} />
        <Label htmlFor="group-active" className="cursor-pointer text-sm font-normal">{t("form.field.isActive")}</Label>
      </div>
    </FormDialogLayout>
  );
}
