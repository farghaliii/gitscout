import { REPOS_PER_PAGE } from "../config";
import { sanitizeData } from "../helpers";
import { View } from "./View";

class ProfileView extends View {
  _parentEl = document.querySelector(".main-container");

  constructor() {
    super();
    this._handleRenderPagination();
  }

  renderBookmarkSign(isBookmarked = false) {
    const el = document.querySelector(".profile__bookmark");
    el.innerHTML = "";
    el.insertAdjacentHTML(
      "afterbegin",
      this._renderBookmarkSignMarkup(isBookmarked)
    );
  }

  addHandlerRender(handler) {
    this._parentEl.addEventListener("click", (e) => {
      if (!e.target.closest(".card--follower")) return;

      e.preventDefault();
      const user = e.target.closest(".card--follower")?.dataset.username;

      if (!user) return;
      handler(e, user);
    });

    window.addEventListener("load", handler);
    window.addEventListener("hashchange", handler);
  }

  addHandlerBookmarking(handler) {
    this._parentEl.addEventListener("click", (e) => {
      if (!e.target.closest(".btn-bookmark")) return;
      handler();
    });
  }

  _renderBookmarkSignMarkup(isBookmarked) {
    return `${
      isBookmarked
        ? `<button class="btn-bookmark">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="bookmark"><path fill="#222" d="M18 22a1 1 0 0 1-.5-.134L12 18.694l-5.5 3.172A1 1 0 0 1 5 21V5a3.003 3.003 0 0 1 3-3h8a3.003 3.003 0 0 1 3 3v16a1 1 0 0 1-1 1Z"></path></svg>
        </button>`
        : `<button class="btn-bookmark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="bookmark"><path fill="#222" d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Zm1,17.27-4.5-2.6a1,1,0,0,0-1,0L7,19.27V5A1,1,0,0,1,8,4h8a1,1,0,0,1,1,1Z"></path></svg>
          </button>`
    }`;
  }

  _handleRenderPagination() {
    this._parentEl.addEventListener("click", (e) => {
      if (
        !e.target.closest(".pagination__link") ||
        !e.target.closest(".profile")
      )
        return;

      e.preventDefault();

      const page = +e.target.closest(".pagination__link")?.dataset.page;

      if (!page || page <= 0 || page > this._data.repos.pagesCount) return;

      this._data.repos.currentPage = page;

      const profileReposFollowersEl = document.querySelector(
        ".profile__repos-followers"
      );
      const profileReposEl = document.querySelector(".profile__repos");
      profileReposEl.remove();
      profileReposFollowersEl.insertAdjacentHTML(
        "afterbegin",
        this._generateReposMarkup(page)
      );
    });
  }

  _updatePageTitle() {
    const favicon = document.getElementById("favicon");
    favicon.href = `${this._data.avatar}`;
    document.title = `${this._data.name ?? this._data.username}'s Profile`;
  }

  _generateMarkup() {
    return `
    <section class="profile">
      ${this._generateProfileInfoMarkup()}
      ${this._generateReposFollowersMarkup()}
    </section>`;
  }

  _generateProfileInfoMarkup() {
    return `
    <div class="profile__info">
      <div class="profile__image-box">
        <img
          class="profile__image"
          src="${this._data.avatar}" 
          alt="${this._data.username}'s Image">
      </div>

      <div class="profile__description-box">
        <div class="profile__description">

          <div class="profile__name-bookmarking-box">
            <h2 class="profile__name">
              ${this._data.name ?? this._data.username}
            </h2>
            <div class="profile__bookmark">
              ${this._renderBookmarkSignMarkup(this._data.isBookmarked)}
            </div>
          </div>

          <div>
            <a
              href="${this._data.githubLink}" 
              target="_blank" 
              class="profile__username">${this._data.username}
            </a>
            
            ${
              this._data.bio
                ? `<span class="profile__bio">
                      ${sanitizeData(this._data.bio)}
                   </span>`
                : ``
            }

            ${
              this._data.blog
                ? `
                  <a href="${this._data.blog}" target="_blank" class="profile__blog">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="link">
                      <path fill="#222" d="M10,17.55,8.23,19.27a2.47,2.47,0,0,1-3.5-3.5l4.54-4.55a2.46,2.46,0,0,1,3.39-.09l.12.1a1,1,0,0,0,1.4-1.43A2.75,2.75,0,0,0,14,9.59a4.46,4.46,0,0,0-6.09.22L3.31,14.36a4.48,4.48,0,0,0,6.33,6.33L11.37,19A1,1,0,0,0,10,17.55ZM20.69,3.31a4.49,4.49,0,0,0-6.33,0L12.63,5A1,1,0,0,0,14,6.45l1.73-1.72a2.47,2.47,0,0,1,3.5,3.5l-4.54,4.55a2.46,2.46,0,0,1-3.39.09l-.12-.1a1,1,0,0,0-1.4,1.43,2.75,2.75,0,0,0,.23.21,4.47,4.47,0,0,0,6.09-.22l4.55-4.55A4.49,4.49,0,0,0,20.69,3.31Z">
                      </path>
                    </svg>
                      ${this._data.blog}
                  </a>
                `
                : ``
            }

            ${
              this._data.email
                ? `
                <a href="mailto:${this._data.email}" target="_blank" class="profile__email">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="envelope">
                    <path fill="#222" d="M19,4H5A3,3,0,0,0,2,7V17a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm-.41,2-5.88,5.88a1,1,0,0,1-1.42,0L5.41,6ZM20,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V7.41l5.88,5.88a3,3,0,0,0,4.24,0L20,7.41Z">
                    </path>
                  </svg>
                    ${this._data.email}
                </a>
                `
                : ``
            }

            ${
              this._data.twitterLink
                ? `
                <a href="https://twitter.com/${this._data.twitterLink}" target="_blank" class="profile__blog">
                  <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="twitter-alt">
                    <path fill="#222" d="M22.99121,3.9502a.99942.99942,0,0,0-1.51074-.85938,7.47956,7.47956,0,0,1-1.873.793,5.15234,5.15234,0,0,0-3.374-1.24219,5.23238,5.23238,0,0,0-5.22363,5.06348A11.03194,11.03194,0,0,1,4.19629,3.78125,1.01154,1.01154,0,0,0,3.33887,3.416a.99852.99852,0,0,0-.78516.5,5.2755,5.2755,0,0,0-.24219,4.76855l-.00195.00195a1.0411,1.0411,0,0,0-.49512.88868,3.04174,3.04174,0,0,0,.02637.43945,5.1854,5.1854,0,0,0,1.56836,3.3125.99813.99813,0,0,0-.06641.76953,5.20436,5.20436,0,0,0,2.36231,2.92187,7.46464,7.46464,0,0,1-3.58985.44825.99975.99975,0,0,0-.665,1.833A12.94248,12.94248,0,0,0,8.46,21.36133,12.7878,12.7878,0,0,0,20.9248,11.998,12.82166,12.82166,0,0,0,21.46,8.35156c0-.06543,0-.13281-.001-.20019A5.76963,5.76963,0,0,0,22.99121,3.9502ZM19.68457,7.16211a.995.995,0,0,0-.2334.70215c.00977.165.00879.331.00879.4873a10.82371,10.82371,0,0,1-.4541,3.08106A10.68457,10.68457,0,0,1,8.46,19.36133a10.93791,10.93791,0,0,1-2.55078-.30078,9.47951,9.47951,0,0,0,2.94238-1.56348A1.00033,1.00033,0,0,0,8.25,15.71094a3.208,3.208,0,0,1-2.21387-.93457q.22413-.04248.44532-.10547a1.00026,1.00026,0,0,0-.08008-1.94336,3.19824,3.19824,0,0,1-2.25-1.72559,5.29929,5.29929,0,0,0,.54492.0459,1.02093,1.02093,0,0,0,.9834-.69629A.9998.9998,0,0,0,5.2793,9.21484,3.19559,3.19559,0,0,1,3.85547,6.542c0-.0664.00195-.13281.00586-.19824a13.01365,13.01365,0,0,0,8.209,3.47949,1.02046,1.02046,0,0,0,.81739-.3584,1.00037,1.00037,0,0,0,.206-.86816,3.15653,3.15653,0,0,1-.08691-.72852A3.23,3.23,0,0,1,16.2334,4.6416a3.18428,3.18428,0,0,1,2.34472,1.02051A.993.993,0,0,0,19.499,5.96a9.27073,9.27073,0,0,0,1.21192-.32226A6.68126,6.68126,0,0,1,19.68457,7.16211Z">
                    </path>
                  </svg>
                    ${this._data.twitterLink}
                </a>
                `
                : ``
            }
            ${
              this._data.location
                ? `
                <span class="profile__location">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="location-pin-alt">
                  <path fill="#222" d="M12,10.8a2,2,0,1,0-2-2A2,2,0,0,0,12,10.8Zm-.71,6.91a1,1,0,0,0,1.42,0l4.09-4.1a6.79,6.79,0,1,0-9.6,0ZM7.23,8.34A4.81,4.81,0,0,1,9.36,4.79a4.81,4.81,0,0,1,5.28,0,4.82,4.82,0,0,1,.75,7.41L12,15.59,8.61,12.2A4.77,4.77,0,0,1,7.23,8.34ZM19,20H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z">
                  </path>
                </svg>
                ${
                  this._data.location.toLowerCase().includes("israel")
                    ? `<span class="israel">${this._data.location}</span> <span class="palestine"><font color="red">Pal</font><font color="white">est</font><font color="green">ine</font></span>`
                    : this._data.location
                }
                </span>
                `
                : ``
            }
          </div>

        </div>

        <div class="profile__stats">
          <div class="profile__stat">
            <span class="number">${this._data.followersCount}</span>
            <span class="keyword">Followers</span>
          </div>
  
          <div class="profile__stat">
            <span class="number">${this._data.followingCount}</span>
            <span class="keyword">Following</span>
          </div>
  
          <div class="profile__stat">
            <span class="number">${this._data.reposCount}</span>
            <span class="keyword">Repos</span>
          </div>
        </div>

      </div>
    </div>
    `;
  }

  _generateReposFollowersMarkup() {
    return `
    <div class="profile__repos-followers">
      ${this._generateReposMarkup()}
      <div class="profile__followers">
        <h3 class="followers__title">Followers</h3>
        <div class="followers">
          ${
            this._data.followers.length > 0
              ? this._generateFollowersMarkup()
              : this._generateNoDataMarkup("followers")
          }
        </div>
      </div>
    </div>`;
  }

  _generateReposMarkup(page = 1) {
    return `
    <div class="profile__repos">
      <div>
      <h3 class="repos__title">Repositories</h3>
      ${
        this._data.repos.items.length <= REPOS_PER_PAGE - 1
          ? ""
          : this._generatePaginationMarkup()
      }
      </div>
      <div class="repos">
        ${
          this._data.repos.pagesCount > 0
            ? this._generateReposListMarkup(page)
            : this._generateNoDataMarkup("repositories")
        }
      </div>
    </div>
    `;
  }

  _generateReposListMarkup(page) {
    const startRepo = (page - 1) * REPOS_PER_PAGE;
    let endRepo;

    if (this._data.repos.items.length < REPOS_PER_PAGE) {
      endRepo = this._data.repos.items.length;
    } else {
      if (page * REPOS_PER_PAGE < this._data.repos.items.length) {
        endRepo = page * REPOS_PER_PAGE;
      } else {
        endRepo = this._data.repos.items.length;
      }
    }

    let markup = ``;
    for (let i = startRepo; i < endRepo; i++) {
      const repo = this._data.repos.items[i];
      markup += `
      <div class="repo">
        <div class="repo__upper-part">
          <a href="${repo.url}" class="repo__name" target="_blank">
            ${repo.name}
          </a>
          <p class="repo__description">${repo.description}</p>
        </div>
        <div class="repo__bottom-part">
          <div>
            ${
              repo.language
                ? `<span class="repo__lang">${repo.language}</span>`
                : ""
            }
            <div class="repo__star">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="star">
                <path fill="#222"
                  d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68a1,1,0,0,0,.4,1,1,1,0,0,0,1.05.07L12,18.76l5.1,2.68a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.89l.72,4.19-3.76-2a1,1,0,0,0-.94,0l-3.76,2,.72-4.19a1,1,0,0,0-.29-.89l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z">
                </path>
              </svg>
              <span>${repo.starsCount}</span>
            </div>
            <div class="repo__forked">
              <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="code-branch">
                <path fill="#222"
                  d="M17 6.06a3 3 0 0 0-1.15 5.77A2 2 0 0 1 14 13.06h-4a3.91 3.91 0 0 0-2 .56V7.88a3 3 0 1 0-2 0v8.36a3 3 0 1 0 2.16.05A2 2 0 0 1 10 15.06h4a4 4 0 0 0 3.91-3.16A3 3 0 0 0 17 6.06Zm-10-2a1 1 0 1 1-1 1 1 1 0 0 1 1-1Zm0 16a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm10-10a1 1 0 1 1 1-1 1 1 0 0 1-1 1Z">
                </path>
              </svg>
              <span>${repo.forksCount}</span>
            </div>
          </div>
          <p class="repo__last-push">${repo.lastUpdate}</p>
        </div>
      </div>`;
    }
    return markup;
  }

  _generateFollowersMarkup() {
    return this._data.followers
      .map((follower) => {
        return `
          <a href="#${follower.username}" data-username="${follower.username}" class="card card--follower">
            <div class="card__image-box">
              <img class="card__image" src="${follower.avatar}"
                alt="${follower.username}'s Image">
            </div>
            <h4 class="card__profile-name">${follower.username}</h4>
          </a>
        `;
      })
      .join("");
  }

  _generatePaginationMarkup() {
    return `
      <div class="pagination">
        <a href="#" class="pagination__link pagination__prev ${
          this._data.repos.currentPage <= 1 ? "pagination__link--disable" : ""
        }" data-page="${this._data.repos.currentPage - 1}">
          <!-- Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="arrow-circle-left">
            <path fill="#222"
              d="M8.29,11.29a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l3,3a1,1,0,0,0,1.42-1.42L11.41,13H15a1,1,0,0,0,0-2H11.41l1.3-1.29a1,1,0,0,0,0-1.42,1,1,0,0,0-1.42,0ZM2,12A10,10,0,1,0,12,2,10,10,0,0,0,2,12Zm18,0a8,8,0,1,1-8-8A8,8,0,0,1,20,12Z">
            </path>
          </svg>
          Previous
        </a>

        <a href="#" class="pagination__link pagination__next ${
          this._data.repos.currentPage >= this._data.repos.pagesCount
            ? "pagination__link--disable"
            : ""
        }" data-page="${this._data.repos.currentPage + 1}">
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

  _generateNoDataMarkup(dataType) {
    return `
      <div class="message message--no-data">
        <p class="message__text">
          Oops! It seems there's no ${dataType}.
        </p>
      </div>`;
  }
}

export default new ProfileView();
