"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "@/components/link";
import { useTranslation } from "@/services/i18n/client";
import {
  useGetProvincesService,
  useGetRegenciesService,
} from "../services/region-api";

const PAGE_SIZE = 50;

type PagePayload = {
  data: unknown[];
  hasNextPage: boolean;
};

function isPagePayload(value: unknown): value is PagePayload {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.data) &&
    typeof candidate.hasNextPage === "boolean"
  );
}

async function countAllPages(
  fetchPage: (page: number) => Promise<unknown>
): Promise<number> {
  let page = 1;
  let total = 0;

  while (true) {
    const response = await fetchPage(page);
    if (typeof response !== "object" || response === null) {
      throw new Error("Unexpected Region pagination response");
    }

    const payload = (response as Record<string, unknown>).data;
    if (!isPagePayload(payload)) {
      throw new Error("Unexpected Region pagination response");
    }

    total += payload.data.length;
    if (!payload.hasNextPage || payload.data.length === 0) return total;
    page += 1;
  }
}

function RegionMetric({
  value,
  isLoading,
  isError,
  href,
}: {
  value?: number;
  isLoading: boolean;
  isError: boolean;
  href: string;
}) {
  const { t } = useTranslation("module-region");

  return (
    <Link
      href={href}
      className="block rounded-xl border bg-card p-5 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <p className="mt-2 text-3xl font-semibold tabular-nums">
        {isLoading ? "…" : isError ? "—" : (value ?? 0).toLocaleString()}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        {isError ? t("dashboard.load_error") : t("dashboard.open_module")}
      </p>
    </Link>
  );
}

export function ProvinceCountWidget() {
  const service = useGetProvincesService();
  const query = useQuery({
    queryKey: ["region", "dashboard", "province-count"],
    queryFn: () =>
      countAllPages((page) => service({ page, limit: PAGE_SIZE })),
    staleTime: 60_000,
  });

  return (
    <RegionMetric
      value={query.data}
      isLoading={query.isLoading}
      isError={query.isError}
      href="/admin/region"
    />
  );
}

export function RegencyCountWidget() {
  const service = useGetRegenciesService();
  const query = useQuery({
    queryKey: ["region", "dashboard", "regency-count"],
    queryFn: () =>
      countAllPages((page) => service({ page, limit: PAGE_SIZE })),
    staleTime: 60_000,
  });

  return (
    <RegionMetric
      value={query.data}
      isLoading={query.isLoading}
      isError={query.isError}
      href="/admin/region"
    />
  );
}
