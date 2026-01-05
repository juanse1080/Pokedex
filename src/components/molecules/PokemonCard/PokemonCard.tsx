import { getPokemonImageUrls } from "@/utils/pokemon";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LazyImage } from "@/molecules/LazyImage";
import styles from "./PokemonCard.module.css";
import { cx } from "@/utils/cx";
import { Typography } from "@/atoms/Typography";

interface PokemonCardProps {
  id: number;
  name: string;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ id, name }) => {
  const navigate = useNavigate();

  const imageUrl = useMemo(() => getPokemonImageUrls(id).list, [id]);

  const handleCardClick = () => {
    navigate(`/pokemon/${id}`);
  };

  const pokemonNumber = useMemo(() => `#${String(id).padStart(5, "0")}`, [id]);

  return (
    <button
      title={name}
      onClick={handleCardClick}
      aria-label={`Ver detalles de ${name}`}
      className={cx(styles.card, styles.reset)}
    >
      <div className={styles.containerNumber}>
        <Typography variant="caption">{pokemonNumber}</Typography>
      </div>
      <div className={styles.imageContainer}>
        <LazyImage
          width={72}
          height={72}
          alt={name}
          src={imageUrl}
          className={styles.image}
        />
      </div>

      <div className={styles.containerName}>
        <Typography variant="body-third" className={styles.name}>
          {name}
        </Typography>
      </div>
    </button>
  );
};
