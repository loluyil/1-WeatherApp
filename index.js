/*
    Weather App Script
    1. Drop down menu for when entering location
    2. Grab location and API
    3. Grab temperature, wind-speed, and humidity
    4. Give error prompt for invalid location

 */

/*

    Edits:
    1. Need a images for Night time
    2. Dropdown menu of cites
    3. Background images
    4. Button to change C to F

*/

const weatherAppConfig = {

    APIKey: 'c3918b0da3bbe4eb6d8041846622e2c6',
    images: {
        clear: 'images/clear.png',
        cloud: 'images/cloud.png',
        mist: 'images/mist.png',
        rain: 'images/rain.png',
        snow: 'images/snow.png',
    },
    elements: {
        temperature: document.querySelector('.weather-box .temperature'),
        description: document.querySelector('.weather-box .description'),
        humidity: document.querySelector('.weather-details .humidity span'),
        wind: document.querySelector('.weather-details .wind-speed span'),
        city: document.querySelector('.date-information-box .city-name'),
        time: document.querySelector('.date-information-box .current-time'),
    }

}

const weatherAppLayout = {

    container: document.querySelector('.container'),
    error: document.querySelector('.not-found-error'),
    weatherBox: document.querySelector('.weather-box'),
    weatherDetails: document.querySelector('.weather-details'),

}

const search = document.querySelector('.search-box button');
const searchBox = document.querySelector('.search-box input');
const image = document.querySelector('.weather-box img');


const clearInput = () => {
    searchBox.value = '';
}

const displayError = () => {
    weatherAppLayout.container.style.height = '400px';
    weatherAppLayout.weatherBox.style.display = 'none';
    weatherAppLayout.weatherDetails.style.display = 'none';
    weatherAppLayout.error.style.display = 'block';
    weatherAppLayout.error.classList.add('fadeIn');
}

const updateLayout = () => {
    weatherAppLayout.weatherBox.style.display = '';
    weatherAppLayout.weatherDetails.style.display = '';
    weatherAppLayout.weatherBox.classList.add('fadeIn');
    weatherAppLayout.weatherDetails.classList.add('fadeIn');
    weatherAppLayout.container.style.height = '680px';
}

const performSearch = () => {

    const city = document.querySelector('.search-box input').value;

    if(city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherAppConfig.APIKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response error');
                }
                return response.json();
        })
        .then(json => {
            if(json.cod === '404') {
                displayError();
                return;
            }

        weatherAppLayout.error.style.display = 'none';
        weatherAppLayout.error.classList.remove('fadeIn');

        const now = new Date();
        const time =  now.toLocaleTimeString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: true });

        switch(json.weather[0].main) {
            case 'Clear':
                image.src = `${weatherAppConfig.images.clear}`;
                break;
            case 'Clouds':
                image.src = `${weatherAppConfig.images.cloud}`;
                break;
            case 'Haze':
                image.src = `${weatherAppConfig.images.mist}`;
                break;
            case 'Rain':
                image.src = `${weatherAppConfig.images.rain}`;
                break;
            case 'Snow':
                image.src = `${weatherAppConfig.images.snow}`;
                break;
            default: 
                image.src = '';
                break;       
        }

        weatherAppConfig.elements.city.innerHTML = `${json.name}`;
        weatherAppConfig.elements.time.innerHTML = `${time}`;
        weatherAppConfig.elements.temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
        weatherAppConfig.elements.description.innerHTML = `${json.weather[0].description}`;
        weatherAppConfig.elements.humidity.innerHTML = `${json.main.humidity}%`;
        weatherAppConfig.elements.wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;
        
        updateLayout();
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        // Handle the error (e.g., display a user-friendly message)
        displayError();
    });
}

search.addEventListener('click', performSearch);
searchBox.addEventListener('keydown', (event) => {

    if(event.key === 'Enter') {
        performSearch();
        clearInput();
    }

});