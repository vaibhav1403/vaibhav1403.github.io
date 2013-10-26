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


var canvas, ctx, W, H, initiate, score = 0;

canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

W = canvas.width;
H = canvas.height;

var gun, angleGun = 0, particlesCount = 10, bulletLimit = 30;

var bullet = [], bubbles = [], particles = [];

console.log((W/2)-(20/2));

canvas.addEventListener('mousemove', findAngle, false);
canvas.addEventListener('click', initBall, false);

gun = {
	width: 25,
	height: 120,
	x: (W/2),
	y: H,
	anglefromhorizon: Math.PI/4,

	draw: function(angleFromHor) {
		// ctx.rotate(this.anglefromhorizon);
		this.x = (W/2);
		this.y = H;
		ctx.fillStyle = 'white';

		ctx.save();

		ctx.translate(this.x, this.y);

		ctx.rotate((Math.PI/2) - angleFromHor);
		ctx.fillRect(-(this.width/2), -this.height, this.width, this.height);

		ctx.restore();
	}
}

function Ball() {
	this.x = 0;
	this.y = 0;
	this.v = 8;
	this.speed = 1;
	this.radius = 3;
	this.shootAngle;
	var self = this;

	this.draw = function(x, y) {
		ctx.beginPath();
		ctx.arc(x, y, 6, 0, Math.PI*2, false);
		ctx.fillStyle = "white";
		ctx.fill();
	}
}

function initBall(e) {
	bullet.unshift(new Ball());
	bullet[0].x = gun.x + gun.height*Math.cos(angleGun);
	bullet[0].y = gun.y - gun.height*Math.sin(angleGun);
	bullet[0].shootAngle = angleGun;
}

function gameReset() {
	for(var i=0; i<bullet.length; i++) {
		bullet.pop();
	}
	bullet.length = 0;
	for(var i=0; i<bubbles.length; i++) {
		bubbles.pop();
	}
	bubbles.length = 0;
	score = 0;
	document.getElementById('scoreSpan').innerHTML = 0;
	document.getElementById('bulletsLeft').innerHTML = bulletLimit;
	animloop();
}

function init() {

	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, W, H);

	if (bullet.length > bulletLimit) {
		// bullet.pop();
		alert('Your score is \"' + score + '\" Press Ok to start again');
		cancelRequestAnimFrame(initiate);
		gameReset();
		return false;
	}

	for(var i = 0; i<bullet.length; i++){
		for(var j = 0; j<bubbles.length; j++) {
			var xDiff = bubbles[j].x - bullet[i].x;
			var yDiff = bubbles[j].y - bullet[i].y;

			if (Math.sqrt((xDiff*xDiff) + (yDiff*yDiff)) <= bubbles[j].radius) {
				console.log('bullet ' + i + 'hits Bubble ' + j);
				bubbles[j].hit = true;
				bubbles[j].radius = 0;

				score += bubbles[j].number;
				// The blast effect is yet to be done
				// for(var k = 0; k < particlesCount; k++) {
				// 	particles.push(new createParticles(bubbles[j].x, bubbles[j].y, 1));
				// }
				// emitParticles();
			}
		}
	}	

	for(var i = 0; i<bullet.length; i++){
		bullet[i].x += bullet[i].v*Math.cos(bullet[i].shootAngle);
		bullet[i].y -= bullet[i].v*Math.sin(bullet[i].shootAngle);
		bullet[i].draw(bullet[i].x, bullet[i].y);
	};

	for(var i = 0; i<bubbles.length; i++){
		bubbles[i].x += bubbles[i].vx;
		bubbles[i].draw(bubbles[i].x, bubbles[i].y, bubbles[i].hit);
	};

	gun.draw(angleGun);
	document.getElementById('scoreSpan').innerHTML = score;
	document.getElementById('bulletsLeft').innerHTML = bulletLimit - bullet.length;
}

function animloop() {
	initiate = requestAnimFrame(animloop);
	init();
}

animloop();


function findAngle(event) {
	var angle;

	eX = event.pageX;
	eY = event.pageY;

	var _y = eY - gun.y;
	var _x = eX - gun.x;

	angleGun = Math.atan2(-_y, _x);

}

function Bubble() {
	this.number;
	this.radius = 20;
	this.x;
	this.y;
	this.vx = 3;
	this.hit = false;
	this.number = Math.floor(Math.random()*10) + 1;;

	this.draw = function(x, y, hit) {

		ctx.beginPath();
		ctx.arc(x, y, this.radius, 0, Math.PI*2, false);
		if (hit) {
			ctx.fillStyle = "black";
		}
		else {
			ctx.fillStyle = "white";	
		}
			
		ctx.fill();		

		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		if (hit) {
			ctx.fillStyle = "black";
		}
		else {
			ctx.fillStyle = "black";	
		}
		ctx.fillText(this.number, x, y );
	}
}

setInterval( function () {
	bubbles.push(new Bubble());
	bubbles[bubbles.length-1].x = 0;
	bubbles[bubbles.length-1].y = Math.floor(Math.random()*H/2) + 1;
}, 2000);


function createParticles(x, y, m) {
	this.x = x || 0;
	this.y = y || 0;
	
	this.radius = 10;
	
	this.vx = -1.5 + Math.random()*3;
	this.vy = m * Math.random()*1.5;
}