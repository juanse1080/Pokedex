import { GET_TYPES } from "@/graphql/queries/pokemonTypeList.query";
import type { PokemonTypeResponse } from "@/graphql/types";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

export function usePokemonTypes() {
  const { data, loading, error } = useQuery<PokemonTypeResponse>(GET_TYPES);

  const types = useMemo(() => data?.type ?? [], [data?.type]);

  return { types, loading, error };
}
