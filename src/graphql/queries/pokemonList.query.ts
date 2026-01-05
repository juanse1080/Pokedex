import { gql } from "@apollo/client";

export const GET_POKEMON_LIST = gql`
  query PokemonListWithCount(
    $limit: Int!
    $offset: Int!
    $orderBy: [pokemon_order_by!]
    $where: pokemon_bool_exp = {}
  ) {
    pokemon(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
      id
      name
      order
    }

    pokemon_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;
