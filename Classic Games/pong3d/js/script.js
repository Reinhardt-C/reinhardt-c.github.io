let paddles;
let balls;
let points;

function setup() {
	paddles = [];
	balls = [];
	points = [0, 0];
	paddles.push(new Paddle(true));
	paddles.push(new Paddle(false));
	balls.push(new Ball(new p5.Vector(0, 0, 0), new p5.Vector([-10, 10][Math.round(Math.random())], 0, 0)));
	// balls.push(new Ball(new p5.Vector(0, 0, 0), new p5.Vector(10, 0, 0)));
	createCanvas(500, 500, WEBGL);
}

function draw() {
	background(0);
	lights();
	document.getElementById("score").innerText = `${points[0]}|${points[1]}`;
	translate(0, 0, -200);
	if (keyIsDown(87)) for (let i of paddles) if (i.left) i.up();
	if (keyIsDown(83)) for (let i of paddles) if (i.left) i.down();
	if (keyIsDown(65)) for (let i of paddles) if (i.left) i.backward();
	if (keyIsDown(68)) for (let i of paddles) if (i.left) i.forward();
	if (keyIsDown(UP_ARROW)) for (let i of paddles) if (!i.left) i.up();
	if (keyIsDown(DOWN_ARROW)) for (let i of paddles) if (!i.left) i.down();
	if (keyIsDown(LEFT_ARROW)) for (let i of paddles) if (!i.left) i.backward();
	if (keyIsDown(RIGHT_ARROW)) for (let i of paddles) if (!i.left) i.forward();

	fill(noise(frameCount / 8) * 200 + 55, noise(frameCount / 10) * 200 + 55, noise(frameCount / 12) * 200 + 55);
	stroke(noise(frameCount / 12) * 200 + 55, noise(frameCount / 10) * 200 + 55, noise(frameCount / 8) * 200 + 55);
	for (let i of paddles) i.show();
	for (let i of balls) i.show();
}

class Paddle {
	// PVectors
	constructor(left, dims = new p5.Vector(10, 100, 100)) {
		this.left = left;
		this.pos = left ? new p5.Vector(-100, 0, 0) : new p5.Vector(100, 0, 0);
		this.dims = dims;
		this.hasMoved = false;
	}

	show() {
		push();
		translate(this.pos.x, this.pos.y, this.pos.z);
		box(this.dims.x, this.dims.y, this.dims.z);
		pop();
		for (let i of balls) line(this.pos.x, this.pos.y, this.pos.z, i.pos.x, i.pos.y, i.pos.z);
	}

	up() {
		if (this.pos.y < -250) return;
		this.pos.y -= 10;
		this.hasMoved = true;
	}

	down() {
		if (this.pos.y > 250) return;
		this.pos.y += 10;
		this.hasMoved = true;
	}

	forward() {
		if (this.pos.z > 250) return;
		this.pos.z += 10;
		this.hasMoved = true;
	}

	backward() {
		if (this.pos.z < -250) return;
		this.pos.z -= 10;
		this.hasMoved = true;
	}
}

class Ball {
	constructor(pos, vel) {
		this.pos = pos;
		this.vel = vel;
	}

	show() {
		this.vel = this.vel.limit(10);
		if (this.pos.x > 250 || this.pos.x < -250) {
			this.vel.x *= -1;
			// setup();
		}
		if (this.pos.y > 250 || this.pos.y < -250) this.vel.y *= -1;
		if (this.pos.z > 250 || this.pos.z < -250) this.vel.z *= -1;
		this.pos = this.pos.add(this.vel);
		for (let i of paddles)
			if (this.inPaddle(i)) {
				if (i.hasMoved) points[i.left ? 0 : 1]++;
				this.vel.x *= -1;
				this.vel.y += -(i.pos.y - this.pos.y) / 5;
				this.vel.z += -(i.pos.z - this.pos.z) / 5;
			}
		push();
		translate(this.pos.x, this.pos.y, this.pos.z);
		sphere(10);
		pop();
	}

	inPaddle(paddle) {
		return this.pos.x > paddle.pos.x - paddle.dims.x / 2 && this.pos.x < paddle.pos.x + paddle.dims.x / 2 && this.pos.y > paddle.pos.y - paddle.dims.y / 2 && this.pos.y < paddle.pos.y + paddle.dims.y / 2 && this.pos.z > paddle.pos.z - paddle.dims.z / 2 && this.pos.z < paddle.pos.z + paddle.dims.z / 2;
	}
}
