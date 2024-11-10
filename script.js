const apiKey = "038e45e1170c1161db236f50c6162dba";
let forecastData = [];

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(currentWeatherUrl);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        displayCurrentWeather(data);

        const { lat, lon } = data.coord;
        getForecast(lat, lon);
    } catch (error) {
        console.error("Error fetching current weather:", error);
        alert(error.message);
    }
}

function displayCurrentWeather(data) {
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("condition").textContent = data.weather[0].main;

    const iconCode = data.weather[0].icon;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    document.getElementById("weatherInfo").style.display = "block";
}

async function getForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(forecastUrl);
        const data = await response.json();

        forecastData = data.daily;
        showForecast(3);
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

function showForecast(days) {
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";

    if (forecastData.length > 0) {
        for (let i = 0; i < days; i++) {
            const day = forecastData[i];
            const date = new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: "long" });
            const temp = `${Math.round(day.temp.day)}°C`;
            const condition = day.weather[0].main;
            const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

            const forecastItem = document.createElement("div");
            forecastItem.classList.add("forecast-item");
            forecastItem.innerHTML = `
                <h4>${date}</h4>
                <img src="${icon}" alt="${condition}">
                <p>${temp}</p>
                <p>${condition}</p>
            `;
            forecastContainer.appendChild(forecastItem);
        }
    }
}
