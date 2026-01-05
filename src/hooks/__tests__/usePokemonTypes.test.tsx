import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import type { MockedResponse } from "@apollo/client/testing";
import { usePokemonTypes } from "../usePokemonTypes";
import { GET_TYPES } from "@/graphql/queries/pokemonTypeList.query";
import type { PokemonTypeResponse } from "@/graphql/types";
import { makePokemonType } from "@/test/factories";

const createWrapper = (mocks: MockedResponse<PokemonTypeResponse>[]) => {
  return ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
};

describe("usePokemonTypes", () => {
  it("should return loading state initially", () => {
    const mocks = [
      {
        request: {
          query: GET_TYPES,
        },
        delay: 1000,
        result: {
          data: {
            type: [],
          },
        },
      },
    ];

    const { result } = renderHook(() => usePokemonTypes(), {
      wrapper: createWrapper(mocks),
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.types).toEqual([]);
  });

  it("should return types on success", async () => {
    const types = [
      makePokemonType({ id: 1, name: "fire" }),
      makePokemonType({ id: 2, name: "water" }),
      makePokemonType({ id: 3, name: "grass" }),
    ];

    const mocks = [
      {
        request: {
          query: GET_TYPES,
        },
        result: {
          data: {
            type: types,
          },
        },
      },
    ];

    const { result } = renderHook(() => usePokemonTypes(), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.types).toHaveLength(3);
    expect(result.current.types[0].name).toBe("fire");
    expect(result.current.types[1].name).toBe("water");
    expect(result.current.types[2].name).toBe("grass");
    expect(result.current.error).toBeUndefined();
  });

  it("should return error state on error", async () => {
    const mocks = [
      {
        request: {
          query: GET_TYPES,
        },
        error: new Error("Network error"),
      },
    ];

    const { result } = renderHook(() => usePokemonTypes(), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.types).toEqual([]);
  });

  it("should return empty array when no types", async () => {
    const mocks = [
      {
        request: {
          query: GET_TYPES,
        },
        result: {
          data: {
            type: [],
          },
        },
      },
    ];

    const { result } = renderHook(() => usePokemonTypes(), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.types).toEqual([]);
  });
});

