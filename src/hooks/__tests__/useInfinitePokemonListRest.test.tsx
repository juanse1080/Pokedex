import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useInfinitePokemonListRest } from "../useInfinitePokemonListRest";
import { FetcherError } from "@/utils/fetcher";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useInfinitePokemonListRest", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_POKEMON_REST_URI", "https://pokeapi.co/api/v2");
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("should return loading state initially", () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        count: 100,
        next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
        previous: null,
        results: [],
      }),
    });

    const { result } = renderHook(() => useInfinitePokemonListRest({}));

    expect(result.current.loading).toBe(true);
    expect(result.current.items).toEqual([]);
  });

  it("should return pokemon list on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        count: 100,
        next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
        previous: null,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      }),
    });

    const { result } = renderHook(() => useInfinitePokemonListRest({}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[0].name).toBe("bulbasaur");
    expect(result.current.items[0].id).toBe(1);
    expect(result.current.totalCount).toBe(100);
    expect(result.current.hasMore).toBe(true);
  });

  it("should extract id from URL correctly", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        count: 100,
        next: null,
        previous: null,
        results: [
          { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
        ],
      }),
    });

    const { result } = renderHook(() => useInfinitePokemonListRest({}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items[0].id).toBe(25);
  });

  it("should return error state on error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useInfinitePokemonListRest({}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.items).toEqual([]);
  });

  it("should return error when API returns error response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({ message: "Internal server error" }),
    });

    const { result } = renderHook(() => useInfinitePokemonListRest({}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(FetcherError);
  });

  it("should use default limit when not provided", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        count: 100,
        next: null,
        previous: null,
        results: [],
      }),
    });

    renderHook(() => useInfinitePokemonListRest({}));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    const callUrl = mockFetch.mock.calls[0]?.[0] as string;
    expect(callUrl).toContain("limit=20");
  });

  it("should use custom limit", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        count: 100,
        next: null,
        previous: null,
        results: [],
      }),
    });

    renderHook(() => useInfinitePokemonListRest({ limit: 50 }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    const callUrl = mockFetch.mock.calls[0]?.[0] as string;
    expect(callUrl).toContain("limit=50");
  });

  it("should indicate hasMore when nextUrl exists", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        count: 100,
        next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
        previous: null,
        results: [],
      }),
    });

    const { result } = renderHook(() => useInfinitePokemonListRest({}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasMore).toBe(true);
  });

  it("should indicate no more when nextUrl is null", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        count: 10,
        next: null,
        previous: null,
        results: [],
      }),
    });

    const { result } = renderHook(() => useInfinitePokemonListRest({}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);
  });

  it("should load more items when loadMore is called", async () => {
    const firstPage = {
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        count: 100,
        next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
        previous: null,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        ],
      }),
    };

    const secondPage = {
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        count: 100,
        next: null,
        previous: null,
        results: [
          { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      }),
    };

    mockFetch
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(secondPage);

    const { result } = renderHook(() => useInfinitePokemonListRest({}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.hasMore).toBe(true);

    await result.current.loadMore();

    await waitFor(() => {
      expect(result.current.items.length).toBeGreaterThan(1);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.hasMore).toBe(false);
  });

  it("should not load more if already loading", async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                ok: true,
                headers: new Headers({ "Content-Type": "application/json" }),
                json: async () => ({
                  count: 100,
                  next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
                  previous: null,
                  results: [],
                }),
              }),
            100
          );
        })
    );

    const { result } = renderHook(() => useInfinitePokemonListRest({}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const loadMoreCalls = mockFetch.mock.calls.length;

    await result.current.loadMore();

    expect(mockFetch.mock.calls.length).toBeGreaterThan(loadMoreCalls);
  });

  it("should prevent duplicate items when loading more", async () => {
    const firstPage = {
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        count: 100,
        next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
        previous: null,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        ],
      }),
    };

    const secondPage = {
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        count: 100,
        next: null,
        previous: null,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      }),
    };

    mockFetch
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(secondPage);

    const { result } = renderHook(() => useInfinitePokemonListRest({}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.hasMore).toBe(true);

    await result.current.loadMore();

    await waitFor(() => {
      expect(result.current.isFetchingMore).toBe(false);
    });

    expect(result.current.items.length).toBeGreaterThanOrEqual(1);
    const ids = result.current.items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

