'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getMovies = require('./modules/Movies.js')
const weather = require('./modules/Weather.js');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/movies', getMovies);
app.get('/weather', weatherHandler);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}

app.listen(PORT, () => console.log(`Server up on ${PORT}`));
