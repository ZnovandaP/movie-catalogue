const { pause } = require('codeceptjs');
const assert = require('assert');

Feature('Liking Movies');

Before(({ I }) => {
  I.amOnPage('/#/like');
});

Scenario('showing empty liked movies', ({ I }) => {
  I.seeElement('#query');
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');
});

Scenario('liking one movie', async ({ I }) => {
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');
  I.amOnPage('/');

  I.waitForElement('.movie__title a');
  I.seeElement('.movie__title a');
  const firstMovie = locate('.movie__title a').first();
  const firstMovieTitle = await I.grabTextFrom(firstMovie);
  I.click(firstMovie);

  I.waitForElement('#likeButton');
  I.seeElement('#likeButton');
  I.click('#likeButton');

  I.amOnPage('/#/like');
  I.seeElement('.movie-item');
  const likeFMovieTitle = await I.grabTextFrom('.movie__title a');

  assert.strictEqual(firstMovieTitle, likeFMovieTitle);
});

Scenario('searching movies', async ({ I }) => {
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');
  I.amOnPage('/');

  I.waitForElement('.movie__title a');
  I.seeElement('.movie__title a');

  const titles = [];
  const totalMovieLike = 3;
  for (let i = 0; i < totalMovieLike; i++) {
    I.click(locate('.movie__title a').at(i + 1));
    I.waitForElement('#likeButton');
    I.seeElement('#likeButton');
    I.click('#likeButton');
    titles.push(await I.grabTextFrom('.movie__title'));
    I.amOnPage('/');
  }

  I.amOnPage('/#/like');
  I.seeElement('#query');

  const searchQuery = titles[1].substring(1, 3);
  const matchingMovies = titles.filter((title) => title.indexOf(searchQuery) !== -1);

  I.fillField('#query', searchQuery);
  I.pressKey('Enter');

  const getTotalLikeMoviesAfterQuery = await I.grabNumberOfVisibleElements('.movie-item');
  assert.strictEqual(matchingMovies.length, getTotalLikeMoviesAfterQuery);

  matchingMovies.forEach(async (title, index) => {
    const getTitleLikeMoviesAfterQuery = await I.grabTextFrom(locate('.movie__title').at(index + 1));
    assert.strictEqual(title, getTitleLikeMoviesAfterQuery);
  });
});
