const cityInput = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const currentWeatherDiv = document.querySelector('.current');
const weatherCardsDiv = document.querySelector('.day-section');

const API_KEY = "6fe8ba213b9da6d61bdf501302c0a30d";

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0){
        return `
            <div class="left">
                <h2 class="city">${cityName}</h2>
                <p class="date">Date: ${weatherItem.dt_txt.split(" ")[0]}</p>
                <p class="temp">Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}&deg;C</p>
                <p class="humidity">Humidity: ${weatherItem.main.humidity}%</p>
                <p class="wind">Wind Speed: ${weatherItem.wind.speed}M/s</p>
            </div>
            <div class="right">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" class="weather-icon">
                <p>${weatherItem.weather[0].description}</p>
            </div>
        `;
    }else{
        return `
            <div class="day-card">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" class="weather-icon">
                <div class="day-card-date">(${weatherItem.dt_txt.split(" ")[0]})</div>
                <div>temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}&deg;</div>
                <div>Wind: ${weatherItem.wind.speed}M/s</div>
                <div>Humidity: ${weatherItem.main.humidity}%</div>
            </div>
        `
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        })
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
    }).catch(() => {
        alert("Error while fetching the coordinates")
    });
}