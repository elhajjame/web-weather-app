const apiKey = "be670a1389eafd9b8736cce1a056a2cf";

const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherConditions = document.querySelector('.condition-txt');
const cityTxt = document.querySelector('.city-txt');
const tempTxt = document.querySelector('.temp-txt');
const windValue = document.querySelector('.wind-value');
const humidityValue = document.querySelector('.humidty-value');
const dataTxt = document.querySelector('.date-txt');
const weatherStatus = document.querySelector('.condition-txxt');
const daysContainer = document.querySelector('.days-container');

const date = new Date();
const weatherConditionIMG = document.querySelector('.weather-status-img');
async function fetchData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Could not fetch data');
        const data = await response.json();
        console.log(data.weather[0].main);
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        console.log(lat, lon);
        const forc = await fetchForecast(lat, lon)
        console.log(forc)
        daysContainer.innerHTML = "";
        forc.list.forEach((forecast) => {

            let iconCode = forecast.weather[0].icon;
            const temp = Math.round(forecast.main.temp);
            const time = timeConverter(forecast.dt);

            console.log(iconCode, temp, time);

            const childContainer = document.createElement('div');
            childContainer.classList.add('forcast-item');

            childContainer.innerHTML = `
        <h5 class="week-day">${temp} °C</h5>
        <img
            src="https://openweathermap.org/img/wn/${iconCode}@2x.png"
            alt="weather-icon"
        />
        <h5 class="day-temp">${time}:00</h5>
    `;

            daysContainer.appendChild(childContainer);
        });


        weatherStatus.textContent = data.weather[0].main;
        cityTxt.textContent = data.name;
        tempTxt.textContent = Math.round(data.main.temp) + "°C";
        // weatherConditions.textContent = data.weather[0].main;
        windValue.textContent = data.wind.speed + " Km/h";
        humidityValue.textContent = data.main.humidity + " %";
        dataTxt.textContent = date.toDateString();

        const icon = getIcon(data.weather[0].main);
        weatherConditionIMG.src = `assets/weather/${icon}`

    } catch (error) {
        console.error(error);
        showError("City not found");
    }
}

// time Converter function
function timeConverter(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, "0");
    return hours;
}
async function fetchForecast(lat, lon) {
    console.log(lat, lon)
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=7&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('city not found!')

    const dataforecast = (await response).json();
    return dataforecast;
}

function getIcon(condition) {
    condition = condition.toLowerCase();
    if (condition === 'snow') return 'snowy.svg';
    if (condition === 'rain') return 'rainy.svg';
    if (condition === 'clear') return 'day.svg';
    if (condition === 'clouds') return 'cloudy.svg';
    if (condition === 'drizzle') return 'drizzle.svg';
    if (condition === 'thunderstorm') return 'thunderstorm.svg';
    if (condition === 'atmosphere') return 'atmosphere.svg';

    if (
        condition === "mist" ||
        condition === "fog" ||
        condition === "haze" ||
        condition === "smoke" ||
        condition === "dust"
    ) return "atmosphere.svg"

    return "default.svg";

}

// search by icon
const searchByIcon = () =>{
    const cityName = cityInput.value.trim();
    if (cityName) fetchData(cityName);
}
searchBtn.addEventListener("click", searchByIcon);

// search by enter
const searchByicon = (e) => {
if (e.key === 'Enter') {
    const cityName = cityInput.value.trim();
    if (cityName) fetchData(cityName)
}
}
cityInput.addEventListener('keydown', searchByicon);

fetchData('Casablanca');

// error function message
function showError(msg) {
    const erroor = document.querySelector('.div-error1');
    erroor.innerHTML = msg
    erroor.classList.add('show')
    setTimeout(() => { erroor.classList.remove('show') }, 1900)
}

// theme mode
const switchBtn = document.querySelector('.theme-switch');
const themeSwitch = () => {
    document.body.classList.toggle('dark-mode')
    document.body.classList.toggle('light-mode')
}
switchBtn.addEventListener('click', themeSwitch);



