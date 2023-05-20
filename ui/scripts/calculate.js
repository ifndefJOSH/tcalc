
var fn = null;

var outIsActive = false;

// The next function to execute when we hit equals or the next operator
var nextFunction = null;

function setOutActive(active) {
	let inElem = document.getElementById('calc-input');
	let outElem = document.getElementById('calc-result');
	if (active && outIsActive) {
		return;
	}
	else if (active) {
		inElem.classList.remove("active-number");
		outElem.classList.remove("inactive-number");
		inElem.classList.add("inactive-number");
		outElem.classList.add("active-number");
		outIsActive = true;
	}
	else if (!outIsActive) {
		return
	}
	else {
		inElem.classList.remove("inactive-number");
		outElem.classList.remove("active-number");
		inElem.classList.add("active-number");
		outElem.classList.add("inactive-number");
		outIsActive = false;
	}
}

function clearCalc(result=true) {
	document.getElementById('calc-input').innerHTML = "";
	if (result) { document.getElementById('calc-result').innerHTML = ""}
	console.log("Clearing");
}

function enterDigitOrPt(inpt) {
	setOutActive(false);
	let inElement = document.getElementById('calc-input');
	// Can only have one pt
	if (inpt == "." && !inElement.innerHTML.includes(".")) {
		inElement.innerHTML += ".";
	}
	// Check to see if it is a number, otherwise do nothing
	if (/^\d+$/.test(inpt)) {
		inElement.innerHTML += inpt;
	}
}

function backSpace() {
	console.log("Backspacing");
	let inElement = document.getElementById('calc-input');
	if (inElement.innerHTML == "") { return; }
	inElement.innerHTML = inElement.innerHTML.substring(0, inElement.innerHTML.length - 1);
}

function setUpNumbers() {
	document.querySelectorAll(".number").forEach(e => {
		let numVal = e.innerHTML;
		if (!/^\d+$/.test(numVal)) {
			console.log("For element " + e + " inner HTML is not a number!")
			return;
		}
		e.onclick = function() { enterDigitOrPt(numVal); console.log("Adding number " + numVal); }
	});

	// Add a keypress event which listens for the numbers and functions anyway
	document.onkeypress = function (e) {
		e = e || window.event;
		// console.log(e);
		let charCode = (typeof e.which == "number") ? e.which : e.keyCode;
		if (charCode) {
			let val = String.fromCharCode(charCode);
			if (/^\d+$/.test(val) || val == ".") {
				enterDigitOrPt(val);
			}
			else if (val == "+") {
				operatorTwoOperands(function(i, j) { return i + j; }, 0);
			}
			else if (val == "-") {
				operatorTwoOperands(function(i, j) { return i - j; }, 0);
			}
			else if (val == "*" || val == "x") {
				operatorTwoOperands(function(i, j) { return i * j; });
			}
			else if (val == "/") {
				operatorTwoOperands(function(i, j) { return i / j; });
			}
			else if (val == "^") {
				operatorTwoOperands(function(i, j) { return i ** j; }, 2);
			}
		}
	};
	document.onkeydown = function (e) {
		console.log(e.keyCode);
		// listen for backspace
		if (e.keyCode == 8) {
			backSpace();
		}
		// Listen for enter
		else if (e.keyCode == 13) {
			equals();
		}
		// Listen for delete
		else if (e.keyCode == 46) {
			clear();
		}
	}
}

function setUpOperators() {
	// Square operator
	document.getElementById("sqr").onclick = function() {
		operatorOneOperand(i => i * i);
	}
	// Sqrt operator
	document.getElementById("sqrt").onclick = function() {
		operatorOneOperand(i => Math.sqrt(i));
	}
	// divide operator
	document.getElementById("divide").onclick = function() {
		operatorTwoOperands(function(i, j) { return i / j; });
	}
	// multiply operator
	document.getElementById("mult").onclick = function() {
		operatorTwoOperands(function(i, j) { return i * j; });
	}
	// Add operator
	document.getElementById("add").onclick = function() {
		operatorTwoOperands(function(i, j) { return i + j; }, 0);
	}
	// Subtract operator
	document.getElementById("sub").onclick = function() {
		operatorTwoOperands(function(i, j) { return i - j; }, 0);
	}
	// exponent operator
	document.getElementById("exp").onclick = function() {
		operatorTwoOperands(function(i, j) { return i ** j; }, 2);
	}
}

function operatorOneOperand(f) {
	// console.log("operatorOneOperand");
	// Ignores the last result and uses the current input buffer
	let inElem = document.getElementById('calc-input');
	let inputStr = inElem.innerHTML;
	let inputValue = Number.parseFloat(inputStr);
	let out = f(inputValue);
	let outElem = document.getElementById('calc-result');
	outElem.innerHTML = out;
	inElem.innerHTML = ""
	setOutActive(true);
}

function operatorTwoOperands(f, defaultFirstOperand = 1) {
	let inElem = document.getElementById('calc-input');
	let outElem = document.getElementById('calc-result');
	let inputStr1 = outElem.innerHTML;
	let inputValue1 = Number.parseFloat(inputStr1);
	let inputStr2 = inElem.innerHTML;
	let inputValue2 = Number.parseFloat(inputStr2);
	if (nextFunction != null) {
		outElem.innerHTML = nextFunction(inputValue1, inputValue2);
	}
	else {
		// Make the output the input
		if (inputStr2 != "") {
			outElem.innerHTML = inputStr2;
		}
		else {
			outElem.innerHTML = defaultFirstOperand;
		}
	}
	inElem.innerHTML = "";
	nextFunction = f;
}

function equals() {
	let inElem = document.getElementById('calc-input');
	let outElem = document.getElementById('calc-result');
	let inputStr1 = outElem.innerHTML;
	let inputValue1 = Number.parseFloat(inputStr1);
	let inputStr2 = inElem.innerHTML;
	let inputValue2 = Number.parseFloat(inputStr2);
	if (nextFunction != null) {
		outElem.innerHTML = nextFunction(inputValue1, inputValue2);
	}
	else {
		// Make the output the input
		outElem.innerHTML = inputStr2;
	}
	inElem.innerHTML = "";
	setOutActive(true);
	nextFunction = null;
}
