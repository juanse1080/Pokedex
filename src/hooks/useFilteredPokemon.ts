import { useMemo } from "react";
import type { PokemonListItem, PokemonOrderBy } from "@/graphql/types";

export type SortKey = PokemonOrderBy;

export interface UseFilteredPokemonOptions {
  q: string;
  sortKey: PokemonOrderBy;
}

export function useFilteredPokemon(
  items: PokemonListItem[],
  { q, sortKey }: UseFilteredPokemonOptions
) {
  const value = q.trim();
  const hasSpecial = /[^a-z0-9\s-]/i.test(value);
  const isValid = value.length === 0 || (value.length >= 3 && !hasSpecial);

  const filteredItems = useMemo(() => {
    let list = items;

    if (value.length >= 3) {
      const qLower = value.toLowerCase();
      list = list.filter((p) => p.name.includes(qLower));
    }

    const sorted = [...list].sort((a, b) =>
      sortKey === "id" ? a.id - b.id : a.name.localeCompare(b.name)
    );

    return sorted;
  }, [items, value, sortKey]);

  return { filteredItems, isValid };
}
