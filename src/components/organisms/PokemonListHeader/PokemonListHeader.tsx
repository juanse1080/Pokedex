import { Link } from "react-router-dom";
import styles from "./PokemonListHeader.module.css";
import { PokeBallIcon } from "@/atoms/PokeBallIcon";
import { Typography } from "@/atoms/Typography";
import { StarIcon } from "@/atoms/StarIcon";

export const PokemonListHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.headerContent}>
          <PokeBallIcon width={24} height={24} fill="currentColor" />
          <Typography variant="headline" as="h2">
            Pokédex
          </Typography>
        </Link>

        <Link to="/favorites" className={styles.headerContent}>
          <StarIcon width={24} height={24} fill="currentColor" />
        </Link>
      </div>
    </header>
  );
};
