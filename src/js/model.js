import "core-js/stable";

import "regenerator-runtime/runtime.js";
import {
  API_SEARCH_URL,
  API_USER_URL,
  ACCOUNTS_PER_PAGE,
  REPOS_PER_PAGE,
  BOOKMARKS_PER_PAGE,
} from "./config";
import { getJSON } from "./helpers";

export const state = {
  bookmarks: {
    items: JSON.parse(localStorage.getItem("bookmarkedProfiles")) || [],
    currentPage: 1,
    pagesCount: Math.ceil(
      JSON.parse(localStorage.getItem("bookmarkedProfiles"))?.length /
        BOOKMARKS_PER_PAGE
    ),
  },
  searchResults: {},
  profile: {},
};

export const getUsers = async function (query, page) {
  try {
    const data = await getJSON(
      `${API_SEARCH_URL}?q=${query}&page=${page}&per_page=${ACCOUNTS_PER_PAGE}`
    );

    state.searchResults = {
      query: query,
      profilesCount: data.total_count,
      profiles: [],
      currentPage: page,
    };

    data.items.forEach((item) => {
      state.searchResults.profiles.push({
        username: item.login,
        avatar: item.avatar_url,
      });
    });
  } catch (error) {
    throw error;
  }
};

export const getUser = async function (user) {
  try {
    const url = `${API_USER_URL}/${user}`;

    // Fetching in Parallel
    const data = await Promise.all([
      getJSON(url),
      getJSON(`${url}/followers`),
      getJSON(`${url}/repos`),
    ]);

    const userInfoData = data[0];
    const userFollowersData = data[1];
    const userReposData = data[2];

    // All Profile Data
    state.profile = {
      avatar: userInfoData.avatar_url,
      username: userInfoData.login,
      name: userInfoData.name,
      bio: userInfoData.bio,
      githubLink: userInfoData.html_url,
      location: userInfoData.location,
      blog:
        userInfoData.blog.split("://").length === 1 &&
        userInfoData.blog.split("://")[0] != ""
          ? `http://${userInfoData.blog}`
          : userInfoData.blog,
      email: userInfoData.email,
      twitterLink: userInfoData.twitter_username,
      followingCount: userInfoData.following,
      followersCount: userInfoData.followers,
      followers: [],
      reposCount: userInfoData.public_repos,
      repos: {
        items: [],
      },
      isBookmarked: state.bookmarks.items.find(
        (item) => item.username === userInfoData.login
      )
        ? true
        : false,
    };

    // Profile's Followers
    userFollowersData.forEach((follower) => {
      state.profile.followers.push({
        username: follower.login,
        avatar: follower.avatar_url,
      });
    });

    // Profile's Repos
    userReposData.forEach((repo) => {
      state.profile.repos.items.push({
        name: repo.name,
        description: repo.description ?? "",
        url: repo.html_url,
        starsCount: repo.stargazers_count,
        forksCount: repo.forks,
        isFork: repo.fork,
        language: repo.language ?? "",
        lastUpdate: repo.updated_at.split("T")[0],
      });
    });

    state.profile.repos.currentPage = 1;
    state.profile.repos.pagesCount = Math.ceil(
      state.profile.repos.items.length / REPOS_PER_PAGE
    );
  } catch (error) {
    throw error;
  }
};

export const toggleBookmark = function () {
  if (state.profile.isBookmarked) {
    // If already bookmarked, remove bookmark
    const profileIndex = state.bookmarks.items.findIndex(
      (p) => p.username === state.profile.username
    );

    // Remove profile from bookmarks
    state.bookmarks.items.splice(profileIndex, 1);
    state.profile.isBookmarked = false;

    if (state.bookmarks.pagesCount === 1) {
      if (state.bookmarks.items.length < 1) {
        state.bookmarks.pagesCount = 1;
        state.bookmarks.currentPage = 1;
      }
    }

    if (state.bookmarks.pagesCount > 1) {
      if (Number.isInteger(state.bookmarks.items.length / BOOKMARKS_PER_PAGE)) {
        state.bookmarks.pagesCount--;
        state.bookmarks.currentPage--;
      }
    }
  } else {
    // If not bookmarked, add bookmark
    state.bookmarks.items.push(state.profile);
    state.profile.isBookmarked = true;

    // Update bookmarks page count if needed
    if (state.bookmarks.pagesCount === 1) {
      if (state.bookmarks.items.length > 12) {
        state.bookmarks.pagesCount++;
        state.bookmarks.currentPage++;
      }
    }

    if (state.bookmarks.pagesCount > 1) {
      if (Number.isInteger(state.bookmarks.items.length / BOOKMARKS_PER_PAGE)) {
        state.bookmarks.pagesCount++;
        state.bookmarks.currentPage++;
      }
    }
  }
};

export const updateLocalStorage = function () {
  localStorage.setItem(
    "bookmarkedProfiles",
    JSON.stringify(state.bookmarks.items)
  );
};
