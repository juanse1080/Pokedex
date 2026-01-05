import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { usePokemonListFilters } from "../usePokemonListFilters";

const wrapper = ({ children, initialEntries }: { children: React.ReactNode; initialEntries?: string[] }) => (
  <MemoryRouter initialEntries={initialEntries || ["/"]}>
    {children}
  </MemoryRouter>
);

describe("usePokemonListFilters", () => {
  it("should initialize with default values when no search params", () => {
    const { result } = renderHook(() => usePokemonListFilters(), {
      wrapper: ({ children }) => wrapper({ children }),
    });

    expect(result.current.type).toBe("all");
    expect(result.current.searchQuery).toBe("");
    expect(result.current.sortBy).toBe("name");
  });

  it("should initialize from search params", () => {
    const { result } = renderHook(() => usePokemonListFilters(), {
      wrapper: ({ children }) =>
        wrapper({
          children,
          initialEntries: ["/?type=fire&search=pikachu&sort=id"],
        }),
    });

    expect(result.current.type).toBe("fire");
    expect(result.current.searchQuery).toBe("pikachu");
    expect(result.current.sortBy).toBe("id");
  });

  it("should default to 'name' when invalid sort param", () => {
    const { result } = renderHook(() => usePokemonListFilters(), {
      wrapper: ({ children }) =>
        wrapper({
          children,
          initialEntries: ["/?sort=invalid"],
        }),
    });

    expect(result.current.sortBy).toBe("name");
  });

  it("should update search query and URL params", () => {
    const { result } = renderHook(() => usePokemonListFilters(), {
      wrapper: ({ children }) => wrapper({ children }),
    });

    act(() => {
      result.current.handleSearch("bulbasaur");
    });

    expect(result.current.searchQuery).toBe("bulbasaur");
  });

  it("should update sort and URL params", () => {
    const { result } = renderHook(() => usePokemonListFilters(), {
      wrapper: ({ children }) => wrapper({ children }),
    });

    act(() => {
      result.current.handleSort("id")();
    });

    expect(result.current.sortBy).toBe("id");
  });

  it("should update type and URL params", () => {
    const { result } = renderHook(() => usePokemonListFilters(), {
      wrapper: ({ children }) => wrapper({ children }),
    });

    act(() => {
      result.current.handleType("fire");
    });

    expect(result.current.type).toBe("fire");
  });

  it("should preserve other params when updating search", () => {
    const { result } = renderHook(() => usePokemonListFilters(), {
      wrapper: ({ children }) =>
        wrapper({
          children,
          initialEntries: ["/?type=fire&sort=id"],
        }),
    });

    act(() => {
      result.current.handleSearch("pikachu");
    });

    expect(result.current.type).toBe("fire");
    expect(result.current.sortBy).toBe("id");
    expect(result.current.searchQuery).toBe("pikachu");
  });

  it("should preserve other params when updating sort", () => {
    const { result } = renderHook(() => usePokemonListFilters(), {
      wrapper: ({ children }) =>
        wrapper({
          children,
          initialEntries: ["/?type=fire&search=pikachu"],
        }),
    });

    act(() => {
      result.current.handleSort("id")();
    });

    expect(result.current.type).toBe("fire");
    expect(result.current.searchQuery).toBe("pikachu");
    expect(result.current.sortBy).toBe("id");
  });

  it("should preserve other params when updating type", () => {
    const { result } = renderHook(() => usePokemonListFilters(), {
      wrapper: ({ children }) =>
        wrapper({
          children,
          initialEntries: ["/?search=pikachu&sort=id"],
        }),
    });

    act(() => {
      result.current.handleType("water");
    });

    expect(result.current.searchQuery).toBe("pikachu");
    expect(result.current.sortBy).toBe("id");
    expect(result.current.type).toBe("water");
  });
});

