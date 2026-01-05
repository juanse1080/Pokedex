import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useFilteredPokemon } from "@/hooks/useFilteredPokemon";
import { useInfinitePokemonListRest } from "@/hooks/useInfinitePokemonListRest";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { usePokemonListFilters } from "@/hooks/usePokemonListFilters";
import { PokemonListContent } from "@/organisms/PokemonListContent";
import { PokemonListFilter } from "@/organisms/PokemonListFilter";
import { PokemonListTemplate } from "@/templates/PokemonListTemplate";

const LIMIT = 50;

export const PokemonListRestPage: React.FC = () => {
  const { searchQuery, sortBy, handleSearch, handleSort } =
    usePokemonListFilters();

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

  const {
    loading,
    hasMore,
    loadMore,
    items: pokemons,
  } = useInfinitePokemonListRest({
    limit: LIMIT,
  });

  const { filteredItems: filteredPokemons } = useFilteredPokemon(pokemons, {
    sortKey: sortBy,
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
      />
      <PokemonListContent
        limit={LIMIT}
        loading={loading}
        sentinelRef={sentinelRef}
        pokemons={filteredPokemons}
      />
    </PokemonListTemplate>
  );
};
