"use client";

import { Suspense, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/services/i18n/client";
import {
  useEquipmentItemsServerSide,
  useDeleteEquipmentItem,
} from "../hooks/use-equipments";
import { useMasterDetail } from "@/core/master-detail/use-master-detail";
import { SmallTable, type SmallTableColumn, type DetailTab } from "@/components/small-table";
import { EquipmentItemFormDialog } from "../components/equipment-item-form-dialog";
import { Button } from "@/components/ui/button";
import PencilIcon from "lucide-react/dist/esm/icons/pencil";
import TrashIcon from "lucide-react/dist/esm/icons/trash";
import ArrowLeftIcon from "lucide-react/dist/esm/icons/arrow-left";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right";
import WrenchIcon from "lucide-react/dist/esm/icons/wrench";
import { Suspense as ReactSuspense } from "react";
import type { EquipmentItem } from "../types/equipment";

function PageInner() {
  const { t } = useTranslation("module-equipment");
  const qc = useQueryClient();
  const { selectedId, showDetail, select, close, toggle, afterSave } = useMasterDetail();
  const [refreshKey, setRefreshKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<EquipmentItem | null>(null);
  function openCreateDialog() { setEditItem(null); setFormOpen(true); }
  function openEditDialog(item: EquipmentItem) { setEditItem(item); setFormOpen(true); }

  const deleteMutation = useDeleteEquipmentItem();
  async function handleDelete(id: EquipmentItem["id"]) {
    if (!window.confirm(t("confirm.delete.message"))) return;
    await deleteMutation.mutateAsync({ id });
    if (String(selectedId) === String(id)) close();
    setRefreshKey(k => k + 1);
  }

  const { data: items, total, limit, isLoading, isFetching, error, page, setPage, search, setSearch, sort, setSort } = useEquipmentItemsServerSide(null);

  const columns: SmallTableColumn<EquipmentItem>[] = useMemo(() => [
    { key: "id", label: "#", primary: true, render: item => <span className="font-mono text-muted-foreground">{String(item.id)}</span> },
    { key: "code", label: t("table.code"), primary: true, render: item => <span className="font-mono text-muted-foreground">{item.code}</span> },
    { key: "name", label: t("table.name"), primary: true, render: item => <span className="font-medium">{item.name}</span> },
    { key: "description", label: t("table.description"), render: item => <span className="text-muted-foreground">{item.description || "—"}</span> },
    { key: "isActive", label: t("table.status"), render: item => <span>{item.isActive ? t("status.active") : t("status.inactive")}</span> },
  ], [t]);

  const tabs: DetailTab[] = useMemo(() => [
    { slug: "overview", label: t("detail.overview"), position: 0 },
  ], [t]);

  const customTabBody = useMemo(() => ({
    overview: (item: EquipmentItem) => <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
      <div><dt className="text-muted-foreground">{t("table.code")}</dt><dd className="font-mono text-foreground">{item.code}</dd></div>
      <div><dt className="text-muted-foreground">{t("table.name")}</dt><dd className="font-medium text-foreground">{item.name}</dd></div>
      <div><dt className="text-muted-foreground">{t("table.status")}</dt><dd className="text-foreground">{item.isActive ? t("status.active") : t("status.inactive")}</dd></div>
      <div className="sm:col-span-2"><dt className="text-muted-foreground">{t("table.description")}</dt><dd className="text-foreground">{item.description || "—"}</dd></div>
    </dl>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [refreshKey]);

  function toolbar(item: EquipmentItem) {
    return <div className="flex items-center gap-2">
      <Button variant="outline" size="icon-sm" title={t("actions.edit")} onClick={() => openEditDialog(item)}><PencilIcon className="size-3.5" /></Button>
      <Button variant="outline" size="icon-sm" className="text-destructive hover:bg-destructive/10" title={t("actions.delete")} onClick={() => handleDelete(item.id)} disabled={deleteMutation.isPending}><TrashIcon className="size-3.5" /></Button>
      <Button variant="ghost" size="icon-sm" title={showDetail ? t("actions.collapse") : t("actions.expand")} onClick={toggle}>{showDetail ? <ArrowRightIcon className="size-3.5" /> : <ArrowLeftIcon className="size-3.5" />}</Button>
    </div>;
  }

  function renderHeader(item: EquipmentItem) {
    return <div className="flex items-center gap-2"><WrenchIcon className="size-4 text-primary" /><span>{item.name}</span>{item.code && <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{item.code}</span>}</div>;
  }

  return <div className="page-content--wide">
    <div className="page-content--body">
      <div className="page-header--split">
        <div><h1 className="page-title">{t("equipment_page_title")}</h1><p className="page-subtitle">{t("equipment_page_subtitle")}</p></div>
        <div className="page-header__actions"><Button onClick={openCreateDialog}>{t("equipment.create")}</Button></div>
      </div>
      <SmallTable<EquipmentItem>
        items={items} total={total} searchValue={search} onSearchChange={setSearch}
        searchPlaceholder={t("equipment_search")} searchLabel={t("equipment_search_label")}
        page={page} onPageChange={setPage} perPage={limit} sort={sort} onSortChange={setSort}
        columns={columns} selectedId={selectedId} onSelectId={select} getItemId={item => item.id}
        showDetail={showDetail} detailItem={null} detailLoading={false}
        tabs={tabs} customTabBody={customTabBody} emptyText={t("equipment.empty")}
        isLoading={isLoading} isFetching={isFetching} loadingText={t("table.loading")}
        error={error} errorText={t("table.error")} tabEmptyText={t("detail.empty")}
        paginationOfLabel={t("table.of")} previousPageLabel={t("actions.prev_page")}
        nextPageLabel={t("actions.next_page")} toolbar={toolbar} renderHeader={renderHeader}
        listHeader={showDetail ? <Button variant="outline" size="sm" onClick={close}>{t("actions.collapse")}</Button> : undefined}
      />
    </div>
    <EquipmentItemFormDialog open={formOpen} onOpenChange={open => { setFormOpen(open); if (!open) setEditItem(null); }}
      editItem={editItem} onSuccess={savedId => {
        qc.invalidateQueries({ queryKey: ["equipment", "items"] });
        setRefreshKey(k => k + 1);
        afterSave(savedId);
      }} />
  </div>;
}

export function EquipmentTypesPage() {
  return <ReactSuspense fallback={<div className="p-8 text-muted-foreground">Loading…</div>}><PageInner /></ReactSuspense>;
}
