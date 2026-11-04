"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import useFetch from "@/services/api/use-fetch";
import { API_URL } from "@/services/api/config";
import wrapperFetchJsonResponse from "@/services/api/wrapper-fetch-json-response";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Category } from "../types/equipment";

interface EquipmentItem {
  id: number | string; ulid: string; code: string; categoryId: number | string;
  name: string; description: string | null; isActive: boolean;
}
interface ListResult { data: EquipmentItem[]; total: number }

export function CategoryEquipmentManager({ category }: { category: Category }) {
  const { t } = useTranslation("module-equipment");
  const fetch = useFetch();
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<EquipmentItem | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_URL}/v1/equipment/items`);
      url.searchParams.set("page", "1"); url.searchParams.set("limit", "50");
      url.searchParams.set("category_id", String(category.id));
      const result = await fetch(url, { method: "GET" }).then(wrapperFetchJsonResponse<ListResult>);
      if (result.status >= 200 && result.status < 300) setItems((result as any).data?.data ?? []);
      else setError(t("equipment.load_error"));
    } catch { setError(t("equipment.load_error")); }
    finally { setLoading(false); }
  }, [category.id, fetch, t]);

  useEffect(() => { void load(); }, [load]);
  function reset() { setEditing(null); setName(""); setDescription(""); setIsActive(true); setError(""); }
  function startEdit(item: EquipmentItem) { setEditing(item); setName(item.name); setDescription(item.description ?? ""); setIsActive(item.isActive); setError(""); }

  async function save() {
    if (!name.trim()) { setError(t("form.validation.required")); return; }
    setSaving(true); setError("");
    try {
      const payload = { categoryId: Number(category.id), name: name.trim(), description: description.trim() || null, isActive };
      const url = `${API_URL}/v1/equipment/items${editing ? `/${editing.id}` : ""}`;
      const result = await fetch(url, { method: editing ? "PATCH" : "POST", body: JSON.stringify(payload) }).then(wrapperFetchJsonResponse<EquipmentItem>);
      if (result.status < 200 || result.status >= 300) throw new Error(t("equipment.save_error"));
      reset(); await load();
    } catch (e) { setError(e instanceof Error ? e.message : t("equipment.save_error")); }
    finally { setSaving(false); }
  }

  async function remove(item: EquipmentItem) {
    if (!window.confirm(t("confirm.delete.message"))) return;
    setSaving(true);
    try {
      const result = await fetch(`${API_URL}/v1/equipment/items/${item.id}`, { method: "DELETE" }).then(wrapperFetchJsonResponse<undefined>);
      if (result.status !== 204 && (result.status < 200 || result.status >= 300)) throw new Error(t("equipment.delete_error"));
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : t("equipment.delete_error")); }
    finally { setSaving(false); }
  }

  return <div className="mt-3 space-y-3 rounded-md bg-muted/30 p-3">
    <div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold text-muted-foreground">{t("equipment.title")}</p><span className="text-xs text-muted-foreground">{items.length}</span></div>
    {loading ? <p className="text-xs text-muted-foreground">{t("table.loading")}</p> : items.length === 0 ? <p className="text-xs text-muted-foreground">{t("equipment.empty")}</p> : (
      <ul className="space-y-2">{items.map(item => <li key={String(item.id)} className="flex items-center justify-between gap-2 rounded border bg-background p-2">
        <div className="min-w-0"><p className="text-sm font-medium">{item.name} <span className="ml-1 font-mono text-xs text-muted-foreground">{item.code}</span></p>{item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}<p className="text-xs text-muted-foreground">{item.isActive ? t("status.active") : t("status.inactive")}</p></div>
        <div className="flex shrink-0 gap-1"><Button size="sm" variant="outline" disabled={saving} onClick={() => startEdit(item)}>{t("actions.edit")}</Button><Button size="sm" variant="outline" disabled={saving} className="text-destructive" onClick={() => remove(item)}>{t("actions.delete")}</Button></div>
      </li>)}</ul>
    )}
    <div className="grid gap-2 rounded-md border bg-background p-3">
      <p className="text-xs font-semibold">{editing ? t("equipment.edit") : t("equipment.create")}</p>
      <div className="space-y-1"><Label htmlFor={`equipment-name-${category.id}`}>{t("form.field.name")} *</Label><Input id={`equipment-name-${category.id}`} value={name} maxLength={190} onChange={e => setName(e.target.value)} /></div>
      <div className="space-y-1"><Label htmlFor={`equipment-description-${category.id}`}>{t("form.field.description")}</Label><Input id={`equipment-description-${category.id}`} value={description} maxLength={500} onChange={e => setDescription(e.target.value)} /></div>
      <div className="flex items-center gap-2"><Checkbox id={`equipment-active-${category.id}`} checked={isActive} onCheckedChange={v => setIsActive(Boolean(v))} /><Label htmlFor={`equipment-active-${category.id}`} className="text-sm font-normal">{t("form.field.isActive")}</Label></div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex justify-end gap-2">{editing && <Button size="sm" variant="outline" disabled={saving} onClick={reset}>{t("actions.cancel")}</Button>}<Button size="sm" disabled={saving} onClick={save}>{saving ? t("actions.saving") : editing ? t("actions.save") : t("equipment.create")}</Button></div>
    </div>
  </div>;
}
