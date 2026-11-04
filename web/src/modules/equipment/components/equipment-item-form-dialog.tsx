"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import { FormDialogLayout } from "@/components/form/form-dialog-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategoriesQuery, useSubgroupsQuery, useCreateEquipmentItem, useUpdateEquipmentItem } from "../hooks/use-equipments";
import type { Category, EquipmentItem, Subgroup } from "../types/equipment";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: EquipmentItem | null;
  onSuccess: (savedId: EquipmentItem["id"]) => void;
}

export function EquipmentItemFormDialog({ open, onOpenChange, editItem, onSuccess }: Props) {
  const { t } = useTranslation("module-equipment");
  const createMutation = useCreateEquipmentItem();
  const updateMutation = useUpdateEquipmentItem();
  const { data: categoriesData } = useCategoriesQuery();
  const { data: subgroupsData } = useSubgroupsQuery();
  const isEditing = Boolean(editItem);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const [subgroup, setSubgroup] = useState("");
  const [category, setCategory] = useState("none");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setSubgroup(editItem ? String(editItem.subgroupId) : "");
    setCategory(editItem?.categoryId != null ? String(editItem.categoryId) : "none");
    setName(editItem?.name ?? "");
    setDescription(editItem?.description ?? "");
    setIsActive(editItem?.isActive ?? true);
    setError("");
  }, [open, editItem]);

  const subgroups = subgroupsData?.data ?? [];
  const categories = useMemo(
    () => (categoriesData?.data ?? []).filter((item: Category) => String(item.subgroupId) === subgroup),
    [categoriesData, subgroup],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subgroup || !name.trim()) { setError(t("form.validation.required")); return; }
    setError("");
    const payload = {
      subgroupId: Number(subgroup),
      categoryId: category === "none" ? null : Number(category),
      name: name.trim(),
      description: description.trim() || null,
      isActive,
    };
    const result = isEditing && editItem
      ? await updateMutation.mutateAsync({ id: editItem.id, data: payload })
      : await createMutation.mutateAsync(payload);
    onOpenChange(false);
    onSuccess(result.id);
  }

  return (
    <FormDialogLayout open={open} onOpenChange={onOpenChange}
      title={isEditing ? t("equipment.edit") : t("equipment.create")}
      onSubmit={handleSubmit}
      footer={<>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>{t("actions.cancel")}</Button>
        <Button type="submit" disabled={isPending}>{isPending ? t("actions.saving") : t("actions.save")}</Button>
      </>}>
      <div className="space-y-1.5">
        <Label htmlFor="item-subgroup">{t("form.field.subgroup")} <span className="text-destructive">*</span></Label>
        <Select value={subgroup} onValueChange={value => { setSubgroup(value); setCategory("none"); }}>
          <SelectTrigger id="item-subgroup"><SelectValue placeholder={t("form.placeholder.subgroup")} /></SelectTrigger>
          <SelectContent>{subgroups.map((item: Subgroup) => <SelectItem key={String(item.id)} value={String(item.id)}>{item.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="item-category">{t("form.field.category")}</Label>
        <Select value={category} onValueChange={setCategory} disabled={!subgroup}>
          <SelectTrigger id="item-category"><SelectValue placeholder={t("form.placeholder.category")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">—</SelectItem>
            {categories.map((item: Category) => <SelectItem key={String(item.id)} value={String(item.id)}>{item.name}</SelectItem>)}
          </SelectContent>
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
