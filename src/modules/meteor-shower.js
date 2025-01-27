import { Module } from '../core/module';
import { random } from '../utils';
import './meteor-shower.css';

import starSky from '../assets/img/starSky.jpg';

export default class MeteorShower extends Module {

	constructor(text) {
		super('MeteorShower', text);
		this.isRun = false;
	}

	trigger() {
		if (!this.isRun) {
			this.isRun = true;
			setTimeout(deleteModule.bind(this), 3000);
			
			const body = document.body;
			const currentBackground = body.style.background;
			const currentColor = body.style.color;
			
			const cometTemplate = document.createElement('div');
			cometTemplate.className = 'comet';
			const core = document.createElement('core');
			core.className = 'core';
			cometTemplate.append(core);

			body.classList.add('meteor-shower');
			body.style.background = `url(${starSky}) no-repeat center`;
			body.style.color = 'white';
			body.style.backgroundRepeat = 'no-repeat';
			body.style.backgroundSize = 'cover';

			const comets = [];
			for (let index = 0; index < 50; index++) {
				let comet = cometTemplate.cloneNode(true);
				comet.style.top = '-100vh';
				comet.style.left = `${250 + 100 * index}px`;
				comet.style.transition = `${random(0.5, 10)}s ease, ${random(0.5, 10)}s ease`;
				comet.style.transitionProperty = 'top, left';

				comets.push(comet);
				body.append(comets[index]);
			}

			setTimeout(() => {
				comets.forEach(comet => {
					const left = comet.style.left.match(/\d{1,}/g)[0];
					comet.style.top = '100vh';
					comet.style.left = `${-1 * left}px`;
				});
			}, 0);

			function deleteModule() {
				comets.forEach(comet => comet.remove());
				body.classList.remove('meteor-shower');
				body.style.background = currentBackground;
				body.style.color = currentColor;
				this.isRun = false;
			}
		}
	}
}
