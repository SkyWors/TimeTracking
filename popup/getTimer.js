const timers = [];

chrome.storage.local.get(null).then((result) => {
	for (const [key, value] of Object.entries(result)) {
		if (key.startsWith("timetracking://")) {
			timers.push({ key, value });
		}
	}
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

			let container = document.createElement("div");
			container.className = "container";

			let progressBar = document.createElement("div");
			progressBar.className = "progressBar";
			progressBar.style.width = value/total*100 + "%";

			let item = document.createElement("div");
			item.className = "item";

			let elementName = document.createElement("a");
			elementName.className = "elementName";
			elementName.href = title;
			elementName.target = "_blank";
			elementName.textContent = title;

			let elementValue = document.createElement("a");
			elementValue.className = "elementValue";
			elementValue.textContent = secondsToDhms(value);

			item.appendChild(elementName);
			item.appendChild(elementValue);

			container.appendChild(item);
			container.appendChild(progressBar);

			document.getElementById("listContainer").append(container);
			i++;
		}
	});
});

function secondsToDhms(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600*24));
	var h = Math.floor(seconds % (3600*24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);

	var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}
