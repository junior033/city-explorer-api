'use strict';
const axios = require('axios');

async function getWeather(request, response, next) {
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
}

// class to groom bulky data
class Forecast{
  constructor(day){
    this.date = day.valid_date;
    this.description = day.weather.description;
  }
}

module.exports = getWeather;