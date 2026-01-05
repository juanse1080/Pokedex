import { PokemonCard } from "@/molecules/PokemonCard";
import type { PokemonListItem } from "@/graphql/types";
import { PokemonListTemplateLoading } from "@/templates/PokemonListTemplate/PokemonListTemplateLoading";
import styles from "./PokemonListContent.module.css";
import { Typography } from "@/atoms/Typography";

interface PokemonListContentProps {
  limit: number;
  error?: boolean;
  loading?: boolean;
  pokemons: PokemonListItem[];
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

export const PokemonListContent: React.FC<PokemonListContentProps> = ({
  limit,
  error,
  loading,
  pokemons,
  sentinelRef,
}) => {
  if (error)
    return (
      <div className={styles.gridContainer}>
        <Typography variant="subtitle-first" className={styles.message}>
          Hubo un error al cargar la lista de Pokémon, por favor, inténtelo de
          nuevo.
        </Typography>
      </div>
    );

  if (!loading && pokemons.length === 0)
    return (
      <div className={styles.gridContainer}>
        <Typography variant="subtitle-first" className={styles.message}>
          No se encontraron Pokémon que coincidan con los filtros aplicados.
        </Typography>
      </div>
    );

  return (
    <div className={styles.gridContainer}>
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} id={pokemon.id} name={pokemon.name} />
      ))}
      {loading && <PokemonListTemplateLoading count={limit} />}
      <div ref={sentinelRef} className={styles.sentinel} />
    </div>
  );
};
