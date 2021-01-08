async function init() {
	let t = await fetch("./shaders/shader.frag").then(r => r.text());
	let j = await fetch("./data/model.json").then(r => r.json());

	let sdf = "";
	for (let i of j.objects) {
		let string = "";
		switch (i.type) {
			case "sphere":
				string = `Sphere(vec4(${i.pos},${i.radius}),p,vec3(${i.color}))`;
				break;
			case "box":
				string = `Box(vec3(${i.pos}),vec3(${i.dim}),p,vec3(${i.color}))`;
				break;
			case "round_box":
				string = `RoundBox(vec3(${i.pos}),vec3(${i.dim}),${i.radius},p,vec3(${i.color}))`;
				break;
			default:
				throw `Unknown type (${i.type})`;
		}
		if (sdf.length == 0) sdf = string;
		else sdf = `Union(${string}, ${sdf})`;
	}
	sdf = sdf.replace(/[^\w\.]\d[^\.\d]/g, match => `${match[0] + match[1]}.0${match[2]}`);
	t = t.replace("#define _SDF_ vec4(0)", "").replace("_SDF_", sdf);

	const WIDTH = window.innerWidth;
	const HEIGHT = window.innerHeight;

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(WIDTH, HEIGHT);
	renderer.setClearColor(0xdddddd, 1);
	document.body.appendChild(renderer.domElement);

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
	camera.position.z = 30;
	scene.add(camera);

	const uniforms = {
		u_time: { type: "f", value: 0.2 },
		u_resolution: { type: "v2", value: new THREE.Vector2(WIDTH, HEIGHT) },
		u_camera: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
		u_dir: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
		u_light: {
			type: "v3",
			value: new THREE.Vector3(
				...(j.lightSource.map(e => eval((e + "").replace(/u_time/g, 0))) || [0, 0, 0])
			),
		},
	};

	const boxGeometry = new THREE.BoxGeometry(WIDTH, HEIGHT, 1);
	const basicMaterial = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: `void main() {
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,
		fragmentShader: t,
	});

	const cube = new THREE.Mesh(boxGeometry, basicMaterial);
	scene.add(cube);

	function render() {
		uniforms.u_time.value += 0.01;
		uniforms.u_light.value = new THREE.Vector3(
			...(j.lightSource.map(e => eval((e + "").replace(/u_time/g, uniforms.u_time.value))) || [
				0,
				0,
				0,
			])
		);
		const speed = 0.1;
		const u = basicMaterial.uniforms;
		// W
		if (pressedKeys[87]) {
			u.u_camera.value.z += speed * Math.cos(u.u_dir.value.y);
			u.u_camera.value.x -= speed * Math.sin(u.u_dir.value.y);
		}
		// S
		if (pressedKeys[83]) {
			u.u_camera.value.z -= speed * Math.cos(u.u_dir.value.y);
			u.u_camera.value.x += speed * Math.sin(u.u_dir.value.y);
		}
		// A
		if (pressedKeys[65]) {
			u.u_camera.value.x -= speed * Math.cos(u.u_dir.value.y);
			u.u_camera.value.z -= speed * Math.sin(u.u_dir.value.y);
		}
		// S
		if (pressedKeys[68]) {
			u.u_camera.value.x += speed * Math.cos(u.u_dir.value.y);
			u.u_camera.value.z += speed * Math.sin(u.u_dir.value.y);
		}
		if (pressedKeys[32]) u.u_camera.value.y += speed;
		if (pressedKeys[16]) u.u_camera.value.y -= speed;
		if (pressedKeys[37]) u.u_dir.value.y += speed / 2;
		if (pressedKeys[39]) u.u_dir.value.y -= speed / 2;
		if (pressedKeys[38]) u.u_dir.value.x += speed / 2;
		if (pressedKeys[40]) u.u_dir.value.x -= speed / 2;
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	const pressedKeys = {};
	window.onkeyup = function (e) {
		pressedKeys[e.keyCode] = false;
	};
	window.onkeydown = function (e) {
		pressedKeys[e.keyCode] = true;
	};

	render();
}

init();
