let n = 0;
let complex = math.complex(prompt("Complex base"));
let symbols = parseFloat(prompt("How many symbols? 1-9"));

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	frameRate(60);
	background(0);
	stroke(255);
	strokeWeight(2);
	push();
	translate(width / 2, height / 2);
	line(0, height / 2, 0, -height / 2);
	line(width / 2, 0, -width / 2, 0);
	pop();
}

function draw() {
	push();
	translate(width / 2, height / 2);
	const expression = n.toString(symbols).split(".");
	let acc = math.complex(0, 0);
	for (const i in expression[0])
		acc = math.add(
			acc,
			math.multiply(
				parseFloat(expression[0][i]),
				math.pow(complex, expression[0].length - parseFloat(i) - 1)
			)
		);
	const x = math.round(acc.re);
	const y = math.round(acc.im);
	stroke(255, 0, 0);
	strokeWeight(5);
	point(x * 5, y * 5);
	pop();
	stroke(255);
	rect(0, 0, 300, 50);
	text(expression, 20, 20);
	if (x == 0) text(y + "i", 20, 40);
	else if (y == 0) text(x, 20, 40);
	else text(x + "+" + y + "i", 20, 40);
	n++;
}
