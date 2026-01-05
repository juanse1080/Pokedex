import { gql } from "@apollo/client";

export const GET_TYPES = gql`
  query Types {
    type {
      id
      name
    }
  }
`;
