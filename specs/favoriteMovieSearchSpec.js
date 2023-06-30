import FavoriteMovieIdb from '../src/scripts/data/favorite-movie-idb';
import FavoriteMovieSearchPresenter from '../src/scripts/views/pages/liked-movies/favorite-movie-search-presenter';
import FavoriteMovieSearchView from '../src/scripts/views/pages/liked-movies/favorite-movie-search-view';

describe('Searching movies', () => {
  let presenter;
  let favoriteMovies;
  let view;

  const searchMovies = (query) => {
    const queryElement = document.getElementById('query');
    queryElement.value = query;
    queryElement.dispatchEvent(new Event('change'));
  };

  const setMovieSearchContainer = () => {
    view = new FavoriteMovieSearchView();
    document.body.innerHTML = view.getTemplate();
  };

  const constructPresenter = () => {
    favoriteMovies = spyOnAllFunctions(FavoriteMovieIdb);
    presenter = new FavoriteMovieSearchPresenter({
      favoriteMovies,
      view,
    });
  };

  beforeEach(() => {
    setMovieSearchContainer();
    constructPresenter();
  });

  describe('When query is not empty', () => {
    it('should be able to capture the query typed by the user', () => {
      searchMovies('film a');

      expect(presenter.latestQuery).toEqual('film a');
    });

    it('should ask the model to search for liked movies', () => {
      searchMovies('film a');

      expect(favoriteMovies.searchMovies).toHaveBeenCalledWith('film a');
    });

    it('should show the movies found by Favorite Movies', (done) => {
      document.getElementById('movies')
        .addEventListener('movies:updated', () => {
          expect(document.querySelectorAll('.movie-item').length).toEqual(3);
          done();
        });

      favoriteMovies.searchMovies.withArgs('film a').and.returnValues(
        [
          { id: 111, title: 'film abc' },
          { id: 222, title: 'ada juga film abcde' },
          { id: 333, title: 'ini juga boleh film a' },
        ],
      );
      searchMovies('film a');
    });

    it('should "-" when the movie returned does not contain a title', (done) => {
      document.getElementById('movies')
        .addEventListener('movies:updated', () => {
          const movieTitles = document.querySelectorAll('.movie__title');
          expect(movieTitles.item(0).textContent).toEqual('-');
          done();
        });

      favoriteMovies.searchMovies.withArgs('film a').and.returnValues([
        { id: 444 },
      ]);
      searchMovies('film a');
    });

    it('should show the name of the movies found by Favorite Movies', (done) => {
      document.getElementById('movies')
        .addEventListener('movies:updated', () => {
          const movieTitles = document.querySelectorAll('.movie__title');
          expect(movieTitles.item(0).textContent).toEqual('film abc');
          expect(movieTitles.item(1).textContent).toEqual('ada juga film abcde');
          expect(movieTitles.item(2).textContent).toEqual('ini juga boleh film a');
          done();
        });

      favoriteMovies.searchMovies.withArgs('film a').and.returnValues(
        [
          { id: 111, title: 'film abc' },
          { id: 222, title: 'ada juga film abcde' },
          { id: 333, title: 'ini juga boleh film a' },
        ],
      );
      searchMovies('film a');
    });
  });

  describe('When query is empty', () => {
    it('should capture the query empty', () => {
      searchMovies('');
      expect(presenter.latestQuery).toEqual('');
      expect(presenter.latestQuery.length).toEqual(0);

      searchMovies(' ');
      expect(presenter.latestQuery).toEqual('');
      expect(presenter.latestQuery.length).toEqual(0);

      searchMovies('  ');
      expect(presenter.latestQuery).toEqual('');
      expect(presenter.latestQuery.length).toEqual(0);

      searchMovies('\t');
      expect(presenter.latestQuery).toEqual('');
      expect(presenter.latestQuery.length).toEqual(0);
    });

    it('should show all favorite movies', () => {
      searchMovies('   ');
      expect(favoriteMovies.getAllMovies).toHaveBeenCalled();
      expect(favoriteMovies.getAllMovies).toHaveBeenCalledTimes(1);
    });
  });

  describe('When no favorite movies could be founded', () => {
    it('should show the empty message', (done) => {
      document.getElementById('movies')
        .addEventListener('movies:updated', () => {
          expect(document.querySelectorAll('.movie-item__not__found').length).toEqual(1);
          done();
        });

      favoriteMovies.searchMovies.withArgs('film a').and.returnValues([]);
      searchMovies('film a');
    });

    it('should not show any movie', (done) => {
      document.getElementById('movies')
        .addEventListener('movies:updated', () => {
          expect(document.querySelectorAll('.movie-item').length).toEqual(0);
          done();
        });

      favoriteMovies.searchMovies.withArgs('film a').and.returnValues([]);
      searchMovies('film a');
    });
  });
});
