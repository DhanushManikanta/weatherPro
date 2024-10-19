let cityInput = document.getElementById("city");
let searchBtn = document.getElementById("search");
let Humidityval = document.getElementById("Humidityval");
let visibilityval = document.getElementById("visibilityval");
let feelslikeval = document.getElementById("feelslikeval");
let Pressureval = document.getElementById("Pressureval");
let hourlyForecastContainer = document.querySelector(".hourlyforecast");
let highlights = document.getElementsByClassName("highlights");
let speedval = document.getElementById("speedval");
let currentWeatherCard = document.querySelectorAll(".weather-left .card")[0];
let forecastWeatherCard = document.getElementById("forecastWeatherCard");
const api_Key = "241332460b45f4546518c7245c4b7e0b";


function getWeatherDetails(name, lat, lon, country, state) {
  let url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_Key}`;
  let forecast_Api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_Key}`;
  let weather_Api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_Key}`;
  let air_pollution_Api = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_Key}`;
  (days = ["sunday", "monday", "tuesday", "thursday", "friday", "saturday"]),
    (months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ]);
  fetch(weather_Api)
    .then((res) => res.json())
    .then((data) => {
      let date = new Date();
      currentWeatherCard.innerHTML = `<div class="current-weather">
                        <div class="details">
                           <div class="data">
                            <p>Now</p>
                            <h2>${(data.main.temp - 273.15).toFixed(
                              2
                            )}&deg;c</h2>
                            <p>${data.weather[0].description}</p>
                           </div>
                            <div class="weather-icon">
                                <img src="https://openweathermap.org/img/wn/${
                                  data.weather[0].icon
                                }@2x.png" alt="">
                            </div>
                        </div>
                        <hr>
                        <div class="card-footer">
                            <p>${days[date.getDay()]},${date.getDate()},${
        months[date.getMonth()]
      }  ${date.getFullYear()}</p>

                            <p>${name},${country}</p>
                        </div>
                    </div>`;

      // Check if the data is valid
      if (data && data.main && data.wind) {
        // Update the values using the data from the API
        Humidityval.innerHTML = `${data.main.humidity}%`;
       visibilityval.innerHTML = `${(data.visibility / 1000).toFixed(2)} km`; // Convert meters to kilometers
        feelslikeval.innerHTML = `${(data.main.feels_like - 273.15).toFixed(
          2
        )}&deg;C`; // Convert Kelvin to Celsius
        Pressureval.innerHTML = `${data.main.pressure} hPa`;
       speedval.innerHTML = `${data.wind.speed} m/s`;
      } else {
        alert("Weather data not available.");
      }
    })

    .catch(() => {
      alert(`failed to fetch`);
    });
  fetch(forecast_Api)
    .then((res) => res.json())
    .then((data) => {
      let uniqueForecast = {};
      let fiveDaysForecast = data.list.filter((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecast[forecastDate]) {
          uniqueForecast[forecastDate] = true;
          return true;
        }
        return false;
      });
      forecastWeatherCard.innerHTML = ""; // Clear existing content
      for (let i = 0; i < fiveDaysForecast.length; i++) {
        let date = new Date(fiveDaysForecast[i].dt_txt);
        forecastWeatherCard.innerHTML += `
        <div class="day-forecast">
          <div class="forecast-item">
            <div class="icon-wrapper">
              <img src="https://openweathermap.org/img/wn/${
                fiveDaysForecast[i].weather[0].icon
              }.png" alt="">
              <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(
                2
              )}&deg;C</span>
            </div>
          </div>
          <p>${date.getDate()} ${months[date.getMonth()]}</p>
          <p>${days[date.getDay()]}</p>
        </div>
        <hr>`;
      }
      hourlyForecastContainer.innerHTML = '';

      // Get the hourly forecast data
      let hourlyForecast = data.list.slice(0, 10); // Get the first 10 entries (next 5 hours)

      hourlyForecast.forEach(forecast => {
        let date = new Date(forecast.dt * 1000); // Convert Unix timestamp to Date
        let hours = date.getHours().toString().padStart(2, '0'); // Format hours
        let temp = (forecast.main.temp - 273.15).toFixed(2); // Convert Kelvin to Celsius

        // Create a new card for each hour
        hourlyForecastContainer.innerHTML += `
          <div class="card">
            <p>${hours}:00 ${temp}&deg;C</p>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="">
          </div>
        `;
      });
    })
    
    .catch(() => {
      alert(`failed to fetch`);
    });
}

function getCoordinates() {
  let cityName = cityInput.value.trim();
  if (!cityName) return;

  let geoCodingApi = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_Key}`;

  fetch(geoCodingApi)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        alert(`No coordinates found for ${cityName}`);
        return;
      }
      // Extract latitude and longitude from the API response
      let { name, lat, lon, country, state } = data[0];
      // Ensure lat and lon are defined before using them
      if (lat !== undefined && lon !== undefined) {
        getWeatherDetails(name, lat, lon, country, state);
      } else {
        alert(`Coordinates not found for ${cityName}`);
      }
    })
    .catch(() => {
      alert(`Failed to fetch geo coordinates of ${cityName}`);
    });
}
searchBtn.addEventListener("click", getCoordinates);

