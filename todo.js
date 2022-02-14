$(document).ready(function () {
  // navbar on scroll handler
  $(window).scroll(function () {
    $(window).scrollTop() >= 100 ? $('nav').addClass('navbar-color') : $('nav').removeClass('navbar-color');
  });

  const getMoviesPopularApi = 'https://api.themoviedb.org/3/movie/popular?api_key=69276f9e5d744ab6e6f496a04f002283&language=vi-VN&page=1';
  const getMovieLasterApi = 'https://api.themoviedb.org/3/movie/now_playing?api_key=69276f9e5d744ab6e6f496a04f002283&language=vi-VN&page=1';
  let popularSelector = $('#movies-list');
  let lasterSelector = $('.movies-list');
  const getMovie = async (api, selector) => {
    try {
      const listDataApi = await $.get(api);
      const dataResults = listDataApi.results.slice(0, 8);
      dataResults.forEach(movie => {
        selector.append(`<div class='movies-box'>
        <a href='/detailMovie.html?movie-id=${movie.id}'>

          <div class='movies-img'>
              <div class='quality'>${movie.id}</div>
                <img alt='${movie.original_title}' src='https://image.tmdb.org/t/p/w300${movie.poster_path}'>
          </div>
          </a>

          <a href='/detailMovie.html?movie-id=${movie.id}'>
              ${movie.title}
          </a>
          <a href='/detailMovie.html?movie-id=${movie.id}'>
            <p style = "color:gray">
                ${movie.original_title}
            </p>
          </a>
      </div>`);
      });
    } catch (error) {
      console.log('Error: ' + error);
    }
  };
  //Get movie popular
  getMovie(getMoviesPopularApi, popularSelector);
  //Get movie laster
  getMovie(getMovieLasterApi, lasterSelector);

  //Get genres
  $.ajax({
    url: 'https://api.themoviedb.org/3/genre/movie/list?api_key=69276f9e5d744ab6e6f496a04f002283&language=vi-VN',
    type: 'GET',
    data: '',
    success: function (response) {
      var genres = response.genres;
      genres.forEach((genre) => {
        $('#genres-selector').append(`<option value='${genre.id}'>${genre.name}</option>`);
      });
    }
  });

  //Get countries
  $.ajax({
    url: 'https://api.themoviedb.org/3/configuration/languages?api_key=69276f9e5d744ab6e6f496a04f002283',
    type: 'GET',
    data: '',
    success: function (countries) {
      const listCountries = ["vi", "de", "en", "fr", "ja", "ko", "th"];
      countries.forEach((country) => {
        listCountries.includes(country.iso_639_1) &&
        $('#countries-selector').append(`<option value=${country.iso_639_1}>${country.english_name}</option>`);
      });
    }
  });

  //searching
  const popularMoviesSelectorForSearch = $(".search-box__search-results").find(
    ".row"
  );

  let timeout;
  $("#search").on("keyup input", function () {
    const term = $(this).val();

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      if (term.trim().length) {
        $.get(
          `https://api.themoviedb.org/3/search/movie?api_key=69276f9e5d744ab6e6f496a04f002283&language=vi-VN&query=${term.trim()}&page=1&include_adult=false`
        ).done(function (data) {
          popularMoviesSelectorForSearch.empty();
          data.results.length
            ? data.results
              .slice(0, 10)
              .forEach((movie) =>
                popularMoviesSelectorForSearch.append(`<div class='movies-box'>
                <div class='movies-img'>
                    <div class='quality'>${movie.id}</div>
                    <img alt='${movie.original_title}' src='https://image.tmdb.org/t/p/w300${movie.poster_path}'>
                </div>
                <a href='detailMovie.html'>
                    ${movie.title}
                </a>
                <p style = "color:gray">
                    ${movie.original_title}
                </p>
            </div>`)
              )
            : popularMoviesSelectorForSearch.html(
              `<div style="color:red; margin-left:500px" class="w-100">Không có kết quả nào cho từ khoá <p class="h4">${term.trim()}</p></div>`
            );
        });
      } else {
        popularMoviesSelectorForSearch.empty();
        getMovie(getMoviesPopularApi, popularSelector);
      }
    }, 500);
  });

  // initialize pagination
  const paginationInit = (totalPage) => {
    $(".pagination").empty();
    const page = (index) =>
      `<li class="page-item ${1 === index && "active"
      }" data-index=${index}><span class="page-link">${index}</span></li>`;
    for (let i = 0; i < totalPage; i++) {
      $(".pagination").append(page(i + 1));
    }
  };

  // pagination buttons clicked handler
  $(document).on("click", ".page-item", async function () {
    const currentPage = $(this).data("index");
    const api = $(".pagination").hasClass("pagination--filter")
      ? filterAPICreator(
        $("select").eq(3).val() !== "0" ? $("select").eq(3).val() : undefined,
        $("select").eq(2).val() !== "0" ? $("select").eq(2).val() : undefined,
        $("select").eq(0).val() !== "0" ? $("select").eq(0).val() : undefined,
        $("select").eq(1).val() !== "0" ? $("select").eq(1).val() : undefined,
        currentPage
      )
      : favoriteAPICreator(currentPage);

    await loadingListFromAPI(api);

    $(".page-item").removeClass("active");
    $(this).addClass("active");
  });

  // loading list responded from API and return total pages for pagination
  const loadingListFromAPI = async (api) => {
    try {
      const list = await $.get(api);

      $(".main-view").addClass("hidden");
      section.removeClass("hidden");
      section.find(".row").empty();
      list.results.length
        ? list.results.forEach((movie) =>
          section.find(".row").append(`<div class='movies-box'>
          <div class='movies-img'>
              <div class='quality'>${movie.id}</div>
              <a href='/detailMovie.html?movie-id=${movie.id}'>
                <img alt='${movie.original_title}' src='https://image.tmdb.org/t/p/w300${movie.poster_path}'>
              </a>
          </div>
          <a href='/detailMovie.html?movie-id=${movie.id}'>
              ${movie.title}
          </a>
          <p style = "color:gray">
              ${movie.original_title}
          </p>          
      </div>`)
        )
        : section.find(".row").append("<span>Không có kết quả nào</span>");

      return list.total_pages;
    } catch (error) {
      console.log("Fetching error " + error);
    }
  };

  const callAPI = async (api) => {
    try {
      const totalPages = await loadingListFromAPI(api);
      paginationInit(totalPages < 10 ? totalPages : 10);
    } catch (error) {
      console.log("Fetching error " + error);
    }
  };

  //filter movies
  let section = $(".main-view__section--filter").addClass("hidden");
  const filterAPICreator = (
    sortOrder = "popularity.desc",
    releasedYear = "",
    genreID = "",
    languageID = "",
    page
  ) => {
    return `https://api.themoviedb.org/3/discover/movie?api_key=69276f9e5d744ab6e6f496a04f002283&language=vi-VN&sort_by=${sortOrder}&primary_release_year=${releasedYear}&with_genres=${genreID}&with_original_language=${languageID}&page=${page}&with_watch_monetization_types=flatrate`;
  };

  // filter selects changed handler
  $("select").on("change", async function () {
    const filterListAPI = filterAPICreator(
      $("select").eq(3).val() !== "0" ? $("select").eq(3).val() : undefined,
      $("select").eq(2).val() !== "0" ? $("select").eq(2).val() : undefined,
      $("select").eq(0).val() !== "0" ? $("select").eq(0).val() : undefined,
      $("select").eq(1).val() !== "0" ? $("select").eq(1).val() : undefined,
      1
    );

    await callAPI(filterListAPI);
  });

});