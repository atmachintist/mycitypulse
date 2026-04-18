function levenshtein(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      if (row === 0) return col;
      if (col === 0) return row;
      return 0;
    }),
  );

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      dp[row][col] =
        a[row - 1] === b[col - 1]
          ? dp[row - 1][col - 1]
          : 1 + Math.min(dp[row - 1][col], dp[row][col - 1], dp[row - 1][col - 1]);
    }
  }

  return dp[a.length][b.length];
}

function scoreCityMatch(city, query) {
  if (!query) return Infinity;

  const normalizedQuery = query.toLowerCase().trim();
  const targets = [
    city.city.toLowerCase(),
    city.state.toLowerCase(),
    city.formerName?.toLowerCase(),
    ...city.aliases.map((alias) => alias.toLowerCase()),
  ].filter(Boolean);

  if (targets.some((target) => target.includes(normalizedQuery))) {
    return 0;
  }

  if (normalizedQuery.length < 4) {
    return Infinity;
  }

  let bestScore = Infinity;

  for (const target of targets) {
    const sliceDistance = levenshtein(normalizedQuery, target.slice(0, normalizedQuery.length + 2));
    if (sliceDistance <= 2) {
      bestScore = Math.min(bestScore, sliceDistance);
    }

    for (const word of target.split(/[\s-]/)) {
      if (word.length < 4) continue;

      const wordDistance = levenshtein(normalizedQuery, word.slice(0, normalizedQuery.length + 2));
      if (wordDistance <= 2) {
        bestScore = Math.min(bestScore, wordDistance);
      }
    }
  }

  return bestScore;
}

export function searchCities(cities, query, limit = 6) {
  if (!query || query.trim().length < 1) {
    return [];
  }

  return cities
    .map((city) => ({ city, score: scoreCityMatch(city, query) }))
    .filter((entry) => entry.score < Infinity)
    .sort((left, right) => left.score - right.score)
    .map((entry) => entry.city)
    .slice(0, limit);
}
