let player, impostor, state, gamestate;

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	player = createVector(0, 0);
	impostor = createVector(-100, -100);
	gamestate = 1;
}

function draw() {
	translate(width / 2, height / 2);
	background(0);
	strokeWeight(10);
	if (gamestate) {
		if (keyIsDown(87) && player.y > -height / 2) player.y--;
		if (keyIsDown(65) && player.x > -width / 2) player.x--;
		if (keyIsDown(68) && player.x < width / 2) player.x++;
		if (keyIsDown(83) && player.y < height / 2) player.y++;
		state = +(abs(impostor.x - player.x) < abs(impostor.y - player.y));
		if (impostor[state ? "y" : "x"] < player[state ? "y" : "x"])
			impostor[state ? "y" : "x"]++;
		if (impostor[state ? "y" : "x"] > player[state ? "y" : "x"])
			impostor[state ? "y" : "x"]--;
	}
	stroke(255);
	point(player.x, player.y);
	stroke(255, 0, 0);
	point(impostor.x, impostor.y);
	if (dist(player.x, player.y, impostor.x, impostor.y) < 2) gamestate = 0;
}
