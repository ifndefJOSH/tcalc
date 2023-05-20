var sandwichOpened = false;

function toggleSandwich() {
	let s = document.getElementById("sandwich");
	let menu = document.getElementById("menu");
	if (sandwichOpened) {
		s.classList.remove("sandwich-opened");
		s.classList.add("sandwich-closed");
		menu.style.left = "-150%";
		sandwichOpened = false;
	}
	else {
		s.classList.add("sandwich-opened");
		s.classList.remove("sandwich-closed");
		menu.style.left = "0%";
		sandwichOpened = true;
	}
}
