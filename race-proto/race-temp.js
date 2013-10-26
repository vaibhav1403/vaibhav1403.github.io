// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
} )();

var canvas, ctx, W, H,
	car = {};
	obstacles = [];
	baseX = 0;
	baseY = 0;
	canvasBG = "#322f2a";


function init() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	W = canvas.width;
	H = canvas.height;

	ctx.fillStyle = canvasBG;
	ctx.fillRect(0, 0, W, H);

	setDefault();
	canvas.click();
}

init();

function Car() {
	this.width = 30;
	this.height = 50;
	this.x = baseX = W/2 - this.width/2;
	this.y = baseY = H-(this.height/2);

	this.draw = function() {
		ctx.fillStyle = "#2ccae2";
		ctx.fillRect(this.x-(this.width/2), this.y-(this.height/2), this.width, this.height);
	};
}

function setDefault() {
	car[0] = new Car();

	car[0].draw();

	window.addEventListener('keydown', updateCarPos, false);

	obstacles = [];

}
function updateCarPos(e) {
	var key = e.which;
	console.log(key);
	if (key === 37) {
		console.log('left');
		shiftCar('left');
	}
	if (key === 39) {
		console.log('right');
		shiftCar('right');	
	}
}

function shiftCar(dir) {
	if (dir === 'right' && car[0].x < (W-(car[0].width/2))) {
		console.log(car[0].x + ':' + (car[0].x+10));
		car[0].x = baseX + 10;
		baseX+=10;
	}
	if (dir === 'left' && car[0].x > (car[0].width/2)) {
		console.log(car[0].x + ':' + (car[0].x-10));
		car[0].x = baseX - 10;
		baseX-=10;
	}	
}

function update() {
	ctx.fillStyle = canvasBG;
	ctx.fillRect(0, 0, W, H);
	car[0].draw();

	updateObstacle();
	for (var i=0; i<obstacles.length; i++) {
		if ( ((obstacles[i].y+(obstacles[i].height/2)) > (baseY-(car[0].height/2))) && ((obstacles[i].y-(obstacles[i].height/2)) < (baseY+(car[0].height/2)))
			&& ((car[0].x-((car[0].width/2)+(obstacles[i].width/2))) < obstacles[i].x && obstacles[i].x < (car[0].x+(car[0].width/2+(obstacles[i].width/2)))) ) {
			alert('game over');
			setDefault();
		}
	};
}

setInterval(function () {
	update();
}, 20);


function Obstacle () {
	this.width = 50;
	this.height = 30;
	this.x = (this.width/2) + (Math.random()*(W-this.width));
	this.y = this.height/2;

	this.draw = function ()	{
		ctx.fillStyle = '#e2121c';
		ctx.fillRect(this.x-(this.width/2), this.y-(this.height/2), this.width, this.height);
	};
}


function createObstacle () {
	var newObstacle = new Obstacle();
	obstacles.push(newObstacle);
	newObstacle.draw();
}

function updateObstacle() {
	var obstacleNumber = obstacles.length;
	for(var j=0; j<obstacleNumber; j++) {
		obstacles[j].y += 3;
		obstacles[j].draw();
	}
}

setInterval(function () {
	createObstacle();
}, 1000);
