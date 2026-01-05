import { typeColors } from "@/const/colors";
import { PokemonDetailHeader } from "@/organisms/PokemonDetailHeader";
import { type CSSProperties, type ReactNode } from "react";
import styles from "./PokemonDetailTemplate.module.css";
import { PokeBallIcon } from "@/atoms/PokeBallIcon";

export type PokemonDetailTemplateProps = {
  id: string;
  title: string;
  types: string[];
  children?: ReactNode;
};

export const PokemonDetailTemplate = ({
  id,
  title,
  types,
  children,
}: Readonly<PokemonDetailTemplateProps>) => {
  const primaryType = types[0] ?? "normal";
  const backgroundColor = typeColors[primaryType];

  return (
    <div
      className={styles.appContainer}
      style={
        {
          "--pokemon-background-type": backgroundColor,
        } as CSSProperties
      }
    >
      <PokeBallIcon
        width={208}
        height={208}
        fill="currentColor"
        className={styles.pokeBallIcon}
      />
      <main className={styles.mainContent}>
        <PokemonDetailHeader id={id} title={title} />
        <div className={styles.templateContainer}>{children}</div>
      </main>
    </div>
  );
};
