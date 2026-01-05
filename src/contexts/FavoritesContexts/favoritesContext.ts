import { createContext } from "react";
import type { FavoritePokemon } from "@/graphql/types";

export interface FavoritesContextType {
  favorites: FavoritePokemon[];
  toggleFavorite: (pokemon: FavoritePokemon) => void;
  isFavorite: (id: number) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);
