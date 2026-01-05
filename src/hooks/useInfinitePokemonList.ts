import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { GET_POKEMON_LIST } from "@/graphql/queries/pokemonList.query";
import type {
  PokemonListItem,
  PokemonListResponse,
  PokemonOrderBy,
} from "@/graphql/types";

export interface UseInfinitePokemonListOptions {
  q?: string;
  type?: string;
  limit?: number;
  orderBy?: PokemonOrderBy;
}

const DEFAULT_LIMIT = 20;

export function useInfinitePokemonList({
  q,
  type,
  limit: limitParam,
  orderBy: orderByParam,
}: Readonly<UseInfinitePokemonListOptions>) {
  const limit = limitParam ?? DEFAULT_LIMIT;

  const orderBy = useMemo(() => {
    if (!orderByParam) return [{ name: "asc" }] as const;
    return [{ [orderByParam]: "asc" }] as const;
  }, [orderByParam]);

  const typeFilter = useMemo(() => {
    if (!type || type === "all") return {};
    return { pokemontypes: { type: { name: { _eq: type } } } };
  }, [type]);

  const qFilter = useMemo(() => {
    if (!q || q.length < 3) return {};
    return { name: { _ilike: `%${q}%` } };
  }, [q]);

  const where = useMemo(() => {
    return { ...qFilter, ...typeFilter };
  }, [qFilter, typeFilter]);

  const { data, loading, error, fetchMore, networkStatus } =
    useQuery<PokemonListResponse>(GET_POKEMON_LIST, {
      variables: {
        limit,
        where,
        offset: 0,
        orderBy,
      },
      notifyOnNetworkStatusChange: true,
    });

  const items: PokemonListItem[] = data?.pokemon ?? [];
  const totalCount = data?.pokemon_aggregate?.aggregate?.count ?? 0;

  const isFetchingMore = networkStatus === 3;
  const hasMore = items.length < totalCount;
  const canLoadMore = hasMore && !loading && !isFetchingMore;

  const loadMore = async () => {
    if (!canLoadMore) return;

    await fetchMore({
      variables: {
        limit,
        where,
        orderBy,
        offset: items.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        const next = fetchMoreResult?.pokemon ?? [];
        if (next.length === 0) return prev;

        const seen = new Set(prev.pokemon.map((p: PokemonListItem) => p.id));
        const merged = [
          ...prev.pokemon,
          ...next.filter((p) => !seen.has(p.id)),
        ];

        return { ...prev, pokemon: merged };
      },
    });
  };

  return {
    items,
    totalCount,
    loading,
    error,
    hasMore,
    isFetchingMore,
    loadMore,
  };
}
