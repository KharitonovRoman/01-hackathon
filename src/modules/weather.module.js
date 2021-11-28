import { Module } from '../core/module'

export default class WeatherModule extends Module{
    
    constructor(weather) {
        super('Weather', weather);
        this.container = document.createElement('div');
        this.container.classList = 'container';
        this.container.id = 'container';
        this.weatherContainer = document.createElement('div');
        this.weatherContainer.classList = 'block';
        this.blockCity = document.createElement('div');
        this.blockCity.classList = 'block-city';
        this.info = document.createElement('div');
        this.info.classList = 'info-weather';
        this.info.innerHTML =
            `
                <div class='weather'></div>
                <div class='wind'></div>   
                <div class='temp'></div>
            `;
        this.weatherContainer.append(this.blockCity, this.info);
        this.container.append(this.weatherContainer);
        
    };

    trigger () {
        const WEATHER_API_TOKEN = 'ea0e6f44e0fe1a6376995ccd76b7c6c3';
        document.body.append(this.container);
        const blockCity = document.querySelector('.block-city');
        if (blockCity.textContent === ''){
            blockCity.classList.add('loader') ;
        } 
        navigator.geolocation.getCurrentPosition(function(position) {
            let requestLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${WEATHER_API_TOKEN}`;
            async function sendRequest(method, url) {
                return await fetch(url).then(response => {
                    return response.json();
                })
            };

            setInterval(() => {
                sendRequest('GET', requestLocation) 
                    .then(data => {
                        const celsius = Math.round(data.main.temp - 273.15);
                        const blockCity = document.querySelector('.block-city');
                        const weather = document.querySelector('.weather');
                        const wind = document.querySelector('.wind');
                        const temp = document.querySelector('.temp');
                      
                        blockCity.textContent = data.name;
                        weather.textContent = `Погода: ${data.weather[0].description}`;
                        wind.textContent = `Ветер: ${data.wind.speed} м/с`;
                        temp.textContent = `Температура: ${celsius} ° С`;
                        blockCity.classList.remove('loader');
                    });
            }, 10000);
        });
    };
}