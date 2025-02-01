//weather app
const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "09bee5c5d261cfed938dcdcf311edf18";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value;
    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city!")
    }
});

async function getWeatherData(city) {
    
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if(!response.ok){
        throw new Error("Failed to fetch weather data");

    }

    return await response.json();

}

function displayWeatherInfo(data){
    const {name: city, 
           main: {temp, humidity},
           weather: [{description, id}] } = data;
    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmojiDisplay = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmojiDisplay.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmojiDisplay.classList.add("weatherEmoji");
    
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmojiDisplay);

}

function getWeatherEmoji(weatherId){
    switch(true){
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

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex"; 
    card.appendChild(errorDisplay);
}
