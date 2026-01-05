import type { MockedResponse } from "@apollo/client/testing";
import { GET_POKEMON_LIST } from "@/graphql/queries/pokemonList.query";
import { GET_POKEMON_DETAIL } from "@/graphql/queries/pokemonDetail.query";
import {
  makePokemonListResponse,
  makePokemonDetailResponse,
  makePokemon,
  SAMPLE_POKEMON_LIST,
} from "./factories";
import type { PokemonListResponse, PokemonDetailResponse } from "@/graphql/types";

export function createPokemonListMock(
  items = SAMPLE_POKEMON_LIST,
  totalCount?: number,
  variables?: Record<string, unknown>
): MockedResponse<PokemonListResponse> {
  return {
    request: {
      query: GET_POKEMON_LIST,
      variables: {
        limit: 20,
        offset: 0,
        orderBy: [{ name: "asc" }],
        where: {},
        ...variables,
      },
    },
    result: {
      data: makePokemonListResponse(items, totalCount),
    },
  };
}

export function createPokemonListLoadingMock(
  variables?: Record<string, unknown>
): MockedResponse<PokemonListResponse> {
  return {
    request: {
      query: GET_POKEMON_LIST,
      variables: {
        limit: 20,
        offset: 0,
        orderBy: [{ name: "asc" }],
        where: {},
        ...variables,
      },
    },
    delay: 1000,
    result: {
      data: makePokemonListResponse(),
    },
  };
}

export function createPokemonListErrorMock(
  errorMessage = "Network error",
  variables?: Record<string, unknown>
): MockedResponse<PokemonListResponse> {
  return {
    request: {
      query: GET_POKEMON_LIST,
      variables: {
        limit: 20,
        offset: 0,
        orderBy: [{ name: "asc" }],
        where: {},
        ...variables,
      },
    },
    error: new Error(errorMessage),
  };
}

export function createPokemonDetailMock(
  id: number,
  pokemonOverrides?: Partial<ReturnType<typeof makePokemon>>
): MockedResponse<PokemonDetailResponse> {
  return {
    request: {
      query: GET_POKEMON_DETAIL,
      variables: { id },
    },
    result: {
      data: makePokemonDetailResponse(
        makePokemon({ id, ...pokemonOverrides })
      ),
    },
  };
}

export function createPokemonDetailLoadingMock(
  id: number
): MockedResponse<PokemonDetailResponse> {
  return {
    request: {
      query: GET_POKEMON_DETAIL,
      variables: { id },
    },
    delay: 1000,
    result: {
      data: makePokemonDetailResponse(makePokemon({ id })),
    },
  };
}

export function createPokemonDetailErrorMock(
  id: number,
  errorMessage = "Network error"
): MockedResponse<PokemonDetailResponse> {
  return {
    request: {
      query: GET_POKEMON_DETAIL,
      variables: { id },
    },
    error: new Error(errorMessage),
  };
}

export function createPokemonDetailNotFoundMock(
  id: number
): MockedResponse<PokemonDetailResponse> {
  return {
    request: {
      query: GET_POKEMON_DETAIL,
      variables: { id },
    },
    result: {
      data: {
        pokemon: [],
      },
    },
  };
}

