import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import type { MockedResponse } from "@apollo/client/testing";
import { useInfinitePokemonList } from "../useInfinitePokemonList";
import {
  createPokemonListMock,
  createPokemonListLoadingMock,
  createPokemonListErrorMock,
} from "@/test/mocks";
import type { PokemonListResponse } from "@/graphql/types";
import { makePokemonListItem, SAMPLE_POKEMON_LIST } from "@/test/factories";

const createWrapper = (mocks: MockedResponse<PokemonListResponse>[]) => {
  return ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
};

describe("useInfinitePokemonList", () => {
  it("should return loading state initially", () => {
    const mocks = [createPokemonListLoadingMock()];
    const { result } = renderHook(() => useInfinitePokemonList({}), {
      wrapper: createWrapper(mocks),
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.items).toEqual([]);
  });

  it("should return pokemon list on success", async () => {
    const mocks = [createPokemonListMock(SAMPLE_POKEMON_LIST, 100)];
    const { result } = renderHook(() => useInfinitePokemonList({}), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(5);
    expect(result.current.totalCount).toBe(100);
    expect(result.current.hasMore).toBe(true);
  });

  it("should return error state on error", async () => {
    const mocks = [createPokemonListErrorMock("Network error")];
    const { result } = renderHook(() => useInfinitePokemonList({}), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.items).toEqual([]);
  });

  it("should use default limit when not provided", async () => {
    const mocks = [createPokemonListMock(SAMPLE_POKEMON_LIST, 100)];
    const { result } = renderHook(() => useInfinitePokemonList({}), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items.length).toBeLessThanOrEqual(20);
  });

  it("should use custom limit", async () => {
    const mocks = [
      createPokemonListMock(SAMPLE_POKEMON_LIST.slice(0, 10), 100, {
        limit: 10,
      }),
    ];
    const { result } = renderHook(() => useInfinitePokemonList({ limit: 10 }), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items.length).toBeLessThanOrEqual(10);
  });

  it("should filter by type", async () => {
    const firePokemon = [makePokemonListItem({ id: 4, name: "charmander" })];
    const mocks = [
      createPokemonListMock(firePokemon, 10, {
        where: { pokemontypes: { type: { name: { _eq: "fire" } } } },
      }),
    ];
    const { result } = renderHook(
      () => useInfinitePokemonList({ type: "fire" }),
      {
        wrapper: createWrapper(mocks),
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe("charmander");
  });

  it("should not filter when type is 'all'", async () => {
    const mocks = [createPokemonListMock(SAMPLE_POKEMON_LIST, 100)];
    const { result } = renderHook(
      () => useInfinitePokemonList({ type: "all" }),
      {
        wrapper: createWrapper(mocks),
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items.length).toBeGreaterThan(0);
  });

  it("should filter by search query when length >= 3", async () => {
    const filtered = [makePokemonListItem({ id: 1, name: "bulbasaur" })];
    const mocks = [
      createPokemonListMock(filtered, 1, {
        where: { name: { _ilike: "%bul%" } },
      }),
    ];
    const { result } = renderHook(() => useInfinitePokemonList({ q: "bul" }), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe("bulbasaur");
  });

  it("should not filter by search query when length < 3", async () => {
    const mocks = [createPokemonListMock(SAMPLE_POKEMON_LIST, 100)];
    const { result } = renderHook(() => useInfinitePokemonList({ q: "bu" }), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items.length).toBeGreaterThan(0);
  });

  it("should use default orderBy (name) when not provided", async () => {
    const mocks = [
      createPokemonListMock(SAMPLE_POKEMON_LIST, 100, {
        orderBy: [{ name: "asc" }],
      }),
    ];
    const { result } = renderHook(() => useInfinitePokemonList({}), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items.length).toBeGreaterThan(0);
  });

  it("should use custom orderBy", async () => {
    const mocks = [
      createPokemonListMock(SAMPLE_POKEMON_LIST, 100, {
        orderBy: [{ id: "asc" }],
      }),
    ];
    const { result } = renderHook(
      () => useInfinitePokemonList({ orderBy: "id" }),
      {
        wrapper: createWrapper(mocks),
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items.length).toBeGreaterThan(0);
  });

  it("should indicate hasMore when items < totalCount", async () => {
    const mocks = [createPokemonListMock(SAMPLE_POKEMON_LIST, 100)];
    const { result } = renderHook(() => useInfinitePokemonList({}), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasMore).toBe(true);
  });

  it("should indicate no more when items >= totalCount", async () => {
    const mocks = [createPokemonListMock(SAMPLE_POKEMON_LIST, 5)];
    const { result } = renderHook(() => useInfinitePokemonList({}), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);
  });

  it("should have loadMore function available", async () => {
    const mocks = [createPokemonListMock(SAMPLE_POKEMON_LIST, 100)];
    const { result } = renderHook(() => useInfinitePokemonList({}), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.loadMore).toBe("function");
    expect(result.current.hasMore).toBe(true);
  });
});
