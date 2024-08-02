const link = window.location.origin;
const key = "timetracking://" + link;
let currentValue;

chrome.storage.local.get([key]).then((result) => {
	if (typeof result[key] === 'undefined') {
		currentValue = 0;
	} else {
		currentValue = result[key];
	}
});

setInterval(() => {
	if (document.hasFocus()) {
		currentValue++;

		chrome.storage.local.set({[key]: currentValue}).then(() => {});

		chrome.storage.local.get([key]).then(() => {});
	}
}, 1000);
