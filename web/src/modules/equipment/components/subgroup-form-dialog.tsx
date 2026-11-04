"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import { FormDialogLayout } from "@/components/form/form-dialog-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGroups, useCreateSubgroup, useUpdateSubgroup } from "../hooks/use-equipments";
import type { Group, Subgroup } from "../types/equipment";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: Subgroup | null;
  defaultGroupId?: Group["id"] | null;
  onSuccess: (savedId: Subgroup["id"]) => void;
}

export function SubgroupFormDialog({ open, onOpenChange, editItem, defaultGroupId, onSuccess }: Props) {
  const { t } = useTranslation("module-equipment");
  const createMutation = useCreateSubgroup();
  const updateMutation = useUpdateSubgroup();
  const { data: groupsData } = useGroups(1, 50);
  const isEditing = Boolean(editItem);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const [groupId, setGroupId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{ groupId?: string; name?: string }>({});

  useEffect(() => {
    if (!open) return;
    setGroupId(editItem ? String(editItem.groupId) : defaultGroupId != null ? String(defaultGroupId) : "");
    setName(editItem?.name ?? "");
    setDescription(editItem?.description ?? "");
    setIsActive(editItem?.isActive ?? true);
    setErrors({});
  }, [open, editItem, defaultGroupId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!groupId) nextErrors.groupId = t("form.validation.required");
    if (!name.trim()) nextErrors.name = t("form.validation.required");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const payload = { groupId: Number(groupId), name: name.trim(), description: description.trim() || null, isActive };
    const result = isEditing && editItem
      ? await updateMutation.mutateAsync({ id: editItem.id, data: payload })
      : await createMutation.mutateAsync(payload);
    onOpenChange(false);
    onSuccess(result.id);
  }

  const groups = groupsData?.data ?? [];
  return (
    <FormDialogLayout open={open} onOpenChange={onOpenChange}
      title={isEditing ? t("actions.edit_subgroup") : t("actions.create_subgroup")}
      onSubmit={handleSubmit}
      footer={<>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>{t("actions.cancel")}</Button>
        <Button type="submit" disabled={isPending}>{isPending ? t("actions.saving") : t("actions.save")}</Button>
      </>}>
      <div className="space-y-1.5">
        <Label htmlFor="subgroup-group">{t("form.field.group")} <span className="text-destructive">*</span></Label>
        <Select value={groupId} onValueChange={setGroupId}>
          <SelectTrigger id="subgroup-group" aria-invalid={Boolean(errors.groupId)}><SelectValue placeholder={t("form.placeholder.group")} /></SelectTrigger>
          <SelectContent>{groups.map((group: Group) => <SelectItem key={String(group.id)} value={String(group.id)}>{group.name}</SelectItem>)}</SelectContent>
        </Select>
        {errors.groupId && <p className="text-xs text-destructive">{errors.groupId}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subgroup-name">{t("form.field.name")} <span className="text-destructive">*</span></Label>
        <Input id="subgroup-name" value={name} onChange={e => setName(e.target.value)} maxLength={190} aria-invalid={Boolean(errors.name)} />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subgroup-description">{t("form.field.description")}</Label>
        <Input id="subgroup-description" value={description} onChange={e => setDescription(e.target.value)} maxLength={500} />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="subgroup-active" checked={isActive} onCheckedChange={value => setIsActive(Boolean(value))} />
        <Label htmlFor="subgroup-active" className="cursor-pointer text-sm font-normal">{t("form.field.isActive")}</Label>
      </div>
    </FormDialogLayout>
  );
}
