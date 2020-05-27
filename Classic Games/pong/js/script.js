class Thingy {
	constructor(left, pos = 0) {
		this.pos = pos;
		this.left = left;
	}

	show() {
		stroke(255);
		rectMode(CENTER);
		for (let i of balls) this.ballOverlaps(i);
		// if (this.left) {
		// 	if (balls[0].y - height / 2 > this.pos) this.down();
		// 	else this.up();
		// }
		rect(this.left ? 5 : width - 5, this.pos + height / 2, 5, 100);
	}

	up() {
		if (this.pos <= -height / 2) return;
		this.pos -= 5;
	}

	down() {
		if (this.pos >= height / 2) return;
		this.pos += 5;
	}

	ballOverlaps(ball) {
		if ((this.left ? ball.x <= 10 : ball.x >= width - 10) && Math.abs(this.pos - (ball.y - height / 2)) <= 50) {
			ball.velx *= -1;
			if (chaosMode) ball.vely += this.pos + (ball.y - height / 2);
			else ball.vely += (this.pos - (ball.y - height / 2)) / 5;
		}
	}
}

class Ball {
	constructor(x, y, velx = 4, vely = 0) {
		this.x = x;
		this.y = y;
		this.velx = velx;
		this.vely = vely;
	}

	show() {
		this.walls();
		if (!chaosMode && this.vely > 20) this.vely = 20;
		this.x += this.velx;
		this.y += this.vely;
		rect(this.x, this.y, 10, 10);
	}

	walls() {
		if (this.y < 0 || this.y > height) this.vely *= -1;
		if (this.x < 0 || this.x > width) {
			this.x = width / 2;
			this.y = height / 2;
			// balls.push(new Ball(width / 2, 300, 4));
			// balls.push(new Ball(width / 2, 100, -4));
			balls.splice(balls.indexOf(this), 1);
			if (balls.length == 0) {
				balls = [new Ball(width / 2, height / 2) /* , new Ball(width / 2, 100, -4) */];
				thingies = [new Thingy(true), new Thingy(false)];
			}
		}
	}
}

let thingies = [],
	balls = [];
let chaosMode = false;

function setup() {
	createCanvas(500, 500);
	thingies.push(new Thingy(true));
	thingies.push(new Thingy(false));
	balls.push(new Ball(width / 2, height / 2));
	// balls.push(new Ball(width / 2, 100, -4));
}

function draw() {
	background(0);

	if (keyIsDown(87)) for (let i of thingies) if (i.left) i.up();
	if (keyIsDown(83)) for (let i of thingies) if (i.left) i.down();
	if (keyIsDown(UP_ARROW)) for (let i of thingies) if (!i.left) i.up();
	if (keyIsDown(DOWN_ARROW)) for (let i of thingies) if (!i.left) i.down();

	for (let i of thingies) i.show();
	for (let i of balls) i.show();
}
