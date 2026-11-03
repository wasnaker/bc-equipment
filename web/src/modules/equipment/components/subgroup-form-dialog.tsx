"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import { FormDialogLayout } from "@/components/form/form-dialog-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useGroups } from "../hooks/use-equipments";
import { useCreateSubgroup, useUpdateSubgroup } from "../hooks/use-equipments";
import { SUBGROUP_TYPES } from "../types/equipment";
import type { Subgroup, Group } from "../types/equipment";

interface SubgroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: Subgroup | null;
  /** Pre-selected groupId when creating from group detail */
  defaultGroupId?: Group["id"] | null;
  onSuccess: (savedId: Subgroup["id"]) => void;
}

interface FormState {
  groupId: string;
  name: string;
  type: "kabupaten" | "kota";
  isActive: boolean;
}

interface FormErrors {
  groupId?: string;
  name?: string;
  type?: string;
}

export function SubgroupFormDialog({
  open,
  onOpenChange,
  editItem,
  defaultGroupId,
  onSuccess,
}: SubgroupFormDialogProps) {
  const { t } = useTranslation("module-equipment");
  const createMutation = useCreateSubgroup();
  const updateMutation = useUpdateSubgroup();
  const { data: groupsData } = useGroups(1, 200);

  const isEditing = Boolean(editItem);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [form, setForm] = useState<FormState>({
    groupId: "",
    name: "",
    type: "kabupaten",
    isActive: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      setForm({
        groupId: editItem
          ? String(editItem.groupId)
          : defaultGroupId != null
            ? String(defaultGroupId)
            : "",
        name: editItem?.name ?? "",
        type: editItem?.type ?? "kabupaten",
        isActive: editItem?.isActive ?? true,
      });
      setErrors({});
    }
  }, [open, editItem, defaultGroupId]);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.groupId) e.groupId = t("form.validation.required");
    if (!form.name.trim()) e.name = t("form.validation.required");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      groupId: Number(form.groupId),
      name: form.name.trim(),
      type: form.type,
      isActive: form.isActive,
    };

    let savedId: Subgroup["id"] | undefined;
    if (isEditing && editItem) {
      const result = await updateMutation.mutateAsync({
        id: editItem.id,
        data: payload,
      });
      savedId = result.id;
    } else {
      const result = await createMutation.mutateAsync(payload);
      savedId = result.id;
    }

    onOpenChange(false);
    if (savedId != null) onSuccess(savedId);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const groups = groupsData?.data ?? [];

  return (
    <FormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? t("actions.edit_subgroup") : t("actions.create_subgroup")}
      onSubmit={handleSubmit}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {t("actions.cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? t("actions.saving") : t("actions.save")}
          </Button>
        </>
      }
    >
          {/* Group */}
          <div className="space-y-1.5">
            <Label htmlFor="subgroup-group">
              {t("form.field.group")} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.groupId}
              onValueChange={(v) => setField("groupId", v)}
            >
              <SelectTrigger
                id="subgroup-group"
                aria-invalid={Boolean(errors.groupId)}
              >
                <SelectValue placeholder={t("form.placeholder.group")} />
              </SelectTrigger>
              <SelectContent>
                {groups.map((p) => (
                  <SelectItem key={String(p.id)} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.groupId && (
              <p className="text-xs text-destructive">{errors.groupId}</p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="subgroup-name">
              {t("form.field.name")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subgroup-name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder={t("form.placeholder.name")}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label htmlFor="subgroup-type">{t("form.field.type")}</Label>
            <Select
              value={form.type}
              onValueChange={(v) => setField("type", v as "kabupaten" | "kota")}
            >
              <SelectTrigger id="subgroup-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBGROUP_TYPES.map((rt) => (
                  <SelectItem key={rt.value} value={rt.value}>
                    {rt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* isActive */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="subgroup-active"
              checked={form.isActive}
              onCheckedChange={(v) => setField("isActive", Boolean(v))}
            />
            <Label
              htmlFor="subgroup-active"
              className="cursor-pointer text-sm font-normal"
            >
              {t("form.field.isActive")}
            </Label>
          </div>

    </FormDialogLayout>
  );
}