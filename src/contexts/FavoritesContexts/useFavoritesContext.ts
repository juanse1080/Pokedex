import { useContext } from "react";
import { FavoritesContext } from "./favoritesContext";

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error(
      "useFavoritesContext debe ser usado dentro de FavoritesProvider"
    );
  }
  return context;
};
