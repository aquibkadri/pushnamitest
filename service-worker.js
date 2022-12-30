"use strict";
var global_ttl = void 0,
	global_fallbackUrl = void 0,
	verbose = !1,
	worker = {
		util: {
			track: function e(r) {
				verbose && console.log("[SW] | service-worker.template.js | worker.util.track() | Tracking " + JSON.stringify(r));
				var o = r.event,
					t = r.scope,
					n = r.scopeId,
					i = r.s,
					s = r.pnid,
					c = { event: o, scope: t, scopeId: n };
				return (
					i && (c.s = i),
					s && (c.pnid = s),
					fetch("https://trc.pushnami.com/api/push/trc", { method: "POST", body: JSON.stringify(c), mode: "cors", redirect: "follow", headers: new Headers({ Accept: "application/json, text/plain, */*", "Content-Type": "application/json", key: "613b6621eeed1b0010adbfa5" }) })
						.then(function (e) {
							return verbose && console.log("[SW] | service-worker.template.js | worker.util.track() | Tracking Received"), e.ok ? (verbose && console.log("[SW] | service-worker.template.js | worker.util.track() | Tracking OK"), console.log("Tracking OK", e), !0) : (verbose && console.log("[SW] | service-worker.template.js | worker.util.track() | Tracking ERROR"), console.error("Tracking error", e), !1);
						})
						.catch(function (e) {
							return console.error(e), !1;
						})
				);
			},
		},
		on: {
			install: function e(r) {
				console.log("Installed", r), r.waitUntil(self.skipWaiting());
			},
			activate: function e(r) {
				console.log("Activated", r), r.waitUntil(self.clients.claim());
			},
			click: function e(r) {
				verbose && console.log("[SW] | service-worker.template.js | worker.on.click() | Received Click Event"), r.notification.close();
				var o = worker.click
					.handler(r)
					.then(function (e) {
						return verbose && console.log("[SW] | service-worker.template.js | worker.on.click() | Push Promise Valid"), !0;
					})
					.catch(function (e) {
						return verbose && console.error("[SW] | service-worker.template.js | worker.on.click() | Error in click promise,", e), !0;
					});
				return r.waitUntil(o);
			},
			push: function e(r) {
				verbose && console.log("[SW] | service-worker.template.js | worker.on.push() | Received Push Event");
				var o = worker.push
					.handler(r)
					.then(function (e) {
						return verbose && console.log("[SW] | service-worker.template.js | worker.on.push() | Push Promise Valid"), !0;
					})
					.catch(function (e) {
						return verbose && console.error("[SW] | service-worker.template.js | worker.on.push() | Error in push promise,", e), !0;
					});
				return r.waitUntil(o);
			},
		},
		push: {
			handler: function e(r) {
				return (
					"undefined" != typeof Promise && Promise.race
						? Promise.race([
								new Promise(function (e) {
									return setTimeout(e, 1e3);
								}),
								self.registration.pushManager.getSubscription(),
						  ])
						: self.registration.pushManager.getSubscription()
				)
					.then(function (e) {
						verbose && console.log("[SW] | service-worker.template.js | worker.push.handler() | Got Subscription");
						var o = r.data,
							t = void 0;
						if (o) verbose && console.log("[SW] | service-worker.template.js | worker.push.handler() | Parsing Payload"), (t = Promise.resolve(r.data.json()));
						else {
							var n = e || {},
								i = n.endpoint;
							if (!i) return verbose && console.error("[SW] | service-worker.template.js | worker.push.handler() | No Subscription Endpoint Found"), null;
							verbose && console.log("[SW] | service-worker.template.js | worker.push.handler() | Fetching Payload"), (t = worker.push.fetchPayload(i));
						}
						return verbose && console.log("[SW] | service-worker.template.js | worker.push.handler() | Got Payload " + JSON.stringify(t)), t;
					})
					.then(function (e) {
						return e ? worker.push.show(e) : Promise.reject(new Error("No payload supplied"));
					});
			},
			fetchPayload: function e(r) {
				var o = "application/json",
					key = "613b6621eeed1b0010adbfa5",
					t = new Headers({ accept: o, key: key }),
					n = "GET",
					i = "cors",
					s = "follow",
					c = "https://api.pushnami.com/api/push/notification-data?endpoint=" + encodeURIComponent(r),
					l = { method: "GET", mode: i, redirect: "follow", headers: t };
				return (
					verbose && console.log("[SW] | service-worker.template.js | worker.fethPayload() | Fetching Payload for " + c),
					fetch(c, l).then(function (e) {
						return e.json();
					})
				);
			},
			show: function e(r) {
				verbose && console.log("[SW] | service-worker.template.js | worker.push.show() | Showing Notification " + JSON.stringify(r));
				var o = r.ttl,
					t = r.fallbackUrl,
					n = r.url,
					i = r.title,
					s = r.message,
					c = r.icon,
					l = r.image,
					a = r.tag,
					p = r.s,
					u = r.campaignId,
					k = r.pnid,
					d = r.buttons,
					v = void 0 === d ? [] : d,
					w = r.badge;
				void 0 !== o && (global_ttl = o), t && (global_fallbackUrl = t);
				var h = o && new Date().getTime() - o > 0,
					g = h ? t + "/" : n;
				if (h) {
					var f = u;
					worker.util.track({ event: "webpush-notification-ttl-expired-onpush-payload", s: p, scope: "Campaign", scopeId: f });
				}
				var m = "https://api.pushnami.com" + c,
					b = !0,
					S = { body: s, icon: m, requireInteraction: !0, tag: a, data: { s: p, campaignId: u, url: g, pnid: k, buttons: v } };
				v.length > 0 &&
					(S.actions = v.map(function (e, r) {
						return { action: "button_" + r, title: e.text };
					})),
					l && (S.image = l),
					w && (S.badge = "https://api.pushnami.com" + w),
					verbose && console.log("[SW] | service-worker.template.js | worker.push.show() | showNotification()");
				var j = u;
				return (
					verbose && console.log("[SW] | service-worker.template.js | worker.push.show() | track delivered"),
					worker.util.track({ event: "webpush-notification-delivered", s: p, scope: "Campaign", scopeId: j, pnid: k }).then(function () {
						return self.registration.showNotification(i, S);
					})
				);
			},
		},
		click: {
			handler: function e(r) {
				verbose && console.log("[SW] | service-worker.template.js | worker.click.handler() | Click Event");
				var o = r.notification.data,
					t = o.campaignId,
					n = o.s,
					i = o.pnid,
					s = r.notification.data.url,
					c = /button_(0|1)/.exec(r.action || "");
				if (c && c[1]) {
					var l = r.notification.data.buttons || [],
						a = l[parseInt(c[1])];
					a && a.link && (s = a.link);
				}
				var p = global_ttl && new Date().getTime() - global_ttl > 0,
					u = p ? global_fallbackUrl + "/" : s;
				verbose && console.log("[SW] | service-worker.template.js | worker.click.handler() | Click URL: " + u);
				var k = t;
				return (
					verbose && console.log("[SW] | service-worker.template.js | worker.click.handler() | Logging Clicked for campaign " + t),
					worker.util
						.track({ event: "webpush-notification-clicked", s: n, scope: "Campaign", scopeId: k, pnid: i })
						.catch(function (e) {
							return console.error("[SW] | service-worker.template.js | worker.click.handler() | Unable to log click event", e);
						})
						.then(function () {
							return clients.matchAll({ type: "window" }).then(function (e) {
								for (var r = 0; r < e.length; r++) {
									var o = e[r],
										t = o.url === u;
									if ((verbose && t && console.log("[SW] | service-worker.template.js | worker.click.handler() | Found Same Tab: " + u), t && "focus" in o)) return verbose && t && console.log("[SW] | service-worker.template.js | worker.click.handler() | Focusing Tab: " + u), o.focus();
								}
								return clients.openWindow ? (verbose && console.log("[SW] | service-worker.template.js | worker.click.handler() | Opening Window " + u), clients.openWindow(u)) : (verbose && console.error("[SW] | service-worker.template.js | worker.click.handler() | openWindow not accessible"), null);
							});
						})
				);
			},
		},
		register: {
			handlers: function e() {
				self.addEventListener("install", worker.on.install), self.addEventListener("activate", worker.on.activate), self.addEventListener("notificationclick", worker.on.click), self.addEventListener("push", worker.on.push);
			},
		},
		init: function e() {
			worker.register.handlers();
		},
	};
worker.init();
