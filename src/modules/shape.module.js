import { Module } from '../core/module';
import { random } from '../utils';
import 'konva/konva';

export default class ShapeModule extends Module {
	#shapeContainer;
	#canvasWidth;
	#canvasHeight;
	stage;
	
	constructor(text) {
		super('Shape', text);
		this.#canvasWidth = window.innerWidth;
		this.#canvasHeight = window.innerHeight;
		this.#shapeContainer = document.createElement('div');
		this.#shapeContainer.id = 'shape-container';
		this.#shapeContainer.style.position = 'absolute';
		this.#shapeContainer.style.top = '0';
		this.#shapeContainer.style.left = '0';
		this.#shapeContainer.style.zIndex = -1;
		document.body.append(this.#shapeContainer);
	}
	
	trigger() {
		this.#shapeContainer.style.zIndex = 1;
		const baseLayer = new Konva.Layer();
		const stage = new Konva.Stage({
			container: 'shape-container',
			width: this.#canvasWidth,
			height: this.#canvasHeight,
		});
		for (let i = 0; i < 5; i++)	{
			const shapeRadius = random(80, 120);
			const shapeCoordinateX = random(shapeRadius, this.#canvasWidth - shapeRadius);
			const shapeCoordinateY = random(shapeRadius, this.#canvasHeight - shapeRadius);
			const shapeColor = `rgb(${ random(50, 255) }, ${ random(50, 255) }, ${ random(50, 255) })`;

			let shape;
			if (random(0, 1)) {
				shape = new Konva.Circle({ x: shapeCoordinateX, y: shapeCoordinateY, radius: shapeRadius, fill: shapeColor, stroke: 'black' });
			} else {
				shape = new Konva.RegularPolygon({ x: shapeCoordinateX, y: shapeCoordinateY, sides: random(3, 10), radius: shapeRadius, fill: shapeColor, stroke: 'black', strokeWidth: 5 });
			}

			shape.draggable(true);
			shape.opacity(0.9);

			if (shape instanceof Konva.RegularPolygon) {
				shape.on('mousedown', function () {
					shape.sides(shape.sides() + 1);
					baseLayer.draw();
				});
				
				shape.on('mouseleave', function () {
					let totalSides = shape.sides();
					if (totalSides > 3) {
						shape.sides(shape.sides() - 1);
					}
					baseLayer.draw();
				});
			} else if (random(0, 1)) {
				shape.on('mousemove', function () {
					const pointerPos = stage.getPointerPosition();
					shape.fill(`rgb(${ pointerPos.x % 255 }, ${ pointerPos.y % 255 }, 100)`);
					baseLayer.draw();
				});

				shape.on('mouseover.radius', function () {
					let curRadius = shape.radius();
					shape.radius(curRadius + 5);
					baseLayer.draw();
				});
			} else {			
				shape.on('mouseover.fillcolor', function () {
					shape.fill(`hsl(${ random(0, 360) }, 60%, 60%)`);
					baseLayer.draw();
				});
			}
			
			baseLayer.add(shape);
			stage.add(baseLayer);

			setTimeout(() => {
				shape.destroy();
				baseLayer.destroy();
				stage.destroy();
				this.#shapeContainer.style.zIndex = -1;
			}, 5000);
		}	
	}
}
