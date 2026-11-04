"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import { FormDialogLayout } from "@/components/form/form-dialog-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategoriesQuery, useCreateEquipmentItem, useUpdateEquipmentItem } from "../hooks/use-equipments";
import type { Category, EquipmentItem } from "../types/equipment";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: EquipmentItem | null;
  categoryId?: Category["id"] | null;
  onSuccess: (savedId: EquipmentItem["id"]) => void;
}

export function EquipmentItemFormDialog({ open, onOpenChange, editItem, categoryId, onSuccess }: Props) {
  const { t } = useTranslation("module-equipment");
  const createMutation = useCreateEquipmentItem();
  const updateMutation = useUpdateEquipmentItem();
  const { data: categoriesData } = useCategoriesQuery();
  const isEditing = Boolean(editItem);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setCategory(editItem ? String(editItem.categoryId) : categoryId != null ? String(categoryId) : "");
    setName(editItem?.name ?? "");
    setDescription(editItem?.description ?? "");
    setIsActive(editItem?.isActive ?? true);
    setError("");
  }, [open, editItem, categoryId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError(t("form.validation.required")); return; }
    if (!category) { setError(t("form.validation.required")); return; }
    setError("");
    const payload = { categoryId: Number(category), name: name.trim(), description: description.trim() || null, isActive };
    const result = isEditing && editItem
      ? await updateMutation.mutateAsync({ id: editItem.id, data: payload })
      : await createMutation.mutateAsync(payload);
    onOpenChange(false);
    onSuccess(result.id);
  }

  const categories = categoriesData?.data ?? [];
  return (
    <FormDialogLayout open={open} onOpenChange={onOpenChange}
      title={isEditing ? t("equipment.edit") : t("equipment.create")}
      onSubmit={handleSubmit}
      footer={<>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>{t("actions.cancel")}</Button>
        <Button type="submit" disabled={isPending}>{isPending ? t("actions.saving") : t("actions.save")}</Button>
      </>}>
      <div className="space-y-1.5">
        <Label htmlFor="item-category">{t("form.field.category")} <span className="text-destructive">*</span></Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="item-category"><SelectValue placeholder={t("form.placeholder.category")} /></SelectTrigger>
          <SelectContent>{categories.map((cat: Category) => <SelectItem key={String(cat.id)} value={String(cat.id)}>{cat.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="item-name">{t("form.field.name")} <span className="text-destructive">*</span></Label>
        <Input id="item-name" value={name} onChange={e => setName(e.target.value)} maxLength={190} aria-invalid={Boolean(error)} />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="item-description">{t("form.field.description")}</Label>
        <Input id="item-description" value={description} onChange={e => setDescription(e.target.value)} maxLength={500} />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="item-active" checked={isActive} onCheckedChange={value => setIsActive(Boolean(value))} />
        <Label htmlFor="item-active" className="cursor-pointer text-sm font-normal">{t("form.field.isActive")}</Label>
      </div>
    </FormDialogLayout>
  );
}
