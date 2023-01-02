if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("sworker.js").then((res) => console.log("registered"));
	});
}
