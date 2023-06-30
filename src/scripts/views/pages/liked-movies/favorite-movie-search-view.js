import { createMovieItemTemplate } from '../../templates/template-creator';

class FavoriteMovieSearchView {
  getTemplate() {
    return `
      <div class="content">
        <input id="query" type="text">
        <h2 class="content__heading">Your Liked Movie</h2>
        <div id="movies" class="movies">
        </div>
      </div>
  `;
  }

  _getEmptyMoviesTemplate() {
    return `
      <div class="movie-item__not__found">Tidak ada film untuk ditampilkan</div>
    `;
  }

  _runWhenUserIsSearching(callback) {
    document.querySelector('#query').addEventListener('change', (event) => {
      callback(event.target.value);
    });
  }

  showFavoriteMovies(movies) {
    if (!movies) return;

    const moviesContainer = document.querySelector('.movies');
    moviesContainer.innerHTML = '';

    if (!movies.length) {
      moviesContainer.innerHTML = this._getEmptyMoviesTemplate();
    }

    movies.forEach((movie) => {
      moviesContainer.innerHTML += createMovieItemTemplate(movie);
    });

    document.getElementById('movies').dispatchEvent(new Event('movies:updated'));
  }
}

export default FavoriteMovieSearchView;
