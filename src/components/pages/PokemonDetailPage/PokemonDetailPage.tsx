import { Spinner } from "@/atoms/Spinner";
import { STAT_ABBR_MAP } from "@/const/labels";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { PokemonDetailInfo } from "@/organisms/PokemonDetailInfo";
import { PokemonDetailMedia } from "@/organisms/PokemonDetailMedia";
import { PokemonDetailTemplate } from "@/templates/PokemonDetailTemplate";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import styles from "./PokemonDetailPage.module.css";
import { Typography } from "@/atoms/Typography";

export const PokemonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pokemon, loading } = usePokemonDetail(id);

  const pokemonId = useMemo(() => {
    return Number(pokemon?.id ?? 0);
  }, [pokemon]);

  const pokemonTypes = useMemo(() => {
    if (!pokemon) return [];
    return pokemon.pokemontypes.map((type) => type.type.name) ?? [];
  }, [pokemon]);

  const pokemonDescription = useMemo(() => {
    if (!pokemon) return "";
    return pokemon.pokemonspecy.pokemonspeciesflavortexts[0].flavor_text ?? "";
  }, [pokemon]);

  const pokemonMoves = useMemo(() => {
    if (!pokemon) return [];
    return pokemon.pokemonmoves.map((move) => move.move.name) ?? [];
  }, [pokemon]);

  const pokemonStats = useMemo(() => {
    if (!pokemon) return [];
    return (
      pokemon.pokemonstats.map((stat) => ({
        name: STAT_ABBR_MAP[stat.stat.name],
        base_stat: stat.base_stat,
      })) ?? []
    );
  }, [pokemon]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <Spinner />
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <Typography variant="headline" as="p" center>
            Pokemon not found!
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <PokemonDetailTemplate
      types={pokemonTypes}
      title={pokemon.name}
      id={pokemonId.toString()}
    >
      <PokemonDetailMedia
        id={pokemonId}
        name={pokemon.name}
        order={pokemon.order}
      />
      <PokemonDetailInfo
        id={pokemonId.toString()}
        name={pokemon.name}
        order={pokemon.order}
        types={pokemonTypes}
        moves={pokemonMoves}
        stats={pokemonStats}
        height={pokemon.height}
        weight={pokemon.weight}
        description={pokemonDescription}
      />
    </PokemonDetailTemplate>
  );
};
