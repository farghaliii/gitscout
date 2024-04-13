import { BOOKMARKS_PER_PAGE } from "../config";
import { View } from "./View";

class BookmarksView extends View {
  _parentEl = document.querySelector(".bookmarks__content");
  _bookmarksContainerEl = document.querySelector(".bookmarks-container");
  _bookmarksBtn = document.querySelector(".bookmarks__btn");

  constructor() {
    super();
    // Open / Close bookmarks menu when clicking on the bookmark button
    this._toggleBookmarksMenu();

    // Close Bookmarks Menu When Scrolling
    this._closeBookmarksMenuOnScroll();

    // Close bookmarks menu when clicking outside the bookmark container
    this._closeBookmarksMenuOnClickOutside();

    // Hanlde Bookmarks Pagination
    this._handleRenderPagination();
  }

  close() {
    this._bookmarksContainerEl.classList.remove("bookmarks-container--open");
  }

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _handleRenderPagination() {
    this._bookmarksContainerEl.addEventListener("click", (e) => {
      if (!e.target.closest(".pagination__link")) return;

      e.preventDefault();

      const page = +e.target.closest(".pagination__link")?.dataset.page;

      if (!page || page <= 0 || page > this._data.pagesCount) return;

      this._data.currentPage = page;
      this.render(this._data);
    });
  }

  _generateMarkup() {
    return `
        ${this._generateBookmarksMarkup(this._data.currentPage)}
        ${
          this._data.items.length < BOOKMARKS_PER_PAGE
            ? ""
            : this._generatePaginationMarkup()
        }`;
  }

  _generateBookmarksMarkup(page) {
    const startBookmarkItem = (page - 1) * BOOKMARKS_PER_PAGE;
    let endBookmarkItem;

    if (this._data.items.length < BOOKMARKS_PER_PAGE) {
      endBookmarkItem = this._data.items.length;
    } else {
      endBookmarkItem =
        this._data.items.length > page * BOOKMARKS_PER_PAGE
          ? page * BOOKMARKS_PER_PAGE
          : this._data.items.length;
    }

    let markup;
    if (this._data.items.length) {
      markup = `<div class="bookmarks">`;
      for (let i = startBookmarkItem; i < endBookmarkItem; i++) {
        const profile = this._data.items[i];
        markup += `
        <a href="./#${profile.username}" data-username="${profile.username}" class="card">
          <img src="${profile.avatar}" alt="${profile.username}'s Image" class="card__image">
        </a>`;
      }
      markup += `</div>`;
    } else {
      markup = `
      <div class="bookmarks__message-container">
        <p class="bookmarks__message">There is no bookmarked accounts yet!</p>
      </div>`;
    }
    return markup;
  }

  _generatePaginationMarkup() {
    return `
      <div class="pagination">
        <a href="#" class="pagination__link pagination__prev ${
          this._data.currentPage <= 1 ? "pagination__link--disable" : ""
        }" data-page="${this._data.currentPage - 1}">
          <!-- Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="arrow-circle-left">
            <path fill="#222"
              d="M8.29,11.29a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l3,3a1,1,0,0,0,1.42-1.42L11.41,13H15a1,1,0,0,0,0-2H11.41l1.3-1.29a1,1,0,0,0,0-1.42,1,1,0,0,0-1.42,0ZM2,12A10,10,0,1,0,12,2,10,10,0,0,0,2,12Zm18,0a8,8,0,1,1-8-8A8,8,0,0,1,20,12Z">
            </path>
          </svg>
          Previous
        </a>

        <a href="#" class="pagination__link pagination__next ${
          this._data.currentPage >= this._data.pagesCount
            ? "pagination__link--disable"
            : ""
        }" data-page="${this._data.currentPage + 1}">
          Next
          <!-- Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="arrow-circle-right">
            <path fill="#222"
              d="M15.71,12.71a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-3-3a1,1,0,0,0-1.42,1.42L12.59,11H9a1,1,0,0,0,0,2h3.59l-1.3,1.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0ZM22,12A10,10,0,1,0,12,22,10,10,0,0,0,22,12ZM4,12a8,8,0,1,1,8,8A8,8,0,0,1,4,12Z">
            </path>
          </svg>
        </a>
      </div>
    `;
  }

  _closeBookmarksMenuOnClickOutside() {
    document.addEventListener("click", (e) => {
      const targetEl = e.target;
      if (
        targetEl != this._bookmarksContainerEl &&
        !this._bookmarksContainerEl.contains(targetEl) &&
        !targetEl.closest(".pagination")
      )
        this.close();
    });
  }

  _closeBookmarksMenuOnScroll() {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    };
    const callback = function (entries, observer) {
      const [entry] = entries;
      if (entry.intersectionRatio < 1) {
        this.close();
      }
    };
    const observer = new IntersectionObserver(callback.bind(this), options);
    observer.observe(this._bookmarksContainerEl);
  }

  _toggleBookmarksMenu() {
    this._bookmarksBtn.addEventListener("click", () => {
      this._bookmarksContainerEl.classList.toggle("bookmarks-container--open");
    });
  }

  _updatePageTitle() {}
}

export default new BookmarksView();
