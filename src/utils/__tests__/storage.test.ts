import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getFavorites,
  saveFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from "../storage";
import { makeFavoritePokemon } from "@/test/factories";

const FAVORITES_KEY = "pokedex_favorites";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("getFavorites", () => {
    it("should return empty array when localStorage is empty", () => {
      expect(getFavorites()).toEqual([]);
    });

    it("should return favorites from localStorage", () => {
      const favorites = [makeFavoritePokemon({ id: 1, name: "bulbasaur" })];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      expect(getFavorites()).toEqual(favorites);
    });

    it("should return empty array when JSON is corrupted", () => {
      localStorage.setItem(FAVORITES_KEY, "invalid json{");
      expect(getFavorites()).toEqual([]);
    });

    it("should return empty array when localStorage throws", () => {
      const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
      getItemSpy.mockImplementation(() => {
        throw new Error("Storage error");
      });
      expect(getFavorites()).toEqual([]);
      getItemSpy.mockRestore();
    });
  });

  describe("saveFavorites", () => {
    it("should save favorites to localStorage", () => {
      const favorites = [makeFavoritePokemon({ id: 1, name: "bulbasaur" })];
      saveFavorites(favorites);
      const stored = localStorage.getItem(FAVORITES_KEY);
      expect(stored).toBe(JSON.stringify(favorites));
    });

    it("should handle errors gracefully", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
      setItemSpy.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      const favorites = [makeFavoritePokemon({ id: 1, name: "bulbasaur" })];
      expect(() => saveFavorites(favorites)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      setItemSpy.mockRestore();
    });
  });

  describe("addFavorite", () => {
    it("should add favorite when not already present", () => {
      const pokemon = makeFavoritePokemon({ id: 1, name: "bulbasaur" });
      addFavorite(pokemon);
      expect(getFavorites()).toEqual([pokemon]);
    });

    it("should not add duplicate favorites", () => {
      const pokemon = makeFavoritePokemon({ id: 1, name: "bulbasaur" });
      addFavorite(pokemon);
      addFavorite(pokemon);
      expect(getFavorites()).toEqual([pokemon]);
    });

    it("should add multiple different favorites", () => {
      const pokemon1 = makeFavoritePokemon({ id: 1, name: "bulbasaur" });
      const pokemon2 = makeFavoritePokemon({ id: 2, name: "ivysaur" });
      addFavorite(pokemon1);
      addFavorite(pokemon2);
      expect(getFavorites()).toEqual([pokemon1, pokemon2]);
    });
  });

  describe("removeFavorite", () => {
    it("should remove favorite by id", () => {
      const pokemon1 = makeFavoritePokemon({ id: 1, name: "bulbasaur" });
      const pokemon2 = makeFavoritePokemon({ id: 2, name: "ivysaur" });
      addFavorite(pokemon1);
      addFavorite(pokemon2);
      removeFavorite(1);
      expect(getFavorites()).toEqual([pokemon2]);
    });

    it("should do nothing when id does not exist", () => {
      const pokemon = makeFavoritePokemon({ id: 1, name: "bulbasaur" });
      addFavorite(pokemon);
      removeFavorite(999);
      expect(getFavorites()).toEqual([pokemon]);
    });

    it("should handle empty favorites list", () => {
      expect(() => removeFavorite(1)).not.toThrow();
      expect(getFavorites()).toEqual([]);
    });
  });

  describe("isFavorite", () => {
    it("should return true when pokemon is favorite", () => {
      const pokemon = makeFavoritePokemon({ id: 1, name: "bulbasaur" });
      addFavorite(pokemon);
      expect(isFavorite(1)).toBe(true);
    });

    it("should return false when pokemon is not favorite", () => {
      expect(isFavorite(1)).toBe(false);
    });

    it("should return false after removing favorite", () => {
      const pokemon = makeFavoritePokemon({ id: 1, name: "bulbasaur" });
      addFavorite(pokemon);
      removeFavorite(1);
      expect(isFavorite(1)).toBe(false);
    });
  });
});

