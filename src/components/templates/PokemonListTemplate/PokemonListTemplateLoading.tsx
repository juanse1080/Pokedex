import { PokemonCardLoading } from "@/molecules/PokemonCard";

export type PokemonListTemplateLoadingProps = {
  count: number;
};

const KEY_PREFIX = "pokemon-list-template-loading";

export const PokemonListTemplateLoading: React.FC<
  PokemonListTemplateLoadingProps
> = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <PokemonCardLoading key={`${KEY_PREFIX}-${index}`} />
      ))}
    </>
  );
};
