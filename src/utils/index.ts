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

/**
 * Safely parse a “page” query-string value into a 1-based number.
 * If rawPage is undefined, NaN, or <1, returns 1.
 */
export function parsePageQueryString(
  rawPage?: string,
  fallback: string = defaultPageNumber
): number {
  const str = rawPage ?? fallback;
  const n = parseInt(str, 10);
  return isNaN(n) || n < 1 ? 1 : n;
}

/**
 * Safely parse a “per_page” query-string value into a positive integer.
 * If rawPerPage is undefined, NaN, or <1, returns 1.
 */
export function parsePerPageQueryString(
  rawPerPage?: string,
  fallback: string = defaultResultsPerPage
): number {
  const str = rawPerPage ?? fallback;
  const n = parseInt(str, 10);
  return isNaN(n) || n < 1 ? 1 : n;
}
