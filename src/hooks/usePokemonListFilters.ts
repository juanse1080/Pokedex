import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { PokemonOrderBy } from "@/graphql/types";

export function usePokemonListFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState<string>(searchParams.get("type") ?? "all");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") ?? ""
  );
  const [sortBy, setSortBy] = useState<PokemonOrderBy>(() => {
    const sort = searchParams.get("sort");
    if (!sort) return "name";
    if (!["name", "id"].includes(sort)) return "name";
    return sort as PokemonOrderBy;
  });

  const handleSearch = useCallback(
    (term: string) => {
      setSearchQuery(term);
      setSearchParams({
        type: type,
        search: term,
        sort: sortBy,
      });
    },
    [type, sortBy, setSearchParams]
  );

  const handleSort = useCallback(
    (key: PokemonOrderBy) => () => {
      setSortBy(key);
      setSearchParams({
        type,
        sort: key,
        search: searchQuery,
      });
    },
    [type, searchQuery, setSearchParams]
  );

  const handleType = useCallback(
    (type: string) => {
      setType(type);

      setSearchParams({
        type,
        search: searchQuery,
        sort: sortBy,
      });
    },
    [searchQuery, sortBy, setSearchParams]
  );

  return {
    type,
    sortBy,
    searchQuery,
    handleType,
    handleSort,
    handleSearch,
  };
}
