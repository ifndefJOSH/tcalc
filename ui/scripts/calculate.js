
var fn = null;

var outIsActive = false;

// The next function to execute when we hit equals or the next operator
var nextFunction = null;

var nextCalculation = false;

// let precision = 6;

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
	if (result) {
		document.getElementById('calc-result').innerHTML = "0";
		nextFunction = null;
	}
	console.log("Clearing");
}

function enterDigitOrPt(inpt) {
	// nextCalculation = true;
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
				document.getElementById("op").innerHTML = "+";
			}
			else if (val == "-") {
				operatorTwoOperands(function(i, j) { return i - j; }, 0);
				document.getElementById("op").innerHTML = "-";
			}
			else if (val == "*" || val == "x") {
				operatorTwoOperands(function(i, j) { return i * j; });
				document.getElementById("op").innerHTML = "&times;";
			}
			else if (val == "/") {
				operatorTwoOperands(function(i, j) { return i / j; });
				document.getElementById("op").innerHTML = "&div;";
			}
			else if (val == "^") {
				operatorTwoOperands(function(i, j) { return i ** j; }, 2);
				document.getElementById("op").innerHTML = "x<sup>y</sup>";
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
		document.getElementById("op").innerHTML = "&div;";
	}
	// multiply operator
	document.getElementById("mult").onclick = function() {
		operatorTwoOperands(function(i, j) { return i * j; });
		document.getElementById("op").innerHTML = "&times;";
	}
	// Add operator
	document.getElementById("add").onclick = function() {
		operatorTwoOperands(function(i, j) { return i + j; }, 0);
		document.getElementById("op").innerHTML = "+";
	}
	// Subtract operator
	document.getElementById("sub").onclick = function() {
		operatorTwoOperands(function(i, j) { return i - j; }, 0);
		document.getElementById("op").innerHTML = "-";
	}
	// exponent operator
	document.getElementById("exp").onclick = function() {
		operatorTwoOperands(function(i, j) { return i ** j; }, 2);
		document.getElementById("op").innerHTML = "x<sup>y</sup>";
	}
}

function operatorOneOperand(f) {
	// console.log("operatorOneOperand");
	// Ignores the last result and uses the current input buffer
	let inElem = document.getElementById('calc-input');
	var inputStr = inElem.innerHTML;
	// So we can chain calculations
	if (inputStr == "") {
		inputStr = document.getElementById('calc-result').innerHTML;
	}
	let inputValue = Number.parseFloat(inputStr);
	let out = f(inputValue);
	let outElem = document.getElementById('calc-result');
	if (out == Number.POSITIVE_INFINITY) {
		outElem.innerHTML = "&infin;";
	}
	else if (out == Number.NEGATIVE_INFINITY) {
		outElem.innerHTML = "-&infin;";
	}
	else {
		outElem.innerHTML = out;
	}
	inElem.innerHTML = ""
	setOutActive(true);
	// calculationComplete = false;
	document.getElementById("op").innerHTML = "";
}

function operatorTwoOperands(f, defaultOperand = 1) {
	let inElem = document.getElementById('calc-input');
	let outElem = document.getElementById('calc-result');
	if (nextCalculation) {
		outElem.innerHTML = "";
		// calculationComplete = false;
	}
	let inputStr1 = outElem.innerHTML;
	let inputStr2 = inElem.innerHTML;
	if (inputStr1 == "") {
		outElem.innerHTML = defaultOperand;
	}
	if (inputStr2 == "") {
		nextFunction = f;
		return;
	}
	let inputValue1 = Number.parseFloat(inputStr1);
	let inputValue2 = Number.parseFloat(inputStr2);
	if (nextFunction != null) {
		let outVal = nextFunction(inputValue1, inputValue2);
		if (outVal == Number.POSITIVE_INFINITY) {
			outElem.innerHTML = "&infin;";
		}
		else if (outVal == Number.NEGATIVE_INFINITY) {
			outElem.innerHTML = "-&infin;";
		}
		else {
			outElem.innerHTML = outVal;
		}
	}
	else {
		// Make the output the input
		if (inputStr2 != "") {
			outElem.innerHTML = inputValue2;
		}
		// else
	}
	inElem.innerHTML = "";
	nextFunction = f;
}

function equals() {
	let inElem = document.getElementById('calc-input');
	let outElem = document.getElementById('calc-result');
	let inputStr1 = outElem.innerHTML;
	let inputStr2 = inElem.innerHTML;
	if (inputStr1 == "") {
		inputStr1 = "0";
	}
	if (inputStr2 == "") {
		inputStr2 = "0";
	}
	let inputValue1 = Number.parseFloat(inputStr1);
	let inputValue2 = Number.parseFloat(inputStr2);
	if (nextFunction != null) {
		let outVal = nextFunction(inputValue1, inputValue2);
		if (outVal == Number.POSITIVE_INFINITY) {
			outElem.innerHTML = "&infin;";
		}
		else if (outVal == Number.NEGATIVE_INFINITY) {
			outElem.innerHTML = "-&infin;";
		}
		else {
			outElem.innerHTML = outVal;
		}
	}
	else {
		// Make the output the input
		outElem.innerHTML = inputValue2;
	}
	inElem.innerHTML = "";
	setOutActive(true);
	nextFunction = null;
	document.getElementById("op").innerHTML = "";
	// calculationComplete = true;
	// Add this to the history
	console.log("adding element to history");
	document.getElementById("calc-history").innerHTML += "<a class=menu-item onclick='insertValue(" + outElem.innerHTML + ")'>" + outElem.innerHTML + "</a>";
	document.getElementById("nohist-label").style.display = "None";
}

function e() {
	document.getElementById('calc-input').innerHTML = Math.E;
	setOutActive(false);
	// toggleSandwich();
}

function pi() {
	document.getElementById('calc-input').innerHTML = Math.PI
	setOutActive(false);
	// toggleSandwich();
}

function insertValue(value) {
	document.getElementById('calc-input').innerHTML = value;
	setOutActive(false);
	if (sandwichOpened) {
		toggleSandwich();
	}
}
