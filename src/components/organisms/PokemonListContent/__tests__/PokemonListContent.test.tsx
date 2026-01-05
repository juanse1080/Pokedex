import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { PokemonListContent } from "../PokemonListContent";
import { SAMPLE_POKEMON_LIST } from "@/test/factories";
import { renderWithProviders } from "@/test/helpers";

describe("PokemonListContent", () => {
  it("should render list of pokemon cards", () => {
    renderWithProviders(
      <PokemonListContent
        limit={20}
        pokemons={SAMPLE_POKEMON_LIST}
        sentinelRef={{ current: null }}
      />
    );

    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("ivysaur")).toBeInTheDocument();
    expect(screen.getByText("venusaur")).toBeInTheDocument();
    expect(screen.getByText("charmander")).toBeInTheDocument();
    expect(screen.getByText("charmeleon")).toBeInTheDocument();
  });

  it("should show error message when error is true", () => {
    renderWithProviders(
      <PokemonListContent
        limit={20}
        error={true}
        pokemons={[]}
        sentinelRef={{ current: null }}
      />
    );

    expect(
      screen.getByText(/hubo un error al cargar la lista/i)
    ).toBeInTheDocument();
  });

  it("should show empty state when no pokemons and not loading", () => {
    renderWithProviders(
      <PokemonListContent
        limit={20}
        loading={false}
        pokemons={[]}
        sentinelRef={{ current: null }}
      />
    );

    expect(
      screen.getByText(/no se encontraron pokémon/i)
    ).toBeInTheDocument();
  });

  it("should not show empty state when loading", () => {
    renderWithProviders(
      <PokemonListContent
        limit={20}
        loading={true}
        pokemons={[]}
        sentinelRef={{ current: null }}
      />
    );

    expect(
      screen.queryByText(/no se encontraron pokémon/i)
    ).not.toBeInTheDocument();
  });

  it("should render sentinel element", () => {
    const sentinelRef = { current: null };
    renderWithProviders(
      <PokemonListContent
        limit={20}
        pokemons={SAMPLE_POKEMON_LIST}
        sentinelRef={sentinelRef}
      />
    );

    expect(sentinelRef.current).toBeInTheDocument();
  });

  it("should render loading skeleton when loading", () => {
    const { container } = renderWithProviders(
      <PokemonListContent
        limit={20}
        loading={true}
        pokemons={SAMPLE_POKEMON_LIST}
        sentinelRef={{ current: null }}
      />
    );

    const loadingElements = container.querySelectorAll('[class*="cardSkeleton"], [class*="skeleton"]');
    expect(loadingElements.length).toBeGreaterThanOrEqual(20);
  });
});

