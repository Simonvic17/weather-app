const cityInput = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const currentWeatherDiv = document.querySelector('.current');
const weatherCardsDiv = document.querySelector('.day-section');

// Key from openweathermap.org
const API_KEY = "6fe8ba213b9da6d61bdf501302c0a30d";

// Weather card function that store data of current day and the next five forecast days.
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

// get weather data from api
const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        // An array that store one date of the day at time for 5 days
        const forecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!forecastDays.includes(forecastDate)){
                return forecastDays.push(forecastDate);
            }
        })
        // clear input and weather hard coded inner html divs
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
        // Display the data inside html cardds
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

// Get data from the entered input data
const getCityData = () => {
    const cityName = cityInput.value.trim()
    if(!cityInput) return;
    

    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(API_URL).then(res =>res.json()).then(data =>{
        if(!data.length) return alert(`EN coordinates found for ${cityName}`)
        const { name, lat, lon} = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("Error while fetching the coordinates")
    })
}

// Automatic get user location based on where they are
const getUserLocation = () =>{
    navigator.geolocation.getCurrentPosition(
        position => {
            const {latitude, longitude} = position.coords;
            // URL that auto detect user latitude and longitude
            const REVERSE_API_URL =`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
            fetch(REVERSE_API_URL).then(res =>res.json()).then(data =>{
                const { name} = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("Error while fetching the city")
            })
        },
        error => {
            if(error.code === error.PERMISSION_DENIED){
                alert("Please reset location permission to grant access")
            }
        }
    )
}
getUserLocation()

searchBtn.addEventListener("click", getCityData)
cityInput.addEventListener("keyup", e => e.key === 'Enter' && getCityData())