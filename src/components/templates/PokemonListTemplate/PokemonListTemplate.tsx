import { PokemonListHeader } from "@/organisms/PokemonListHeader";
import type { ReactNode } from "react";
import styles from "./PokemonListTemplate.module.css";

export type PokemonListTemplateProps = {
  children?: ReactNode;
};

export const PokemonListTemplate = ({
  children,
}: Readonly<PokemonListTemplateProps>) => {
  return (
    <div className={styles.appContainer}>
      <main className={styles.mainContent}>
        <PokemonListHeader />
        <div className={styles.templateContainer}>{children}</div>
      </main>
    </div>
  );
};
