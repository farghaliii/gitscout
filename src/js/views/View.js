export class View {
  _data;

  render(data) {
    this._data = data;
    this._updatePageTitle();
    this._clear();
    this._parentEl.insertAdjacentHTML("beforeend", this._generateMarkup());
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg class="spinner__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>`;
    this._clear();
    this._parentEl.classList.remove("visually-hidden");
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderErrorMessage(error = "") {
    const markup = `
    <div class="message message--error">
      <p>Something went wrong!</p>
      <p class="message--error__detials">${error}</p>
    </div>`;
    this._parentEl.innerHTML = "";
    this._parentEl.classList.remove("visually-hidden");
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    this._parentEl.innerHTML = "";
  }
}
