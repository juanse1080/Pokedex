import type { FavoritePokemon } from "@/graphql/types";

const FAVORITES_KEY = 'pokedex_favorites';

export const getFavorites = (): FavoritePokemon[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveFavorites = (favorites: FavoritePokemon[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

export const addFavorite = (pokemon: FavoritePokemon): void => {
  const favorites = getFavorites();
  if (!favorites.some((fav) => fav.id === pokemon.id)) {
    saveFavorites([...favorites, pokemon]);
  }
};

export const removeFavorite = (id: number): void => {
  const favorites = getFavorites();
  saveFavorites(favorites.filter((fav) => fav.id !== id));
};

export const isFavorite = (id: number): boolean => {
  return getFavorites().some((fav) => fav.id === id);
};

