if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("pushnami-service-worker.js").then((res) => console.log("registered"));
	});
}
