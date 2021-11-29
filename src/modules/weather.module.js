import { Module } from '../core/module'
import loader from '../assets/svg/loader.svg';

const WEATHER_API_TOKEN = 'ea0e6f44e0fe1a6376995ccd76b7c6c3';

export default class WeatherModule extends Module {

	constructor(weather) {
		super('Weather', weather);
		this.loader = document.createElement('img');
		this.loader.classList = 'loader';
		this.loader.src = loader;
		this.loader.setAttribute('hidden', '');
		this.weatherContainer = document.createElement('div');
		this.weatherContainer.classList = 'weather-container';
		this.cityName = document.createElement('div');
		this.cityName.classList = 'city-name-field';
		this.weatherInfo = document.createElement('div');
		this.weatherInfo.classList = 'weather-info';
		this.weatherInfo.innerHTML = `
			<div class='weather-field'></div>
			<div class='wind-field'></div>   
			<div class='temp-field'></div>
		`;
		this.weatherContainer.append(this.cityName, this.weatherInfo);
		document.body.append(this.weatherContainer, this.loader);
	};
	
	trigger() {
		this.loader.removeAttribute('hidden');
		navigator.geolocation.getCurrentPosition(async function(position) {
			console.log(position);
			try {
				const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${WEATHER_API_TOKEN}`, {'method': 'GET'});
				const weatherData = await response.json();
				const temperatureInCelsius = Math.round(weatherData.main.temp - 273.15);
				const cityNameField = document.querySelector('.city-name-field');
				const weatherNameField = document.querySelector('.weather-field');
				const windSpeedField = document.querySelector('.wind-field');
				const temperatureField = document.querySelector('.temp-field');
				cityNameField.textContent = `Погода в ${weatherData.name}`;
				weatherNameField.textContent = `${weatherData.weather[0].description}`;
				windSpeedField.textContent = `Ветер: ${weatherData.wind.speed} м/с`;
				temperatureField.textContent = `Температура: ${temperatureInCelsius}℃`;
			} catch (error) {
				alert('Unexpected error from API');
			} finally {
				const loader = document.querySelector('.loader');
				loader.setAttribute('hidden', '');
			}
		});
		
		setTimeout(() => {
			const weatherContainer = document.querySelector('.weather-container');
			weatherContainer.remove();
		}, 5000);
	};
}
