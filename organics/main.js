let activeAnswer;

async function init() {
	const data = await getData();
	document.getElementById("input").placeholder = "";
	askQuestion(getQuestion(data));
}

async function getData() {
	return fetch("./data.json").then((e) => e.json());
}

function getQuestion(data) {
	const reactionData =
		data.questions[Math.floor(Math.random() * data.questions.length)];
	const keys = Object.keys(reactionData);
	let type = "product";
	while (type == "product" || type == "reactant")
		type = keys[Math.floor(Math.random() * keys.length)];
	const neatType = type.toUpperCase();
	return [
		reactionData.reactant,
		reactionData.product,
		neatType,
		reactionData[type],
	];
}

function askQuestion(question) {
	activeAnswer = question[3];
	const text = `In a reaction from ${question[0].toUpperCase()}S to ${question[1].toUpperCase()}S what is the ${
		question[2]
	} of the reaction?`;
	document.getElementById("q").innerText = text;
}

function answer(response) {
	if (
		(activeAnswer.toLowerCase &&
			response.toLowerCase() == activeAnswer.toLowerCase()) ||
		(activeAnswer.map &&
			(activeAnswer
				.map((e) => e.toLowerCase())
				.includes(response.toLowerCase()) ||
				response.toLowerCase() ==
					activeAnswer.join(" OR ").toLowerCase()))
	) {
		init();
		return true;
	}
	document.getElementById("input").placeholder = activeAnswer.join
		? activeAnswer.join(" OR ")
		: activeAnswer;
	return false;
}

document.getElementById("input").addEventListener("keydown", (e) =>
	e.key == "Enter"
		? (() => {
				answer(e.target.value);
				e.target.value = "";
		  })()
		: null
);

init();
