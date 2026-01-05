import { useFavoritesContext } from "@/contexts/FavoritesContexts";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useFilteredPokemon } from "@/hooks/useFilteredPokemon";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { usePokemonListFilters } from "@/hooks/usePokemonListFilters";
import { PokemonListContent } from "@/organisms/PokemonListContent";
import { PokemonListFilter } from "@/organisms/PokemonListFilter";
import { PokemonListTemplate } from "@/templates/PokemonListTemplate";

const LIMIT = 50;

export const PokemonListFavoritesPage: React.FC = () => {
  const { searchQuery, sortBy, handleSearch, handleSort } =
    usePokemonListFilters();

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

  const { favorites } = useFavoritesContext();
  const { filteredItems: filteredFavorites } = useFilteredPokemon(favorites, {
    sortKey: sortBy,
    q: debouncedSearchQuery,
  });

  const sentinelRef = useInfiniteScroll(false, () => {}, {
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
        loading={false}
        pokemons={filteredFavorites}
        sentinelRef={sentinelRef}
      />
    </PokemonListTemplate>
  );
};
