export type PokemonOrderBy = "name" | "id";

export interface PokemonType {
  name: string;
}

export interface PokemonTypeRelation {
  type: PokemonType;
}

export interface PokemonMove {
  move: {
    name: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonSprite {
  sprites: {
    front_default?: string;
    other?: {
      "official-artwork"?: {
        front_default?: string;
      };
    };
  };
}

export interface PokemonSpecyFlavorText {
  flavor_text: string;
}

export interface PokemonSpecy {
  pokemonspeciesflavortexts: PokemonSpecyFlavorText[];
}

export interface Pokemon {
  id: number;
  name: string;
  order: number;
  height: number;
  weight: number;
  pokemonspecy: PokemonSpecy;
  pokemonmoves: PokemonMove[];
  pokemonstats: PokemonStat[];
  pokemonsprites: PokemonSprite[];
  pokemontypes: PokemonTypeRelation[];
}

export interface PokemonListItem {
  id: number;
  name: string;
}

export interface FavoritePokemon {
  id: number;
  name: string;
}

export interface PokemonListResponse {
  pokemon: PokemonListItem[];
  pokemon_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export interface PokemonDetailResponse {
  pokemon: Pokemon[];
}

export interface PokemonTypeResponse {
  type: PokemonType[];
}
