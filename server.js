'use strict';

console.log('Hello from server');


// ** REQUIRES**
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const data = require('./data/weather.json');


// Once express is sin we activate it to use it
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

app.get('/weather', (request, response, next) => {
  try {
    let lat = request.query.lat; //querys for key
    let lon = request.query.lon;
    let {searchQuery} = request.query;

    let dataToGroom = data.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());
    let dataToSend = (dataToGroom.data.map((day) => new Forecast(day)));

    response.status(200).send(dataToSend);

  } catch (error) {
    next(error);
  }
});

// class to groom bulky data

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
