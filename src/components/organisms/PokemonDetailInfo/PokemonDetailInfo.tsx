import { Typography } from "@/atoms/Typography/Typography";
import { WeightIcon } from "@/atoms/WeightIcon";
import { typeColors } from "@/const/colors";
import type { CSSProperties } from "react";
import styles from "./PokemonDetailInfo.module.css";
import { StraightenIcon } from "@/atoms/StraightenIcon";
import { Progress } from "@/atoms/Progress";
import { FavoriteToggle } from "@/molecules/FavoriteToggle";
import { useFavoritesContext } from "@/contexts/FavoritesContexts";

export type PokemonDetailInfoProps = {
  id: string;
  name: string;
  order: number;
  types: string[];
  height: number;
  weight: number;
  moves: string[];
  stats: {
    name: string;
    base_stat: number;
  }[];
  description: string;
};

export const PokemonDetailInfo = ({
  id,
  name,
  order,
  types,
  height,
  weight,
  moves,
  stats,
  description,
}: PokemonDetailInfoProps) => {
  const { isFavorite, toggleFavorite } = useFavoritesContext();

  const pokemonId = Number(id);
  const primaryType = types[0] ?? "normal";
  const backgroundColor = typeColors[primaryType];
  const favorite = isFavorite(pokemonId);

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: pokemonId,
      name,
      order,
    });
  };

  return (
    <div className={styles.infoContainer}>
      <FavoriteToggle
        isFavorite={favorite}
        onToggle={handleToggleFavorite}
        className={styles.favoriteToggle}
      />

      <div className={styles.infoTypes}>
        {types.map((type) => (
          <Typography
            as="span"
            variant="subtitle-third"
            key={`${id}-type-${type}`}
            className={styles.infoChip}
            style={
              { "--pokemon-background-type": typeColors[type] } as CSSProperties
            }
          >
            {type}
          </Typography>
        ))}
      </div>

      <Typography
        center
        as="h2"
        variant="headline"
        style={{ color: backgroundColor }}
      >
        About
      </Typography>

      <div className={styles.infoAttributes}>
        {/* Weight */}
        <div className={styles.infoAttributeContainer}>
          <div className={styles.infoAttributeValue}>
            <WeightIcon width={24} height={24} fill="currentColor" />
            <Typography variant="body-third" as="span">
              {weight} kg
            </Typography>
          </div>
          <Typography
            as="span"
            variant="caption"
            className={styles.infoAttributeCaption}
          >
            Weight
          </Typography>
        </div>

        <div className={styles.infoDivider} />

        {/* height */}
        <div className={styles.infoAttributeContainer}>
          <div className={styles.infoAttributeValue}>
            <StraightenIcon
              width={24}
              height={24}
              fill="currentColor"
              style={{ transform: "rotate(90deg)" }}
            />
            <Typography variant="body-third" as="span">
              {height} m
            </Typography>
          </div>
          <Typography
            as="span"
            variant="caption"
            className={styles.infoAttributeCaption}
          >
            Height
          </Typography>
        </div>

        <div className={styles.infoDivider} />

        {/* abilities */}
        <div className={styles.infoAttributeContainer}>
          <div className={styles.infoAbilityValue}>
            {moves.map((move) => (
              <Typography
                as="span"
                variant="body-third"
                key={`${id}-move-${move}`}
              >
                {move}
              </Typography>
            ))}
          </div>
          <Typography
            as="span"
            variant="caption"
            className={styles.infoAttributeCaption}
          >
            Moves
          </Typography>
        </div>
      </div>

      <Typography center as="p" variant="body-third">
        {description}
      </Typography>

      <Typography
        center
        as="h2"
        variant="headline"
        style={{ color: backgroundColor }}
      >
        Stats
      </Typography>
      <div className={styles.infoStats}>
        <div className={styles.infoStatLabels}>
          {stats.map((stat) => (
            <Typography
              as="span"
              variant="subtitle-third"
              key={`${id}-stat-${stat.name}-label`}
              style={{ textTransform: "uppercase", color: backgroundColor }}
            >
              {stat.name}
            </Typography>
          ))}
        </div>
        <div className={styles.infoDivider} />
        <div className={styles.infoStatValues}>
          {stats.map((stat) => (
            <Typography
              as="span"
              variant="body-third"
              key={`${id}-stat-${stat.name}-value`}
            >
              {String(stat.base_stat).padStart(3, "0")}
            </Typography>
          ))}
        </div>
        <div className={styles.infoStatProgress}>
          {stats.map((stat) => (
            <Progress
              value={stat.base_stat}
              color={backgroundColor}
              key={`${id}-stat-${stat.name}-progress`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
