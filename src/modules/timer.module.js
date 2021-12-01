import { Module } from "../core/module";
import { createCross } from "../utils";

export default class TimerModule extends Module {
	constructor(text) {
		super("Timer", text);
		this.timerContainer = document.createElement("div");
		this.timerContainer.className = "timer-container";
		document.body.append(this.timerContainer);
	}

	#getTimerId = (function () {
		let timerId = 1;
		return function () {
			return timerId++;
		};
	})();

	trigger() {
		const timerId = this.#getTimerId();
		const timer = document.createElement("div");
		timer.id = `timer${timerId}`;
		timer.className = "timer";
		const button = document.createElement("button");
		button.className = "btn-start";
		button.textContent = "start";

		timer.innerHTML = `
			<input id="timer${timerId}-input-hours" class="timer-input-hours" name="hours" type="number" max="59" min="0" placeholder="hh" />
			<input id="timer${timerId}-input-mins" class="timer-input-min" name="minutes" type="number" max="59" min="0" placeholder="mm" />
			<input id="timer${timerId}-input-secs" class="timer-input-sec" name="seconds" type="number" max="59" min="0" placeholder="ss" />
		`;

		button.addEventListener("click", () => {
			let timerInputSec = document.querySelector(`#timer${timerId}-input-secs`);
			let timerInputMin = document.querySelector(`#timer${timerId}-input-mins`);
			let timerInputHours = document.querySelector(`#timer${timerId}-input-hours`);
			let timerSec = Number(timerInputSec.value);
			let timerMin = Number(timerInputMin.value);
			let timerHours = Number(timerInputHours.value);
			const endDate = new Date();
			endDate.setHours(
				endDate.getHours() + timerHours,
				endDate.getMinutes() + timerMin,
				endDate.getSeconds() + timerSec + 1
			);
			timer.innerHTML = `
				<div class="time-countdown-container">
					<p id="timer${timerId}">
						<span id="timer${timerId}-hours"></span>
						<span id="timer${timerId}-mins"></span>
						<span id="timer${timerId}-secs"></span>
					</p>
				</div>
			`;

			const timerFunc = setInterval(function () {
				const currentDate = new Date();
				let deltaTime = endDate.getTime() - currentDate.getTime();

				if (deltaTime >= 0) {
					let hours = Math.floor((deltaTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					let mins = Math.floor((deltaTime % (1000 * 60 * 60)) / (1000 * 60));
					let secs = Math.floor((deltaTime % (1000 * 60)) / 1000);

					document.querySelector(`#timer${timerId}-hours`).innerHTML = ("0" + hours).slice(-2) + '<span class="label"> : </span>';
					document.querySelector(`#timer${timerId}-mins`).innerHTML = ("0" + mins).slice(-2) + '<span class="label"> : </span>';
					document.querySelector(`#timer${timerId}-secs`).innerHTML = ("0" + secs).slice(-2) + '<span class="label"></span>';
				} else {
					document.querySelector(`#timer${timerId}`).innerHTML = "TIME IS OVER";
					clearInterval(timerFunc);
					const endingFunc = setTimeout(() => {
						let element = document.querySelector(`#timer${timerId}`);
						element.remove();
						clearInterval(endingFunc);
					}, 2000);
				}
			}, 0);
			
			//верстка крестика удалить
			const btnDelete = document.createElement("button");
			btnDelete.className = "btn-delete";
			btnDelete.textContent = '✖';
			timer.append(btnDelete);

			// Удаление блока нажав на крестик
			btnDelete.addEventListener("click", () => {
				if (timer) {
					timer.remove();
					clearInterval(timerFunc);
				}
			})
			
		});
		//функция создания крестика и удаления блока timer
		createCross(timer);

		timer.append(button);
		this.timerContainer.append(timer);
	}
}
