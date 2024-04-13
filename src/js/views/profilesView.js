import { MAX_PAGES_NUM } from "../config";
import { View } from "./View";

class ProfilesView extends View {
  _parentEl = document.querySelector(".main-container");
  _formEl = document.querySelector(".form");
  _searchedQueryInput = document.querySelector(".searched-query");

  addHandlerRender(handler) {
    this._parentEl.addEventListener("click", (e) => {
      if (
        !e.target.closest(".pagination__link") ||
        !e.target.closest(".profiles")
      )
        return;

      e.preventDefault();

      const page = e.target.closest(".pagination__link")?.dataset.page;
      if (!page || page <= 0 || page > MAX_PAGES_NUM) return;
      handler(e, this._data.query, page);
    });

    this._formEl.addEventListener("submit", (e) => {
      handler(e, this._searchedQueryInput.value);
      this._formEl.reset();
      this._searchedQueryInput.blur();
    });

    window.addEventListener("load", handler);
  }

  _updatePageTitle() {
    document.title = `${this._data.query}'s Profiles`;
  }

  _generateMarkup() {
    return `
    <section class="profiles">
      ${this._generateMessageMarkup()}
      ${this._data.profilesCount > 0 ? this._generateProfileCardsMarkup() : ""}

      ${
        this._data.profilesCount > MAX_PAGES_NUM
          ? this._generatePaginationMarkup()
          : ""
      }
    </section>`;
  }

  _generateMessageMarkup() {
    return `
      <div class="message">
        <p class="message__text">
          Found ${this._data.profilesCount} results for 
          <span class="searched-name">
          ${this._data.query}
          </span>
          , <span>Page ${this._data.currentPage}</span>
        </p>
      </div>`;
  }

  _generateProfileCardsMarkup() {
    let markup = `<div class="profiles-container">`;
    markup += this._data.profiles
      .map((profile) => {
        return `
      <a href="./#${profile.username}" data-username="${profile.username}" class="card">
        <img src="${profile.avatar}" alt="${profile.username}'s Image" class="card__image">
        <h4 class="card__profile-name">${profile.username}</h4>
      </a>`;
      })
      .join("");
    markup += `</div>`;
    return markup;
  }

  _generatePaginationMarkup() {
    return `
      <div class="pagination">
        <a href="#" class="pagination__link pagination__prev ${
          this._data.currentPage <= 1 ? "pagination__link--disable" : ""
        }" data-page="${--this._data.currentPage}">
          <!-- Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="arrow-circle-left">
            <path fill="#353535"
              d="M8.29,11.29a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l3,3a1,1,0,0,0,1.42-1.42L11.41,13H15a1,1,0,0,0,0-2H11.41l1.3-1.29a1,1,0,0,0,0-1.42,1,1,0,0,0-1.42,0ZM2,12A10,10,0,1,0,12,2,10,10,0,0,0,2,12Zm18,0a8,8,0,1,1-8-8A8,8,0,0,1,20,12Z">
            </path>
          </svg>
          Previous
        </a>

        <a href="#" class="pagination__link pagination__next ${
          ++this._data.currentPage >= MAX_PAGES_NUM
            ? "pagination__link--disable"
            : ""
        }" data-page="${++this._data.currentPage}">
          Next
          <!-- Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="arrow-circle-right">
            <path fill="#353535"
              d="M15.71,12.71a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-3-3a1,1,0,0,0-1.42,1.42L12.59,11H9a1,1,0,0,0,0,2h3.59l-1.3,1.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0ZM22,12A10,10,0,1,0,12,22,10,10,0,0,0,22,12ZM4,12a8,8,0,1,1,8,8A8,8,0,0,1,4,12Z">
            </path>
          </svg>
        </a>
      </div>
    `;
  }
}

export default new ProfilesView();
