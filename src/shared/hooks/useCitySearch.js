import { useEffect, useState } from "react";
import { searchCities } from "../../domain/cities/search.js";

export default function useCitySearch({
  cities,
  query,
  excludeCityNames = [],
  limit = 6,
  minQueryLength = 2,
}) {
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const normalizedQuery = query.trim();
    const nextResults =
      normalizedQuery.length >= minQueryLength
        ? searchCities(cities, normalizedQuery, limit).filter(
            (city) => !excludeCityNames.includes(city.city),
          )
        : [];

    setResults(nextResults);
  }, [cities, excludeCityNames, limit, minQueryLength, query]);

  useEffect(() => {
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  const resetSearch = () => {
    setResults([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event, onSelect) => {
    if (!results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
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
