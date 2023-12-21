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
        clearNight: 'images/clear-night.png',
        cloudNight: 'images/cloud-night.png',
        weatherBg: 'images/weather-background.jpg',
        weatherBgNight: 'images/weather-background-night.png'
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
    background: document.querySelector('.background-image img')

}

const clock = {
    now: new Date(),
    //Hours starts from 7 to 18 for day/night cycle
    daytime: [
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18
    ],
    updateTime: () => {
        clock.now = new Date();
    },
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

const background = () => {
    // Background will be day if it's 7 AM - 7 PM and night at 7 PM - 7 AM
    if (clock.now.getHours() >= 7 && clock.now.getHours() < 19) {
        weatherAppLayout.background.src = `${weatherAppConfig.images.weatherBg}`;
    } else {
        weatherAppLayout.background.src = `${weatherAppConfig.images.weatherBgNight}`;
    }
};

//Initial call for background
background();

//Updates the background and time every second
const updateClockInterval = setInterval(() => {
    
    //Shows time as 00:00 AM/PM
    const time =  clock.now.toLocaleTimeString('en-US', { 
        weekday: 'long', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });
    //Changes the shown time live
    weatherAppConfig.elements.time.innerHTML = `${time}`;
    clock.updateTime();
    //Changes background live
    background();

  }, 1000);
  

const performSearch = () => {

    const city = document.querySelector('.search-box input').value;
    
    if(city === '')
        return;
    //Fetches weather API from OpenWeather
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
        
        //Removes error display when there is no error
        weatherAppLayout.error.style.display = 'none';
        weatherAppLayout.error.classList.remove('fadeIn');

        //Grabs time as 00:00 AM/PM
        const time =  clock.now.toLocaleTimeString('en-US', { 
            weekday: 'long', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });

        //Changes images based on weather
        switch(json.weather[0].main) {
            case 'Clear':
                if (clock.now.getHours() >= 7 && clock.now.getHours() < 19) {
                    console.log('Clear-Day');
                    image.src = `${weatherAppConfig.images.clear}`;
                } else {
                    console.log('Clear-Night');
                    image.src = `${weatherAppConfig.images.clearNight}`;
                }
                break;
            case 'Clouds':
                if (clock.now.getHours() >= 7 && clock.now.getHours() < 19) {
                    console.log('Cloud-Day');
                    image.src = `${weatherAppConfig.images.cloud}`;
                } else {
                    console.log('Cloud-Night');
                    image.src = `${weatherAppConfig.images.cloudNight}`;
                }
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

        //Sets weather data
        weatherAppConfig.elements.city.innerHTML = `${json.name}`;
        weatherAppConfig.elements.temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span`;
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

//Performs functions when action is done
search.addEventListener('click', performSearch);
searchBox.addEventListener('keydown', (event) => {

    if(event.key === 'Enter') {
        performSearch();
        clearInput();
    }

});

//Clears interval when window is closed
window.addEventListener('beforeunload', () => {
    clearInterval(updateClockInterval);
});