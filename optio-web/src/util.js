export function extractSearchResults(parentList, searchResults) {
  const filteredResults = [];
  const resultsIds = new Set();

  for (let i = 0; i < searchResults.length; ++i) {
    resultsIds.add(searchResults[i].id);
  }

  // O(N * logN)
  for (let i = 0; i < parentList.length; ++i) {
    if (resultsIds.has(parentList[i].id)) {
      filteredResults.push(parentList[i]);
    }
  }

  return filteredResults;
}
