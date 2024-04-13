import "core-js/stable";
import "regenerator-runtime/runtime.js";

import * as model from "./model.js";
import bookmarksView from "./views/bookmarksView.js";
import profileView from "./views/profileView.js";
import profilesView from "./views/profilesView.js";
import { sanitizeData } from "./helpers.js";

// Control Display All Profiles
const showProfiles = async function (e, query = "", page = 1) {
  try {
    e.preventDefault();

    if (e.type === "load") {
      query = decodeURIComponent(
        `${window.location.search.split("&")[0]}`.split("=")[1]
      );
      page = +`${window.location.search.split("&")[1]}`.split("=")[1] || 1;
    } else {
      query = query.trim();
    }

    query = sanitizeData(query);

    if (!query || query == "undefined") return;

    // Close The Bookmarks Menu
    bookmarksView.close();

    // Spinner
    profilesView.renderSpinner();

    // Fetching Users data
    await model.getUsers(query, page);

    // For Handling Back/Next Interactions
    history.pushState(
      model.state.searchResults,
      "",
      `search?query=${query}&page=${page}`
    );

    // Rendering profiles list
    profilesView.render(model.state.searchResults);
  } catch (error) {
    profilesView.renderErrorMessage(error);
  }
};

// Control Display Profile
const showProfile = async function (_, u = "") {
  try {
    // Close The Bookmarks Menu
    bookmarksView.close();

    // Get username
    const user = u.trim().length !== 0 ? u : window.location.hash.slice(1);
    if (!user) return;

    // Spinner
    profileView.renderSpinner();

    // Getting User Data
    await model.getUser(user);

    // For Handling Back/Next Interactions
    history.pushState(model.state.profile, "", `./#${user}`);

    // Rendering Profile
    profileView.render(model.state.profile);
  } catch (error) {
    profileView.renderErrorMessage(error);
  }
};

// Display Bookmarks
const showBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const handleBookmarking = function () {
  // Add/Remove the current profile to/from the bookmarks array
  model.toggleBookmark();

  // Update Profile View
  profileView.renderBookmarkSign(model.state.profile.isBookmarked);

  // Update Local Storage
  model.updateLocalStorage();

  // Re-render Bookmarks View
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  // Linking Event Handlers
  profilesView.addHandlerRender(showProfiles);
  profileView.addHandlerRender(showProfile);
  profileView.addHandlerBookmarking(handleBookmarking);
  bookmarksView.addHandlerRender(showBookmarks);

  // Handle Back/Next
  window.addEventListener("popstate", (e) => {
    if (!e.state) return;
    e.state.query ? profilesView.render(e.state) : profileView.render(e.state);
  });
};

init();
