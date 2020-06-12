class Thingy {
	constructor(left, pos = 0) {
		this.pos = pos;
		this.left = left;
	}

	show() {
		stroke(255);
		rectMode(CENTER);
		for (let i of balls) this.ballOverlaps(i);
		if (ai !== false && this.left) {
			switch (ai) {
				case 0:
					if (balls[0].y - height / 2 > this.pos) this.down();
					else this.up();
					break;
				case 1:
					if (balls[0].y - height / 2 > this.pos && balls[0].vely > 0) this.down();
					else if (balls[0].y - height / 2 < this.pos && balls[0].vely < 0) this.up();
					break;
				case 2:
					if (balls[0].x > Math.abs((6 / balls[0].vely) * 250)) {
						let moveTo = balls[0].moveTo;
						if (moveTo > this.pos) this.down();
						else if (moveTo < this.pos) this.up();
					} else {
						if (balls[0].y - height / 2 > this.pos && balls[0].vely > 0 && Math.abs(balls[0].y - height / 2 - this.pos) > 40) this.down();
						else if (balls[0].y - height / 2 < this.pos && balls[0].vely < 0 && Math.abs(balls[0].y - height / 2 - this.pos) > 40) this.up();
					}
					break;
				case 3:
					if (this.left && balls[0].velx > 0) break;
					// if (!this.left && balls[0].velx < 0) break;
					let moveTo = balls[0].moveTo;
					if (Math.abs(moveTo - this.pos) > 3 && moveTo > this.pos) this.down();
					else if (Math.abs(moveTo - this.pos) > 3 && moveTo < this.pos) this.up();
					break;
			}
		}
		rect(this.left ? 5 : width - 5, this.pos + height / 2, 5, 100);
	}

	up(player) {
		if ((player && this.left && ai !== false) || this.pos <= -height / 2) return;
		this.pos -= 5;
	}

	down(player) {
		if ((player && this.left && ai !== false) || this.pos >= height / 2) return;
		this.pos += 5;
	}

	ballOverlaps(ball) {
		if (!ball.immune && (this.left ? ball.x <= 10 : ball.x >= width - 10) && Math.abs(this.pos - (ball.y - height / 2)) <= 50) {
			ball.velx *= -1;
			ball.immune = true;
			if (chaosMode) ball.vely += this.pos + (ball.y - height / 2);
			else ball.vely += (this.pos - (ball.y - height / 2)) / 5;
			ball.updBounces();
		}
	}
}

class Ball {
	constructor(x, y, velx = 4, vely = 0) {
		this.x = x;
		this.y = y;
		this.velx = velx;
		this.vely = vely;
		this.moveTo = 0;
		this.mtt = "a";
		this.immune = false;
	}

	updBounces() {
		if (ai == 2) {
			let cy = this.y;
			let time = 485 / Math.abs(this.velx);
			let dist = Math.abs(this.vely) * time;
			if (this.vely < 0) dist -= 500 - cy;
			else dist -= cy;
			dist += 250;
			let bounces = Math.round(dist / 500);
			let bounceParity = bounces % 2; // Even or odd bounces
			if (this.vely < 0) dist += 500 - cy;
			else dist += cy;
			let thing = dist % 500;
			if (bounceParity) {
				this.moveTo = thing;
				this.mtt = "a";
			} else {
				this.moveTo = 250 - thing;
				this.mtt = "b";
			}
			this.moveTo = this.moveTo % 500;
		} else if (ai == 3) {
			let ray = new Ray(this.x, this.y, this.velx, this.vely);
			ray.process();
			this.moveTo = ray.y - 250;
		}
	}

	show() {
		this.walls();
		if (!chaosMode && this.vely > 10) this.vely = 10;
		this.x += this.velx;
		this.y += this.vely;
		if (Math.abs(this.x - 250) < 50) this.immune = false;
		rect(this.x, this.y, 10, 10);
	}

	walls() {
		if (this.y < 0 || this.y > height) {
			this.vely *= -1;
			this.y += this.vely;
		}
		if (this.x < 0 || this.x > width) {
			this.x = width / 2;
			this.y = height / 2;
			balls.splice(balls.indexOf(this), 1);
			if (balls.length == 0) {
				balls = [new Ball(width / 2, height / 2)];
				thingies = [new Thingy(true), new Thingy(false)];
			}
		}
	}
}

class Ray {
	constructor(x, y, velx = 4, vely = 0) {
		this.x = x;
		this.y = y;
		this.velx = velx;
		this.vely = vely;
		this.endx = "PENDING";
		this.endy = "PENDING";
	}

	process() {
		while (this.endx == "PENDING" && this.endy == "PENDING") {
			this.step();
		}
	}

	step() {
		this.walls();
		if (!chaosMode && this.vely > 10) this.vely = 10;
		this.x += this.velx;
		this.y += this.vely;
	}

	walls() {
		if (this.y < 0 || this.y > height) this.vely *= -1;
		if (this.x < 0 || this.x > width) {
			this.endx = this.x;
			this.endy = this.y;
		}
	}
}

let thingies = [],
	balls = [];
let chaosMode = false,
	ai = 3;

function setup() {
	createCanvas(500, 500);
	thingies.push(new Thingy(true));
	thingies.push(new Thingy(false));
	balls.push(new Ball(width / 2, height / 2));
}

function draw() {
	background(0);

	if (keyIsDown(87)) for (let i of thingies) if (i.left) i.up(true);
	if (keyIsDown(83)) for (let i of thingies) if (i.left) i.down(true);
	if (keyIsDown(UP_ARROW)) for (let i of thingies) if (!i.left) i.up(true);
	if (keyIsDown(DOWN_ARROW)) for (let i of thingies) if (!i.left) i.down(true);

	for (let i of thingies) i.show();
	for (let i of balls) i.show();
}
