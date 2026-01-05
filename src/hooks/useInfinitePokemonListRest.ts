import type { PokemonListItem } from "@/graphql/types";
import { FetcherError, fetcher } from "@/utils/fetcher";
import { useCallback, useEffect, useRef, useState } from "react";

type RestListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
};

export interface UseInfinitePokemonListRESTOptions {
  limit?: number;
}

const API_BASE = import.meta.env.VITE_POKEMON_REST_URI;

const DEFAULT_LIMIT = 20;

const extractIdFromUrl = (url: string) => {
  const parts = url.split("/").filter(Boolean);
  const id = Number(parts.at(-1));
  return Number.isFinite(id) ? id : -1;
};

export function useInfinitePokemonListRest({
  limit: limitParam,
}: Readonly<UseInfinitePokemonListRESTOptions>) {
  const limit = limitParam ?? DEFAULT_LIMIT;

  const [items, setItems] = useState<PokemonListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<FetcherError | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(
    async (url: string, mode: "initial" | "more") => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (mode === "initial") {
        setLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      setError(null);

      try {
        const data = await fetcher<RestListResponse>(url, {
          signal: controller.signal,
        });

        setTotalCount(data.count);
        setNextUrl(data.next);

        const pageItems: PokemonListItem[] = data.results.map((r) => ({
          name: r.name,
          url: r.url,
          id: extractIdFromUrl(r.url),
        }));

        setItems((prev) => {
          const seen = new Set(prev.map((p) => p.id));
          return [...prev, ...pageItems.filter((p) => !seen.has(p.id))];
        });
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
        setError(e as FetcherError);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    },
    []
  );

  // initial load
  useEffect(() => {
    const url = new URL(`${API_BASE}/pokemon`);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", "0");
    void fetchPage(url.toString(), "initial");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const hasMore = nextUrl !== null;
  const loadMore = useCallback(async () => {
    if (!nextUrl || loading || isFetchingMore) return;
    await fetchPage(nextUrl, "more");
  }, [nextUrl, loading, isFetchingMore, fetchPage]);

  return {
    items,
    totalCount,
    nextUrl,
    loading,
    isFetchingMore,
    error,
    hasMore,
    loadMore,
  };
}
