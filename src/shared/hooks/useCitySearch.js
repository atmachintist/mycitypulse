import { useMemo, useState } from "react";
import { searchCities } from "../../domain/cities/search.js";

export default function useCitySearch({
  cities,
  query,
  excludeCityNames = [],
  limit = 6,
  minQueryLength = 2,
}) {
  const [rawActiveIndex, setRawActiveIndex] = useState(-1);
  const [activeSessionKey, setActiveSessionKey] = useState("");
  const excludedNamesKey = useMemo(
    () => [...excludeCityNames].sort().join("|"),
    [excludeCityNames],
  );
  const results = useMemo(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < minQueryLength) {
      return [];
    }

    return searchCities(cities, normalizedQuery, limit).filter(
      (city) => !excludeCityNames.includes(city.city),
    );
  }, [cities, excludeCityNames, limit, minQueryLength, query]);
  const searchSessionKey = `${query.trim()}|${excludedNamesKey}|${limit}|${minQueryLength}`;
  const activeIndex = useMemo(() => {
    if (results.length === 0) {
      return -1;
    }

    if (activeSessionKey !== searchSessionKey) {
      return 0;
    }

    if (rawActiveIndex < 0) {
      return -1;
    }

    if (rawActiveIndex >= results.length) {
      return results.length - 1;
    }

    return rawActiveIndex;
  }, [activeSessionKey, rawActiveIndex, results.length, searchSessionKey]);

  const setActiveIndex = (value) => {
    setActiveSessionKey(searchSessionKey);
    setRawActiveIndex(value);
  };

  const resetSearch = () => {
    setActiveSessionKey(searchSessionKey);
    setRawActiveIndex(-1);
  };

  const handleKeyDown = (event, onSelect) => {
    if (!results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => {
        if (index < 0) return 0;
        return (index + 1) % results.length;
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => {
        if (index < 0) return results.length - 1;
        return index <= 0 ? results.length - 1 : index - 1;
      });
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      onSelect(results[activeIndex] || results[0]);
      return;
    }

    if (event.key === "Escape") {
      resetSearch();
    }
  };

  return {
    activeIndex,
    handleKeyDown,
    resetSearch,
    results,
    setActiveIndex,
  };
}
