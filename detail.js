$(document).ready(function () {
const queryString = window.location.search;
const parameters = new URLSearchParams(queryString);
const movieId = parameters.get('movie-id');

$.ajax({
    url: `https://api.themoviedb.org/3/movie/${movieId}?api_key=69276f9e5d744ab6e6f496a04f002283&language=vi-VN
    `,
    type: 'GET',
    data: {},
    success: function (response) {
      const data = response;
  
      $('.backdrop').prop(
        'style',
        `background-image: url(https://image.tmdb.org/t/p/original${data.backdrop_path})`
      );
      $('.img').prop(
        'src',
        `https://image.tmdb.org/t/p/original${data.poster_path}`
      );
      $('.title').html(data.title);
      $('.subtitle').html(`${data.original_title} (${data.release_date})`);
      $('.time').html(`${data.runtime} phút`);
      $('.content-rating').html(data.vote_average);
      $('.director').html(data.production_companies[0].name)
      $('.country').find('a').html(data.production_countries[0].name);
      $('.released').html(data.release_date);
      $('.intro').html(data.overview);
      data.genres.map((item) => {
        $('.level-right').append(`<a class="button is-link is-small is-rounded is-inverted is-outlined"
        href="#">${item.name}</a>`);
      })
      data.cast
    },
    error: function (error) {
      console.log(`Ajax error: ${error}`);
    },
  });

  $.ajax({
    url: `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=69276f9e5d744ab6e6f496a04f002283&language=vi-VN
    `,
    type: 'GET',
    data: {},
    success: function (response) {
      const data = response;
      data.cast.slice(0,6).forEach((item) => {
        $('.slick-list').append(` <div data-index="1" class="slick-slide slick-active" aria-hidden="false"
        style="outline: none; width: 131px;">
        <div>
          <div class="item"style="width: 100%; display: inline-block;"><a class="image"
              href="/person/eugenio-derbez~7143">
              <figure><img
              src="https://image.tmdb.org/t/p/w138_and_h175_face/${item.profile_path}"
                  alt="${item.name}"></figure>
            </a>
            <p><a class="name" href="/person/eugenio-derbez~7143">${item.name}</a></p>
            <p class="character">${item.character}</p>
          </div>
        </div>
      </div>`);
      })
    },
    error: function (error) {
      console.log(`Ajax error: ${error}`);
    },
  });
});