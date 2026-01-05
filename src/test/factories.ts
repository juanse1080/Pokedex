import type {
  PokemonListItem,
  Pokemon,
  FavoritePokemon,
  PokemonType,
  PokemonListResponse,
  PokemonDetailResponse,
} from "@/graphql/types";

export function makePokemonListItem(
  overrides?: Partial<PokemonListItem>
): PokemonListItem {
  return {
    id: overrides?.id ?? 1,
    name: overrides?.name ?? "bulbasaur",
  };
}

export function makePokemon(overrides?: Partial<Pokemon>): Pokemon {
  return {
    id: 1,
    name: "bulbasaur",
    order: 1,
    height: 7,
    weight: 69,
    pokemontypes: [
      {
        type: {
          name: "grass",
        },
      },
      {
        type: {
          name: "poison",
        },
      },
    ],
    pokemonmoves: [
      {
        move: {
          name: "tackle",
        },
      },
      {
        move: {
          name: "growl",
        },
      },
    ],
    pokemonstats: [
      {
        base_stat: 45,
        stat: {
          name: "hp",
        },
      },
      {
        base_stat: 49,
        stat: {
          name: "attack",
        },
      },
    ],
    pokemonspecy: {
      pokemonspeciesflavortexts: [
        {
          flavor_text: "A strange seed was planted on its back at birth.",
        },
      ],
    },
    pokemonsprites: [],
    ...overrides,
  };
}

export function makeFavoritePokemon(
  overrides?: Partial<FavoritePokemon>
): FavoritePokemon {
  return {
    id: 1,
    name: "bulbasaur",
    ...overrides,
  };
}

export function makePokemonType(
  overrides?: Partial<PokemonType & { id?: number }>
): PokemonType & { id?: number } {
  return {
    id: overrides?.id ?? 1,
    name: overrides?.name ?? "grass",
  };
}

export function makePokemonListResponse(
  items: PokemonListItem[] = [makePokemonListItem()],
  totalCount?: number
): PokemonListResponse {
  return {
    pokemon: items,
    pokemon_aggregate: {
      aggregate: {
        count: totalCount ?? items.length,
      },
    },
  };
}

export function makePokemonDetailResponse(
  pokemon: Pokemon = makePokemon()
): PokemonDetailResponse {
  return {
    pokemon: [pokemon],
  };
}

export const SAMPLE_POKEMON_LIST: PokemonListItem[] = [
  makePokemonListItem({ id: 1, name: "bulbasaur" }),
  makePokemonListItem({ id: 2, name: "ivysaur" }),
  makePokemonListItem({ id: 3, name: "venusaur" }),
  makePokemonListItem({ id: 4, name: "charmander" }),
  makePokemonListItem({ id: 5, name: "charmeleon" }),
];
