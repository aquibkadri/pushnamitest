/*
Response format of API_URL when notification data is available:
{
	"src":"WP",
	"title":"Dummy Ad",
	"options":{
		"body":"Noti desc",
		"icon":"",
		"image":"",
		"requireInteraction":true,
		"tag":time(),
		"actions":[
			{
				"action":"bt1",
				"title":"button1 title",
			},
			{
				"action":"bt2",
				"title":"button2 title",
			}
		],		
	},
	"clickUrl":"main_click_url",
	"btnClickUrls":{
		"bt1":"clickUrl/bt1",
		"bt2":"clickUrl/bt2",
	},
	"displayPixels":["pixel1", "pixel2"],
	"clickPixels":["pixel1", "pixel2"],
	"lp":"{\"k1\":\"v1\",\"k2\":\"v2\",\"k3\":\"v3\"}"
}

*/

(function () {
	var API_URL = "";
	var globalData = {};
	var DEBUG = 0;

	function getData(key) {
		if (globalData[key] !== null) {
			return globalData[key];
		}
		return null;
	}

	function setData(key, val) {
		globalData[key] = val;
	}

	function d(msg, isObj) {
		try {
			if (!DEBUG) return;
			if (!isObj) {
				msg = "EXT_SW:: " + msg;
			}
			console.log(msg);
		} catch (e) {}
	}

	function extractSubscriptionId(sub) {
		var i = sub.lastIndexOf("/"),
			sid = sub.substring(0, i);
		if (sub.indexOf(sid + "/") === 0) {
			return sub.replace(sid + "/", "");
		}
		return "";
	}

	function fetchSubscriptionId() {
		return Promise.resolve()
			.then(function () {
				d("Getting current subscription details");
				return self.registration.pushManager.getSubscription();
			})
			.then(function (subscription) {
				d(subscription, 1);
				if (!subscription || !subscription.endpoint) {
					return "";
				}
				var subId = extractSubscriptionId(subscription.endpoint);
				setData("subId", subId);
				return subId;
			})
			.catch(function (error) {
				d(`Exception ${error}`);
			});
	}

	function getSubscriptionId() {
		return Promise.resolve().then(function () {
			var subId = getData("subId");
			if (subId) {
				return subId;
			} else {
				return fetchSubscriptionId();
			}
		});
	}

	function parsePayload(eventName, event) {
		var payload = {};
		switch (eventName) {
			case "push":
				payload = event.data.json();
				break;
			case "nclick":
			case "nclose":
				payload = event && event.notification && event.notification.data;
				break;
		}

		return payload;
	}

	function convertToQueryString(data) {
		var str = "";
		for (var i in data) {
			if (data[i] === null || typeof data[i] == "undefined") {
				data[i] = "";
			}
			str += encodeURIComponent(i) + "=" + encodeURIComponent(data[i]) + "&";
		}
		return str;
	}

	function cloneObj(obj) {
		try {
			return JSON.parse(JSON.stringify(obj));
		} catch (e) {
			d(`Ex::${e}`);
		}
		return {};
	}

	function mergeObj(obj1, obj2) {
		for (var i in obj2) {
			obj1[i] = obj2[i];
		}
		return obj1;
	}

	function firePixel(eventName, payload, extraParams) {
		var postData = {};
		postData.event = eventName;
		postData.domain = self.location.hostname;
		postData.ref_url = self.location.href;
		postData.subscriptionId = getData("subId");
		if (isMyPayload(payload) && payload.lp) {
			postData.lp = payload.lp;
		}
		if (extraParams) {
			postData = mergeObj(postData, extraParams);
		}
		postData.payload = JSON.stringify(payload);

		var url = API_URL;

		var fetchOptions = {
			method: "POST",
			body: convertToQueryString(postData),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		};
		d(`Url: ${url}, fetchOptions ${JSON.stringify(fetchOptions)}`);

		return fetch(url, fetchOptions)
			.then(function (resp) {
				return resp.text();
			})
			.then(function (data) {
				d("Api call Response: " + JSON.stringify(data));
				if (data) data = JSON.parse(data);
				return data;
			})
			.catch(function (error) {
				d(`Exception ${error}`);
			})
			.then(function (resp) {
				if (resp && Array.isArray(resp)) {
					return showMultipleNotifications(resp);
				}
			})
			.catch(function (error) {
				d(`Exception ${error}`);
			});
	}

	function showMultipleNotifications(resp) {
		var promArr = [];
		for (var i = 0; i < resp.length; i++) {
			promArr.push(showNotification(resp[i]));
		}
		return Promise.all(promArr);
	}

	function showNotification(resp) {
		try {
			d("show notification");
			var options = resp.options;
			options.data = cloneObj(resp);
			return Promise.resolve()
				.then(function () {
					return fireCustPixels(resp, "ndisplayed");
				})
				.catch(getCatch())
				.then(function () {
					self.registration.showNotification(resp.title, options);
				})
				.catch(getCatch());
		} catch (e) {
			d(`Ex: ${e}`);
		}
	}

	function fireCustPixels(payload, eventName) {
		if (!payload) return;

		var pixels = [];
		if (eventName == "ndisplayed" && payload.displayPixels) {
			pixels = payload.displayPixels;
		} else if (eventName == "nclick" && payload.clickPixels) {
			pixels = payload.clickPixels;
		}

		if (!pixels) return Promise.resolve();

		//string format (single pixel)
		if (!Array.isArray(pixels)) {
			pixels = [pixels];
		}

		if (pixels.length == 0) return;

		var pixelPromArr = [];
		for (var i = 0; i < pixels.length; i++) {
			var p = pixels[i];
			var pixelProm = callCustApi(p, "GET", {}, true).catch(function (err) {
				d("error for api " + p);
				d(err, 1);
			});
			pixelPromArr.push(pixelProm);
		}
		return Promise.all(pixelPromArr);
	}

	function callCustApi(url, method, postData, isRespNotJson) {
		var isRespNotJson = isRespNotJson || 0;

		var fetchOptions = {
			method: method,
		};

		if (method == "POST") {
			if (!postData) {
				var postData = {};
			}
			fetchOptions.body = convertToQueryString(postData);
			fetchOptions.headers = {
				"Content-Type": "application/x-www-form-urlencoded",
			};
		}

		d("Call url :: " + url);
		return fetch(url, fetchOptions)
			.then(function (resp) {
				if (isRespNotJson) {
					return resp.text();
				}
				return resp.json();
			})
			.then(function (data) {
				d("Api call Response: ");
				d(data, 1);
				return data;
			});
	}

	function getClickUrl(event, payload) {
		var eventAction = event.action;
		var actionName = "";
		var url = (payload && payload.clickUrl) || "";
		d("CLICK_URL:" + url);

		if (eventAction && payload.btnClickUrls && payload.btnClickUrls[eventAction]) {
			actionName = eventAction;
			url = payload.btnClickUrls[eventAction];
		}
		return url;
	}

	function openClickUrl(url) {
		var p = Promise.resolve();
		if (url) {
			p = p
				.then(function () {
					return clients.openWindow(url);
				})
				.catch(getCatch());
		}
		return p;
	}

	function isMyPayload(payload) {
		return payload && payload.src && payload.src == "WP";
	}

	function getCatch() {
		return function (e) {
			d(`Ex::${e}`);
		};
	}

	function processEvent(eventName, event) {
		try {
			d(`Event ${eventName} triggered`);
			var payload = parsePayload(eventName, event);
			d("payload:");
			d(payload, 1);

			var extraParams = {};
			var clickUrl = "";
			if (eventName == "nclick") {
				clickUrl = getClickUrl(event, payload);
				extraParams.clickUrl = clickUrl;
			}

			var promObj = getSubscriptionId().then(function () {
				return firePixel(eventName, payload, extraParams);
			});

			if (eventName == "nclick" || eventName == "nclose") {
				if (isMyPayload(payload)) {
					d("It is My Payload");
					event.stopImmediatePropagation();

					promObj = promObj
						.then(function () {
							return fireCustPixels(payload, eventName);
						})
						.catch(getCatch());

					if (eventName == "nclick") {
						event.notification.close();
						promObj = promObj.then(function () {
							return openClickUrl(clickUrl);
						});
					}
				} else {
					d("Not my payload.");
				}
			}

			event.waitUntil(promObj);
		} catch (e) {
			d(`Exception ${e}`);
		}
	}

	function push(event) {
		processEvent("push", event);
	}

	function nclick(event) {
		processEvent("nclick", event);
	}

	function nclose(event) {
		processEvent("nclose", event);
	}

	function registerHandlers() {
		d("Register Handlers");

		self.addEventListener("push", push);
		self.addEventListener("notificationclick", nclick);
		self.addEventListener("notificationclose", nclose);
	}

	function init() {
		if (typeof _pw_vars == "undefined" || !_pw_vars.API_URL) {
			d("_pw_vars not found. Taking exit.");
			return;
		}
		importScripts("https://api.pushnami.com/scripts/v2/pushnami-sw/613b6621eeed1b0010adbfa5");

		API_URL = _pw_vars.API_URL;
		DEBUG = _pw_vars.DEBUG || 0;
		registerHandlers();
	}

	init();
})();
