const apiKey = '9505fd1df737e20152fbd78cdb289b6a';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + apiKey;

const form = document.querySelector('form');
const cityElement = document.querySelector('.name');
const temperatureElement = document.querySelector('.temperature');
const descriptionElement = document.querySelector('.description');
const cloudsElement = document.getElementById('clouds');
const humidityElement = document.getElementById('humidity');
const pressureElement = document.getElementById('pressure');
const valueSearch = document.getElementById('name');
const main = document.querySelector('main');

// Set the gradient bar width dynamically
const setBar = (element, value, color='rgba(255,255,255,0.3)') => {
    let bar = element.querySelector('.value-bar');
    if (!bar) {
        bar = document.createElement('span');
        bar.className = 'value-bar';
        element.appendChild(bar);
    }
    bar.style.width = value + '%';
    bar.style.background = color;
};

// Fetch Weather Data
const searchWeather = async () => {
    const city = valueSearch.value.trim();
    if (!city) return;

    try {
        const response = await fetch(`${baseUrl}&q=${city}`);
        const data = await response.json();

        if (data.cod == 200) {
            cityElement.querySelector('figcaption').innerText = data.name;
            cityElement.querySelector('img').src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;

            temperatureElement.querySelector('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
            temperatureElement.querySelector('span').innerText = Math.round(data.main.temp);
            descriptionElement.innerText = data.weather[0].description;

            cloudsElement.innerText = data.clouds.all;
            humidityElement.innerText = data.main.humidity;
            pressureElement.innerText = data.main.pressure;

            setBar(cloudsElement.parentElement, data.clouds.all, 'rgba(200,200,200,0.5)');
            setBar(humidityElement.parentElement, data.main.humidity, 'rgba(50,150,255,0.5)');
            // Normalize pressure (typical 980–1050 hPa range)
            let pressurePercent = Math.min(Math.max((data.main.pressure - 980) / 70 * 100, 0), 100);
            setBar(pressureElement.parentElement, pressurePercent, 'rgba(255,200,0,0.5)');
        } else {
            main.classList.add('error');
            setTimeout(() => main.classList.remove('error'), 1000);
        }
    } catch (err) {
        console.error(err);
        main.classList.add('error');
        setTimeout(() => main.classList.remove('error'), 1000);
    }

    valueSearch.value = '';
};

// Form Submit
form.addEventListener('submit', e => {
    e.preventDefault();
    searchWeather();
});

// Initialize App with Default City
const initApp = () => {
    valueSearch.value = 'London';
    searchWeather();
};

initApp();
