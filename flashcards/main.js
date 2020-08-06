const $$ = id => document.createElement(id);

class Card {
	constructor(dat) {
		this.q = dat;
		this.div = "";
	}

	makeDOM() {
		this.div = $$("div");
		this.div.className = "div";
		this.div.innerHTML = `${data.question_text[this.q.type].replace(
			"$",
			`<strong>${this.q.data.name}</strong>`
		)}<br><br>`;
		let flow = $$("div");
		flow.style.display = "flex";
		for (let i of data.questions[this.q.type]) {
			let button = $$("button");
			button.innerText = i;
			if (i == this.q.answer) button.onclick = () => answer(true);
			else button.onclick = () => answer(false);
			flow.appendChild(button);
		}
		this.div.appendChild(flow);
		document.body.appendChild(this.div);
	}

	remove() {
		document.body.removeChild(this.div);
	}
}

let data, card, lastcard;
function init() {
	fetch("data.json")
		.then(r => r.json())
		.then(j => {
			data = j;
			return j;
		})
		.then(makeCard);
}

function makeCard() {
	let r = Math.floor(Math.random() * data.cards.length);
	let c = data.cards[r];
	if (c.id == lastcard) return makeCard();
	else lastcard = c.id;
	let r2 = Math.floor(Math.random() * c.questions.length);
	let t = c.questions[r2];
	let a = c.answers[r2];
	card = new Card({ type: t, answer: a, data: c });
	card.makeDOM();
}

function answer(bool) {
	if (bool) {
		card.remove();
		makeCard();
	}
}
