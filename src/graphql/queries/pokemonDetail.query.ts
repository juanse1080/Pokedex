import { gql } from "@apollo/client";

export const GET_POKEMON_DETAIL = gql`
  query GetPokemonDetail($id: Int!) {
    pokemon(where: { id: { _eq: $id } }, limit: 1) {
      id
      name
      height
      weight

      pokemontypes {
        type {
          name
        }
      }
      pokemonmoves(order_by: { move: { id: desc } }, limit: 2) {
        move {
          name
        }
      }

      pokemonstats {
        base_stat
        stat {
          name
        }
      }

      pokemonspecy {
        pokemonspeciesflavortexts(
          where: { language: { name: { _eq: "en" } } }
          limit: 2
        ) {
          flavor_text
        }
      }
    }
  }
`;
