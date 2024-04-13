import "core-js/stable";

export const API_SEARCH_URL = "https://api.github.com/search/users";
export const API_USER_URL = "https://api.github.com/users";

export const GITHUB_MAX_SEARCH_RESULTS = 1000;
export const ACCOUNTS_PER_PAGE = 12;
export const MAX_PAGES_NUM = Math.ceil(
  GITHUB_MAX_SEARCH_RESULTS / ACCOUNTS_PER_PAGE
);
export const REPOS_PER_PAGE = 8;
export const BOOKMARKS_PER_PAGE = 12;
export const TIMEOUT_SEC = 120;
