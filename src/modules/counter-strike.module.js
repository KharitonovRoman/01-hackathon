import { Module } from "../core/module";
import enemy1 from "../assets/img/ter1.png";
import enemy2 from "../assets/img/ter2.png";
import enemy3 from "../assets/img/ter3.png";
import enemy4 from "../assets/img/ter4.png";
import vladilen from "../assets/img/vladilen.png";
import roman from "../assets/img/removebg/roman.png";
import marat from "../assets/img/removebg/marat.png";
import dimarik from "../assets/img/removebg/dimarik.png";
import alexey from "../assets/img/removebg/alexey.png";
import darya from "../assets/img/removebg/darya.png";
import yana from "../assets/img/removebg/yana.png";
import mirage from "../assets/img/mirage.jpg";
import { random } from "../utils";

const terrorists = [ enemy1, enemy2, enemy3, enemy4 ];
const counterTerrorists = [ vladilen, roman, marat, dimarik, alexey, darya, yana ];

export default class CounterStrikeModule extends Module {
	#csContainer;
	#board;
	#gameTimer;
	#score;
	#teammate;
	#interval;
	#isEventListenerAdded;

	constructor(text) {
		super("CS", text);
		
		this.#csContainer = document.createElement("div");
		this.#csContainer.className = "cs-container";
		this.#score = 0;
		this.#isEventListenerAdded = false;
		document.body.append(this.#csContainer);
	}
	
	trigger() {
		this.#csContainer.innerHTML = `
			<div class="cs-container__screen">
				<div class="cs-container__menu">
					<div id="cs-container__logo"></div>
					<h1>Цель игры</h1>
					<div>Подстрелить как можно больше террористов, но не стреляйте по своим!</div>
					<button class="cs-container__btn cs-container__got-it">Понятно</button>
				</div>
			</div>
			<div class="cs-container__screen">
				<div class="cs-container__menu">
					<div>Установите время раунда</div>
					<ul class="cs-container__time-list" id="cs-container__time-list">
						<li><button class="cs-container__btn cs-container__time" data-time="15">15 сек</button></li>
						<li><button class="cs-container__btn cs-container__time" data-time="30">30 сек</button></li>
						<li><button class="cs-container__btn cs-container__time" data-time="60">1 мин</button></li>
						<li><button class="cs-container__btn cs-container__time" data-time="120">2 мин</button></li>
					</ul>
				</div>
			</div>
			<div class="cs-container__screen">
				<div class="cs-container__board" id="cs-container__board">
					<div class="cs-container__timer">00:00</div>
				</div>
			</div>
		`;

		this.#board = document.querySelector("#cs-container__board");
		this.#board.style.background = `url(${ mirage })`;
		this.#board.style.backgroundSize = "cover";

		this.#gameTimer = document.querySelector(".cs-container__timer");

		if (!this.#isEventListenerAdded) { 
			this.#csContainer.addEventListener("click", this.#clickHandler.bind(this));
			this.#isEventListenerAdded = true;
		}
	}

	#clickHandler = function(event) {
		const screens = document.querySelectorAll(".cs-container__screen");
		if (event.target.classList.contains("cs-container__got-it")) {
			screens[0].classList.add("up");
		} else if (event.target.classList.contains("cs-container__time")) {
			this.gameTime = parseInt(event.target.getAttribute("data-time"));
			screens[1].classList.add("up");
			this.#startGame(this.gameTime);
		} else if (event.target.classList.contains("t")) {
			this.#score++;
			event.target.remove();
			this.#teammate.remove();
			this.#createTandCT();
		} else if (event.target.classList.contains("ct")) {
			this.#finishGame(false);
		}
	}

	#startGame(gameTime) {
		const gameover = document.querySelector(".cs-container__game-over");
		if (gameover) {
			gameover.remove();
		}
		if (this.#interval) {
			clearInterval(this.#interval);
		}
		this.#interval = setInterval(this.#deacreaseTime.bind(this), 1000);
		this.#setGameTime(gameTime);
		this.#createTandCT();
	}

	#deacreaseTime() {
		if (this.gameTime === 0) {
			this.#finishGame();
		} else {
			this.#setGameTime(--this.gameTime);
		}
	}

	#createTandCT() {
		this.#createPlayer(true);
		this.#teammate = this.#createPlayer(false);  
	}

	#setGameTime(gameTime) {
		let minutes = Math.floor(gameTime / 60);
		let seconds = gameTime % 60;
		minutes = (minutes < 10) ? `0${minutes}` : minutes;
		seconds = (seconds < 10) ? `0${seconds}` : seconds;
		this.#gameTimer.innerHTML = `${minutes}:${seconds}`;
	}

	#getTerroristUrlImage() {
		return terrorists[random(0, terrorists.length - 1)];
	}

	#getCounterTerroristUrlImage() {
		return counterTerrorists[random(0, counterTerrorists.length - 1)];
	}

	#createPlayer(isTerrorist) {
		const size = random(150, 200);
		const { width, height } = this.#board.getBoundingClientRect();
		
		const player = document.createElement("div");
		player.classList.add("cs-container__player");
		
		const top = random(0, height - size);
		const left = random(0, width - size);

		if (isTerrorist) {
			player.style.background = `url(${ this.#getTerroristUrlImage() })`;
			player.classList.add("t");
		} else {
			player.style.background = `url(${ this.#getCounterTerroristUrlImage() })`;
			player.classList.add("ct");
		}
		player.style.backgroundSize = "cover";
		player.style.width = `${size}px`;
		player.style.height = `${size}px`;
		player.style.top = `${top}px`;
		player.style.left = `${left}px`;
		this.#board.append(player);

		return player;
	}

	#finishGame(isWon = true) {	
		clearInterval(this.#interval);
		if (isWon) {
			this.#board.innerHTML = `
				<div class="cs-container__game-over">
					<div>Your score: ${this.#score}</div>
					<button class="cs-container__btn cs-container__close-cs-container__btn">Close</button>
				</div>
			`;
		} else {
			this.#board.innerHTML = `
				<div class="cs-container__game-over">
					<div>You have been banned from this Hackathon!</div>
					<div>You have wounded your teammate.</div>
					<button class="cs-container__btn cs-container__close-cs-container__btn">Close</button>
				</div>
			`;
		}
		document.querySelector(".cs-container__close-cs-container__btn").addEventListener("click", (function() {
			this.#csContainer.innerHTML = "";
		}).bind(this));
		this.#score = 0;
	}
}
