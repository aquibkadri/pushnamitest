// The empty line above is critical for templating main.beta in the current implementation
// Start Test Mode Detection ;

//
var isRollbar = false;
// add rollbar
var pushWrap = {
	wrapObj: function (service) {
		for (var fn in service) {
			if (service.hasOwnProperty(fn) && typeof service[fn] === "function") pushWrap.safeWrap(service, fn);
		}
	},
	safeWrap: function (service, fn) {
		var pushFn = service[fn];
		service[fn] = function (a, b, c, d, e, f, g, h, i, j, k, l) {
			try {
				return pushFn.call(service, a, b, c, d, e, f, g, h, i, j, k, l);
			} catch (err) {
				pushWrap.report(err);
			}
		};
	},
	report: function (err) {
		var opts = {
			event: "webpush-error-generic",
			scope: "Website",
			scopeId: "613b6621eeed1b0010adbfa4",
			l: encodeURIComponent(location.href),
			e: JSON.stringify(err, Object.getOwnPropertyNames(err)),
		};

		var uri = "event=" + opts.event + "&scope=" + opts.scope + "&scopeId=" + opts.scopeId + (navigator && navigator.userAgent ? "&ua=" + navigator.userAgent : "") + (opts.l ? "&l=" + opts.l : "") + (opts.e ? "&e=" + opts.e : "");

		if (typeof fetch === "function") {
			fetch("https://trc.pushnami.com/api/push/track", {
				method: "POST",
				body: encodeURI(uri),
				mode: "cors",
				redirect: "follow",
				headers: new Headers({
					Accept: "application/json, text/plain, */*",
					"Content-Type": "application/x-www-form-urlencoded",
					key: "613b6621eeed1b0010adbfa5",
				}),
			});
		}
		if (isRollbar) Rollbar.error(err);
	},
};

// start device detection

// start device detection (ES5 version without Polyfills)

try {
	/* We will define the call to produce a socialpush opt-in now, and if the conditional below is truthy then it will
     get overwritten with the real thing.  We need to do this so that our script doesn't crash should the function be
     undefined at runtime. */
	var showFbChkOptIn = function () {};

	// start fbv2

	// start hannity-mailnami-newsletter-form ;

	var mailnamiPromptModule = (function () {
		if (window.mailnami) {
			return window.mailnami;
		}

		//Define the class with all of the default values / functions
		var defaultInitResult = {
			shown: false,
			callerPrompt: "now",
		};

		var localStoragePsidKey = "pushnamiMailnamiSubscriberId",
			localStorageUnsubscribedKey = "pushnamiMailnamiUnsubscribed";

		// @todo: fix me | hack use for sms purpose | revert back to original code after sms feature is completed
		// @todo: fix me | remove following variable and next if-statement block
		var hijackEmailSmartboxForSMS = false || false;
		if (hijackEmailSmartboxForSMS) {
			localStoragePsidKey = "pushnamiSmsSubscriberId";
			localStorageUnsubscribedKey = "pushnamiSmsUnsubscribed";
		}

		/**
		 * Convenience function for getting the current PSID for this mailnami subscriber (if applicable).
		 * @return String|null The mailnami PSID if it exists, null otherwise. */
		var getPSID = function () {
			if (localStorage.getItem(localStorageUnsubscribedKey) === "true") {
				return null;
			}
			return localStorage.getItem(localStoragePsidKey) || null;
		};

		var mailnami = {
			enabled: false,
			init: function () {
				return Promise.resolve(defaultInitResult);
			},
			on: function () {},
			getPSID: getPSID,
			subscribe: function () {
				return Promise.resolve({ subscriberId: null });
			},
			unsubscribe: function () {
				return Promise.resolve(false);
			},
			update: function () {
				return mailnami;
			},

			// @todo: fix me | hack use for sms purpose | remove after SMS feature is completed and remove the check for this in the main script(s)
			hijackEmailSmartboxForSMS: hijackEmailSmartboxForSMS,
		};

		// start mailnami

		return (window.mailnami = mailnami);
	})();
	mailnamiPromptModule.init({ promptEvent: "webpush-optin-load" });

	// start osxSafari

	Pushnami = (function (window) {
		"use strict";
		var start = Date.now();
		// API Key for backend
		var key = "613b6621eeed1b0010adbfa5";
		var websiteId = "613b6621eeed1b0010adbfa4";
		var swPath = "service-worker.js";

		var supportedTags = ["pstag", "pstag_android"];

		var isOSXSafari = "safari" in window && "pushNotification" in window.safari;

		if ((!isOSXSafari && !navigator.serviceWorker) || !localStorage || (window.location.protocol !== "https:" && Boolean(window.location.hostname !== "localhost" && window.location.hostname !== "[::1]" && !window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)))) {
			var o = {
				setVariables: function () {
					return o;
				},
				on: function () {
					return o;
				},
				fire: function () {
					return o;
				},
				convert: function () {
					return o;
				},
				update: function () {
					return o;
				},
				enroll: function () {
					return o;
				},
				unenroll: function () {
					return o;
				},
				clear: function () {
					return o;
				},
				showOverlay: function () {
					return o;
				},
				prompt: function () {
					return o;
				},
				getPSID: function () {
					return o;
				},
				unsubscribe: function () {
					return o;
				},
				setSWPath: function () {
					return o;
				},
			};

			if (window.location.protocol !== "https:" && !(window.location.protocol === "https:" || Boolean(window.location.hostname === "localhost" || window.location.hostname === "[::1]" || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)))) {
				console.error("Pushnami - error not SSL");
				pushnamiTrack({
					event: "webpush-error-not-ssl",
					scope: "Website",
					scopeId: websiteId,
					l: encodeURIComponent(location.href),
				});
			}

			return o;
		}

		var vapidPublicKey = "BLrizbuslgxJU_WuU07mqu5z-5N-FB5JHPVG95xHs7SVjoz33el_a2W3tUbWN-elZUxrkpXYnkBkPTjI6bSAoVA";
		var convertedVapidKey = vapidPublicKey && vapidPublicKey.length > 0 ? urlBase64ToUint8Array(vapidPublicKey) : undefined;

		// HELPERS
		// Read a page's GET URL variables and return them as an associative array.
		var getUrlParams = function () {
			var vars = {},
				href = window.location.href.split("#")[0],
				hash;

			if (href.indexOf("?") > 0) {
				var hashes = href.slice(href.indexOf("?") + 1).split("&");
				for (var i = 0; i < hashes.length; i++) {
					try {
						hash = hashes[i].split("=");
						if (hash && hash[0] && hash[1]) vars[hash[0]] = decodeURIComponent(hash[1]);
					} catch (e) {
						console.log("Failed to decode variable " + e);
					}
				}
			}

			var pushnamiVars = Pushnami.data;
			for (var key in pushnamiVars) {
				if (pushnamiVars.hasOwnProperty(key)) {
					vars[key] = pushnamiVars[key];
				}
			}

			return vars;
		};

		//TODO: Establish a query builder to clean up the request body, use supportedTags
		function pushnamiTrack(details) {
			console.log(JSON.stringify(details));

			var trackingBody = encodeURI(
				"event=" + details.event + "&scope=" + details.scope + "&scopeId=" + details.scopeId + (details.pstag ? "&pstag=" + details.pstag : "") + (details.pstag_android ? "&pstag_android=" + details.pstag_android : "") + (ua === "1" && navigator && navigator.userAgent ? "&ua=" + navigator.userAgent : "") + (details.l ? "&l=" + details.l : "") + (details.e ? "&e=" + details.e : "") + (details.state ? "&state=" + details.state : "") + (details.custom ? "&custom=" + details.custom : "")
			);

			// TODO: Remove this hotfix to disable pstag overloading
			//

			var ua = "0";
			return fetch("https://trc.pushnami.com/api/push/track", {
				method: "POST",
				body: trackingBody,
				mode: "cors",
				redirect: "follow",
				headers: new Headers({
					Accept: "application/json, text/plain, */*",
					"Content-Type": "application/x-www-form-urlencoded",
					key: key,
				}),
			})
				.then(function (response) {
					if (response.ok) {
						console.log("Tracking OK", response);
						return true;
					} else {
						console.error("Tracking error", response);
						return false;
					}
				})
				.catch(function (err) {
					if (isRollbar) Rollbar.error(err);
					return false;
				});
		}

		function detectOtherPush() {
			var vendorWindow = {
				upush: ["upushPermission", "upushRequest"],
				accengage: ["AccengageWebSDKObject"],
				aimtell: ["aimtellDebugBox", "_aimtellVersion"],
				cleverpush: ["CleverPush"],
				foxpush: ["_foxpush"],
				frizbit: ["frizbit"],
				izooto: ["Izooto"],
				letreach: ["ltr"],
				letsocify: ["let_socify"],
				onesignal: ["OneSignal"],
				push_monkey: ["PushMonkey"],
				pushalert: ["PushAlertCo"],
				pushcrew: ["pushcrew"],
				pushe: ["PusheHttp"],
				pushflew: ["PushflewLibrary"],
				pushwoosh: ["Pushwoosh"],
				sendmsgs: ["sendMessageToSW"],
				shophero_io: ["SHOPHERO"],
				urban_airship: ["UA"],
				wonderpush: ["WonderPush"],
				goroost: ["_roost"],
			};
			var vendors = [];
			for (var k in vendorWindow) {
				if (!vendorWindow.hasOwnProperty(k)) continue;
				vendorWindow[k].forEach(function (_v) {
					if (typeof window !== undefined && window[_v]) vendors.push(k);
				});
			}
			// Just considering one for now
			return vendors[0] || null;
		}

		// Start unsub reporter

		function urlBase64ToUint8Array(base64String) {
			// IE still doesn't support String.prototype.repeat
			var paddingLength = (4 - (base64String.length % 4)) % 4;
			var padding = "";
			for (var ji = 0; ji < paddingLength; ji++) padding += "=";
			var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

			var rawData = window.atob(base64);
			var outputArray = new Uint8Array(rawData.length);

			for (var i = 0; i < rawData.length; ++i) {
				outputArray[i] = rawData.charCodeAt(i);
			}
			return outputArray;
		}

		var commitEnrollment = function (subscriberId, tag, opts) {
			//Wipe any pending enrollment for this tag
			delete Pushnami.pendingEnrollments[tag];
			var payload = {
				psid: subscriberId,
				tag: tag,
				renew: !!opts.renew,
			};
			if (typeof opts.renewThreshold === "number") {
				payload.renewThreshold = opts.renewThreshold;
			}
			fetch("https://api.pushnami.com/api/push/waterfall/enrollment", {
				method: "POST",
				body: JSON.stringify(payload),
				mode: "cors",
				redirect: "follow",
				headers: new Headers({ key: "613b6621eeed1b0010adbfa5" }),
			})
				.then(function (response) {
					return response.json();
				})
				.then(function (data) {
					if (!data) {
						throw new Error("No data returned by API");
					}
					if (data.errors) {
						throw new Error(JSON.stringify(data.errors));
					}
					if (!data.results || data.results.processed !== 1) {
						throw new Error("No results returned by API");
					}
					return data;
				})
				.catch(function (err) {
					if (isRollbar) Rollbar.error("Pushnami - Error enrolling subscriber: ", err);
				});
		};

		var commitUnenrollment = function (subscriberId, tag, opts) {
			fetch("https://api.pushnami.com/api/push/waterfall/enrollment?psid=" + subscriberId + "&tag=" + tag, {
				method: "DELETE",
				mode: "cors",
				redirect: "follow",
				headers: new Headers({ key: "613b6621eeed1b0010adbfa5" }),
			})
				.then(function (response) {
					return response.json();
				})
				.then(function (data) {
					if (!data) {
						throw new Error("No data returned by API");
					}
					if (data.errors) {
						throw new Error(JSON.stringify(data.errors));
					}
					if (!data.results || data.results.processed !== 1) {
						throw new Error("No results returned by API");
					}
					return data;
				})
				.catch(function (err) {
					if (isRollbar) Rollbar.error("Pushnami - Error unenrolling subscriber: ", err);
				});
		};

		//

		function showPrompt(opts) {
			//

			if ((getUrlParams() || {}).pnblock) {
				return;
			}

			//
			// to bot or not to bot
			var userAgent = window && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : undefined;
			if (/(Ads|Google|Yandex|Pinterest|Cookie)(Mobile)?bot/i.test(userAgent)) {
				pushnamiTrack({
					event: "optin-notshown-bot",
					scope: "Website",
					scopeId: websiteId,
					l: encodeURIComponent(location.href),
				});
				return;
			}
			//

			// TODO: Remove hardcoding
			// Testing 2db19f42ae59126f34dd95b7c3485555
			//

			if (opts && opts.ts) {
				// start androidStrategy
			}
			if (localStorage.getItem("pushnamiSubscriptionBlock")) return Pushnami;

			if (Pushnami.twoStepNativePromptDisabled) return Pushnami;
			Pushnami.fire("permissions-initializing");
			var isLocalhost = Boolean(window.location.hostname === "localhost" || window.location.hostname === "[::1]" || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
			if ("serviceWorker" in navigator && (window.location.protocol === "https:" || isLocalhost)) {
				// start shopify
				// start unreg
				// start shopify
				navigator.serviceWorker.register(swPath || "/service-worker.js").catch(function (error) {
					if (isRollbar) Rollbar.error("Pushnami - error registering service-worker", error);
					pushnamiTrack({
						event: "webpush-error-no-sw",
						scope: "Website",
						scopeId: websiteId,
						l: encodeURIComponent(location.href),
						e: error && error.message && error.message !== "Registration failed - permission denied" ? error.message : null,
					});
				});
				// End shopify

				navigator.serviceWorker.ready
					.then(function (registration) {
						console.log(JSON.stringify(registration));

						var scriptUrl = (registration && registration.active && registration.active.scriptURL) || null;
						// We have fired this function for the registration of a service worker that may not correspond to Pushnami
						if (scriptUrl && !scriptUrl.indexOf(swPath || "service-worker.js") === -1) {
							pushnamiTrack({
								event: "webpush-error-unrecognized-sw",
								scope: "Website",
								scopeId: websiteId,
								l: encodeURIComponent(location.href),
								e: null,
							});
						}

						if (detectOtherPush()) {
							pushnamiTrack({
								event: "webpush-error-sw-conflict-detected",
								scope: "Website",
								scopeId: websiteId,
								l: encodeURIComponent(location.href),
								e: null,
							});
						}

						// Ignore Safari's incomplete service-worker support
						if ("safari" in window && "pushNotification" in window.safari) {
							return;
						}

						var subOpts = { userVisibleOnly: true };
						if (convertedVapidKey) subOpts.applicationServerKey = convertedVapidKey;

						// start multi

						// start promptOncePerSession

						new Promise(function (resolve) {
							if (!opts || !opts.multi) return resolve("granted");
							if (Pushnami.ts && Pushnami.ash && Pushnami.ash.behaviorOptionsSatisfied("overlayOptions", opts.behaviorOptions, "show_for_native_prompt")) {
								console.warn && console.warn('[Pushnami] Warning: Native opt-ins for two-step with a persistent overlay may not work correctly while "multi" is enabled because the "permissions-blocked-ignored" event may never fire to hide the overlay.');
							}
							window.Notification.requestPermission(resolve);
						}).then(function (notificationPerm) {
							if (notificationPerm === "granted") {
								if (!registration || !registration.pushManager || !registration.pushManager.subscribe) return;

								// Check the useragent and check if they are already subscribed as far as we can tell
								var preemptSubscription = window && window.navigator && window.navigator.userAgent && /samsungbrowser/i.test(window.navigator.userAgent);

								// Should we force preempting a subscription for this website?

								var subscriptionRequest = (
									preemptSubscription
										? registration.pushManager.getSubscription().then(function (sub) {
												// Try to subscribe if necessary
												return sub || registration.pushManager.subscribe(subOpts);
										  })
										: registration.pushManager.subscribe(subOpts)
								)
									// start Recap
									.catch(function (err) {
										if (err.message && err.message.startsWith && err.message.startsWith("Registration failed - A subscription with a different applicationServerKey")) {
											return registration.pushManager.getSubscription().then(function (subscription) {
												return subscription.unsubscribe().then(function (successful) {
													return registration.pushManager.subscribe(subOpts);
												});
											});
										} else {
											throw err;
										}
									});
								// End Recap
								subscriptionRequest
									.then(function (sub) {
										// console.log('endpoint:', JSON.stringify(sub));
										var data = {
											sub: sub,
											subscriberId: localStorage.getItem("pushnamiSubscriberId"),
											urlParams: getUrlParams(),
										};
										if (websiteId) data.websiteId = websiteId;
										if (Pushnami && Pushnami.psfp && Pushnami.psfp.data) {
											localStorage.removeItem("pushnami-psp-status");
											data.psfp = Pushnami.psfp.data.toString();
										} else {
											// Mark status as incomplete if it did not build in time
											var psfpStatus = localStorage.getItem("pushnami-psp-status");
											if (psfpStatus === "pending") {
												localStorage.setItem("pushnami-psp-status", "incomplete");
											}
										}
										if (Pushnami && Pushnami.psfpv2) data.psfpv2 = Pushnami.psfpv2;
										var pkid = "611d4e837962803b60397a84";
										if (pkid) data.pkid = pkid;
										// @todo: fix me | hack use for sms purpose | revert back to original code after sms feature is completed
										if (!mailnamiPromptModule.hijackEmailSmartboxForSMS) {
											var emailSubscriberId = mailnamiPromptModule.getPSID();
											if (emailSubscriberId) data.emailSubscriberId = emailSubscriberId;
										}
										return (
											fetch("https://api.pushnami.com/api/push/subscribe", {
												method: "POST",
												body: JSON.stringify(data),
												mode: "cors",
												redirect: "follow",
												headers: new Headers({ key: key }),
											})
												.then(function (response) {
													if (!response.ok && response.status == 403) {
														localStorage.setItem("pushnamiSubscriptionBlock", "BLOCKED");
														throw new Error("Subscription blocked");
													}
													return response.json();
												})
												.then(function (data) {
													var alreadySubscribed = localStorage.getItem("pushnamiSubscriptionStatus") === "SUBSCRIBED";
													if (data && data.subscriberId) {
														localStorage.setItem("pushnamiSubscriberId", data.subscriberId);
														localStorage.setItem("pushnamiSubscriptionStatus", "SUBSCRIBED");
														Pushnami.fire("permissions-action-subscribed");
														if (!alreadySubscribed) {
															Pushnami.fire("permissions-action-subscribed-new");
														}
													}
													return data;
												})

												// start tbid
												.then(function (data) {
													var redir = "https://api.pushnami.com/api/tbid?psid=" + (data.subscriberId || "") + "&tbid=<TUID>";
													var tbidPixel = "https://trc.taboola.com/sg/pushnami/1/cm?redirect=" + encodeURIComponent(redir);

													fetch(tbidPixel, {
														method: "GET",
														mode: "no-cors",
														redirect: "follow",
														credentials: "include",
													}).catch(function (err) {
														pushnamiTrack({
															event: "webpush-error-general",
															scope: "Website",
															scopeId: websiteId,
															e: err && err.message ? err.message : null,
														});
													});

													return data;
												})
												// End tbid

												.then(function (data) {
													if (!window || !window.pushnamiStorage) return data;

													return window.pushnamiStorage
														.onConnect()
														.then(function () {
															return window.pushnamiStorage.set("psfp:1414235ff204423577770a44004b6b86", data.subscriberId);
														})
														.then(function (res) {
															return data;
														})
														.catch(function (err) {
															pushWrap.report(err);
															return true;
														});
												})
												.then(function (data) {
													if (Pushnami.pendingEnrollments) {
														for (var tag in Pushnami.pendingEnrollments) {
															if (Pushnami.pendingEnrollments.hasOwnProperty(tag)) commitEnrollment(data.subscriberId, tag, Pushnami.pendingEnrollments[tag]);
														}
													}
													return data;
												})
												.catch(function (err) {
													Pushnami.fire("permissions-failed");
													pushnamiTrack({
														event: "webpush-error-subscription",
														scope: "Website",
														scopeId: websiteId,
														e: err && err.message ? err.message : null,
													});
													if (isRollbar) Rollbar.error("Pushnami - Subscription Error", err);
													return false;
												})
										);
									})
									.catch(function (err) {
										var notErrors = ["Registration failed - permission denied", "User denied permission to use the Push API.", "Failed to register a ServiceWorker: The user denied permission to use Service Worker.", "User denied permission to use the Push API", "Subscription blocked"];
										var notAnError = !!(err && err.message && notErrors.indexOf(err.message) > -1);

										if (notAnError) {
											Pushnami.fire("permissions-blocked-ignored");
										} else {
											Pushnami.fire("permissions-failed");
										}
										if (err.message && err.message === "Registration failed - missing applicationServerKey, and manifest empty or missing") {
											var hasManifest = false;
											if (document && document.head && document.head.childNodes)
												document.head.childNodes.forEach(function (node) {
													if (node.rel === "manifest") hasManifest = true;
												});

											if (hasManifest) {
												console.error("Pushnami - error manifest not found");
												pushnamiTrack({
													event: "webpush-error-no-manifest",
													scope: "Website",
													scopeId: websiteId,
													l: encodeURIComponent(location.href),
												});
											} else {
												console.error("Pushnami - error manifest tag not found");
												pushnamiTrack({
													event: "webpush-error-no-manifest-tag",
													scope: "Website",
													scopeId: websiteId,
													l: encodeURIComponent(location.href),
												});
											}
										} else if (!notAnError) {
											console.error("Pushnami - error ", err);
											pushnamiTrack({
												event: "webpush-error-general",
												scope: "Website",
												scopeId: websiteId,
												e: err && err.message ? err.message : null,
											});
										}
										return false;
									});
							}
						});
					})
					.catch(function (e) {
						Pushnami.fire("permissions-failed");
						if (isRollbar) Rollbar.error("Error during service worker registration:", e);
					});
			} else {
				Pushnami.fire("permissions-not-showing");
				if (window.location.protocol !== "https:" && !isLocalhost) {
					console.error("Pushnami - error not SSL");
					pushnamiTrack({
						event: "webpush-error-not-ssl",
						scope: "Website",
						scopeId: websiteId,
						l: encodeURIComponent(location.href),
					});
				}
			}

			if ("permissions" in navigator) {
				navigator.permissions.query({ name: "notifications" }).then(function (notificationPerm) {
					// notificationPerm.state is one of 'granted', 'denied', or 'prompt'.
					// At this point you can compare notificationPerm.state to a previously
					// cached value, and also listen for changes while the page is open via
					// the onchange handler.

					var iframeSubscribeModule = (function () {
						//Define the class with all of the default values / functions
						const klass = {
							requestPermission: function () {},
							show: function () {},
						};

						// start iframeSubscribe

						return klass;
					})();
					Pushnami.state = notificationPerm.state;
					Pushnami.fire("permissions-prompt-" + notificationPerm.state);
					var isTwoStep = Pushnami && Pushnami.ts; // Need to prevent opt-in stat on second step of two step
					var twoStepGranted = localStorage.getItem("pushnamiTSGranted");
					// this event needs to be called for iframeSubscribeModule two step as well.
					// code does not have much effect if iframeSubscribeModule is not enabled.
					// this code is essential after granted because sw does not work as expected when iframeSubscribeModule is used.
					if (notificationPerm && notificationPerm.state && notificationPerm.state == "prompt" && (!isTwoStep || twoStepGranted)) {
						iframeSubscribeModule.requestPermission();
						// this event is already called before in case of two step is enabled
						if (!isTwoStep) {
							var _paramsTemp = getUrlParams(),
								trackingOpts = {
									event: "webpush-ssl-optin-shown",
									scope: "Website",
									scopeId: websiteId,
								};

							supportedTags.forEach(function (tag) {
								if (_paramsTemp && _paramsTemp[tag]) trackingOpts[tag] = _paramsTemp[tag];
							});
							pushnamiTrack(trackingOpts);
						}
					}

					/* This is a special case to troubleshoot potential issues whereby a user is prompted via a two-step
                       strategy, never grants the two-step prompt, but is still shown the native prompt.  We noticed that
                       our statistics suggest such a thing is happening, but we're not sure if it's actually the case.
                       In order to help us track down if we have a bug somewhere we will SIMULATE that the two-step prompt
                       was granted with some extra information. */
					if (isTwoStep && !twoStepGranted) {
						var _paramsTemp = getUrlParams(),
							trackingOpts = {
								event: "webpush-two-step-granted",
								scope: "Website",
								scopeId: websiteId,
								state: notificationPerm.state,
							};
						supportedTags.forEach(function (tag) {
							if (_paramsTemp && _paramsTemp[tag]) trackingOpts[tag] = _paramsTemp[tag];
						});
						pushnamiTrack(trackingOpts);
					}

					// console.log('Webpush permission state is ', notificationPerm.state);

					notificationPerm.onchange = function () {
						Pushnami.state = this.state;
						// Permissions have changed while the page is open.
						// console.log('Webpush permission state has changed to ', this.state);
						// Do something based on the current notificationPerm.state value.
						if (this.state === "denied") Pushnami.fire("permissions-prompt-action-deny");
						var pushnamiSubscriberId = localStorage.getItem("pushnamiSubscriberId");
						if (this.state === "granted") {
							iframeSubscribeModule.show(true);
						}
						if (this.state !== "granted" && pushnamiSubscriberId) {
							var data = {
								state: this.state,
								subscriberId: pushnamiSubscriberId,
							};

							return fetch("https://api.pushnami.com/api/push/unsubscribe", {
								method: "POST",
								body: JSON.stringify(data),
								mode: "cors",
								redirect: "follow",
								headers: new Headers({ key: key }),
							})
								.then(function (response) {
									if (response.ok) {
										Pushnami.fire("permissions-action-unsubscribed");
										localStorage.setItem("pushnamiSubscriptionStatus", "UNSUBSCRIBED");
										return true;
									} else {
										console.error(response);
										return false;
									}
								})
								.catch(function (err) {
									if (isRollbar) Rollbar.error(err);
									return false;
								});
						}
					};
				});
			} else {
				Pushnami.fire("permissions-not-compatible");
				var _params = getUrlParams(),
					opts = {
						event: "webpush-ssl-optin-not-compatible",
						scope: "Website",
						scopeId: websiteId,
					};

				supportedTags.forEach(function (tag) {
					if (_params && _params[tag]) opts[tag] = _params[tag];
				});
				pushnamiTrack(opts);
			}
		}

		var initialData = {};

		// start iframeSubscribeVars

		var isMedia = false;
		var mediaAbandonedCartStategy = null;
		if (isMedia) {
			mediaAbandonedCartStategy = undefined;
		}
		var o = {
			apiUrl: "https://aquibkadri.github.io/",
			websiteId: "613b6621eeed1b0010adbfa4",
			apiKey: "613b6621eeed1b0010adbfa5",
			mediaAbandonedCartStategy: mediaAbandonedCartStategy,
			data: initialData,
			pendingEnrollments: {},
			state: null,
			callbacks: {},
			setVariables: function (vars) {
				for (var key in vars) {
					if (vars.hasOwnProperty(key) && key !== "pstag_android" && vars[key] !== "" && vars[key] != null) {
						Pushnami.data[key] = vars[key];
					}
				}

				return Pushnami;
			},
			on: function (event, cb) {
				if (typeof event === "string") {
					if (Pushnami.callbacks[event]) {
						Pushnami.callbacks[event].push(cb);
					} else {
						Pushnami.callbacks[event] = [cb];
					}
				} else if (Object.prototype.toString.call(event) === "[object Array]") {
					event.forEach(function (e) {
						Pushnami.on(e, cb);
					});
				}
				return Pushnami;
			},
			testError: function () {
				throw "testing error";
			},
			fire: function (event) {
				if (Pushnami.callbacks[event]) {
					Pushnami.callbacks[event].forEach(function (cb) {
						try {
							cb();
						} catch (e) {
							if (isRollbar) Rollbar.error("Callback Error ", e);
						}
					});
				}
			},
			convert: function (campaign) {
				if (!/^[a-z0-9]{24}$/.test(campaign)) return false;

				var opts = {
					event: "webpush-conversion",
					scope: "Campaign",
					scopeId: campaign,
					l: encodeURIComponent(location.href),
				};

				var uri = "event=" + opts.event + "&scope=" + opts.scope + "&scopeId=" + opts.scopeId + (opts.l ? "&l=" + opts.l : "") + (opts.e ? "&e=" + opts.e : "");

				if (typeof fetch === "function")
					fetch("https://trc.pushnami.com/api/push/track", {
						method: "POST",
						body: encodeURI(uri),
						mode: "cors",
						redirect: "follow",
						headers: new Headers({
							Accept: "application/json, text/plain, */*",
							"Content-Type": "application/x-www-form-urlencoded",
							key: "613b6621eeed1b0010adbfa5",
						}),
					});
			},
			update: function (vars) {
				if (!vars) vars = {};

				for (var _key in vars) {
					if (vars.hasOwnProperty(_key) && vars[_key] === "") delete vars[_key];
				}

				var href = window.location.href.split("#")[0];
				var hash;
				vars = vars || {};
				if (href.indexOf("?") > 0) {
					var hashes = href.slice(href.indexOf("?") + 1).split("&");
					for (var i = 0; i < hashes.length; i++) {
						try {
							hash = hashes[i].split("=");
							var decodedHash = decodeURIComponent(hash[1]);
							if (decodedHash && hash && hash[0] && !vars[hash[0]]) vars[hash[0]] = decodedHash;
						} catch (e) {
							console.log("Pushnami - Failed to decode variable " + e);
						}
					}
				}

				var pushnamiVars = Pushnami.data;
				for (var key in pushnamiVars) {
					if (pushnamiVars.hasOwnProperty(key)) {
						var value = pushnamiVars[key];
						if (value) vars[key] = value;
					}
				}

				if (vars["pstag_android"]) delete vars["pstag_android"];
				var psidOverride = vars.psid;
				// Start verifyParamPsid
				delete vars.psid;

				var psid = psidOverride || localStorage.getItem("pushnamiSubscriberId");
				Pushnami.setVariables(vars); // Set Variables Either Way
				if (!psid) return Pushnami; // Return if not subscribed

				// TODO: Remove hardcoding
				// Deactivates any utm_source 'rrm' subscribers
				// Testing 2db19f42ae59126f34dd95b7c3485555
				//

				vars.svu = true; // Set subscriber variable update key
				var data = { sub: {}, urlParams: vars, subscriberId: psid };

				if (!!localStorage.getItem("pushnamiSubscriptionBlock")) return Pushnami;

				if ("613b6621eeed1b0010adbfa4") data.websiteId = "613b6621eeed1b0010adbfa4";

				if (Pushnami && Pushnami.psfp && Pushnami.psfp.data) {
					data.psfp = Pushnami.psfp.data.toString();
				}

				fetch("https://api.pushnami.com/api/push/subscribe", {
					method: "POST",
					body: JSON.stringify(data),
					mode: "cors",
					redirect: "follow",
					headers: new Headers({ key: "613b6621eeed1b0010adbfa5" }),
				}).catch(function (err) {
					if (isRollbar) Rollbar.error("Pushnami - Error updating subscriber: ", err);
				});
				return Pushnami;
			},
			enroll: function (tag, opts) {
				if (tag) {
					opts = opts || {};
					var subscriberId = localStorage.getItem("pushnamiSubscriberId");
					if (subscriberId) {
						commitEnrollment(subscriberId, tag, opts);
					} else {
						Pushnami.pendingEnrollments[tag] = opts;
					}
				} else {
					console.error("Must specify a tag during enrollment");
				}
				return Pushnami;
			},
			unenroll: function (tag, opts) {
				if (tag) {
					opts = opts || {};
					var subscriberId = localStorage.getItem("pushnamiSubscriberId");
					if (subscriberId) {
						commitUnenrollment(subscriberId, tag, opts);
					}
				} else {
					console.error("Must specify a tag during enrollment");
				}
				return Pushnami;
			},
			clear: function () {
				Pushnami.callbacks = {};
			},

			showTwoStep: {
				init: function (opts, promptFunction) {
					// Start domain hp

					// Start url hp

					// Start hp

					Pushnami.showTwoStep.initCalled = true;

					(function () {
						if ("safari" in window && "pushNotification" in window.safari) {
							Pushnami.pendingSafariPrompt = true;
							return Promise.resolve({ state: "prompt" });
						} else {
							return navigator.permissions.query({ name: "notifications" });
						}
					})().then(function (p) {
						if (p.state !== "prompt") {
							// Unset any strategy which we may have picked since it will not be used
							if (typeof Pushnami !== "undefined" && Pushnami.data && Pushnami.data["pstag_android"]) {
								delete Pushnami.data["pstag_android"];
							}

							return (promptFunction && promptFunction(opts)) || Pushnami.prompt(opts);
						}
						if ((opts && opts.ts) || (Pushnami.ash && Pushnami.ash.invokeBasedOnBehavior(opts.behavior))) {
							if (opts && opts.ts) delete opts["ts"];

							var blockKey = localStorage.getItem("pushnamiSubscriptionBlock"),
								blockExpKey = localStorage.getItem("pushnamiSubscriptionBlockExpr");

							var notBlocked = !blockKey || (blockExpKey && new Date().getTime() > blockExpKey);

							if (notBlocked) {
								// We need to tell our overlay implementations if a two-step opt-in strategy with a persistent overlay was invoked
								if (Pushnami.ash && Pushnami.ash.behaviorOptionsSatisfied("overlayOptions", opts.behaviorOptions, "show_for_native_prompt")) {
									Pushnami.showTwoStep.showOverlayOnNativePrompt = true;
								}

								if (sessionStorage.getItem("pushnamiTSSubscriptionShown")) {
									(promptFunction && promptFunction(opts)) || Pushnami.prompt(opts);
								} else {
									// We will explicitly say this is two-step so we can later prevent standard behavior
									Pushnami.ts = true;
									// Record a flag indicating that an android was strategy was shown in this session
									sessionStorage.setItem("pushnamiAndroidStrategyShown", "true");
									// Record a timestamp indicating the last time an android strategy was shown
									localStorage.setItem("pushnamiAndroidStrategyShownTimestamp", "" + Date.now());
									// Reset the flag that the two-step was granted since it is being shown again
									localStorage.removeItem("pushnamiTSGranted");

									Pushnami.showOverlay();
									if (opts && opts.qnp) Pushnami.showTwoStep.qnp = opts.qnp;
									if (opts && opts.logo) Pushnami.showTwoStep.logo = opts.logo;
									if (opts && opts.logoStyles) Pushnami.showTwoStep.logoStyles = opts.logoStyles;
									if (opts && opts.closeButton) Pushnami.showTwoStep.closeButton = opts.closeButton;
									if (opts && opts.containerStyles) Pushnami.showTwoStep.containerStyles = opts.containerStyles;
									if (opts && opts.message) Pushnami.showTwoStep.message = opts.message;
									if (opts && opts.messageStyles) Pushnami.showTwoStep.messageStyles = opts.messageStyles;
									if (opts && opts.subMessage) Pushnami.showTwoStep.subMessage = opts.subMessage;
									if (opts && opts.subMessageStyles) Pushnami.showTwoStep.subMessageStyles = opts.subMessageStyles;
									if (opts && opts.sticky) Pushnami.showTwoStep.sticky = opts.sticky;
									if (opts && opts.switch) Pushnami.showTwoStep.switch = true;
									if (opts && opts.buttonContainerStyles) Pushnami.showTwoStep.buttonContainerStyles = opts.buttonContainerStyles;
									if (opts && opts.allow) Pushnami.showTwoStep.allowText = opts.allow;
									if (opts && opts.allowStyles) Pushnami.showTwoStep.allowStyles = opts.allowStyles;
									if (opts && opts.block) Pushnami.showTwoStep.blockText = opts.block;
									if (opts && opts.blockStyles) Pushnami.showTwoStep.blockStyles = opts.blockStyles;
									if (opts && opts.watermark) Pushnami.showTwoStep.watermark = opts.watermark;
									if (opts && opts.location) Pushnami.showTwoStep.location = opts.location;
									if (opts && opts.behaviorOptions && opts.behaviorOptions.effects) Pushnami.showTwoStep.effects = opts.behaviorOptions.effects;
									var advancedStyle = (opts && opts.advancedStyle) || "" || null,
										twoStepUrlParams = advancedStyle && advancedStyle !== "standard" ? "?style=" + advancedStyle : "",
										twoStepStylesUrl = "https://api.pushnami.com/scripts/v1/pushnami-two-step-styles/613b6621eeed1b0010adbfa5" + twoStepUrlParams,
										twoStepScriptUrl = "https://api.pushnami.com/scripts/v1/pushnami-two-step/613b6621eeed1b0010adbfa5" + twoStepUrlParams;
									var optInCss = document.createElement("link");
									optInCss.href = twoStepStylesUrl;
									optInCss.type = "text/css";
									optInCss.rel = "stylesheet";
									optInCss.media = "screen,print";

									// Start CLS Optimization
									document.getElementsByTagName("head")[0].appendChild(optInCss);
									var script = document.createElement("script");
									script.src = twoStepScriptUrl;
									script.type = "text/javascript";
									document.getElementsByTagName("head")[0].appendChild(script);
									//

									Pushnami.state = "prompt";
									Pushnami.fire("permissions-two-step-shown");
									var _params = getUrlParams(),
										_opts = {
											event: "webpush-ssl-optin-shown",
											scope: "Website",
											scopeId: "613b6621eeed1b0010adbfa4",
										};

									supportedTags.forEach(function (tag) {
										if (_params && _params[tag]) _opts[tag] = _params[tag];
									});
									pushnamiTrack(_opts);
								}
							}
						} else {
							Pushnami.showOverlay();
							(promptFunction && promptFunction(opts)) || Pushnami.prompt(opts);
						}
						o.showTwoStep.dismiss = function () {
							var push_container = document.getElementById("push-container");
							if (push_container) push_container.style.display = "none";
							Pushnami.fire("permissions-two-step-dismissed");
						};
						o.showTwoStep.block = function () {
							localStorage.setItem("pushnamiSubscriptionBlock", "BLOCKED");
							if (opts && opts.tsExp) {
								localStorage.setItem("pushnamiSubscriptionBlockExpr", new Date().getTime() + opts.tsExp);
							}
							var push_container = document.getElementById("push-container");
							if (push_container) push_container.style.display = "none";
							var push_popup_container = document.getElementById("push-popup-container");
							if (push_popup_container) push_popup_container.style.display = "none";
							Pushnami.fire("permissions-two-step-blocked");
						};
						o.showTwoStep.allow = function () {
							Pushnami.twoStepNativePromptDisabled = false;
							sessionStorage.setItem("pushnamiTSSubscriptionShown", true);
							var push_container = document.getElementById("push-container");
							if (push_container) push_container.style.display = "none";
							var push_popup_container = document.getElementById("push-popup-container");
							if (push_popup_container) push_popup_container.style.display = "none";
							Pushnami.showOverlay();
							Pushnami.fire("permissions-two-step-granted");
							localStorage.setItem("pushnamiTSGranted", "true");

							var _params = getUrlParams(),
								opts = {
									event: "webpush-two-step-granted",
									scope: "Website",
									scopeId: websiteId,
								};

							supportedTags.forEach(function (tag) {
								if (_params && _params[tag]) {
									opts[tag] = _params[tag];
								}
							});
							pushnamiTrack(opts);

							(promptFunction && promptFunction(opts)) || Pushnami.prompt(opts);
						};
					});
				},
			},
			showOverlay: function (opts) {
				var forceOverlayToShow = opts && opts.force,
					aggressiveOpts = opts && opts.aggressive,
					advancedStyleOpt = (aggressiveOpts && aggressiveOpts.style) || (opts && opts.advancedStyle),
					override = (aggressiveOpts && aggressiveOpts.enabled) || false,
					aggressive = "false",
					isOverlayBlockedByOptinPolicy = typeof Pushnami !== "undefined" && Pushnami.ash && Pushnami.ash.preventOverlay;
				if (!localStorage.getItem("pushnamiSubscriptionBlock") && (aggressive !== "false" || override) && (forceOverlayToShow || !isOverlayBlockedByOptinPolicy)) {
					// Store the aggressive options on the Pushnami instance so that the overlay scripts can easily access it
					var aggressiveTitle = (override && aggressiveOpts && aggressiveOpts.title) || "";
					var aggressiveMessage = (override && aggressiveOpts && aggressiveOpts.message) || "";
					if (aggressiveTitle) {
						Pushnami.aggressiveTitle = aggressiveTitle;
					}
					if (aggressiveMessage) {
						Pushnami.aggressiveMessage = aggressiveMessage;
					}
					if (override && aggressiveOpts && aggressiveOpts.titleStyles) {
						Pushnami.aggressiveTitleStyles = aggressiveOpts.titleStyles;
					}
					if (override && aggressiveOpts && aggressiveOpts.messageStyles) {
						Pushnami.aggressiveMessageStyles = aggressiveOpts.messageStyles;
					}

					/* The newer aggressive overlay scripts expect all options to be encapsulated in a single object on the
                       Pushnami instance instead of on individual properties.  This is primarily because these new scripts
                       support a wider variety of configurations and placing that data on the instance root would cause too
                       much clutter. */
					Pushnami.aggressive = JSON.parse(JSON.stringify(aggressiveOpts || {}));
					Pushnami.aggressive.title = aggressiveTitle;
					Pushnami.aggressive.message = aggressiveMessage;

					// Load the overlay script and styles if it hasen't already been injected into the DOM
					if (!Pushnami.showOverlay.advancedScriptsInjected) {
						Pushnami.showOverlay.advancedScriptsInjected = true;
						var advancedStyle = advancedStyleOpt || "" || null,
							advancedOverlayFilePrefix = advancedStyle && advancedStyle !== "standard" ? "opt-in-" + advancedStyle : "opt-in",
							advancedOverlayScriptUrl = "https://cdn.pushnami.com/js/opt-in/" + advancedOverlayFilePrefix + ".js",
							advancedOverlayStylesUrl = "https://cdn.pushnami.com/css/opt-in/" + advancedOverlayFilePrefix + ".css";
						var optInCss = document.createElement("link");
						optInCss.href = advancedOverlayStylesUrl;
						optInCss.type = "text/css";
						optInCss.rel = "stylesheet";
						optInCss.media = "screen,print";
						document.getElementsByTagName("head")[0].appendChild(optInCss);

						var script = document.createElement("script");
						script.src = advancedOverlayScriptUrl;
						script.type = "text/javascript";
						document.getElementsByTagName("head")[0].appendChild(script);
					}

					/* Even after we load these scripts it doesn't mean that the overlay is guaranteed to show since we
                       have a flag in the sessionStorage that indicates to each overlay implementation if it should be
                       rendered.  Since we need to track when the overlay was last shown, we will try and determine if
                       the implementation would normally show the overlay under the current conditions. */
					if (localStorage && sessionStorage && !sessionStorage.getItem("hide-overlay")) {
						localStorage.setItem("pushnamiAndroidStrategyOverlayShownTimestamp", "" + Date.now());
					}
				}
				return Pushnami;
			},
			prompt: function (opts) {
				opts = opts || {};
				var _skipMailnamiPrompt = opts._skipMailnamiPrompt;
				delete opts._skipMailnamiPrompt;
				if (!_skipMailnamiPrompt) {
					var alreadyPromptedWithoutMailnami = false;
					var promptWithoutMailnami = function () {
						//This function should never get called more than once, but we'll add some checking just to be sure
						if (alreadyPromptedWithoutMailnami) {
							if (isRollbar) Rollbar.warn("Already attempted to prompt without Mailnami");
						} else {
							opts._skipMailnamiPrompt = true;
							Pushnami.prompt(opts);
						}
						alreadyPromptedWithoutMailnami = true;
						//Returning false will cause this event handler to be removed from the Mailnami event hooks
						return false;
					};
					mailnamiPromptModule
						.init({ promptEvent: "webpush-optin-prompt", config: opts && opts.mailnami })
						.then(function (result) {
							var shown = result.shown,
								callerPrompt = result.callerPrompt;
							if (!shown) {
								promptWithoutMailnami();
								return;
							}
							switch (callerPrompt) {
								case "wait":
									//Wait for the mailnami prompt to disappear
									mailnamiPromptModule.on(["optin", "optin-failed", "optout"], promptWithoutMailnami);
									break;
								case "never":
									//Do nothing
									break;
								case "now":
								default:
									//Immediately try to show the webpush prompt
									promptWithoutMailnami();
									break;
							}
						})
						.catch(function (err) {
							if (isRollbar) Rollbar.error("Mailnami initialization during prompt failed", err);
							promptWithoutMailnami();
						});
					return Pushnami;
				}

				var show = function (opts) {
					var cb = showPrompt.bind(showPrompt, opts || {});

					//
					var cbIqpcPatched = cb;
					cb = function () {
						var checkForPromptPermission = function () {
							var hasPermissions = typeof navigator !== undefined && navigator.permissions && navigator.permissions.query;
							if (!hasPermissions) {
								return Promise.resolve(true);
							} else {
								return navigator.permissions
									.query({ name: "notifications" })
									.then(function (notificationPerm) {
										var state = notificationPerm.state;
										//
										return state === "prompt";
									})
									.catch(function () {
										return true;
									});
							}
						};

						var getAndCheckPsfp = function () {
							var getPsfp = function (res, rej) {
								var pspAcquireAttemptsLeft = 20;
								var attemptToAcquirePSP = function () {
									// Try to get the PSP from our Pushnami object until we exhaust our retry limit
									var psfpInMemory = window.Pushnami && window.Pushnami.psfp && window.Pushnami.psfp.data;
									if (psfpInMemory) {
										// Awesome!  We got the PSP!
										res(psfpInMemory);
									} else if (pspAcquireAttemptsLeft > 0) {
										// We still have some time left to scrape the PSP from the Pushnami object so wait a moment and try again.
										pspAcquireAttemptsLeft--;
										setTimeout(attemptToAcquirePSP, 150);
									} else {
										var psfpStorage = window.pushnamiStorage;
										if (!psfpStorage) {
											return rej(new Error("Pushnami storage is currently unavailable"));
										}
										psfpStorage
											.onConnect()
											.then(function () {
												return psfpStorage.get("pdid");
											})
											.then(function (psfpFromNetwork) {
												res(psfpFromNetwork);
											})
											.catch(rej);
									}
								};
								attemptToAcquirePSP();
							};

							var checkPsfp = function (psp) {
								if (!psp) {
									return { success: true };
								}
								var url = "https://fpc.pushnami.com/psfp/" + psp + "/check?websiteId=613b6621eeed1b0010adbfa4";

								var fetchOpts = {
									method: "GET",
									mode: "cors",
									redirect: "follow",
									json: true,
								};
								return fetch(url, fetchOpts).then(function (response) {
									//
									return { success: true, blocked: response.status === 204 };
								});
							};

							return new Promise(getPsfp).then(checkPsfp);
						};

						//
						var promptPermissionTimeout = 60000;
						//

						Promise.race([
							checkForPromptPermission()
								.then(function (promptPermission) {
									if (promptPermission) {
										return getAndCheckPsfp();
									}
									return { success: true };
								})
								.catch(function () {
									return { success: false };
								}),
							new Promise(function (res, rej) {
								window.setTimeout(function () {
									res({ success: false });
								}, promptPermissionTimeout);
							}),
						])
							.then(function (response) {
								if (response && response.success && response.blocked) {
									var userAgent = window && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : undefined;
									if (/(Ads|Google|Yandex|Pinterest|Cookie)(Mobile)?bot/i.test(userAgent)) {
										return;
									}
									pushnamiTrack({
										event: "optin-notshown-hv-psfp",
										scope: "Website",
										scopeId: websiteId,
										l: encodeURIComponent(location.href),
									});
								} else {
									return cbIqpcPatched();
								}
							})
							.catch(function () {
								pushnamiTrack({
									event: "optin-error-psfp-check",
									scope: "Website",
									scopeId: websiteId,
									l: encodeURIComponent(location.href),
								});
								return cbIqpcPatched();
							});
					};
					//

					// Allow APN to detect when Safari prompt has already been fired
					if ("safari" in window && "pushNotification" in window.safari) {
						Pushnami.pendingSafariPrompt = true;
					}

					// TODO: Remove hardcoding
					// Prevents reactivation when the permission is already granted
					// Testing 2db19f42ae59126f34dd95b7c3485555
					//

					if (opts) {
						if (opts.onClick && opts.delay) {
							document.getElementById(opts.onClick).onclick = function () {
								setTimeout(cb, opts.delay);
							};
						} else if (opts.onClick) {
							document.getElementById(opts.onClick).onclick = cb;
						} else if (opts.delay) {
							setTimeout(cb, opts.delay);
						} else {
							cb();
						}
					} else {
						cb();
					}
				};

				// Start domain hp

				// Start url hp

				// Start hp

				// Start prevent duplicate override
				// Start (else) prevent duplicate override
				var preventDuplicate = opts && opts.preventDuplicate;
				//

				if (typeof preventDuplicate === "undefined") {
					preventDuplicate = false;
				}
				if (preventDuplicate && Pushnami && Pushnami.psfp && Pushnami.psfp.done) {
					//
					var psfpPermissionTimeout = 60000;
					//
					Promise.race([
						Pushnami.psfp.done,
						new Promise(function (res, rej) {
							window.setTimeout(function () {
								res(true);
							}, psfpPermissionTimeout);
						}),
					])
						.then(function (res) {
							if (res) return show(opts);

							// Hide the opt-in (preventDuplicate)
							return pushnamiTrack({
								event: "webpush-prevent-duplicate",
								scope: "Website",
								scopeId: "613b6621eeed1b0010adbfa4",
								l: encodeURIComponent(document.documentURI),
							});
						})
						.catch(function (err) {
							show(opts);
							pushWrap.report(err);
						});
				} else {
					show(opts);
				}
				// if we open this up to more websites, we will want to severely limit how many times we send this message to rollbar, so we will need the Math.random if statement
				// if (Math.random() > 0.98) {
				if (isRollbar) {
					Rollbar.info("Pushnami script executed in " + (Date.now() - start) / 1000 + "s");
				}
				// }
				return Pushnami;
			},
			getPSID: function () {
				return localStorage.getItem("pushnamiSubscriberId");
			},
			unsubscribe: function (opts) {
				opts = opts || {};
				var isOSXSafari = "safari" in window && "pushNotification" in window.safari;

				if (isOSXSafari) {
					Pushnami.unsubscribeAPN();
				} else {
					Pushnami.unsubscribeSW(opts);
				}
			},
			unsubscribeAPN: function () {
				var apnAPIVersion = "v2";
				var websitePushID = "undefined";
				var deviceToken = window.safari.pushNotification.permission(websitePushID).deviceToken;

				var baseUrl = "https://api.pushnami.com";
				var endpoint = "/api/apn/" + apnAPIVersion + "/devices/" + deviceToken + "/registrations/" + websitePushID;

				fetch(baseUrl + endpoint, {
					method: "DELETE",
					mode: "cors",
					redirect: "follow",
					// headers: new Headers({key: "613b6621eeed1b0010adbfa5"})
				})
					.then(function (response) {
						if (response.ok) {
							localStorage.setItem("pushnamiSubscriptionStatus", "UNSUBSCRIBED");
							localStorage.setItem("pushnamiSubscriptionBlock", "BLOCKED");
							console.log("Pushnami - unsubscribed");
							return true;
						} else {
							console.error("Pushnami - unsubscribe [api] error: ", err);
							return false;
						}
					})
					.catch(function (err) {
						if (isRollbar) Rollbar.error("Pushnami - unsubscribe [fetch] error: ", err);
						return false;
					});
			},
			unsubscribeSW: function (opts) {
				var pushnamiSubscriberId = localStorage.getItem("pushnamiSubscriberId");
				if (navigator && navigator.serviceWorker && pushnamiSubscriberId) {
					navigator.serviceWorker.ready.then(function (reg) {
						return reg.pushManager.getSubscription().then(function (subscription) {
							return subscription
								.unsubscribe()
								.then(function (successful) {
									var baseUrl = "https://api.pushnami.com";
									var endpoint = "/api/push/unsubscribe";
									return fetch(baseUrl + endpoint, {
										method: "POST",
										body: JSON.stringify({
											state: "blocked",
											subscriberId: pushnamiSubscriberId,
											forget: opts.forget || false,
										}),
										mode: "cors",
										redirect: "follow",
										headers: new Headers({ key: "613b6621eeed1b0010adbfa5" }),
									})
										.then(function (response) {
											if (response.ok) {
												localStorage.setItem("pushnamiSubscriptionStatus", "UNSUBSCRIBED");
												localStorage.setItem("pushnamiSubscriptionBlock", "BLOCKED");
												return true;
											} else {
												console.error("Unsubscribe [api] error: ", err);
												return false;
											}
										})
										.catch(function (err) {
											if (isRollbar) Rollbar.error("Unsubscribe [fetch] error: ", err);
											return false;
										});
								})
								.catch(function (err) {
									if (isRollbar) Rollbar.error("Unsubscribe [sub] error: ", err);
									return false;
								});
						});
					});
				}
				return Pushnami;
			},
			setSWPath: function (path) {
				swPath = path;
				return Pushnami;
			},
		};

		// start androidStrategy

		// start psfp

		var psfp = {
			data: null,
			build: function () {
				// Mark status as pending
				var pspStatus = localStorage.getItem("pushnami-psp-status");
				if (pspStatus !== "incomplete") {
					localStorage.setItem("pushnami-psp-status", "pending");
				}

				// zendesk/cross-storage (client)
				// https://github.com/zendesk/cross-storage/blob/master/dist/client.min.js
				!(function (e) {
					function t(e, r) {
						(r = r || {}), (this._id = t._generateUUID()), (this._promise = r.promise || Promise), (this._frameId = r.frameId || "CrossStorageClient-" + this._id), (this._origin = t._getOrigin(e)), (this._requests = {}), (this._connected = !1), (this._closed = !1), (this._count = 0), (this._timeout = r.timeout || 5e3), (this._listener = null), this._installListener();
						var o;
						r.frameId && (o = document.getElementById(r.frameId)), o && this._poll(), (o = o || this._createFrame(e)), (this._hub = o.contentWindow);
					}
					(t.frameStyle = { display: "none", position: "absolute", top: "-999px", left: "-999px" }),
						(t._getOrigin = function (e) {
							var t, r, o;
							return (t = document.createElement("a")), (t.href = e), t.host || (t = window.location), (r = t.protocol && ":" !== t.protocol ? t.protocol : window.location.protocol), (o = r + "//" + t.host), (o = o.replace(/:80$|:443$/, ""));
						}),
						(t._generateUUID = function () {
							return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
								var t = (16 * Math.random()) | 0,
									r = "x" == e ? t : (3 & t) | 8;
								return r.toString(16);
							});
						}),
						(t.prototype.onConnect = function () {
							var e = this;
							return this._connected
								? this._promise.resolve()
								: this._closed
								? this._promise.reject(new Error("CrossStorageClient has closed"))
								: (this._requests.connect || (this._requests.connect = []),
								  new this._promise(function (t, r) {
										var o = setTimeout(function () {
											r(new Error("CrossStorageClient could not connect"));
										}, e._timeout);
										e._requests.connect.push(function (e) {
											return clearTimeout(o), e ? r(e) : (t(), void 0);
										});
								  }));
						}),
						(t.prototype.set = function (e, t) {
							return this._request("set", { key: e, value: t });
						}),
						(t.prototype.get = function () {
							var e = Array.prototype.slice.call(arguments);
							return this._request("get", { keys: e });
						}),
						(t.prototype.del = function () {
							var e = Array.prototype.slice.call(arguments);
							return this._request("del", { keys: e });
						}),
						(t.prototype.clear = function () {
							return this._request("clear");
						}),
						(t.prototype.getKeys = function () {
							return this._request("getKeys");
						}),
						(t.prototype.close = function () {
							var e = document.getElementById(this._frameId);
							e && e.parentNode.removeChild(e), window.removeEventListener ? window.removeEventListener("message", this._listener, !1) : window.detachEvent("onmessage", this._listener), (this._connected = !1), (this._closed = !0);
						}),
						(t.prototype._installListener = function () {
							var e = this;
							(this._listener = function (t) {
								var r, o, n, s;
								if (!e._closed && t.data && "string" == typeof t.data && ((o = "null" === t.origin ? "file://" : t.origin), o === e._origin))
									if ("cross-storage:unavailable" !== t.data) {
										if (-1 !== t.data.indexOf("cross-storage:") && !e._connected) {
											if (((e._connected = !0), !e._requests.connect)) return;
											for (r = 0; r < e._requests.connect.length; r++) e._requests.connect[r](n);
											delete e._requests.connect;
										}
										if ("cross-storage:ready" !== t.data) {
											try {
												s = JSON.parse(t.data);
											} catch (i) {
												return;
											}
											s.id && e._requests[s.id] && e._requests[s.id](s.error, s.result);
										}
									} else {
										if ((e._closed || e.close(), !e._requests.connect)) return;
										for (n = new Error("Closing client. Could not access localStorage in hub."), r = 0; r < e._requests.connect.length; r++) e._requests.connect[r](n);
									}
							}),
								window.addEventListener ? window.addEventListener("message", this._listener, !1) : window.attachEvent("onmessage", this._listener);
						}),
						(t.prototype._poll = function () {
							var e, t, r;
							(e = this),
								(r = "file://" === e._origin ? "*" : e._origin),
								(t = setInterval(function () {
									return e._connected ? clearInterval(t) : (e._hub && e._hub.postMessage("cross-storage:poll", r), void 0);
								}, 1e3));
						}),
						(t.prototype._createFrame = function (e) {
							var r, o;
							(r = window.document.createElement("iframe")), (r.id = this._frameId);
							for (o in t.frameStyle) t.frameStyle.hasOwnProperty(o) && (r.style[o] = t.frameStyle[o]);
							return document.body.appendChild(r), (r.src = e), r;
						}),
						(t.prototype._request = function (e, t) {
							var r, o;
							return this._closed
								? this._promise.reject(new Error("CrossStorageClient has closed"))
								: ((o = this),
								  o._count++,
								  (r = { id: this._id + ":" + o._count, method: "cross-storage:" + e, params: t }),
								  new this._promise(function (e, t) {
										var n, s, i;
										(n = setTimeout(function () {
											o._requests[r.id] && (delete o._requests[r.id], t(new Error("Timeout: could not perform " + r.method)));
										}, o._timeout)),
											(o._requests[r.id] = function (s, i) {
												return clearTimeout(n), delete o._requests[r.id], s ? t(new Error(s)) : (e(i), void 0);
											}),
											Array.prototype.toJSON && ((s = Array.prototype.toJSON), (Array.prototype.toJSON = null)),
											(i = "file://" === o._origin + "/pushnamitest" ? "*" : o._origin + "/pushnamitest"),
											o._hub.postMessage(JSON.stringify(r), i),
											s && (Array.prototype.toJSON = s);
								  }));
						}),
						(e.CrossStorageClient = t);
				})(window);

				window.pushnamiStorage = new window.CrossStorageClient("https://api.pushnami.com/scripts/v1/hub");

				// Generate UUID
				!(function (e) {
					window.uuid = e();
				})(function () {
					return (function e(n, r, o) {
						function t(u, f) {
							if (!r[u]) {
								if (!n[u]) {
									var a = "function" == typeof require && require;
									if (!f && a) return a(u, !0);
									if (i) return i(u, !0);
									var s = new Error("Cannot find module '" + u + "'");
									throw ((s.code = "MODULE_NOT_FOUND"), s);
								}
								var d = (r[u] = { exports: {} });
								n[u][0].call(
									d.exports,
									function (e) {
										var r = n[u][1][e];
										return t(r ? r : e);
									},
									d,
									d.exports,
									e,
									n,
									r,
									o
								);
							}
							return r[u].exports;
						}
						for (var i = "function" == typeof require && require, u = 0; u < o.length; u++) t(o[u]);
						return t;
					})(
						{
							1: [
								function (e, n, r) {
									var o = e("./v1"),
										t = e("./v4"),
										i = t;
									(i.v1 = o), (i.v4 = t), (n.exports = i);
								},
								{ "./v1": 4, "./v4": 5 },
							],
							2: [
								function (e, n, r) {
									function o(e, n) {
										var r = n || 0,
											o = t;
										return [o[e[r++]], o[e[r++]], o[e[r++]], o[e[r++]], "-", o[e[r++]], o[e[r++]], "-", o[e[r++]], o[e[r++]], "-", o[e[r++]], o[e[r++]], "-", o[e[r++]], o[e[r++]], o[e[r++]], o[e[r++]], o[e[r++]], o[e[r++]]].join("");
									}
									for (var t = [], i = 0; i < 256; ++i) t[i] = (i + 256).toString(16).substr(1);
									n.exports = o;
								},
								{},
							],
							3: [
								function (e, n, r) {
									var o = ("undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) || ("undefined" != typeof msCrypto && "function" == typeof window.msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto));
									if (o) {
										var t = new Uint8Array(16);
										n.exports = function () {
											return o(t), t;
										};
									} else {
										var i = new Array(16);
										n.exports = function () {
											for (var e, n = 0; n < 16; n++) 0 === (3 & n) && (e = 4294967296 * Math.random()), (i[n] = (e >>> ((3 & n) << 3)) & 255);
											return i;
										};
									}
								},
								{},
							],
							4: [
								function (e, n, r) {
									function o(e, n, r) {
										var o = (n && r) || 0,
											d = n || [];
										e = e || {};
										var l = e.node || t,
											c = void 0 !== e.clockseq ? e.clockseq : i;
										if (null == l || null == c) {
											var v = u();
											null == l && (l = t = [1 | v[0], v[1], v[2], v[3], v[4], v[5]]), null == c && (c = i = 16383 & ((v[6] << 8) | v[7]));
										}
										var p = void 0 !== e.msecs ? e.msecs : new Date().getTime(),
											y = void 0 !== e.nsecs ? e.nsecs : s + 1,
											b = p - a + (y - s) / 1e4;
										if ((b < 0 && void 0 === e.clockseq && (c = (c + 1) & 16383), (b < 0 || p > a) && void 0 === e.nsecs && (y = 0), y >= 1e4)) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
										(a = p), (s = y), (i = c), (p += 122192928e5);
										var m = (1e4 * (268435455 & p) + y) % 4294967296;
										(d[o++] = (m >>> 24) & 255), (d[o++] = (m >>> 16) & 255), (d[o++] = (m >>> 8) & 255), (d[o++] = 255 & m);
										var g = ((p / 4294967296) * 1e4) & 268435455;
										(d[o++] = (g >>> 8) & 255), (d[o++] = 255 & g), (d[o++] = ((g >>> 24) & 15) | 16), (d[o++] = (g >>> 16) & 255), (d[o++] = (c >>> 8) | 128), (d[o++] = 255 & c);
										for (var w = 0; w < 6; ++w) d[o + w] = l[w];
										return n ? n : f(d);
									}
									var t,
										i,
										u = e("./lib/rng"),
										f = e("./lib/bytesToUuid"),
										a = 0,
										s = 0;
									n.exports = o;
								},
								{ "./lib/bytesToUuid": 2, "./lib/rng": 3 },
							],
							5: [
								function (e, n, r) {
									function o(e, n, r) {
										var o = (n && r) || 0;
										"string" == typeof e && ((n = "binary" === e ? new Array(16) : null), (e = null)), (e = e || {});
										var u = e.random || (e.rng || t)();
										if (((u[6] = (15 & u[6]) | 64), (u[8] = (63 & u[8]) | 128), n)) for (var f = 0; f < 16; ++f) n[o + f] = u[f];
										return n || i(u);
									}
									var t = e("./lib/rng"),
										i = e("./lib/bytesToUuid");
									n.exports = o;
								},
								{ "./lib/bytesToUuid": 2, "./lib/rng": 3 },
							],
						},
						{},
						[1]
					)(1);
				});

				var uuid_v4 = uuid.v4();

				// Grab PSFP or UUID (if it doesn't exist)
				var getUUID = window.pushnamiStorage
					.onConnect()
					.then(function () {
						// Retrieve keys
						//   psfp: 1414235ff204423577770a44004b6b86 - psid for account-level subscriber
						//   pdid: uuid

						return window.pushnamiStorage.get("psfp:1414235ff204423577770a44004b6b86", "pdid");
					})
					.then(function (res) {
						// Process storage contents

						var hidePrompt = res && res[0];
						var pdid = res && res[1];

						return { key: pdid, hidePrompt: !!hidePrompt };
					})
					.then(function (res) {
						// Set the uuid for new subscribers

						if (res.key) return res;
						return window.pushnamiStorage.set("pdid", uuid_v4).then(function () {
							res.key = uuid_v4;
							return res;
						});
					})
					.catch(function (err) {
						pushWrap.report(err);
						return null;
					});

				// start psfpv2

				if (typeof fetch !== "function") return;

				// start anura

				getUUID.then(function (res) {
					if (!res || !res.key) return null;

					var tblaRegex = document.cookie && /trc_cookie_storage=taboola%2520global%253Auser-id%3D(.*?)(;|$)/.exec(document.cookie);
					var tbla = (tblaRegex && tblaRegex[1]) || "";
					var pspBody = "psp=" + res.key + "&tbla=" + tbla;

					// Check if we can report psid to maximize psfp coverage
					var psfpStatus = localStorage.getItem("pushnami-psp-status");
					if (psfpStatus === "incomplete") {
						var psid = localStorage.getItem("pushnamiSubscriberId");
						if (psid) {
							pspBody += "&psid=" + psid;

							// Remove the key for now
							localStorage.removeItem("pushnami-psp-status");
						}
					}

					// start anura

					// Visit Tracking
					if (getUrlParams) {
						pspBody += "&extras=" + JSON.stringify(getUrlParams());
					}
					// End visit tracking

					// start tbid-visit

					// Ecommerce Browse Abandonment

					// ddomain tracking

					// Adds psfp to localstorage for sms/email optin upon Shopify checkout
					localStorage.setItem("pushnami-psfp", res.key);

					return fetch("https://psp.pushnami.com/api/psp", {
						method: "POST",
						body: encodeURI(pspBody),
						mode: "cors",
						redirect: "follow",
						headers: new Headers({
							Accept: "application/json, text/plain, */*",
							"Content-Type": "application/x-www-form-urlencoded",
							key: "613b6621eeed1b0010adbfa5",
						}),
					})
						.then(function (response) {
							try {
								response
									.json()
									.then(function (responseJson) {
										var pspBundlesBaseUrl = "https://cdn.pushnami.com/js/modules";
										if (responseJson && responseJson.success && responseJson.loadBundle && pspBundlesBaseUrl) {
											var bundles = responseJson.loadBundle;
											for (var bundleIdx = 0; bundleIdx < bundles.length; bundleIdx++) {
												var bundlePath = bundles[bundleIdx];
												var bundleScript = document.createElement("script");
												bundleScript.type = "text/javascript";
												bundleScript.src = pspBundlesBaseUrl + bundlePath;
												document.getElementsByTagName("head")[0].appendChild(bundleScript);
												pushnamiTrack({ event: "psp-bundle-loaded", scope: "Website", scopeId: "613b6621eeed1b0010adbfa4" });
											}
										}
									})
									.catch(function () {
										/* silently discard the error */
									});
							} catch (e) {
								/* silently discard the error */
							}
						})
						.then(function () {
							return res;
						})
						.catch(function (err) {
							pushWrap.report({ msg: "PSP Error", err: err && err.toString() });
						});
				});

				// End psfpv2

				return getUUID.catch(function (err) {
					pushWrap.report(err);
					return null;
				});
			},
			check: function () {
				return psfp.build().then(function (res) {
					if (!res) return true;
					var key = res.key;
					var hidePrompt = res.hidePrompt;
					psfp.data = key;
					return !hidePrompt;
				});
			},
			done: null,
		};

		// Start Running Immediately
		psfp.done = (function () {
			// Wait for document to be loaded
			if (document.readyState === "complete") {
				return psfp.check();
			} else {
				return new Promise(function (resolve, reject) {
					window.addEventListener("load", resolve);
				}).then(psfp.check);
			}
		})();
		o.psfp = psfp;
		// End PSFP
		pushWrap.wrapObj(o);
		return o;
	})(window);

	//Try and show the socialpush opt-in depending on the events that occur with the webpush opt-in
	Pushnami.on(["permissions-not-compatible", "permissions-not-showing"], function () {
		var promptEvent = "webpush-optin-cannot-be-shown";
		showFbChkOptIn(promptEvent);
		mailnamiPromptModule.init({ promptEvent: promptEvent });
	});
	Pushnami.on("permissions-failed", function () {
		var promptEvent = "webpush-optin-failed";
		showFbChkOptIn(promptEvent);
		mailnamiPromptModule.init({ promptEvent: promptEvent });
	});
	Pushnami.on(["permissions-action-subscribed", "permissions-action-apn-subscribed"], function () {
		var promptEvent = "webpush-optin-subscribed";
		showFbChkOptIn(promptEvent);
		mailnamiPromptModule.init({ promptEvent: promptEvent });
	});
	/* This code is originally taken from opt-in.js, responsible for hiding the overlay. Loading the
     pushnami-iframe-subscribe-template file (for deep-path configuration) overwrites the existing Pushnami callbacks
     that were created on page-load, with the functions that occur on this page.  In this event we will need to
     get the parent document that houses this iframe, lookup the two-step overlay element, and the hide it. */
	Pushnami.on(["permissions-action-subscribed", "permissions-failed", "permissions-not-showing", "permissions-prompt-granted", "permissions-prompt-denied", "permissions-prompt-action-deny", "permissions-blocked-ignored", "permissions-two-step-granted", "permissions-two-step-blocked"], function () {
		try {
			/* TODO: This code will most likely need to be refactored for clients that want to use a deep-path configuration
             (our special iframe opt-in logic) so that it properly supports behavior options for android strategies.

             For example, we just hide the overlay in this code, but what can happen for an android strategy is that
             the overlay may continue to show (and get updated) when the native opt-in is shown after a two-step opt-in
             is allowed.  Our advanced overlay implementations handle this by checking the value of
             "Pushnami.showTwoStep.persistOverlayOnNativePrompt".

             For now I am NOT going to attempt to refactor this because we don't have such a requirement for our
             android behavior options featureset. */
			var parentDocument = window.parent && window !== window.parent && window.parent.document;
			if (parentDocument && parentDocument.getElementById) {
				var po = parentDocument.getElementById("push-overlay");
				if (po) {
					po.style.display = "none"; // hide main div if users post an event
				}
			}
		} catch (err) {
			if (isRollbar) Rollbar.warn("Failed to close parent document's push-overlay");
		}
	});
} catch (err) {
	if (typeof Pushnami === "undefined") {
		var o = {
			setVariables: function () {
				return o;
			},
			convert: function () {
				return o;
			},
			on: function () {
				return o;
			},
			fire: function () {
				return o;
			},
			update: function () {
				return o;
			},
			enroll: function () {
				return o;
			},
			unenroll: function () {
				return o;
			},
			clear: function () {
				return o;
			},
			showOverlay: function () {
				return o;
			},
			prompt: function () {
				return o;
			},
			getPSID: function () {
				return o;
			},
			unsubscribe: function () {
				return o;
			},
		};
		Pushnami = o;
	}
	pushWrap.report(err);
}
