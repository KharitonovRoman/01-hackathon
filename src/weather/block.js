export default class BlockWeather{
    
    constructor() {
        this.container = document.createElement('div');
        this.container.classList = 'container';
        this.container.id = 'container';
        const block  = document.createElement('div');
        block.classList = 'block';
        const blockCity = document.createElement('div');
        blockCity.classList = 'block-city';
        const info = document.createElement('div');
        info.classList = 'info-weather';
        info.innerHTML =
        `
            <div class='weather'></div>
            <div class='wind'></div>   
            <div class='temp'></div>
        `;
        block.append(blockCity, info);
        this.container.append(block);
        this.findCity.bind(this)();
        
    };

    findCity () {
        let API = 'ea0e6f44e0fe1a6376995ccd76b7c6c3';

        navigator.geolocation.getCurrentPosition(function(position) {
            let requestLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API}`;
            function sendRequest2(method, url) {
                return fetch(url).then(response => {
                    return response.json();
                })
            };
            setInterval (() => {
                sendRequest2('GET', requestLocation) 
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
                    });
            }, 10000);
            
        })
        
    };
}