"use client";

import { Suspense, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/services/i18n/client";
import { useSubgroupsServerSide, useSubgroup, useDeleteSubgroup } from "../hooks/use-equipments";
import { useMasterDetail } from "@/core/master-detail/use-master-detail";
import { SmallTable, type SmallTableColumn, type DetailTab } from "@/components/small-table";
import { SubgroupFormDialog } from "../components/subgroup-form-dialog";
import { SubgroupOverviewTab, SubgroupCategoriesTab } from "../components/subgroup-detail-tab";
import { Button } from "@/components/ui/button";
import PencilIcon from "lucide-react/dist/esm/icons/pencil";
import TrashIcon from "lucide-react/dist/esm/icons/trash";
import ArrowLeftIcon from "lucide-react/dist/esm/icons/arrow-left";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right";
import LayersIcon from "lucide-react/dist/esm/icons/layers";
import type { Subgroup } from "../types/equipment";

function PageInner() {
  const { t } = useTranslation("module-equipment");
  const qc = useQueryClient();
  const { selectedId, showDetail, select, close, toggle, afterSave } = useMasterDetail();
  const [refreshKey, setRefreshKey] = useState(0);
  const detailId = selectedId != null && /^\d+$/.test(String(selectedId)) ? Number(selectedId) : null;
  const { data: selectedSubgroup, isLoading: detailLoading } = useSubgroup(detailId);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Subgroup | null>(null);
  function openCreateDialog() { setEditItem(null); setFormOpen(true); }
  function openEditDialog(item: Subgroup) { setEditItem(item); setFormOpen(true); }

  const deleteMutation = useDeleteSubgroup();
  async function handleDelete(id: Subgroup["id"]) {
    if (!window.confirm(t("confirm.delete.message"))) return;
    await deleteMutation.mutateAsync({ id });
    if (String(selectedId) === String(id)) close();
    setRefreshKey(k => k + 1);
  }

  const { data: subgroups, total, limit, isLoading, isFetching, error, page, setPage, search, setSearch, sort, setSort } = useSubgroupsServerSide();

  const columns: SmallTableColumn<Subgroup>[] = useMemo(() => [
    { key: "id", label: "#", primary: true, render: item => <span className="font-mono text-muted-foreground">{String(item.id)}</span> },
    { key: "name", label: t("table.name"), primary: true, render: item => <span className="font-medium">{item.name}</span> },
    { key: "description", label: t("table.description"), render: item => <span className="text-muted-foreground">{item.description || "—"}</span> },
    { key: "isActive", label: t("table.status"), render: item => <span>{item.isActive ? t("status.active") : t("status.inactive")}</span> },
  ], [t]);

  const tabs: DetailTab[] = useMemo(() => [
    { slug: "overview", label: t("detail.overview"), position: 0 },
    { slug: "categories", label: t("detail.categories"), position: 10 },
  ], [t]);

  const customTabBody = useMemo(() => ({
    overview: (item: Subgroup) => <SubgroupOverviewTab item={item} />,
    categories: (item: Subgroup) => <SubgroupCategoriesTab item={item} />,
  }), [refreshKey]);

  function toolbar(item: Subgroup) {
    return <div className="flex items-center gap-2">
      <Button variant="outline" size="icon-sm" title={t("actions.edit")} onClick={() => openEditDialog(item)}><PencilIcon className="size-3.5" /></Button>
      <Button variant="outline" size="icon-sm" className="text-destructive hover:bg-destructive/10" title={t("actions.delete")} onClick={() => handleDelete(item.id)} disabled={deleteMutation.isPending}><TrashIcon className="size-3.5" /></Button>
      <Button variant="ghost" size="icon-sm" title={showDetail ? t("actions.collapse") : t("actions.expand")} onClick={toggle}>{showDetail ? <ArrowRightIcon className="size-3.5" /> : <ArrowLeftIcon className="size-3.5" />}</Button>
    </div>;
  }

  function renderHeader(item: Subgroup) {
    return <div className="flex items-center gap-2"><LayersIcon className="size-4 text-primary" /><span>{item.name}</span>{item.description && <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{item.description}</span>}</div>;
  }

  return <div className="page-content--wide">
    <div className="page-content--body">
      <div className="page-header--split">
        <div><h1 className="page-title">{t("subgroups_title")}</h1><p className="page-subtitle">{t("subgroups_subtitle")}</p></div>
        <div className="page-header__actions"><Button onClick={openCreateDialog}>{t("actions.create_subgroup")}</Button></div>
      </div>
      <SmallTable<Subgroup>
        items={subgroups} total={total} searchValue={search} onSearchChange={setSearch}
        searchPlaceholder={t("subgroups_search")} searchLabel={t("subgroups_search_label")}
        page={page} onPageChange={setPage} perPage={limit} sort={sort} onSortChange={setSort}
        columns={columns} selectedId={selectedId} onSelectId={select} getItemId={item => item.id}
        showDetail={showDetail} detailItem={selectedSubgroup ?? null} detailLoading={detailLoading}
        tabs={tabs} customTabBody={customTabBody} emptyText={t("subgroups_empty")}
        isLoading={isLoading} isFetching={isFetching} loadingText={t("table.loading")}
        error={error} errorText={t("table.error")} tabEmptyText={t("detail.empty")}
        paginationOfLabel={t("table.of")} previousPageLabel={t("actions.prev_page")}
        nextPageLabel={t("actions.next_page")} toolbar={toolbar} renderHeader={renderHeader}
        listHeader={showDetail ? <Button variant="outline" size="sm" onClick={close}>{t("actions.collapse")}</Button> : undefined}
      />
    </div>
    <SubgroupFormDialog open={formOpen} onOpenChange={open => { setFormOpen(open); if (!open) setEditItem(null); }}
      editItem={editItem} onSuccess={savedId => {
        qc.invalidateQueries({ queryKey: ["equipment", "subgroups"] });
        setRefreshKey(k => k + 1);
        afterSave(savedId);
      }} />
  </div>;
}

export function SubgroupsPage() {
  return <Suspense fallback={<div className="p-8 text-muted-foreground">Loading…</div>}><PageInner /></Suspense>;
}
