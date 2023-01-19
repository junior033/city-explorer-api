'use strict';

console.log('Hello from server');


// ** REQUIRES**
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

// Once express is in we activate it to use it
const app = express();

// Middleware
// cors acts like a security gaurd that allows us to share resources across the internet
app.use(cors());

// Define a port for server to run on with a back up

const PORT = process.env.PORT || 3002;

// ** END POINTS **

// Base endpoint(route) - proof of life
// 1st arg - endpoint in quotes
// 2nd arg - callback which will execute when someone hits endpoint
// Callback function - 2 parameters: request, response (req, res)
app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server');
});

app.get('/movies', async (request, response, next) => {
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
});



app.get('/weather', async (request, response, next) => {
  try {
    let lat = request.query.lat; //querys for key
    let lon = request.query.lon;
    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&units=I`;

    let dataToGroom = await axios.get(url);
    dataToGroom = dataToGroom.data.data;

    let dataToSend = (dataToGroom.map((day) => new Forecast(day)));

    response.status(200).send(dataToSend);

  } catch (error) {
    next(error);
  }
});

// class to groom bulky data

class Movie{
  constructor(movie){
    this.title = movie.title;
    this.description = movie.overview;
  }
}

class Forecast{
  constructor(day){
    this.date = day.valid_date;
    this.description = day.weather.description;
  }
}

// Catch all endpoint - must be last defined endpoint
app.get('*', (request, response) => {
  response.status(404).send('Error');
});

// Error Handling - plug and play code from express docs
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// Server start

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
