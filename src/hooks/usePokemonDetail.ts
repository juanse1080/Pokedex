import { useQuery } from "@apollo/client/react";
import { GET_POKEMON_DETAIL } from "@/graphql/queries/pokemonDetail.query";
import type { PokemonDetailResponse } from "@/graphql/types";

export const usePokemonDetail = (id: string | undefined) => {
  const pokemonId = id ? Number.parseInt(id, 10) : undefined;

  const { data, loading, error } = useQuery<PokemonDetailResponse>(
    GET_POKEMON_DETAIL,
    {
      skip: !pokemonId,
      variables: { id: pokemonId },
      fetchPolicy: "cache-and-network",
    }
  );

  const pokemon = data?.pokemon[0] ?? null;

  return {
    error,
    loading,
    pokemon,
  };
};
