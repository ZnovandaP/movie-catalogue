class FavoriteMovieSearchPresenter {
  constructor({ favoriteMovies, view }) {
    this._view = view;
    this._favoriteMovies = favoriteMovies;
    this._listenToSearchRequestByUser();
  }

  _listenToSearchRequestByUser() {
    this._view._runWhenUserIsSearching((latestQuery) => {
      this._searchMovies(latestQuery);
    });
  }

  async _searchMovies(latestQuery) {
    this._latestQuery = latestQuery.trim();

    let foundMovies;
    if (!this._latestQuery.length) {
      foundMovies = await this._favoriteMovies.getAllMovies();
    } else {
      foundMovies = await this._favoriteMovies.searchMovies(this._latestQuery);
    }
    this._showFoundMovies(foundMovies);
  }

  _showFoundMovies(movies) {
    this._view.showFavoriteMovies(movies);
  }

  get latestQuery() {
    return this._latestQuery;
  }
}

export default FavoriteMovieSearchPresenter;
