const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const weatherContainer = document.getElementById('weatherContainer');
const errorMessage = document.getElementById('errorMessage');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const weatherDescription = document.getElementById('weatherDescription');

const API_KEY = '356525fa4b4a232d29a3d358562d773e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const weatherIcons = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️'
};

async function fetchWeather(city) {
    try {
        showLoading();
        const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
        
        const data = await response.json();
        
        if (!response.ok) {
            if (data.cod && data.message) {
                throw new Error(`API Error: ${data.message}`);
            }
            if (response.status === 404) {
                throw new Error('City not found. Please check the name and try again.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API key.');
            } else {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        }

        displayWeather(data);
        hideError();
    } catch (error) {
        showError(error.message);
        hideWeather();
    } finally {
        hideLoading();
    }
}

function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    
    const iconCode = data.weather[0].icon;
    weatherIcon.textContent = weatherIcons[iconCode] || '🌡️';
    
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    weatherDescription.textContent = capitalizeFirstLetter(data.weather[0].description);
    
    showWeather();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showWeather() {
    weatherContainer.classList.remove('hidden');
}

function hideWeather() {
    weatherContainer.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showLoading() {
    searchButton.textContent = 'Loading...';
    searchButton.disabled = true;
}

function hideLoading() {
    searchButton.textContent = 'Search';
    searchButton.disabled = false;
}

searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError('Please enter a city name.');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            showError('Please enter a city name.');
        }
    }
});

fetchWeather('London');