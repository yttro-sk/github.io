
var particles = [];
var stage, graphics;
var loader, logo;
var scaleFactor;
var viewportWidth, viewportHeight;

function init() {
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas, false);

	stage = new createjs.Stage("animation");
	graphics = new createjs.Graphics();
	stage.addChild(new createjs.Shape(graphics));

	let canvas = document.getElementById("animation");
	
	for(let i=0; i<100; i++)
		particles.push(new Particle(canvas.width, canvas.height));

	createjs.Ticker.setFPS(30);
    	createjs.Ticker.addEventListener("tick", drawScene);
}

function resizeCanvas() {
	let canvas = document.getElementById("animation");
	let style = window.getComputedStyle(canvas);
	let elementWidth = parseInt(style.getPropertyValue("width"));
	let elementHeight = parseInt(style.getPropertyValue("height"));

    scaleFactor = getDevicePixelRatio();

    if (scaleFactor > 1) {
		canvas.width = elementWidth * scaleFactor;
		canvas.height = elementHeight * scaleFactor;
		canvas.style.width = elementWidth + "px";
		canvas.style.height = elementHeight + "px";
    } else {
		canvas.width = elementWidth;
		canvas.height = elementHeight;
    }

    viewportWidth = elementWidth;
    viewportHeight = elementHeight;

	//console.log("Canvas resized: " + canvas.width + ":" + canvas.height);
	//console.log("Viewport resized: " + viewportWidth + ":" + viewportHeight);
}

function getDevicePixelRatio() {
    if ("devicePixelRatio" in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

function drawScene() {

	let canvas = document.getElementById("animation");
	graphics.clear();

	for(let i=0; i<particles.length; i++) {
		particles[i].update(viewportWidth, viewportHeight);
		particles[i].draw(graphics, i);
	}
	
	stage.update();
}

const clamp = (x, min, max) => Math.min(Math.max(x, min), max);
const rand = (min, max) => Math.random()*(max - min) + min;

class Particle {
	constructor(widht, height) {
		this.reinitialize(widht, height);
	};
	
	reinitialize(width, height) {
		this.x = rand(10, width - 10);
		this.y = rand(10, height - 10);
		this.vx = rand(-0.8, 0.8 );
		this.vy = rand(-0.8, 0.8 );
		this.angle = rand( Math.TWO_PI );
	};

	update(width, height) {		
		this.x += this.vx;
		this.y += this.vy;
		
		//this.theta += Math.random( -0.1, 0.1 );
	        //this.x += Math.sin( this.theta ) * 0.01;
        	//this.y += Math.cos( this.theta ) * 0.01;

		if (this.x < 0 || this.y < 0 || this.x > width || this.y > height) {
			this.reinitialize(width, height);
		}
	};

	draw(g, index) {
		
	
		g.beginFill("#a3a3a3").drawCircle(this.x * scaleFactor, this.y * scaleFactor, 1.1 * scaleFactor);
		for(let i=index+1; i<particles.length; i++) {
			let p = particles[i];
			let dist = this.distance(p);
			
			if(dist < 100) {
				g.setStrokeStyle(this.lineWidth(dist) * scaleFactor).beginStroke(this.lineColor(dist));
				g.moveTo(this.x * scaleFactor, this.y * scaleFactor).lineTo(p.x * scaleFactor, p.y * scaleFactor);
			}
		}
	};

	lineColor(dist) {
		let min = 120, max = 240;
		let x =  Math.floor(min + (max-min)*(1 - dist/100));
		return "rgb(" + x + "," + x + "," + x + ")"
	};

	lineWidth(dist) {
		let min = 0.05, max = 0.5;
		return min + (max-min)*(1 - dist/100);
	}
	
	distance(particle) {
		return Math.sqrt(Math.pow(this.x - particle.x, 2) + Math.pow(this.y - particle.y, 2));
	}
};
