import { useState, useCallback, useMemo, type ReactNode } from "react";
import { getFavorites, saveFavorites } from "@/utils/storage";
import { FavoritesContext } from "./favoritesContext";
import type { FavoritePokemon } from "@/graphql/types";

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>(() =>
    getFavorites()
  );

  const toggleFavorite = useCallback((pokemon: FavoritePokemon) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((fav) => fav.id === pokemon.id);
      const newFavorites = isAlreadyFavorite
        ? prev.filter((fav) => fav.id !== pokemon.id)
        : [...prev, pokemon];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (id: number) => {
      return favorites.some((fav) => fav.id === id);
    },
    [favorites]
  );

  const value = useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite,
    }),
    [favorites, toggleFavorite, isFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
