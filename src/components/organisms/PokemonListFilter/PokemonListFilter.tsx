import { HashtagIcon } from "@/atoms/HashtagIcon";
import { IconButton } from "@/atoms/IconButton";
import { Input } from "@/atoms/Input";
import { Popover } from "@/atoms/Popover";
import { Radio } from "@/atoms/Radio";
import { SearchIcon } from "@/atoms/SearchIcon";
import { TextAIcon } from "@/atoms/TextAIcon";
import { Typography } from "@/atoms/Typography";
import type { SortKey } from "@/hooks/useFilteredPokemon";
import styles from "./PokemonListFilter.module.css";
import type { ReactNode } from "react";

interface PokemonListFilterProps {
  sortBy: SortKey;
  searchQuery: string;
  children?: ReactNode;
  handleSearch: (term: string) => void;
  handleSort: (key: SortKey) => () => void;
}

export const PokemonListFilter = ({
  sortBy,
  children,
  handleSort,
  searchQuery,
  handleSearch,
}: Readonly<PokemonListFilterProps>) => {
  return (
    <div className={styles.controlsContainer}>
      <Input
        value={searchQuery}
        placeholder="Search"
        onChange={handleSearch}
        startAdornment={
          <SearchIcon width={16} height={16} fill="currentColor" />
        }
      />
      {children}
      <Popover
        align="right"
        panelClassName={styles.popoverPanel}
        trigger={
          <IconButton aria-label="Filter by type">
            {sortBy === "name" ? (
              <TextAIcon width={16} height={16} fill="currentColor" />
            ) : (
              <HashtagIcon width={16} height={16} fill="currentColor" />
            )}
          </IconButton>
        }
      >
        <div className={styles.popoverTitle}>
          <Typography variant="subtitle-second" as="h3">
            Sort by:
          </Typography>
        </div>
        <div className={styles.popoverContent} role="radiogroup">
          <Radio
            name="sort"
            value="name"
            label="Name"
            checked={sortBy === "name"}
            onChange={handleSort("name")}
          />
          <Radio
            name="sort"
            value="id"
            label="Number"
            checked={sortBy === "id"}
            onChange={handleSort("id")}
          />
        </div>
      </Popover>
    </div>
  );
};
