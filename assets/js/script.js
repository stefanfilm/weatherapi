const apiKey = 'db626cf247d532286e30a2fb09f9fe77';
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('searchHistory');
let cityHistory = []; // Array to store searched cities

// Event listener for form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value;
    getWeatherData(city);
    cityHistory.push(city); // Add the searched city to the history
    cityInput.value = '';
    displaySearchHistory();
});

// Function to display the search history with clickable city names
function displaySearchHistory() {
    searchHistory.innerHTML = '';
    cityHistory.forEach(city => {
        const cityElement = document.createElement('div');
        cityElement.textContent = city;
        cityElement.classList.add('searched-city');
        cityElement.addEventListener('click', () => {
            getWeatherData(city);
        });
        searchHistory.appendChild(cityElement);
    });
}

// Function to get weather data for a city
function getWeatherData(city) {
    // Fetch current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => console.error('Error fetching weather data:', error));

    // Fetch 5-day forecast data
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

// Display current weather information
function displayWeather(data) {
    weatherInfo.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    forecast.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const forecastData = data.list[i];
        const date = new Date(forecastData.dt * 1000);
        const icon = forecastData.weather[0].icon;
        const temp = forecastData.main.temp;

        forecast.innerHTML += `
            <div>
                <p>${date.toDateString()}</p>
                <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
                <p>Temperature: ${temp}°C</p>
            </div>
        `;
    }
}