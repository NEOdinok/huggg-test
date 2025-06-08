export const defaultPageNumber = "1";

export const defaultResultsPerPage = "20";

export function getPagination(
  totalItems: number,
  page: number,
  itemsPerPage: number
) {
  const lastPage = Math.ceil(totalItems / itemsPerPage) || 1;
  const maxValidPage = Math.min(page, lastPage);
  const pageEnsuredWithinRange = Math.max(1, maxValidPage);
  const startIndex = (pageEnsuredWithinRange - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    startIndex,
    endIndex,
    pageEnsuredWithinRange,
    lastPage,
  };
}
