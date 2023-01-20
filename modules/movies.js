'use strict';
const axios = require('axios');

async function getMovies(request, response, next){
  try {

    let query = request.query.query;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}&language=en-US&page=1&include_adult=false`;


    let moviesFromAxios = await axios.get(url);

    let arrayOfMovies = moviesFromAxios.data.results;
    let newMovieArray = (arrayOfMovies.map((movie) => new Movie(movie)));

    response.status(200).send(newMovieArray);

  } catch (error) {
    next(error);
  }
}

// class to groom bulky data
class Movie{
  constructor(movie){
    this.title = movie.title;
    this.description = movie.overview;
  }
}

module.exports = getMovies;
