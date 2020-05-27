class Brick {
	constructor(x, y, w = 50, h = 20) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		bricks.push(this);
	}

	show() {
		stroke(255);
		fill(255);
		rect(this.x, this.y, this.w, this.h);
		stroke(0);
		noFill();
		rect(this.x, this.y, this.w, this.h);
	}

	ballOverlaps(ball) {
		var circle = { x: ball.x, y: ball.y, r: 5 };
		var rect = { x: this.x, y: this.y, w: this.w, h: this.h };
		var distX = Math.abs(circle.x - rect.x - rect.w / 2);
		var distY = Math.abs(circle.y - rect.y - rect.h / 2);

		if (distX > rect.w / 2 + circle.r) {
			return false;
		}
		if (distY > rect.h / 2 + circle.r) {
			return false;
		}

		if (distX <= rect.w / 2) {
			bricks.splice(bricks.indexOf(this), 1);
			return "x";
		}
		if (distY <= rect.h / 2) {
			bricks.splice(bricks.indexOf(this), 1);
			return "y";
		}

		var dx = distX - rect.w / 2;
		var dy = distY - rect.h / 2;
		if (dx * dx + dy * dy <= circle.r * circle.r) bricks.splice(bricks.indexOf(this), 1);
		return dx * dx + dy * dy <= circle.r * circle.r ? "xy" : false;
	}
}

class Ball {
	constructor(x, y, xvel = 0, yvel = 0) {
		this.x = x;
		this.y = y;
		this.xvel = xvel;
		this.yvel = yvel;

		balls.push(this);
	}

	show() {
		// console.log(this.yvel > 0 && this.y > height, this.y, this.yvel);
		if (this.y < 0 && this.yvel < 0) {
			this.yvel *= -1;
			this.y = 0;
		} else if (this.xvel > 0 && this.x > width) {
			this.xvel *= -1;
			this.x = width;
		} else if (this.yvel > 0 && this.y > height) {
			setup();
			this.yvel *= -1;
			this.y = height;
		} else if (this.x < 0 && this.x < 0) {
			this.xvel *= -1;
			this.x = 0;
		}
		for (let i of bricks) {
			let ov = i.ballOverlaps(this);
			if (ov && ov.includes(chaosMode ? "y" : "x")) {
				this.yvel *= -1;
				this.y += this.yvel;
			}
			if (ov && ov.includes(chaosMode ? "x" : "y")) {
				this.xvel *= -1;
				this.x += this.xvel;
			}
		}
		for (let i of thingies) {
			let ov = i.ballOverlaps(this);
			if (ov) {
				this.yvel *= -1;
				this.y += this.yvel;
				this.xvel += this.x - i.pos - 50;
			}
		}

		if (this.xvel > 5) this.xvel = 5;
		if (this.xvel < -5) this.xvel = -5;

		this.x += this.xvel;
		this.y += this.yvel;

		stroke(255);
		fill(255);
		ellipseMode(CENTER);
		ellipse(this.x, this.y, 5, 5);
	}
}

class Thingy {
	constructor(pos, ypos = height - 20) {
		this.pos = pos;
		this.ypos = height - 20;

		thingies.push(this);
	}

	left() {
		if (this.pos > 0) this.pos -= 10;
	}

	right() {
		if (this.pos < width - 100) this.pos += 10;
	}

	up() {
		if (this.ypos > 0) this.ypos -= 10;
	}

	down() {
		if (this.ypos < height - 10) this.ypos += 10;
	}

	show() {
		fill(thingies.indexOf(this) == 0 ? 0 : 255, thingies.indexOf(this) == 0 ? 255 : 0, thingies.indexOf(this) == 0 ? 0 : 255);
		rect(this.pos, this.ypos, 100, 10);
	}

	ballOverlaps(ball) {
		var circle = { x: ball.x, y: ball.y, r: 5 };
		var rect = { x: this.pos, y: this.ypos, w: 100, h: 10 };
		var distX = Math.abs(circle.x - rect.x - rect.w / 2);
		var distY = Math.abs(circle.y - rect.y - rect.h / 2);

		if (distX > rect.w / 2 + circle.r) {
			return false;
		}
		if (distY > rect.h / 2 + circle.r) {
			return false;
		}

		if (distX <= rect.w / 2) {
			return true;
		}
		if (distY <= rect.h / 2) {
			return true;
		}

		var dx = distX - rect.w / 2;
		var dy = distY - rect.h / 2;
		return dx * dx + dy * dy <= circle.r * circle.r;
	}
}

let bricks, balls, thingies, chaosMode;

function setup() {
	createCanvas(500, 500);
	bricks = [];
	balls = [];
	thingies = [];
	chaosMode = false;

	for (let i = 0; i < Math.floor(width / 50); i++) {
		for (let j = 0; j < Math.floor(height / 40); j++) {
			new Brick(i * 50, j * 20);
		}
	}

	new Ball(width / 2, height - 40, 0, -8);
	new Thingy(width / 2 - 50);
	new Thingy(width / 2 + 150);
	// for (let i = 0; i < Math.floor(width / 100); i++) {
	// 	new Thingy(i * 100);
	// }
}

function draw() {
	background(0);

	if (keyIsDown(LEFT_ARROW)) thingies[0].left();
	if (keyIsDown(RIGHT_ARROW)) thingies[0].right();
	if (keyIsDown(UP_ARROW)) thingies[0].up();
	if (keyIsDown(DOWN_ARROW)) thingies[0].down();
	if (keyIsDown(65)) thingies[1].left();
	if (keyIsDown(68)) thingies[1].right();
	if (keyIsDown(87)) thingies[1].up();
	if (keyIsDown(83)) thingies[1].down();

	for (let i of bricks) i.show();
	for (let i of balls) i.show();
	for (let i of thingies) i.show();

	if (bricks.length == 0) setup();
}
