const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const loading = document.querySelector(".loading");
const unitToggle = document.getElementById("unitToggle");
const apiKey = "09bee5c5d261cfed938dcdcf311edf18";

let currentUnit = "metric"; // "metric" for Celsius, "imperial" for Fahrenheit
let lastWeatherData = null;

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value.trim();
    if (city) {
        showLoading(true);
        try {
            const weatherData = await getWeatherData(city, currentUnit);
            lastWeatherData = weatherData;
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError("Could not fetch weather data. Please check the city name and try again.");
        } finally {
            showLoading(false);
        }
    } else {
        displayError("Please enter a city!");
    }
});

unitToggle.addEventListener("change", () => {
    currentUnit = unitToggle.checked ? "imperial" : "metric";
    if (lastWeatherData) {
        // Re-fetch weather data for the last city with new unit
        displayLoadingAndFetch(lastWeatherData.name);
    }
});

async function displayLoadingAndFetch(city) {
    showLoading(true);
    try {
        const weatherData = await getWeatherData(city, currentUnit);
        lastWeatherData = weatherData;
        displayWeatherInfo(weatherData);
    } catch (error) {
        console.error(error);
        displayError("Could not fetch weather data. Please check the city name and try again.");
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    loading.style.display = show ? "block" : "none";
    card.style.display = show ? "none" : card.style.display;
}

async function getWeatherData(city, unit) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const {
        name: city,
        main: { temp, humidity },
        weather: [{ description, id }],
        wind: { speed },
        sys: { sunrise, sunset },
    } = data;

    const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    card.style.display = "flex";
    card.classList.remove("fade-in");
    void card.offsetWidth; // trigger reflow for restart animation
    card.classList.add("fade-in");

    const tempUnitSymbol = currentUnit === "metric" ? "°C" : "°F";
    const windUnit = currentUnit === "metric" ? "m/s" : "mph";

    card.innerHTML = `
        <h1 class="cityDisplay">${city}</h1>
        <p class="tempDisplay">${temp.toFixed(1)}${tempUnitSymbol}</p>
        <p class="humidityDisplay">Humidity: ${humidity}%</p>
        <p class="descDisplay">${description}</p>
        <p class="weatherEmoji">${getWeatherEmoji(id)}</p>
        <p class="windDisplay">Wind Speed: ${speed} ${windUnit}</p>
        <p class="sunriseDisplay">Sunrise: ${sunriseTime}</p>
        <p class="sunsetDisplay">Sunset: ${sunsetTime}</p>
    `;

    updateBackgroundTheme(id);
}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case weatherId >= 200 && weatherId <= 232:
            return "⛈️"; // Thunderstorm
        case weatherId >= 300 && weatherId <= 321:
            return "🌧️"; // Drizzle
        case weatherId >= 500 && weatherId <= 531:
            return "🌧️"; // Rain
        case weatherId >= 600 && weatherId <= 622:
            return "❄️"; // Snow
        case weatherId >= 701 && weatherId <= 781:
            return "🌫️"; // Fog, Smoke, Mist
        case weatherId === 800:
            return "☀️"; // Clear
        case weatherId >= 801 && weatherId <= 804:
            return "☁️"; // Clouds
        default:
            return "❓"; // Unknown condition
    }
}

function displayError(message) {
    card.style.display = "flex";
    card.classList.remove("fade-in");
    void card.offsetWidth; // trigger reflow for restart animation
    card.classList.add("fade-in");
    card.innerHTML = `<p class="errorDisplay">${message}</p>`;
    updateBackgroundTheme(null);
}

function updateBackgroundTheme(weatherId) {
    const body = document.body;
    // Remove all weather background classes
    body.classList.remove(
        "bg-thunderstorm",
        "bg-rain",
        "bg-snow",
        "bg-fog",
        "bg-clear",
        "bg-clouds",
        "bg-default"
    );

    if (weatherId === null) {
        body.classList.add("bg-default");
        return;
    }

    switch (true) {
        case weatherId >= 200 && weatherId <= 232:
            body.classList.add("bg-thunderstorm");
            break;
        case weatherId >= 300 && weatherId <= 531:
            body.classList.add("bg-rain");
            break;
        case weatherId >= 600 && weatherId <= 622:
            body.classList.add("bg-snow");
            break;
        case weatherId >= 701 && weatherId <= 781:
            body.classList.add("bg-fog");
            break;
        case weatherId === 800:
            body.classList.add("bg-clear");
            break;
        case weatherId >= 801 && weatherId <= 804:
            body.classList.add("bg-clouds");
            break;
        default:
            body.classList.add("bg-default");
            break;
    }
}
