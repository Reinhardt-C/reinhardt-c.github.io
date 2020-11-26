class Element {
	constructor(value, available, source, lastop = "") {
		this.value = value;
		this.available = available;
		this.source = source;
		this.lastop = lastop;
	}
}

class Set24 {
	constructor(elements, standard = false) {
		this.elements = [...elements];
		if (!standard) {
			for (let i = 0; i < this.elements.length; i++)
				if (typeof i == "number")
					this.elements[i] = new Element(this.elements[i], [], this.elements[i].toString());
			this.update();
			for (let i of this.elements) i.available = this.elements.filter(e => e.value !== i.value);
		}
	}

	update() {
		for (let i = 0; i < this.elements.length; i++)
			if (this.elements.filter(e => e.value == this.elements[i].value).length > 1)
				this.elements.splice(i--, 1);
	}

	closure(operation) {
		let newSet = new Set24(this.elements, true);
		for (let i of this.elements) {
			for (let j of i.available) {
				let a = i.source;
				let b = j.source;
				let ab = !(
					/^\d+$/.test(a) ||
					["+", "-"].includes(operation) ||
					(["*", "/"].includes(operation) && ["*", "/", "^"].includes(i.lastop))
				);
				let bb = !(
					/^\d+$/.test(b) ||
					["+", "-"].includes(operation) ||
					(["*", "/"].includes(operation) && ["*", "/", "^"].includes(j.lastop))
				);
				if (ab) a = `(${a})`;
				if (bb) b = `(${b})`;
				let combinedSource = `${a} ${operation} ${b}`;
				let newValue = Set24.operations[operation](i.value, j.value);
				let avail = i.available.filter(e => e.value !== j.value);
				newSet.elements.push(new Element(newValue, avail, combinedSource, operation));
			}
		}
		newSet.update();
		return newSet;
	}

	static operations = {
		"+": (a, b) => a + b,
		"-": (a, b) => a - b,
		"*": (a, b) => a * b,
		"/": (a, b) => a / b,
		"^": (a, b) => a ** b,
	};
}

function find24(a, b, c, d) {
	let set = new Set24([a, b, c, d]);
	for (let i = 0; i < 4; i++) {
		let set1 = set.closure("+");
		let set2 = set.closure("*");
		let set3 = set.closure("-");
		let set4 = set.closure("/");
		let set5 = set.closure("^");
		set.elements = set.elements
			.concat(set1.elements)
			.concat(set2.elements)
			.concat(set3.elements)
			.concat(set4.elements)
			.concat(set5.elements);
		set.update();
		let filter = set.elements.filter(e => e.value == 24);
		if (filter.length >= 1) return filter[0].source;
	}
	return false;
}
