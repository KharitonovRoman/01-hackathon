import { Module } from '../core/module';
import 'konva/konva';

export default class ShapeModule extends Module {
	#shapeContainer;
	#canvasWidth;
	#canvasHeight;
	constructor(text) {
		super('Shape', text);

		this.#canvasWidth = 600;
		this.#canvasHeight = 400;

		this.#shapeContainer = document.createElement('div');
		this.#shapeContainer.id = 'shapeContainer';
		document.body.append(this.#shapeContainer);
	}

	trigger() {
		const stage = new Konva.Stage({
			container: "shapeContainer",
			width: this.#canvasWidth,
			height: this.#canvasHeight
		});
		
		var layerA = new Konva.Layer();
 
		var polyA = new Konva.RegularPolygon({
			x: 125,
			y: 125,
			sides: 6,
			radius: 80,
			fill: "yellow",
			stroke: "black",
			strokeWidth: 5
		  });
		  
		  var circB = new Konva.Circle({
			x: 475,
			y: 275,
			radius: 100,
			fill: "red",
			stroke: "black"
		  });
		  
		  layerA.add(polyA, circB);
		  
		  stage.add(layerA);
		  
		  polyA.on("mousedown", function() {
			polyA.sides(polyA.sides() + 1);
			layerA.draw();
		  });
		  
		  polyA.on("mouseleave", function() {
			var totalSides = polyA.sides();
			if(totalSides > 3) {
			  polyA.sides(polyA.sides() - 1);
			}
			layerA.draw();
		  });
		  
		  circB.on("mouseenter", function() {
			stage.container().style.cursor = "crosshair";
		  });
		  
		  circB.on("mouseleave", function() {
			stage.container().style.cursor = "default";
		  });
		  
		  circB.on("mousemove", function() {
			var pointerPos = stage.getPointerPosition();
			var r = pointerPos.x % 255;
			var g = pointerPos.y % 255;
			circB.fill("rgb(" + r + ", " + g + ", 100)");
			layerA.draw();
		  });

		  /**/

		  var circA = new Konva.Circle({
			x: 300,
			y: 200,
			height: 100,
			fill: "orange",
			stroke: "black"
		  });
		  
		  layerA.add(circA);
		  
		  stage.add(layerA);
		  
		  circA.on("mouseover.radius", function() {
			var curRadius = circA.radius();
			if(curRadius < 150) {
			  circA.radius(curRadius + 5);
			  layerA.draw();
			} else {
			  circA.off('mouseover.radius');
			}
		  });
		  
		  circA.on("mouseover.fillcolor", function() {
			var h = Math.floor(Math.random()*360);
			var color = "hsl(" + h + ", 60%, 60%)";
			circA.fill(color);
			layerA.draw();
		  });
 

	}

}
