'use strict';
const axios = require('axios');

let cache = {};

// create key for data to store
// if data exist and valid timeframe ... send data
// if data DOES NOT exist - call API and cache what is returned from API

async function getMovies(request, response, next){
  try {

    let query = request.query.query;

    let key = `${query}Movie`; // key  cache[movie]


    // if time is valid then send data
    if(cache[key] && (Date.now() - cache[key].timeStamp < 10000)){
      console.log('cache hit');
      response.status(200).send(cache[key].data);
    } else{

      console.log('cache miss');
      let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}&language=en-US&page=1&include_adult=false`;
      let moviesFromAxios = await axios.get(url);
      let arrayOfMovies = moviesFromAxios.data.results;
      let newMovieArray = (arrayOfMovies.map((movie) => new Movie(movie)));

      cache[key] = {
        data: arrayOfMovies,
        timeStamp: Date.now()
      };
      response.status(200).send(newMovieArray);

    }

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
