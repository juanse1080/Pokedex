import { ArrowLeftIcon } from "@/atoms/ArrowLeftIcon";
import { Button } from "@/atoms/Button";
import { Typography } from "@/atoms/Typography";
import { useNavigate } from "react-router-dom";
import styles from "./PokemonDetailHeader.module.css";

export type PokemonDetailHeaderProps = {
  id: string;
  title: string;
};

export const PokemonDetailHeader = ({
  id,
  title,
}: Readonly<PokemonDetailHeaderProps>) => {
  const navigate = useNavigate();

  const pokemonNumber = `#${String(id).padStart(5, "0")}`;

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Button onClick={() => navigate("/")}>
          <ArrowLeftIcon width={32} height={32} fill="currentColor" />
        </Button>
        <Typography variant="headline" as="h1" className={styles.headerTitle}>
          {title}
        </Typography>
        <Typography variant="subtitle-second" as="span">
          {pokemonNumber}
        </Typography>
      </div>
    </header>
  );
};
