import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { FavoritesProvider } from "../FavoritesProvider";
import { useFavoritesContext } from "../useFavoritesContext";
import { makeFavoritePokemon } from "@/test/factories";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

describe("FavoritesProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with empty favorites", () => {
    const { result } = renderHook(() => useFavoritesContext(), { wrapper });
    expect(result.current.favorites).toEqual([]);
  });

  it("should initialize with favorites from localStorage", () => {
    const favorites = [
      makeFavoritePokemon({ id: 1, name: "bulbasaur" }),
      makeFavoritePokemon({ id: 2, name: "ivysaur" }),
    ];
    localStorage.setItem("pokedex_favorites", JSON.stringify(favorites));

    const { result } = renderHook(() => useFavoritesContext(), { wrapper });
    expect(result.current.favorites).toEqual(favorites);
  });

  it("should toggle favorite - add", () => {
    const { result } = renderHook(() => useFavoritesContext(), { wrapper });
    const pokemon = makeFavoritePokemon({ id: 1, name: "bulbasaur" });

    act(() => {
      result.current.toggleFavorite(pokemon);
    });

    expect(result.current.favorites).toEqual([pokemon]);
    expect(result.current.isFavorite(1)).toBe(true);
  });

  it("should toggle favorite - remove", () => {
    const pokemon = makeFavoritePokemon({ id: 1, name: "bulbasaur" });
    localStorage.setItem("pokedex_favorites", JSON.stringify([pokemon]));

    const { result } = renderHook(() => useFavoritesContext(), { wrapper });

    act(() => {
      result.current.toggleFavorite(pokemon);
    });

    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it("should persist favorites to localStorage", () => {
    const { result } = renderHook(() => useFavoritesContext(), { wrapper });
    const pokemon = makeFavoritePokemon({ id: 1, name: "bulbasaur" });

    act(() => {
      result.current.toggleFavorite(pokemon);
    });

    const stored = localStorage.getItem("pokedex_favorites");
    expect(stored).toBe(JSON.stringify([pokemon]));
  });

  it("should not add duplicate favorites", () => {
    const { result } = renderHook(() => useFavoritesContext(), { wrapper });
    const pokemon = makeFavoritePokemon({ id: 1, name: "bulbasaur" });

    act(() => {
      result.current.toggleFavorite(pokemon);
    });
    expect(result.current.favorites).toEqual([pokemon]);

    act(() => {
      result.current.toggleFavorite(pokemon);
    });
    expect(result.current.favorites).toEqual([]);
  });

  it("should handle multiple favorites", () => {
    const { result } = renderHook(() => useFavoritesContext(), { wrapper });
    const pokemon1 = makeFavoritePokemon({ id: 1, name: "bulbasaur" });
    const pokemon2 = makeFavoritePokemon({ id: 2, name: "ivysaur" });

    act(() => {
      result.current.toggleFavorite(pokemon1);
      result.current.toggleFavorite(pokemon2);
    });

    expect(result.current.favorites).toHaveLength(2);
    expect(result.current.isFavorite(1)).toBe(true);
    expect(result.current.isFavorite(2)).toBe(true);
  });

  it("should check if pokemon is favorite correctly", () => {
    const pokemon = makeFavoritePokemon({ id: 1, name: "bulbasaur" });
    localStorage.setItem("pokedex_favorites", JSON.stringify([pokemon]));

    const { result } = renderHook(() => useFavoritesContext(), { wrapper });

    expect(result.current.isFavorite(1)).toBe(true);
    expect(result.current.isFavorite(2)).toBe(false);
  });
});
