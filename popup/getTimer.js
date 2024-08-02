const timers = [];

function displayItems (timers) {
	document.getElementById("listContainer").innerHTML = "";
	timers.sort((a, b) => b.value - a.value);

	var i = 0;
	var total = 0;
	timers.forEach(element => {
		total = total + element["value"];
	})
	timers.forEach(element => {
		if (i<10) {
			let title = element["key"].replace("timetracking://", "");
			let value = element["value"];

			let url = new URL(chrome.runtime.getURL("/_favicon/"));
			url.searchParams.set("pageUrl", title);
			url.searchParams.set("size", 64);
			let icon = document.createElement("img");
			icon.src = url;
			icon.className = "icon";

			let container = document.createElement("div");
			container.className = "container";

			let progressBar = document.createElement("div");
			progressBar.className = "progressBar";
			progressBar.style.width = value/total*100 + "%";

			let progressBarContainer = document.createElement("div");
			progressBarContainer.className = "progressBarContainer";
			progressBarContainer.appendChild(progressBar)

			let item = document.createElement("div");
			item.className = "item";

			let elementName = document.createElement("a");
			elementName.className = "elementName";
			elementName.href = title;
			elementName.target = "_blank";
			elementName.textContent = title;

			let elementValue = document.createElement("a");
			elementValue.textContent = secondsToDhms(value);

			let titleContainer = document.createElement("div");
			titleContainer.className = "titleContainer";
			titleContainer.appendChild(elementName);
			titleContainer.appendChild(elementValue);

			item.appendChild(titleContainer);
			item.appendChild(progressBarContainer);

			container.appendChild(icon);
			container.appendChild(item);

			document.getElementById("listContainer").append(container);
			i++;
		}
	});

	if (timers.length === 0) {
		let noResults = document.createElement("a");
		noResults.className = "noResults";
		noResults.textContent = "Aucun résultat";

		document.getElementById("listContainer").append(noResults);
	};
};

chrome.storage.local.get(null).then((result) => {
	for (const [key, value] of Object.entries(result)) {
		if (key.startsWith("timetracking://")) {
			timers.push({ key, value });
		}
	}

	displayItems(timers)

	let counter = document.createElement("a");
	counter.className = "counter";
	counter.textContent = timers.length + " sites visités";
	document.body.appendChild(counter);
});

function secondsToDhms(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600*24));
	var h = Math.floor(seconds % (3600*24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);

	var dDisplay = d > 0 ? d + "d, " : "";
	var hDisplay = h > 0 ? h + "h " : "";
	var mDisplay = m > 0 ? m + "min " : "";
	var sDisplay = s > 0 ? s + "s" : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
};

document.getElementById("searchBar").addEventListener("input", (event) => {
	const filteredTimers = timers.filter(element => element["key"].includes(event.target.value));
	displayItems(filteredTimers);
});