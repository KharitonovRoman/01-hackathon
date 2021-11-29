import { Module } from '../core/module'
import './clicks.module.css'

export default class ClicksModule extends Module {

	#clicksTimeoutInSeconds;
	#numberOfSingleClicks;
	#numberOfDoubleClicks;
	#timerSingleClick;
	#timerValue;
	#timerDisplayId;
	#isActive;

	constructor(text) {
		super('Clicks', text);
		this.#resetState();
		this.#setupEventListeners();
	}
	
	trigger() {
		this.#resetState();
		this.#createHtml();
		this.#updateAnalyticsInfo();
		this.#startAnalytics();
	}

	#resetState() {
		this.#clicksTimeoutInSeconds = 5;
		this.#numberOfSingleClicks = 0;
		this.#numberOfDoubleClicks = 0;
		this.#timerValue = this.#clicksTimeoutInSeconds;
		this.#isActive = false;
	}

	#singleClickHandler = function(event) {
		if (event.detail === 1) {
			this.#timerSingleClick = setTimeout(() => {
				this.#clickProcessing(true);
				this.#updateAnalyticsInfo();
			}, 200)
		}
	}

	#doubleClickHandler = function() {
		clearTimeout(this.#timerSingleClick);
		this.#clickProcessing(false);
		this.#updateAnalyticsInfo();
	}

	#setupEventListeners() {
		document.body.removeEventListener('click', this.#singleClickHandler);
		document.body.addEventListener('click', this.#singleClickHandler.bind(this));

		document.body.removeEventListener('dblclick', this.#doubleClickHandler);
		document.body.addEventListener('dblclick', this.#doubleClickHandler.bind(this));
	}

	#clickProcessing(isSingleClick) {
		if (this.#isActive) {
			if (isSingleClick) {
				this.#numberOfSingleClicks++;
			} else {
				this.#numberOfDoubleClicks++;
			}
		}
	}	

	#startAnalytics() {
		this.#isActive = true;
		this.#updateTimer(this.#timerValue);
		setTimeout(() => {
			this.#isActive = false;
		}, this.#clicksTimeoutInSeconds * 1000);
		clearInterval(this.#timerDisplayId);
		this.#timerDisplayId = setInterval(this.#displayTimer.bind(this), 1000);
	}

	#displayTimer() {
		if (this.#timerValue !== 0) {
			const value = --this.#timerValue;
			this.#updateTimer(value);
		} else {
			clearInterval(this.#timerDisplayId);
		}
	}

	#updateAnalyticsInfo() {
		const singleClicks = document.querySelector('#clicks-module-single-counter-number');
		if (singleClicks) {
			singleClicks.textContent = this.#numberOfSingleClicks <= 0 ? 0 : `${this.#numberOfSingleClicks - 1}`;
		}

		const doubleClicks = document.querySelector('#clicks-module-double-counter-number');
		if (doubleClicks) {
			doubleClicks.textContent = `${this.#numberOfDoubleClicks}`;
		}
	}

	#updateTimer(value) {
		const timerElem = document.querySelector('#clicks-module-timer-id');
		if (value < 10) {
			value = `0${value}`;
		}
		timerElem.textContent = `00:${value}`;
	}

	#createHtml() {
		const moduleExists = document.querySelector('.root-clicks-module');
		if (moduleExists) {
			return;
		}

		const clicksAnalyticModule = document.createElement("div");
		clicksAnalyticModule.className = 'root-clicks-module';

		const timerBox = document.createElement("div");
		timerBox.className = 'clicks-module-timer-box';

		const countersBox = document.createElement("div");
		countersBox.className = 'clicks-module-counters-box';

		const timerElement = document.createElement("div");
		timerElement.className = 'clicks-module-timer';
		timerElement.textContent = '00:00';
		timerElement.id = 'clicks-module-timer-id';
		
		const singleClickBox = document.createElement("div");
		singleClickBox.className = 'clicks-module-box';

		const doubleClickBox = document.createElement("div");
		doubleClickBox.className = 'clicks-module-box';

		const singleClickCaption = document.createElement("div");
		singleClickCaption.className = 'clicks-module-counter-caption';
		singleClickCaption.textContent = 'Кол-во одиночных кликов:';
		
		const doubleClickCaption = document.createElement("div");
		doubleClickCaption.className = 'clicks-module-counter-caption';
		doubleClickCaption.textContent = 'Кол-во двойных кликов:';

		const singleClickCounter = document.createElement("div");
		singleClickCounter.className = 'clicks-module-counter-number';
		singleClickCounter.id = 'clicks-module-single-counter-number';

		const doubleClickCounter = document.createElement("div");
		doubleClickCounter.className = 'clicks-module-counter-number';
		doubleClickCounter.id = 'clicks-module-double-counter-number';

		singleClickBox.appendChild(singleClickCaption);
		singleClickBox.appendChild(singleClickCounter);

		doubleClickBox.appendChild(doubleClickCaption);
		doubleClickBox.appendChild(doubleClickCounter);

		timerBox.appendChild(timerElement);

		countersBox.appendChild(singleClickBox);
		countersBox.appendChild(doubleClickBox);
		
		clicksAnalyticModule.appendChild(timerBox);
		clicksAnalyticModule.appendChild(countersBox);
		
		document.body.append(clicksAnalyticModule);
		
		setTimeout(() => {
			if (clicksAnalyticModule) {
				clicksAnalyticModule.remove();
			}
		}, 8000);
	}
}
