var activated = true;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	sendResponse({bool: activated});
});

chrome.browserAction.onClicked.addListener(function(tab) {
	activated = !activated;
	if (activated) {
		chrome.browserAction.setIcon({
			path: {
				16: "../icons/fot-icon-16.png",
				19: "../icons/fot-icon-19.png",
				32: "../icons/fot-icon-32.png",
				38: "../icons/fot-icon-38.png",
				64: "../icons/fot-icon-64.png",
				128: "../icons/fot-icon-128.png",
			}
		}, function () {
			chrome.browserAction.setTitle({title: 'Click to deactivate Facebook On-Task'});
			chrome.tabs.query({}, function(tabs) {
				var message = {bool: activated};
				for (var i=0; i<tabs.length; ++i) {
					chrome.tabs.sendMessage(tabs[i].id, message);
				}
			});
		});
	} else {
		chrome.browserAction.setIcon({
			path: {
				16: "../icons/fot-icon-16-deac.png",
				19: "../icons/fot-icon-19-deac.png",
				32: "../icons/fot-icon-32-deac.png",
				38: "../icons/fot-icon-38-deac.png",
				64: "../icons/fot-icon-64-deac.png",
				128: "../icons/fot-icon-128-deac.png",
			}
		}, function () {
			chrome.browserAction.setTitle({title: 'Click to activate Facebook On-Task'});
			chrome.tabs.query({}, function(tabs) {
				var message = {bool: activated};
				for (var i=0; i<tabs.length; ++i) {
					chrome.tabs.sendMessage(tabs[i].id, message);
				}
			});
		});
	}
});