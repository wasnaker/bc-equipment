"use client";

import { Suspense, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/services/i18n/client";
import {
  useCategoriesServerSide,
  useCategory,
  useDeleteCategory,
} from "../hooks/use-equipments";
import { useMasterDetail } from "@/core/master-detail/use-master-detail";
import { SmallTable, type SmallTableColumn, type DetailTab } from "@/components/small-table";
import { CategoryFormDialog } from "../components/category-form-dialog";
import { CategoryOverviewTab, CategoryEquipmentTab } from "../components/category-detail-tab";
import { Button } from "@/components/ui/button";
import PencilIcon from "lucide-react/dist/esm/icons/pencil";
import TrashIcon from "lucide-react/dist/esm/icons/trash";
import ArrowLeftIcon from "lucide-react/dist/esm/icons/arrow-left";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right";
import TagIcon from "lucide-react/dist/esm/icons/tag";
import type { Category } from "../types/equipment";

function PageInner() {
  const { t } = useTranslation("module-equipment");
  const qc = useQueryClient();
  const { selectedId, showDetail, select, close, toggle, afterSave } = useMasterDetail();
  const [refreshKey, setRefreshKey] = useState(0);
  const detailId = selectedId != null && /^\d+$/.test(String(selectedId)) ? Number(selectedId) : null;
  const { data: selectedCategory, isLoading: detailLoading } = useCategory(detailId);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  function openCreateDialog() { setEditItem(null); setFormOpen(true); }
  function openEditDialog(item: Category) { setEditItem(item); setFormOpen(true); }

  const deleteMutation = useDeleteCategory();
  async function handleDelete(id: Category["id"]) {
    if (!window.confirm(t("confirm.delete.message"))) return;
    await deleteMutation.mutateAsync({ id });
    if (String(selectedId) === String(id)) close();
    setRefreshKey(k => k + 1);
  }

  const { data: categories, total, limit, isLoading, isFetching, error, page, setPage, search, setSearch, sort, setSort } = useCategoriesServerSide();

  const columns: SmallTableColumn<Category>[] = useMemo(() => [
    { key: "id", label: "#", primary: true, render: item => <span className="font-mono text-muted-foreground">{String(item.id)}</span> },
    { key: "name", label: t("table.name"), primary: true, render: item => <span className="font-medium">{item.name}</span> },
    { key: "description", label: t("table.description"), render: item => <span className="text-muted-foreground">{item.description || "—"}</span> },
    { key: "isActive", label: t("table.status"), render: item => <span>{item.isActive ? t("status.active") : t("status.inactive")}</span> },
  ], [t]);

  const tabs: DetailTab[] = useMemo(() => [
    { slug: "overview", label: t("detail.overview"), position: 0 },
    { slug: "equipment", label: t("equipment.title"), position: 10 },
  ], [t]);

  const customTabBody = useMemo(() => ({
    overview: (item: Category) => <CategoryOverviewTab item={item} />,
    equipment: (item: Category) => <CategoryEquipmentTab item={item} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [refreshKey]);

  function toolbar(item: Category) {
    return <div className="flex items-center gap-2">
      <Button variant="outline" size="icon-sm" title={t("actions.edit")} onClick={() => openEditDialog(item)}><PencilIcon className="size-3.5" /></Button>
      <Button variant="outline" size="icon-sm" className="text-destructive hover:bg-destructive/10" title={t("actions.delete")} onClick={() => handleDelete(item.id)} disabled={deleteMutation.isPending}><TrashIcon className="size-3.5" /></Button>
      <Button variant="ghost" size="icon-sm" title={showDetail ? t("actions.collapse") : t("actions.expand")} onClick={toggle}>{showDetail ? <ArrowRightIcon className="size-3.5" /> : <ArrowLeftIcon className="size-3.5" />}</Button>
    </div>;
  }

  function renderHeader(item: Category) {
    return <div className="flex items-center gap-2"><TagIcon className="size-4 text-primary" /><span>{item.name}</span>{item.description && <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{item.description}</span>}</div>;
  }

  return <div className="page-content--wide">
    <div className="page-content--body">
      <div className="page-header--split">
        <div><h1 className="page-title">{t("categories_title")}</h1><p className="page-subtitle">{t("categories_subtitle")}</p></div>
        <div className="page-header__actions"><Button onClick={openCreateDialog}>{t("actions.create_category")}</Button></div>
      </div>
      <SmallTable<Category>
        items={categories} total={total} searchValue={search} onSearchChange={setSearch}
        searchPlaceholder={t("categories_search")} searchLabel={t("categories_search_label")}
        page={page} onPageChange={setPage} perPage={limit} sort={sort} onSortChange={setSort}
        columns={columns} selectedId={selectedId} onSelectId={select} getItemId={item => item.id}
        showDetail={showDetail} detailItem={selectedCategory ?? null} detailLoading={detailLoading}
        tabs={tabs} customTabBody={customTabBody} emptyText={t("categories_empty")}
        isLoading={isLoading} isFetching={isFetching} loadingText={t("table.loading")}
        error={error} errorText={t("table.error")} tabEmptyText={t("detail.empty")}
        paginationOfLabel={t("table.of")} previousPageLabel={t("actions.prev_page")}
        nextPageLabel={t("actions.next_page")} toolbar={toolbar} renderHeader={renderHeader}
        listHeader={showDetail ? <Button variant="outline" size="sm" onClick={close}>{t("actions.collapse")}</Button> : undefined}
      />
    </div>
    <CategoryFormDialog open={formOpen} onOpenChange={open => { setFormOpen(open); if (!open) setEditItem(null); }}
      editItem={editItem} subgroupId={editItem?.subgroupId ?? null}
      onSuccess={savedId => {
        qc.invalidateQueries({ queryKey: ["equipment", "categories"] });
        setRefreshKey(k => k + 1);
        afterSave(savedId);
      }} />
  </div>;
}

export function CategoriesPage() {
  return <Suspense fallback={<div className="p-8 text-muted-foreground">Loading…</div>}><PageInner /></Suspense>;
}
