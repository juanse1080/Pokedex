import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFilteredPokemon } from "../useFilteredPokemon";
import { SAMPLE_POKEMON_LIST } from "@/test/factories";

describe("useFilteredPokemon", () => {
  describe("validation", () => {
    it("should be valid when query is empty", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, { q: "", sortKey: "name" })
      );
      expect(result.current.isValid).toBe(true);
    });

    it("should be invalid when query is shorter than 3 characters", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, { q: "ab", sortKey: "name" })
      );
      expect(result.current.isValid).toBe(false);
    });

    it("should be valid when query is exactly 3 characters", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, { q: "bul", sortKey: "name" })
      );
      expect(result.current.isValid).toBe(true);
    });

    it("should be invalid when query contains special characters", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, {
          q: "bulb@",
          sortKey: "name",
        })
      );
      expect(result.current.isValid).toBe(false);
    });

    it("should be invalid when query contains special characters like @", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, {
          q: "bulb@aur",
          sortKey: "name",
        })
      );
      expect(result.current.isValid).toBe(false);
    });

    it("should be invalid when query contains special characters like !", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, {
          q: "bulbasaur!",
          sortKey: "name",
        })
      );
      expect(result.current.isValid).toBe(false);
    });

    it("should be valid when query contains only letters, numbers, spaces and hyphens", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, {
          q: "bulbasaur-123",
          sortKey: "name",
        })
      );
      expect(result.current.isValid).toBe(true);
    });

    it("should trim whitespace from query", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, {
          q: "  bulbasaur  ",
          sortKey: "name",
        })
      );
      expect(result.current.isValid).toBe(true);
      expect(result.current.filteredItems.length).toBeGreaterThan(0);
    });
  });

  describe("filtering", () => {
    it("should return all items when query is empty", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, { q: "", sortKey: "name" })
      );
      expect(result.current.filteredItems).toHaveLength(
        SAMPLE_POKEMON_LIST.length
      );
    });

    it("should filter by name (case-insensitive)", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, { q: "BULB", sortKey: "name" })
      );
      expect(result.current.filteredItems).toHaveLength(1);
      expect(result.current.filteredItems[0].name).toBe("bulbasaur");
    });

    it("should filter by partial match", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, { q: "char", sortKey: "name" })
      );
      expect(result.current.filteredItems).toHaveLength(2);
      expect(result.current.filteredItems.map((p) => p.name)).toEqual([
        "charmander",
        "charmeleon",
      ]);
    });

    it("should return empty array when no matches", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, {
          q: "pikachu",
          sortKey: "name",
        })
      );
      expect(result.current.filteredItems).toHaveLength(0);
    });

    it("should not filter when query is shorter than 3 characters", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, { q: "bu", sortKey: "name" })
      );
      expect(result.current.filteredItems).toHaveLength(
        SAMPLE_POKEMON_LIST.length
      );
    });
  });

  describe("sorting", () => {
    it("should sort by name alphabetically", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, { q: "", sortKey: "name" })
      );
      const names = result.current.filteredItems.map((p) => p.name);
      expect(names).toEqual([
        "bulbasaur",
        "charmander",
        "charmeleon",
        "ivysaur",
        "venusaur",
      ]);
    });

    it("should sort by id numerically", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, { q: "", sortKey: "id" })
      );
      const ids = result.current.filteredItems.map((p) => p.id);
      expect(ids).toEqual([1, 2, 3, 4, 5]);
    });

    it("should maintain sort order after filtering", () => {
      const { result } = renderHook(() =>
        useFilteredPokemon(SAMPLE_POKEMON_LIST, { q: "char", sortKey: "name" })
      );
      const names = result.current.filteredItems.map((p) => p.name);
      expect(names).toEqual(["charmander", "charmeleon"]);
    });
  });
});

