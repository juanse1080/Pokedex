import { Select } from "@/atoms/Select";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useInfinitePokemonList } from "@/hooks/useInfinitePokemonList";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { usePokemonListFilters } from "@/hooks/usePokemonListFilters";
import { usePokemonTypes } from "@/hooks/usePokemonTypes";
import { PokemonListContent } from "@/organisms/PokemonListContent";
import { PokemonListFilter } from "@/organisms/PokemonListFilter";
import { PokemonListTemplate } from "@/templates/PokemonListTemplate";
import { useMemo } from "react";

const LIMIT = 50;

export const PokemonListPage: React.FC = () => {
  const { searchQuery, sortBy, type, handleSearch, handleSort, handleType } =
    usePokemonListFilters();

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);
  const { types, loading: loadingTypes } = usePokemonTypes();

  const allTypes = useMemo(
    () => [
      { label: "Todos los tipos", value: "all" },
      ...types.map((type) => ({ label: type.name, value: type.name })),
    ],
    [types]
  );

  const {
    error,
    loading,
    hasMore,
    loadMore,
    items: pokemons,
  } = useInfinitePokemonList({
    type,
    limit: LIMIT,
    orderBy: sortBy,
    q: debouncedSearchQuery,
  });

  const sentinelRef = useInfiniteScroll(hasMore, loadMore, {
    rootMargin: "200px",
  });

  return (
    <PokemonListTemplate>
      <PokemonListFilter
        searchQuery={searchQuery}
        sortBy={sortBy}
        handleSearch={handleSearch}
        handleSort={handleSort}
      >
        <Select
          value={type}
          options={allTypes}
          onChange={handleType}
          disabled={loadingTypes}
        />
      </PokemonListFilter>
      <PokemonListContent
        limit={LIMIT}
        error={!!error}
        loading={loading}
        pokemons={pokemons}
        sentinelRef={sentinelRef}
      />
    </PokemonListTemplate>
  );
};
