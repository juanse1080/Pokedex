import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import type { MockedResponse } from "@apollo/client/testing";
import { usePokemonDetail } from "../usePokemonDetail";
import {
  createPokemonDetailMock,
  createPokemonDetailLoadingMock,
  createPokemonDetailErrorMock,
  createPokemonDetailNotFoundMock,
} from "@/test/mocks";
import type { PokemonDetailResponse } from "@/graphql/types";

const createWrapper = (mocks: MockedResponse<PokemonDetailResponse>[]) => {
  return ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
};

describe("usePokemonDetail", () => {
  it("should return loading state initially", () => {
    const mocks = [createPokemonDetailLoadingMock(1)];
    const { result } = renderHook(() => usePokemonDetail("1"), {
      wrapper: createWrapper(mocks),
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.pokemon).toBeNull();
  });

  it("should return pokemon data on success", async () => {
    const mocks = [createPokemonDetailMock(1, { name: "bulbasaur" })];

    const { result } = renderHook(() => usePokemonDetail("1"), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pokemon).toBeTruthy();
    expect(result.current.pokemon?.id).toBe(1);
    expect(result.current.pokemon?.name).toBe("bulbasaur");
    expect(result.current.error).toBeUndefined();
  });

  it("should return error state on error", async () => {
    const mocks = [createPokemonDetailErrorMock(1, "Network error")];

    const { result } = renderHook(() => usePokemonDetail("1"), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.pokemon).toBeNull();
  });

  it("should return null pokemon when not found", async () => {
    const mocks = [createPokemonDetailNotFoundMock(999)];

    const { result } = renderHook(() => usePokemonDetail("999"), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pokemon).toBeNull();
    expect(result.current.error).toBeUndefined();
  });

  it("should skip query when id is undefined", () => {
    const mocks = [createPokemonDetailMock(1)];

    const { result } = renderHook(() => usePokemonDetail(undefined), {
      wrapper: createWrapper(mocks),
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.pokemon).toBeNull();
  });

  it("should parse string id to number", async () => {
    const mocks = [createPokemonDetailMock(25, { name: "pikachu" })];

    const { result } = renderHook(() => usePokemonDetail("25"), {
      wrapper: createWrapper(mocks),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pokemon?.id).toBe(25);
  });
});

