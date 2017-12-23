/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "131db375e7262cae1c8e"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 3;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://wx.yyeke.com/171215game/dists/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(40)(__webpack_require__.s = 40);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(3);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "d924ad1187e642e1298ff283f79df9c4.ttf";

/***/ }),
/* 3 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

function ajax( opts ) {

    //1.设置默认参数
    var defaults = {
        method: 'GET', //请求方式
        url: '', //发送请求的地址
        data: '', //发送数据
        async: true,//是否异步
        cache: true,//是否缓存
        contentType: 'application/x-www-form-urlencoded',//http头信息
        success: function () {},
        error: function () {},
    };

    //2.覆盖参数
    for( var key in opts ) {
        defaults[key] = opts[key];
    };

    //3.数据处理
    if ( typeof defaults.data === 'object' ) { //处理data
        var str = '';
        for( var key in defaults.data ) {
            str += key + '=' + defaults.data[key] + '&'
        }
        defaults.data = str.substring(0, str.length - 1);
    };

    defaults.method = defaults.method.toUpperCase();  //请求方式字符转换成大写

    defaults.cache = defaults.cache ? '' : '&' + new Date().getTime(); //处理 缓存


    if ( defaults.method === 'GET' && (defaults.data || defaults.cache) ) {
        defaults.url += '?' + defaults.data + defaults.cache;
    };

    //4.编写ajax
    var oXhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXobject('Microsoft.XMLHTTP');


    //与服务器建立链接，告诉服务器你要做什么
    oXhr.open(defaults.method, defaults.url, defaults.async);

    //发送请求
    if ( defaults.method === 'GET' ) {
        oXhr.send(null);
    } else {
        oXhr.setRequestHeader("Content-type", defaults.contentType);
        oXhr.send(defaults.data);
    }

    //等代服务器回馈
    oXhr.onreadystatechange = function () {
        if ( oXhr.readyState === 4 ) {
            if (oXhr.status === 200) {
                defaults.success.call(oXhr, oXhr.responseText);
            } else {
                defaults.error();
            };
        };
    };

};

module.exports = ajax;


//The end

/***/ }),
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\n@font-face {\n    font-family: 'HKHB';\n    src: url(" + __webpack_require__(2) + ");\n    font-style: normal;\n    font-weight: normal;\n}\n\nhtml {}\n\nbody {}\n\n.wrapper {\n    min-width: 1430px;\n    max-width: 2000px;\n    background: #151886;\n    margin: 0 auto;\n}\n\n.wrapper_0 {\n    min-width: 1430px;\n    max-width: 2000px;\n    background: url(" + __webpack_require__(42) + ") no-repeat;\n    background-size: 100%;\n}\n\n.mainWrapper {\n    position: relative;\n    min-width: 1430px;\n    max-width: 2000px;\n    background: url(" + __webpack_require__(43) + ") no-repeat;\n    background-size: 120%;\n    background-position: 50% 100%;\n}\n\n\n/*@media screen and (min-width:1400px) and (max-width:1600px) {\n    .mainWrapper {\n        background-size: 120%;\n        background-position: 50% 100%;\n    }\n}\n\n@media screen and (min-width:1700px) and (max-width:1900px) {\n    .mainWrapper {\n        background-size: 120%;\n        background-position: 50% 100%;\n    }\n}\n\n@media screen and (min-width:1900px) and (max-width:2400px) {\n    .mainWrapper {\n        background-size: 120%;\n        background-position: 50% 100%;\n    }\n}*/\n\nimg.title {\n    position: fixed;\n    width: 65%;\n    left: 100%;\n    top: 4%;\n}\n\nimg.movingTitle {\n    position: fixed;\n    width: 65%;\n    left: 15%;\n    top: 4%;\n    transition: left 2s;\n}\n\nimg.music {\n    margin-top: 3%;\n    margin-left: 85%;\n}\n\n.luckyStar {\n    position: relative;\n    width: 39%;\n    margin: 0 auto;\n    margin-top: 4%;\n}\n\nimg.lucky {\n    width: 100%;\n}\n\nimg.luckyUser {\n    position: absolute;\n    width: 12%;\n    top: 49%;\n    left: 44.5%;\n    border-radius: 50%;\n}\n\n.luckyStar p {\n    display: block;\n    margin: 0 auto;\n    margin-top: -3%;\n    font-family: HKHB;\n    font-size: 1.2vw;\n    color: #f47080;\n    text-align: center;\n}\n\n.otherLucky {\n    width: 62%;\n    margin: 0 auto;\n    margin-top: 2%;\n}\n\n.littleTitle {\n    margin-left: 3%;\n}\n\n.userHead {\n    position: relative;\n    display: inline-block;\n    width: 8%;\n    margin-left: 6.2%;\n}\n\n.luck{\n\tcursor: pointer;\n}\n\n.otherLucky .first {\n    margin-left: 3.5%;\n}\n\n\n.userHead .background {\n    width: 100%;\n}\n\n.userHead .user {\n    position: absolute;\n    width: 85%;\n    margin: 0 auto;\n    border-radius: 50%;\n    top: 5%;\n    left: 8%;\n}\n\n.userHead p {\n    float: left;\n    height: 50px;\n    word-break: break-all;\n    display: block;\n    margin: 0 auto;\n    margin-top: 8%;\n    font-family: HKHB;\n    font-size: 1vw;\n    color: #f47080;\n    text-align: center;\n}\n\n.btn {\n    position: relative;\n    width: 10%;\n    margin: 2% auto;\n}\n\n.btn .blue {\n    width: 100%;\n    z-index: 20;\n}\n\n.btn .yellow {\n    position: absolute;\n    width: 84%;\n    z-index: 5000;\n    top: 13%;\n    left: 7%;\n    cursor: pointer;\n}\n\n.btn .pressYellow {\n    position: absolute;\n    width: 80%;\n    z-index: 5000;\n    top: 15%;\n    left: 8%;\n    cursor: pointer;\n}\n\nimg.astronaut {\n    position: absolute;\n    width: 5%;\n    top: 56%;\n    left: 70%;\n}\n\nimg.UFO {\n    position: absolute;\n    width: 8%;\n    top: 42%;\n    left: 10%;\n    transition: all 2s;\n}\n\n.blueMeteor {\n    position: absolute;\n    width: 4%;\n    top: 33%;\n    left: 25%;\n}\n\n.purpleMeteor {\n    position: absolute;\n    width: 6%;\n    top: 30%;\n    left: 80%;\n}\n\n.npc {\n    opacity: 0;\n}\n\n.details {\n\tdisplay: none;\n    width: 60vw;\n    height: 33.2vw;\n    position: absolute;\n    top: 16%;\n    left: 20%;\n    background: url(" + __webpack_require__(44) + ");\n    background-size: 100% 100%;\n    z-index: 999999999999999;\n}\n\n.details_userHead {\n    width: 8.8vw;\n    height: 8.8vw;\n    background: pink;\n    border-radius: 50%;\n    margin: 0 auto;\n    margin-top: 6.8vw;\n}\n\n.details_userHead img {\n    border-radius: 50%;\n    width: 100%;\n    height: 100%;\n}\n\n#nickname {\n    font-family: HKHB;\n    font-size: 3vw;\n    color: #57e5ff;\n    text-align: center;\n    margin-top: 3.5vw;\n    text-shadow: 0 0 7vw #57e5ff;\n}\n\n#names {\n    font-family: HKHB;\n    font-size: 1.8vw;\n    color: #57e5ff;\n    text-align: center;\n    margin-top: 2.5vw;\n    text-shadow: 0 0 5vw #57e5ff;\n}\n\n#studentNum {\n    display: inline-block;\n    margin-left: 2.4vw;\n}\n\n.baterry {\n\tdisplay: none;\n    position: absolute;\n    top: 36%;\n    left: 74%;\n    width: 2.4vw;\n    height: 18.3vw;\n    border: solid 4px #57e5ff;\n    border-radius: 2%;\n    box-shadow: 0 0 2vw #57e5ff;\n    transition: box-shadow 3s;\n    z-index: 999999999999999;\n}\n\n.node {\n    width: 1.70vw;\n    height: 1.8vw;\n    margin: 0 auto;\n    margin-top: 3px;\n    background: rgb(162, 247, 254);\n    opacity: 0;\n}\n\n#one {\n    margin-top: 2.0vw;\n}\n\n.circleWrapper{\n\tdisplay: none;\n}\n\n.circle {\n    position: absolute;\n    width: 7vw;\n    height: 7vw;\n    top: 22%;\n    left: 24%;\n    z-index: 999999999999999;\n}\n\n#circle_0 {\n    background: url(" + __webpack_require__(45) + ") no-repeat;\n    background-position: center;\n    background-size: 50%;\n}\n\n#circle_1 {\n    background: url(" + __webpack_require__(46) + ") no-repeat;\n    background-position: center;\n    background-size: 60%;\n    animation: 9.5s linear 0s normal none infinite counterLockWiseRotate;\n}\n\n#circle_2 {\n    background: url(" + __webpack_require__(47) + ") no-repeat;\n    background-position: center;\n    background-size: 90%;\n    animation: 9.5s linear 0s normal none infinite clockWiseRotate;\n}\n\n\n@-webkit-keyframes clockWiseRotate {\n    from {\n        -webkit-transform: rotate(0deg)\n    }\n    to {\n        -webkit-transform: rotate(360deg)\n    }\n}\n\n@-webkit-keyframes counterLockWiseRotate {\n    from {\n        -webkit-transform: rotate(360deg)\n    }\n    to {\n        -webkit-transform: rotate(0deg)\n    }\n}\n\n\n.cover{\n\tdisplay: none;\n\tposition: absolute;\n\twidth: 100%;\n\theight: 100%;\n\ttop: 0;\n\tbackground: #02062d;\n\topacity: 0.88;\n\tz-index: 999999999;\n}\n\n.quit{\n\tposition: absolute;\n\ttop: 4.6%;\n\tleft: 94%;\n\twidth: 2vw;\n\theight: 2vw;\n\tbackground: url(" + __webpack_require__(48) + ") no-repeat;\n\tbackground-size: 100% 100%;\n\tcursor: pointer;\n}\n\n\n", ""]);

// exports


/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_end_css__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_end_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_end_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Ajax_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Ajax_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Ajax_js__);



var w = document.body.clientWidth;
//var h = window.screen.availHeight;
var h = window.innerHeight;
var body = document.querySelector('body');

//动态设定总体高度
var mainWrapper = document.querySelector('.mainWrapper');
mainWrapper.style.height = body.style.height = h + 'px';


var title = document.querySelector('.title');
title.className = 'movingTitle';

var btn = document.querySelector('.yellow');

btn.addEventListener('mousedown', function() {
    btn.className = 'pressYellow';
}, false);

btn.addEventListener('mouseup', function() {
    btn.className = 'yellow';
}, false);

var UFO = document.querySelector('.UFO');
var blueMeteor = document.querySelector('.blueMeteor');
var purpleMeteor = document.querySelector('.purpleMeteor');
UFO.style.top = '42%';


// setInterval(function() {
//     if (UFO.style.top === '42%') {
//         UFO.style.top = '45%';
//     } else if (UFO.style.top === '45%') {
//         UFO.style.top = '42%';
//     }
// }, 1200);

moving(UFO, '42%', '45%', 1200);

function moving(target, init, range, time) {
    setInterval(function() {
        if (target.style.top === init) {
            target.style.top = range;
        } else if (target.style.top === range) {
            target.style.top = init;
        }
    }, time);
}


//webSocket
// var ws = new WebSocket('ws://wx.idsbllp.cn/gavagame/cet/luck?type=1');

// function getMessage(event) {
//     var data = event.data;
//     console.log(data);

// }

//抽奖
var bigPrizeHead = document.querySelector('#bigPrizeHead');
var bigPrizeName = document.querySelector('#bigPrizeName');
var smallPrizeHead = document.querySelectorAll('.smallPrizeHead');
var smallPrizeName = document.querySelectorAll('.smallPrizeName');

smallPrizeName[0].style.opacity = smallPrizeName[1].style.opacity = 0;
smallPrizeName[2].style.opacity = smallPrizeName[3].style.opacity = 0;

//bigPrizeHead.src = 'http://img05.tooopen.com/images/20160121/tooopen_sy_155168162826.jpg';

btn.addEventListener('click', prizeDraw, false);
var time = 0;
var url = 'http://wx.yyeke.com/171215game/master/luck' + window.location.search;

var dataObj;

function prizeDraw() {
    time++;

    if (time === 1) {

        __WEBPACK_IMPORTED_MODULE_1__Ajax_js___default()({
            url: url,
            method: 'GET',
            success: function(data) {
                console.log(data);
                dataObj = JSON.parse(data);
                bigPrizeHead.src = dataObj.data[0].headimgurl;
                bigPrizeName.innerHTML = dataObj.data[0].nickname;
            },
            error: function(data) {
                console.log(data);
            }
        });


        //bigPrizeHead.src = dataObj.data[0].headimgurl;
        //bigPrizeName.innerHTML = dataObj.data[0].nickname;

        // 
        // $.ajax({
        //     url: url,
        //     type: 'GET',
        //     contentType: 'application/json',
        //     dataType: "JSONP",
        //     success: function(data) {
        //         console.log(data);
        //         var dataObj = JSON.parse(data);

        //         bigPrizeHead.src = dataObj.data[0].headimgurl;
        //         bigPrizeName.innerHTML = dataObj.data[0].nickname;
        //     },
        //     error: function(data) {
        //         console.log(data);
        //     }

        // });
    }
    if (time === 2) {

        for (var i = 0; i < smallPrizeHead.length; i++) {
            smallPrizeHead[i].src = dataObj.data[i + 1].headimgurl;
            smallPrizeName[i].innerHTML = dataObj.data[i + 1].nickname;
        }


        smallPrizeName[0].style.opacity = smallPrizeName[1].style.opacity = 1;
        smallPrizeName[2].style.opacity = smallPrizeName[3].style.opacity = 1;

    }
}

//抽奖详情

var baterryColor = ['rgb(162, 247, 254)', 'rgb(162, 247, 254)', 'rgb(149,226,251)',
    'rgb(125, 189, 246)', 'rgb(103, 155, 241)', 'rgb(82, 122, 257)',
    'rgb(62, 90, 232)', 'rgb(47, 67, 229)'
]

var shine;
var baterryaaa;

function bbb() {
    var baterry = document.querySelectorAll('.node');
    baterryaaa = setInterval(function() {
        for (var i = 0; i < baterry.length; i++) {
            baterry[i].style.transition = 'opacity ' + (7 - 1 * i) + 's,' + 'background 0.5s';
            baterry[i].style.opacity = '1';
            baterry[i].style.background = baterryColor[i];
        }
        baterry[0].style.opacity = '0';
    }, 300);


    shine = setInterval(function() {

        if (baterry[0].style.opacity == '1') {
            baterry[0].style.opacity = '0';
            baterry[0].style.transition = 'opacity 2s';
        } else if (baterry[0].style.opacity == '0') {
            baterry[0].style.opacity = '1';
        }
    }, 2000);
}


//进入抽奖详情
var luck = document.querySelectorAll('.luck');
for (var i = luck.length - 1; i >= 0; i--) {
    luck[i].addEventListener('click', function() {
        
        bbb();
        cover.style.display = details.style.display = baterry.style.display = circle.style.display = 'block';
        var userHead = details.querySelector('img');
        var nickname = details.querySelector('#nickname');
        var name = details.querySelector('#name');
        var studentNum = details.querySelector('#studentNum');

        var n;
        switch (this.id) {
            case 'star':
                n = 0;
                break;
            case 'a':
                n = 1;
                break;
            case 'b':
                n = 2;
                break;
            case 'c':
                n = 3;
                break;
            case 'd':
                n = 4;
                break;
            default:
                n = null;
                break;
        }

        userHead.src = dataObj.data[n].headimgurl;
        nickname.innerHTML = dataObj.data[n].nickname;

        if (dataObj.data[n].realname.length > 0) {
            name.innerHTML = dataObj.data[n].realname;
            studentNum.innerHTML = dataObj.data[n].usernumber;
        }
        
    }, false);
}



//退出详情页
var quit = document.querySelector('.quit');
var cover = document.querySelector('.cover');
var details = document.querySelector('.details');
var baterry = document.querySelector('.baterry');
var circle = document.querySelector('.circleWrapper');

quit.addEventListener('click', function() {
    var baterries = document.querySelectorAll('.node');
    for (var i = 0; i < baterries.length; i++) {
        baterries[i].style.opacity = '0';
    }
    setTimeout(function() {
        cover.style.display = details.style.display = baterry.style.display = circle.style.display = 'none';
    }, 200)
    clearInterval(shine);
    clearInterval(baterryaaa);
}, false);



// window.onbeforeunload = function(event) { 
//     alert(233);
// }; 

// window.onunload = function (event) {
//     alert('hahaahahah');
// }



//The end

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(9, function() {
			var newContent = __webpack_require__(9);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "d0d67cc43e8630d324e71c2132cda402.png";

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "2b24fb54f8294c08b0d483fb2b0687d7.png";

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "36d12da3634ff62953388a2a7c8fdcf7.png";

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAcCAYAAACdz7SqAAAESElEQVRIiZWWXWgcVRSAv5ndpkl/TAuFFkyiQqLUF8EHq2j6kMaiRbAFURLBgptoYknVilqtPpS8pbXVCgopiwhCE0ki25A0YhKDa36ERpG2lK4hTdhsk9XQkN2dzWZnd8aHuZOdbO5s6YGFvWfOOd89Z+6ccxXfvPkN0Ixc0sCLwLDLc/zl1QD4wsEa4ApQ5GL6rb+8+h0AFWgBLrsYFgEdQKUbVAArhZ0b8LLgAKD45k2ALVjZ7HNxugk8AyxLnpUCY8DjLr5/ADX+8uqkrVD95dWKv7xaj169/hqmGXFx3At0Ap48vUfo5UDTjNz5fbJevIJiYBOgeFArPEBxqLNP3Vn18PiOqoeOKIqyWRKiEtgBDDh0XwKvS3mGEZ/pG6n75c2TUaBEAA0g60GtsHdcdLtvJLHrib03Sh8pewlFyc8KrPJHgavA20CrS4Z6eHiiaeitUzcEDKxDmQJ0jy8yy1/nvzPELjzTgcH5iuefjW7ZvatWGhAOAivAWTaWG4DF66FT/a8eHxTLjLCPA6uAqQL4wkFDKBJAKnCooSsRiba7QIuAM7ic1EQk2h441PCTWGZFdgkR3wDrk0GAs2JHCSDVtb/ubOrucq8LWJEpU3eXe7v2150TS8MBXBEbYB3UAU4CiWxaT/UebvpYTyQnXMDrRE8kJ3pfbvokm9ZNAbQrl3QCN0CFrIFjt+e0sc/Pv2vo+mwhoKHrs2OfnXsvNjOnAybWoZECpVBfOGhivfwkoE11DfyrLSwGCkG1hcXAVPfPSwKoA5rwzwhdYagDnAa0w/3+J7eX7XHrzQBsL9vTfPD7tn0CoolfWgaEXBuUip5IPrppa8kEirKzEBTANIzl6cDgCyPHW//GcVLvF1qK1TcfuxfQAZ7S5v97qvPpV5YK2UnLi/XRd7kBs2n9H5leUdXKbQ/u/tEXDkqbxr2gXwHSjpSOa8M9B944ko5rv7r41gr/+4I2A8dkxtnVdGik5fRHsZk5faTl9IfZ1XTIJe4xXzjoevjyoTVuuzQy2YXJtouN4aHxOEB4aDw22Xax0chkF1xiXxC3iYLQSqCb3FRYE9Mw4qFLvY3X2jsWyH2Lq9faO+ZCnX0NpmHEJbG9QLe4VUihpUA/1rzMl+yd0ckTo59+YZfS7lgxQBs9eebm/OifHyDpPCJevy8cLM2HekSGVRInlm5Ntw7Un/gtDxjHanNxIHml/v3hpVvT8tlqxe1xnmgVuAAckFknItH2ntqjlxxAewqt+sLBDLmmvtJTe/SHAuOwBvjaXih4n7P/e7AuaA9gXS+c79sgN4g11pfSA2wVfsUufjEczd/ryLgY2CZxNEVGGvKpYZdcxZqzxeTmrR3XvpmsAIZXGGwWwBLWX0HWGr8LUAZWsW4VNtgj4trglJfcYUIA0nnlSQmoPStl4hxpsLFatngA1UtuymckhobIQjoXJeC08LGzlsUy/gcN7NyXiGagdAAAAABJRU5ErkJggg=="

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTMxZGIzNzVlNzI2MmNhZTFjOGUiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZm9udC/ljY7lurfmtbfmiqXkvZNXMTIoMSkv5Y2O5bq35rW35oql5L2TVzEyLnR0ZiIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9BamF4LmpzIiwid2VicGFjazovLy8uL3NyYy9jc3MvZW5kLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvZW5kLmpzIiwid2VicGFjazovLy8uL3NyYy9jc3MvZW5kLmNzcz83MTgwIiwid2VicGFjazovLy8uL3NyYy9pbWcvZW5kX2JhY2tncm91bmQucG5nIiwid2VicGFjazovLy8uL3NyYy9pbWcvZW5kX2JpZ1BsYW5lLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1nL2RldGFpbHNfMS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltZy9jaXJjbGVfMC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltZy9jaXJjbGVfMS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltZy9jaXJjbGVfMi5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltZy9xdWl0LnBuZyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUEyRDtBQUMzRDtBQUNBO0FBQ0EsV0FBRzs7QUFFSCxvREFBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3REFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBO0FBQ0Esb0NBQTRCO0FBQzVCLHFDQUE2QjtBQUM3Qix5Q0FBaUM7O0FBRWpDLCtDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBc0M7QUFDdEM7QUFDQTtBQUNBLHFDQUE2QjtBQUM3QixxQ0FBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQWlCLDhCQUE4QjtBQUMvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUEsNERBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQWtCLGNBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQWEsNEJBQTRCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFD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Q0EsQ0FBQzs7OztBQUlELDRDO0FBQ0E7QUFDQSxLOztBQUVBO0FBQ0E7QUFDQTs7OztBQUlBLFM7Ozs7OztBQ3ZQQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEM7Ozs7OztBQ3pCQSxnRjs7Ozs7O0FDQUEsZ0Y7Ozs7OztBQ0FBLGdGOzs7Ozs7QUNBQSxpQ0FBaUMsb3hFOzs7Ozs7QUNBakMsaUNBQWlDLHc5RTs7Ozs7O0FDQWpDLGlDQUFpQyxna0w7Ozs7OztBQ0FqQyxpQ0FBaUMsNGdEIiwiZmlsZSI6ImpzL2VuZC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gdGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9IDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiBcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xyXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XHJcbiBcdFx0O1xyXG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdChyZXF1ZXN0VGltZW91dCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0cmVxdWVzdFRpbWVvdXQgPSByZXF1ZXN0VGltZW91dCB8fCAxMDAwMDtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRpZih0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTm8gYnJvd3NlciBzdXBwb3J0XCIpKTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0UGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiO1xyXG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSByZXF1ZXN0VGltZW91dDtcclxuIFx0XHRcdFx0cmVxdWVzdC5zZW5kKG51bGwpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnIpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3Quc3RhdHVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcclxuIFx0XHRcdFx0XHQvLyBubyB1cGRhdGUgYXZhaWxhYmxlXHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgIT09IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyAhPT0gMzA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdHZhciB1cGRhdGUgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuIFx0XHRcdFx0XHRcdHJlamVjdChlKTtcclxuIFx0XHRcdFx0XHRcdHJldHVybjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSh1cGRhdGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0XHJcbiBcdFxyXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XHJcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiMTMxZGIzNzVlNzI2MmNhZTFjOGVcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcclxuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XHJcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRpZighbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xyXG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcclxuIFx0XHRcdGlmKG1lLmhvdC5hY3RpdmUpIHtcclxuIFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xyXG4gXHRcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA8IDApXHJcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA8IDApXHJcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcclxuIFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlcXVlc3QgKyBcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgKyBtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcclxuIFx0XHR9O1xyXG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fTtcclxuIFx0XHRmb3IodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmIG5hbWUgIT09IFwiZVwiKSB7XHJcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicmVhZHlcIilcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcclxuIFx0XHRcdFx0dGhyb3cgZXJyO1xyXG4gXHRcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xyXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XHJcbiBcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcclxuIFx0XHRcdFx0XHRpZighaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9O1xyXG4gXHRcdHJldHVybiBmbjtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaG90ID0ge1xyXG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxyXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcclxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXHJcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcclxuIFx0XHJcbiBcdFx0XHQvLyBNb2R1bGUgQVBJXHJcbiBcdFx0XHRhY3RpdmU6IHRydWUsXHJcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxyXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxyXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxyXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGlmKCFsKSByZXR1cm4gaG90U3RhdHVzO1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxyXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXHJcbiBcdFx0fTtcclxuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XHJcbiBcdFx0cmV0dXJuIGhvdDtcclxuIFx0fVxyXG4gXHRcclxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XHJcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcclxuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcclxuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdERlZmVycmVkO1xyXG4gXHRcclxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXHJcbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XHJcbiBcdFx0dmFyIGlzTnVtYmVyID0gKCtpZCkgKyBcIlwiID09PSBpZDtcclxuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcclxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XHJcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XHJcbiBcdFx0XHRpZighdXBkYXRlKSB7XHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0XHRcdHJldHVybiBudWxsO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcclxuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcclxuIFx0XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcclxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcclxuIFx0XHRcdHZhciBjaHVua0lkID0gMztcclxuIFx0XHRcdHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xyXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xyXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxyXG4gXHRcdFx0cmV0dXJuO1xyXG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0aWYoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xyXG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XHJcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcclxuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcclxuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XHJcbiBcdFx0aWYoIWRlZmVycmVkKSByZXR1cm47XHJcbiBcdFx0aWYoaG90QXBwbHlPblVwZGF0ZSkge1xyXG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cclxuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxyXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxyXG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xyXG4gXHRcdFx0fSkudGhlbihcclxuIFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XHJcbiBcdFx0XHRcdGlmKCFjaGlsZCkgY29udGludWU7XHJcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSB7XHJcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcclxuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcclxuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xyXG4gXHRcdFx0XHRcdFx0aWYoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcclxuIFx0XHJcbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcclxuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRcdGlmKGNiKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xyXG4gXHRcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycjIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmdpbmFsRXJyb3I6IGVyciwgLy8gVE9ETyByZW1vdmUgaW4gd2VicGFjayA0XHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJodHRwOi8vd3gueXlla2UuY29tLzE3MTIxNWdhbWUvZGlzdHMvXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoNDApKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDQwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxMzFkYjM3NWU3MjYyY2FlMWM4ZSIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMiAzIDQiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG52YXIgc3R5bGVzSW5Eb20gPSB7fTtcblxudmFyXHRtZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fTtcbn07XG5cbnZhciBpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuXHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcbn0pO1xuXG52YXIgZ2V0RWxlbWVudCA9IChmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW8gPSB7fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRpZiAodHlwZW9mIG1lbW9bc2VsZWN0b3JdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRtZW1vW3NlbGVjdG9yXSA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdH1cblxuXHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHR9O1xufSkoZnVuY3Rpb24gKHRhcmdldCkge1xuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpXG59KTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24pIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICghb3B0aW9ucy5pbnNlcnRJbnRvKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0QXQpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbSAoc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMgKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pIHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZSBuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQgKG9wdGlvbnMsIHN0eWxlKSB7XG5cdHZhciB0YXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcFtzdHlsZXNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR9XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50IChzdHlsZSkge1xuXHRpZiAoc3R5bGUucGFyZW50Tm9kZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcblxuXHR2YXIgaWR4ID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlKTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGFkZEF0dHJzKHN0eWxlLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlKTtcblxuXHRyZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGFkZEF0dHJzKGxpbmssIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGluayk7XG5cblx0cmV0dXJuIGxpbms7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJzIChlbCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUgKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGUsIHVwZGF0ZSwgcmVtb3ZlLCByZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICByZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblxuXHRcdHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcblxuXHR9IGVsc2UgaWYgKFxuXHRcdG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiXG5cdCkge1xuXHRcdHN0eWxlID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXG5cdFx0XHRpZihzdHlsZS5ocmVmKSBVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlLmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG5ld09iaikge1xuXHRcdGlmIChuZXdPYmopIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJlxuXHRcdFx0XHRuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJlxuXHRcdFx0XHRuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGUsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsgKGxpbmssIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0Lypcblx0XHRJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0XHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRcdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRcdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscykge1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmIChzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rLmhyZWY7XG5cblx0bGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpIFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMiAzIDQiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJkOTI0YWQxMTg3ZTY0MmUxMjk4ZmYyODNmNzlkZjljNC50dGZcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9mb250L+WNjuW6t+a1t+aKpeS9k1cxMigxKS/ljY7lurfmtbfmiqXkvZNXMTIudHRmXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAyIDMiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDIgMyA0IiwiZnVuY3Rpb24gYWpheCggb3B0cyApIHtcblxuICAgIC8vMS7orr7nva7pu5jorqTlj4LmlbBcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsIC8v6K+35rGC5pa55byPXG4gICAgICAgIHVybDogJycsIC8v5Y+R6YCB6K+35rGC55qE5Zyw5Z2AXG4gICAgICAgIGRhdGE6ICcnLCAvL+WPkemAgeaVsOaNrlxuICAgICAgICBhc3luYzogdHJ1ZSwvL+aYr+WQpuW8guatpVxuICAgICAgICBjYWNoZTogdHJ1ZSwvL+aYr+WQpue8k+WtmFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsLy9odHRw5aS05L+h5oGvXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge30sXG4gICAgfTtcblxuICAgIC8vMi7opobnm5blj4LmlbBcbiAgICBmb3IoIHZhciBrZXkgaW4gb3B0cyApIHtcbiAgICAgICAgZGVmYXVsdHNba2V5XSA9IG9wdHNba2V5XTtcbiAgICB9O1xuXG4gICAgLy8zLuaVsOaNruWkhOeQhlxuICAgIGlmICggdHlwZW9mIGRlZmF1bHRzLmRhdGEgPT09ICdvYmplY3QnICkgeyAvL+WkhOeQhmRhdGFcbiAgICAgICAgdmFyIHN0ciA9ICcnO1xuICAgICAgICBmb3IoIHZhciBrZXkgaW4gZGVmYXVsdHMuZGF0YSApIHtcbiAgICAgICAgICAgIHN0ciArPSBrZXkgKyAnPScgKyBkZWZhdWx0cy5kYXRhW2tleV0gKyAnJidcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0cy5kYXRhID0gc3RyLnN1YnN0cmluZygwLCBzdHIubGVuZ3RoIC0gMSk7XG4gICAgfTtcblxuICAgIGRlZmF1bHRzLm1ldGhvZCA9IGRlZmF1bHRzLm1ldGhvZC50b1VwcGVyQ2FzZSgpOyAgLy/or7fmsYLmlrnlvI/lrZfnrKbovazmjaLmiJDlpKflhplcblxuICAgIGRlZmF1bHRzLmNhY2hlID0gZGVmYXVsdHMuY2FjaGUgPyAnJyA6ICcmJyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpOyAvL+WkhOeQhiDnvJPlrZhcblxuXG4gICAgaWYgKCBkZWZhdWx0cy5tZXRob2QgPT09ICdHRVQnICYmIChkZWZhdWx0cy5kYXRhIHx8IGRlZmF1bHRzLmNhY2hlKSApIHtcbiAgICAgICAgZGVmYXVsdHMudXJsICs9ICc/JyArIGRlZmF1bHRzLmRhdGEgKyBkZWZhdWx0cy5jYWNoZTtcbiAgICB9O1xuXG4gICAgLy80Lue8luWGmWFqYXhcbiAgICB2YXIgb1hociA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbmV3IEFjdGl2ZVhvYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7XG5cblxuICAgIC8v5LiO5pyN5Yqh5Zmo5bu656uL6ZO+5o6l77yM5ZGK6K+J5pyN5Yqh5Zmo5L2g6KaB5YGa5LuA5LmIXG4gICAgb1hoci5vcGVuKGRlZmF1bHRzLm1ldGhvZCwgZGVmYXVsdHMudXJsLCBkZWZhdWx0cy5hc3luYyk7XG5cbiAgICAvL+WPkemAgeivt+axglxuICAgIGlmICggZGVmYXVsdHMubWV0aG9kID09PSAnR0VUJyApIHtcbiAgICAgICAgb1hoci5zZW5kKG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9YaHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBkZWZhdWx0cy5jb250ZW50VHlwZSk7XG4gICAgICAgIG9YaHIuc2VuZChkZWZhdWx0cy5kYXRhKTtcbiAgICB9XG5cbiAgICAvL+etieS7o+acjeWKoeWZqOWbnummiFxuICAgIG9YaHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIG9YaHIucmVhZHlTdGF0ZSA9PT0gNCApIHtcbiAgICAgICAgICAgIGlmIChvWGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdHMuc3VjY2Vzcy5jYWxsKG9YaHIsIG9YaHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdHMuZXJyb3IoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBhamF4O1xuXG5cbi8vVGhlIGVuZFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL0FqYXguanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDIgMyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIioge1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxufVxcblxcbkBmb250LWZhY2Uge1xcbiAgICBmb250LWZhbWlseTogJ0hLSEInO1xcbiAgICBzcmM6IHVybChcIiArIHJlcXVpcmUoXCIuLi9mb250L+WNjuW6t+a1t+aKpeS9k1cxMigxKS/ljY7lurfmtbfmiqXkvZNXMTIudHRmXCIpICsgXCIpO1xcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XFxuICAgIGZvbnQtd2VpZ2h0OiBub3JtYWw7XFxufVxcblxcbmh0bWwge31cXG5cXG5ib2R5IHt9XFxuXFxuLndyYXBwZXIge1xcbiAgICBtaW4td2lkdGg6IDE0MzBweDtcXG4gICAgbWF4LXdpZHRoOiAyMDAwcHg7XFxuICAgIGJhY2tncm91bmQ6ICMxNTE4ODY7XFxuICAgIG1hcmdpbjogMCBhdXRvO1xcbn1cXG5cXG4ud3JhcHBlcl8wIHtcXG4gICAgbWluLXdpZHRoOiAxNDMwcHg7XFxuICAgIG1heC13aWR0aDogMjAwMHB4O1xcbiAgICBiYWNrZ3JvdW5kOiB1cmwoXCIgKyByZXF1aXJlKFwiLi4vaW1nL2VuZF9iYWNrZ3JvdW5kLnBuZ1wiKSArIFwiKSBuby1yZXBlYXQ7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogMTAwJTtcXG59XFxuXFxuLm1haW5XcmFwcGVyIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICBtaW4td2lkdGg6IDE0MzBweDtcXG4gICAgbWF4LXdpZHRoOiAyMDAwcHg7XFxuICAgIGJhY2tncm91bmQ6IHVybChcIiArIHJlcXVpcmUoXCIuLi9pbWcvZW5kX2JpZ1BsYW5lLnBuZ1wiKSArIFwiKSBuby1yZXBlYXQ7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogMTIwJTtcXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogNTAlIDEwMCU7XFxufVxcblxcblxcbi8qQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDoxNDAwcHgpIGFuZCAobWF4LXdpZHRoOjE2MDBweCkge1xcbiAgICAubWFpbldyYXBwZXIge1xcbiAgICAgICAgYmFja2dyb3VuZC1zaXplOiAxMjAlO1xcbiAgICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogNTAlIDEwMCU7XFxuICAgIH1cXG59XFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDoxNzAwcHgpIGFuZCAobWF4LXdpZHRoOjE5MDBweCkge1xcbiAgICAubWFpbldyYXBwZXIge1xcbiAgICAgICAgYmFja2dyb3VuZC1zaXplOiAxMjAlO1xcbiAgICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogNTAlIDEwMCU7XFxuICAgIH1cXG59XFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDoxOTAwcHgpIGFuZCAobWF4LXdpZHRoOjI0MDBweCkge1xcbiAgICAubWFpbldyYXBwZXIge1xcbiAgICAgICAgYmFja2dyb3VuZC1zaXplOiAxMjAlO1xcbiAgICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogNTAlIDEwMCU7XFxuICAgIH1cXG59Ki9cXG5cXG5pbWcudGl0bGUge1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgIHdpZHRoOiA2NSU7XFxuICAgIGxlZnQ6IDEwMCU7XFxuICAgIHRvcDogNCU7XFxufVxcblxcbmltZy5tb3ZpbmdUaXRsZSB7XFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gICAgd2lkdGg6IDY1JTtcXG4gICAgbGVmdDogMTUlO1xcbiAgICB0b3A6IDQlO1xcbiAgICB0cmFuc2l0aW9uOiBsZWZ0IDJzO1xcbn1cXG5cXG5pbWcubXVzaWMge1xcbiAgICBtYXJnaW4tdG9wOiAzJTtcXG4gICAgbWFyZ2luLWxlZnQ6IDg1JTtcXG59XFxuXFxuLmx1Y2t5U3RhciB7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgd2lkdGg6IDM5JTtcXG4gICAgbWFyZ2luOiAwIGF1dG87XFxuICAgIG1hcmdpbi10b3A6IDQlO1xcbn1cXG5cXG5pbWcubHVja3kge1xcbiAgICB3aWR0aDogMTAwJTtcXG59XFxuXFxuaW1nLmx1Y2t5VXNlciB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgd2lkdGg6IDEyJTtcXG4gICAgdG9wOiA0OSU7XFxuICAgIGxlZnQ6IDQ0LjUlO1xcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XFxufVxcblxcbi5sdWNreVN0YXIgcCB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICBtYXJnaW46IDAgYXV0bztcXG4gICAgbWFyZ2luLXRvcDogLTMlO1xcbiAgICBmb250LWZhbWlseTogSEtIQjtcXG4gICAgZm9udC1zaXplOiAxLjJ2dztcXG4gICAgY29sb3I6ICNmNDcwODA7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLm90aGVyTHVja3kge1xcbiAgICB3aWR0aDogNjIlO1xcbiAgICBtYXJnaW46IDAgYXV0bztcXG4gICAgbWFyZ2luLXRvcDogMiU7XFxufVxcblxcbi5saXR0bGVUaXRsZSB7XFxuICAgIG1hcmdpbi1sZWZ0OiAzJTtcXG59XFxuXFxuLnVzZXJIZWFkIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICAgIHdpZHRoOiA4JTtcXG4gICAgbWFyZ2luLWxlZnQ6IDYuMiU7XFxufVxcblxcbi5sdWNre1xcblxcdGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLm90aGVyTHVja3kgLmZpcnN0IHtcXG4gICAgbWFyZ2luLWxlZnQ6IDMuNSU7XFxufVxcblxcblxcbi51c2VySGVhZCAuYmFja2dyb3VuZCB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4udXNlckhlYWQgLnVzZXIge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHdpZHRoOiA4NSU7XFxuICAgIG1hcmdpbjogMCBhdXRvO1xcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICAgIHRvcDogNSU7XFxuICAgIGxlZnQ6IDglO1xcbn1cXG5cXG4udXNlckhlYWQgcCB7XFxuICAgIGZsb2F0OiBsZWZ0O1xcbiAgICBoZWlnaHQ6IDUwcHg7XFxuICAgIHdvcmQtYnJlYWs6IGJyZWFrLWFsbDtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxuICAgIG1hcmdpbjogMCBhdXRvO1xcbiAgICBtYXJnaW4tdG9wOiA4JTtcXG4gICAgZm9udC1mYW1pbHk6IEhLSEI7XFxuICAgIGZvbnQtc2l6ZTogMXZ3O1xcbiAgICBjb2xvcjogI2Y0NzA4MDtcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4uYnRuIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICB3aWR0aDogMTAlO1xcbiAgICBtYXJnaW46IDIlIGF1dG87XFxufVxcblxcbi5idG4gLmJsdWUge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgei1pbmRleDogMjA7XFxufVxcblxcbi5idG4gLnllbGxvdyB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgd2lkdGg6IDg0JTtcXG4gICAgei1pbmRleDogNTAwMDtcXG4gICAgdG9wOiAxMyU7XFxuICAgIGxlZnQ6IDclO1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5idG4gLnByZXNzWWVsbG93IHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB3aWR0aDogODAlO1xcbiAgICB6LWluZGV4OiA1MDAwO1xcbiAgICB0b3A6IDE1JTtcXG4gICAgbGVmdDogOCU7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuaW1nLmFzdHJvbmF1dCB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgd2lkdGg6IDUlO1xcbiAgICB0b3A6IDU2JTtcXG4gICAgbGVmdDogNzAlO1xcbn1cXG5cXG5pbWcuVUZPIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB3aWR0aDogOCU7XFxuICAgIHRvcDogNDIlO1xcbiAgICBsZWZ0OiAxMCU7XFxuICAgIHRyYW5zaXRpb246IGFsbCAycztcXG59XFxuXFxuLmJsdWVNZXRlb3Ige1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHdpZHRoOiA0JTtcXG4gICAgdG9wOiAzMyU7XFxuICAgIGxlZnQ6IDI1JTtcXG59XFxuXFxuLnB1cnBsZU1ldGVvciB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgd2lkdGg6IDYlO1xcbiAgICB0b3A6IDMwJTtcXG4gICAgbGVmdDogODAlO1xcbn1cXG5cXG4ubnBjIHtcXG4gICAgb3BhY2l0eTogMDtcXG59XFxuXFxuLmRldGFpbHMge1xcblxcdGRpc3BsYXk6IG5vbmU7XFxuICAgIHdpZHRoOiA2MHZ3O1xcbiAgICBoZWlnaHQ6IDMzLjJ2dztcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB0b3A6IDE2JTtcXG4gICAgbGVmdDogMjAlO1xcbiAgICBiYWNrZ3JvdW5kOiB1cmwoXCIgKyByZXF1aXJlKFwiLi4vaW1nL2RldGFpbHNfMS5wbmdcIikgKyBcIik7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogMTAwJSAxMDAlO1xcbiAgICB6LWluZGV4OiA5OTk5OTk5OTk5OTk5OTk7XFxufVxcblxcbi5kZXRhaWxzX3VzZXJIZWFkIHtcXG4gICAgd2lkdGg6IDguOHZ3O1xcbiAgICBoZWlnaHQ6IDguOHZ3O1xcbiAgICBiYWNrZ3JvdW5kOiBwaW5rO1xcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICAgIG1hcmdpbjogMCBhdXRvO1xcbiAgICBtYXJnaW4tdG9wOiA2Ljh2dztcXG59XFxuXFxuLmRldGFpbHNfdXNlckhlYWQgaW1nIHtcXG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgaGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG4jbmlja25hbWUge1xcbiAgICBmb250LWZhbWlseTogSEtIQjtcXG4gICAgZm9udC1zaXplOiAzdnc7XFxuICAgIGNvbG9yOiAjNTdlNWZmO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIG1hcmdpbi10b3A6IDMuNXZ3O1xcbiAgICB0ZXh0LXNoYWRvdzogMCAwIDd2dyAjNTdlNWZmO1xcbn1cXG5cXG4jbmFtZXMge1xcbiAgICBmb250LWZhbWlseTogSEtIQjtcXG4gICAgZm9udC1zaXplOiAxLjh2dztcXG4gICAgY29sb3I6ICM1N2U1ZmY7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgbWFyZ2luLXRvcDogMi41dnc7XFxuICAgIHRleHQtc2hhZG93OiAwIDAgNXZ3ICM1N2U1ZmY7XFxufVxcblxcbiNzdHVkZW50TnVtIHtcXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgICBtYXJnaW4tbGVmdDogMi40dnc7XFxufVxcblxcbi5iYXRlcnJ5IHtcXG5cXHRkaXNwbGF5OiBub25lO1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHRvcDogMzYlO1xcbiAgICBsZWZ0OiA3NCU7XFxuICAgIHdpZHRoOiAyLjR2dztcXG4gICAgaGVpZ2h0OiAxOC4zdnc7XFxuICAgIGJvcmRlcjogc29saWQgNHB4ICM1N2U1ZmY7XFxuICAgIGJvcmRlci1yYWRpdXM6IDIlO1xcbiAgICBib3gtc2hhZG93OiAwIDAgMnZ3ICM1N2U1ZmY7XFxuICAgIHRyYW5zaXRpb246IGJveC1zaGFkb3cgM3M7XFxuICAgIHotaW5kZXg6IDk5OTk5OTk5OTk5OTk5OTtcXG59XFxuXFxuLm5vZGUge1xcbiAgICB3aWR0aDogMS43MHZ3O1xcbiAgICBoZWlnaHQ6IDEuOHZ3O1xcbiAgICBtYXJnaW46IDAgYXV0bztcXG4gICAgbWFyZ2luLXRvcDogM3B4O1xcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMTYyLCAyNDcsIDI1NCk7XFxuICAgIG9wYWNpdHk6IDA7XFxufVxcblxcbiNvbmUge1xcbiAgICBtYXJnaW4tdG9wOiAyLjB2dztcXG59XFxuXFxuLmNpcmNsZVdyYXBwZXJ7XFxuXFx0ZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLmNpcmNsZSB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgd2lkdGg6IDd2dztcXG4gICAgaGVpZ2h0OiA3dnc7XFxuICAgIHRvcDogMjIlO1xcbiAgICBsZWZ0OiAyNCU7XFxuICAgIHotaW5kZXg6IDk5OTk5OTk5OTk5OTk5OTtcXG59XFxuXFxuI2NpcmNsZV8wIHtcXG4gICAgYmFja2dyb3VuZDogdXJsKFwiICsgcmVxdWlyZShcIi4uL2ltZy9jaXJjbGVfMC5wbmdcIikgKyBcIikgbm8tcmVwZWF0O1xcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogNTAlO1xcbn1cXG5cXG4jY2lyY2xlXzEge1xcbiAgICBiYWNrZ3JvdW5kOiB1cmwoXCIgKyByZXF1aXJlKFwiLi4vaW1nL2NpcmNsZV8xLnBuZ1wiKSArIFwiKSBuby1yZXBlYXQ7XFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcXG4gICAgYmFja2dyb3VuZC1zaXplOiA2MCU7XFxuICAgIGFuaW1hdGlvbjogOS41cyBsaW5lYXIgMHMgbm9ybWFsIG5vbmUgaW5maW5pdGUgY291bnRlckxvY2tXaXNlUm90YXRlO1xcbn1cXG5cXG4jY2lyY2xlXzIge1xcbiAgICBiYWNrZ3JvdW5kOiB1cmwoXCIgKyByZXF1aXJlKFwiLi4vaW1nL2NpcmNsZV8yLnBuZ1wiKSArIFwiKSBuby1yZXBlYXQ7XFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcXG4gICAgYmFja2dyb3VuZC1zaXplOiA5MCU7XFxuICAgIGFuaW1hdGlvbjogOS41cyBsaW5lYXIgMHMgbm9ybWFsIG5vbmUgaW5maW5pdGUgY2xvY2tXaXNlUm90YXRlO1xcbn1cXG5cXG5cXG5ALXdlYmtpdC1rZXlmcmFtZXMgY2xvY2tXaXNlUm90YXRlIHtcXG4gICAgZnJvbSB7XFxuICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDBkZWcpXFxuICAgIH1cXG4gICAgdG8ge1xcbiAgICAgICAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpXFxuICAgIH1cXG59XFxuXFxuQC13ZWJraXQta2V5ZnJhbWVzIGNvdW50ZXJMb2NrV2lzZVJvdGF0ZSB7XFxuICAgIGZyb20ge1xcbiAgICAgICAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpXFxuICAgIH1cXG4gICAgdG8ge1xcbiAgICAgICAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKVxcbiAgICB9XFxufVxcblxcblxcbi5jb3ZlcntcXG5cXHRkaXNwbGF5OiBub25lO1xcblxcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5cXHR3aWR0aDogMTAwJTtcXG5cXHRoZWlnaHQ6IDEwMCU7XFxuXFx0dG9wOiAwO1xcblxcdGJhY2tncm91bmQ6ICMwMjA2MmQ7XFxuXFx0b3BhY2l0eTogMC44ODtcXG5cXHR6LWluZGV4OiA5OTk5OTk5OTk7XFxufVxcblxcbi5xdWl0e1xcblxcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5cXHR0b3A6IDQuNiU7XFxuXFx0bGVmdDogOTQlO1xcblxcdHdpZHRoOiAydnc7XFxuXFx0aGVpZ2h0OiAydnc7XFxuXFx0YmFja2dyb3VuZDogdXJsKFwiICsgcmVxdWlyZShcIi4uL2ltZy9xdWl0LnBuZ1wiKSArIFwiKSBuby1yZXBlYXQ7XFxuXFx0YmFja2dyb3VuZC1zaXplOiAxMDAlIDEwMCU7XFxuXFx0Y3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyIS4vc3JjL2Nzcy9lbmQuY3NzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMyIsImltcG9ydCAnLi4vY3NzL2VuZC5jc3MnO1xuaW1wb3J0IGFqYXggZnJvbSAnLi9BamF4LmpzJztcblxudmFyIHcgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xuLy92YXIgaCA9IHdpbmRvdy5zY3JlZW4uYXZhaWxIZWlnaHQ7XG52YXIgaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbnZhciBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuXG4vL+WKqOaAgeiuvuWumuaAu+S9k+mrmOW6plxudmFyIG1haW5XcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW5XcmFwcGVyJyk7XG5tYWluV3JhcHBlci5zdHlsZS5oZWlnaHQgPSBib2R5LnN0eWxlLmhlaWdodCA9IGggKyAncHgnO1xuXG5cbnZhciB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpO1xudGl0bGUuY2xhc3NOYW1lID0gJ21vdmluZ1RpdGxlJztcblxudmFyIGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy55ZWxsb3cnKTtcblxuYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKCkge1xuICAgIGJ0bi5jbGFzc05hbWUgPSAncHJlc3NZZWxsb3cnO1xufSwgZmFsc2UpO1xuXG5idG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uKCkge1xuICAgIGJ0bi5jbGFzc05hbWUgPSAneWVsbG93Jztcbn0sIGZhbHNlKTtcblxudmFyIFVGTyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5VRk8nKTtcbnZhciBibHVlTWV0ZW9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJsdWVNZXRlb3InKTtcbnZhciBwdXJwbGVNZXRlb3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHVycGxlTWV0ZW9yJyk7XG5VRk8uc3R5bGUudG9wID0gJzQyJSc7XG5cblxuLy8gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4vLyAgICAgaWYgKFVGTy5zdHlsZS50b3AgPT09ICc0MiUnKSB7XG4vLyAgICAgICAgIFVGTy5zdHlsZS50b3AgPSAnNDUlJztcbi8vICAgICB9IGVsc2UgaWYgKFVGTy5zdHlsZS50b3AgPT09ICc0NSUnKSB7XG4vLyAgICAgICAgIFVGTy5zdHlsZS50b3AgPSAnNDIlJztcbi8vICAgICB9XG4vLyB9LCAxMjAwKTtcblxubW92aW5nKFVGTywgJzQyJScsICc0NSUnLCAxMjAwKTtcblxuZnVuY3Rpb24gbW92aW5nKHRhcmdldCwgaW5pdCwgcmFuZ2UsIHRpbWUpIHtcbiAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRhcmdldC5zdHlsZS50b3AgPT09IGluaXQpIHtcbiAgICAgICAgICAgIHRhcmdldC5zdHlsZS50b3AgPSByYW5nZTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuc3R5bGUudG9wID09PSByYW5nZSkge1xuICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRvcCA9IGluaXQ7XG4gICAgICAgIH1cbiAgICB9LCB0aW1lKTtcbn1cblxuXG4vL3dlYlNvY2tldFxuLy8gdmFyIHdzID0gbmV3IFdlYlNvY2tldCgnd3M6Ly93eC5pZHNibGxwLmNuL2dhdmFnYW1lL2NldC9sdWNrP3R5cGU9MScpO1xuXG4vLyBmdW5jdGlvbiBnZXRNZXNzYWdlKGV2ZW50KSB7XG4vLyAgICAgdmFyIGRhdGEgPSBldmVudC5kYXRhO1xuLy8gICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuXG4vLyB9XG5cbi8v5oq95aWWXG52YXIgYmlnUHJpemVIZWFkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JpZ1ByaXplSGVhZCcpO1xudmFyIGJpZ1ByaXplTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiaWdQcml6ZU5hbWUnKTtcbnZhciBzbWFsbFByaXplSGVhZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbWFsbFByaXplSGVhZCcpO1xudmFyIHNtYWxsUHJpemVOYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNtYWxsUHJpemVOYW1lJyk7XG5cbnNtYWxsUHJpemVOYW1lWzBdLnN0eWxlLm9wYWNpdHkgPSBzbWFsbFByaXplTmFtZVsxXS5zdHlsZS5vcGFjaXR5ID0gMDtcbnNtYWxsUHJpemVOYW1lWzJdLnN0eWxlLm9wYWNpdHkgPSBzbWFsbFByaXplTmFtZVszXS5zdHlsZS5vcGFjaXR5ID0gMDtcblxuLy9iaWdQcml6ZUhlYWQuc3JjID0gJ2h0dHA6Ly9pbWcwNS50b29vcGVuLmNvbS9pbWFnZXMvMjAxNjAxMjEvdG9vb3Blbl9zeV8xNTUxNjgxNjI4MjYuanBnJztcblxuYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcHJpemVEcmF3LCBmYWxzZSk7XG52YXIgdGltZSA9IDA7XG52YXIgdXJsID0gJ2h0dHA6Ly93eC55eWVrZS5jb20vMTcxMjE1Z2FtZS9tYXN0ZXIvbHVjaycgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuXG52YXIgZGF0YU9iajtcblxuZnVuY3Rpb24gcHJpemVEcmF3KCkge1xuICAgIHRpbWUrKztcblxuICAgIGlmICh0aW1lID09PSAxKSB7XG5cbiAgICAgICAgYWpheCh7XG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgZGF0YU9iaiA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgYmlnUHJpemVIZWFkLnNyYyA9IGRhdGFPYmouZGF0YVswXS5oZWFkaW1ndXJsO1xuICAgICAgICAgICAgICAgIGJpZ1ByaXplTmFtZS5pbm5lckhUTUwgPSBkYXRhT2JqLmRhdGFbMF0ubmlja25hbWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvL2JpZ1ByaXplSGVhZC5zcmMgPSBkYXRhT2JqLmRhdGFbMF0uaGVhZGltZ3VybDtcbiAgICAgICAgLy9iaWdQcml6ZU5hbWUuaW5uZXJIVE1MID0gZGF0YU9iai5kYXRhWzBdLm5pY2tuYW1lO1xuXG4gICAgICAgIC8vIFxuICAgICAgICAvLyAkLmFqYXgoe1xuICAgICAgICAvLyAgICAgdXJsOiB1cmwsXG4gICAgICAgIC8vICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgLy8gICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIC8vICAgICBkYXRhVHlwZTogXCJKU09OUFwiLFxuICAgICAgICAvLyAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAvLyAgICAgICAgIHZhciBkYXRhT2JqID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICAvLyAgICAgICAgIGJpZ1ByaXplSGVhZC5zcmMgPSBkYXRhT2JqLmRhdGFbMF0uaGVhZGltZ3VybDtcbiAgICAgICAgLy8gICAgICAgICBiaWdQcml6ZU5hbWUuaW5uZXJIVE1MID0gZGF0YU9iai5kYXRhWzBdLm5pY2tuYW1lO1xuICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgLy8gICAgIGVycm9yOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIC8vICAgICB9XG5cbiAgICAgICAgLy8gfSk7XG4gICAgfVxuICAgIGlmICh0aW1lID09PSAyKSB7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbWFsbFByaXplSGVhZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc21hbGxQcml6ZUhlYWRbaV0uc3JjID0gZGF0YU9iai5kYXRhW2kgKyAxXS5oZWFkaW1ndXJsO1xuICAgICAgICAgICAgc21hbGxQcml6ZU5hbWVbaV0uaW5uZXJIVE1MID0gZGF0YU9iai5kYXRhW2kgKyAxXS5uaWNrbmFtZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgc21hbGxQcml6ZU5hbWVbMF0uc3R5bGUub3BhY2l0eSA9IHNtYWxsUHJpemVOYW1lWzFdLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICBzbWFsbFByaXplTmFtZVsyXS5zdHlsZS5vcGFjaXR5ID0gc21hbGxQcml6ZU5hbWVbM10uc3R5bGUub3BhY2l0eSA9IDE7XG5cbiAgICB9XG59XG5cbi8v5oq95aWW6K+m5oOFXG5cbnZhciBiYXRlcnJ5Q29sb3IgPSBbJ3JnYigxNjIsIDI0NywgMjU0KScsICdyZ2IoMTYyLCAyNDcsIDI1NCknLCAncmdiKDE0OSwyMjYsMjUxKScsXG4gICAgJ3JnYigxMjUsIDE4OSwgMjQ2KScsICdyZ2IoMTAzLCAxNTUsIDI0MSknLCAncmdiKDgyLCAxMjIsIDI1NyknLFxuICAgICdyZ2IoNjIsIDkwLCAyMzIpJywgJ3JnYig0NywgNjcsIDIyOSknXG5dXG5cbnZhciBzaGluZTtcbnZhciBiYXRlcnJ5YWFhO1xuXG5mdW5jdGlvbiBiYmIoKSB7XG4gICAgdmFyIGJhdGVycnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm9kZScpO1xuICAgIGJhdGVycnlhYWEgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiYXRlcnJ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBiYXRlcnJ5W2ldLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAnICsgKDcgLSAxICogaSkgKyAncywnICsgJ2JhY2tncm91bmQgMC41cyc7XG4gICAgICAgICAgICBiYXRlcnJ5W2ldLnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgICAgICAgICBiYXRlcnJ5W2ldLnN0eWxlLmJhY2tncm91bmQgPSBiYXRlcnJ5Q29sb3JbaV07XG4gICAgICAgIH1cbiAgICAgICAgYmF0ZXJyeVswXS5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgIH0sIDMwMCk7XG5cblxuICAgIHNoaW5lID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKGJhdGVycnlbMF0uc3R5bGUub3BhY2l0eSA9PSAnMScpIHtcbiAgICAgICAgICAgIGJhdGVycnlbMF0uc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICAgICAgICAgIGJhdGVycnlbMF0uc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDJzJztcbiAgICAgICAgfSBlbHNlIGlmIChiYXRlcnJ5WzBdLnN0eWxlLm9wYWNpdHkgPT0gJzAnKSB7XG4gICAgICAgICAgICBiYXRlcnJ5WzBdLnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgICAgIH1cbiAgICB9LCAyMDAwKTtcbn1cblxuXG4vL+i/m+WFpeaKveWlluivpuaDhVxudmFyIGx1Y2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubHVjaycpO1xuZm9yICh2YXIgaSA9IGx1Y2subGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBsdWNrW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICBiYmIoKTtcbiAgICAgICAgY292ZXIuc3R5bGUuZGlzcGxheSA9IGRldGFpbHMuc3R5bGUuZGlzcGxheSA9IGJhdGVycnkuc3R5bGUuZGlzcGxheSA9IGNpcmNsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgdmFyIHVzZXJIZWFkID0gZGV0YWlscy5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcbiAgICAgICAgdmFyIG5pY2tuYW1lID0gZGV0YWlscy5xdWVyeVNlbGVjdG9yKCcjbmlja25hbWUnKTtcbiAgICAgICAgdmFyIG5hbWUgPSBkZXRhaWxzLnF1ZXJ5U2VsZWN0b3IoJyNuYW1lJyk7XG4gICAgICAgIHZhciBzdHVkZW50TnVtID0gZGV0YWlscy5xdWVyeVNlbGVjdG9yKCcjc3R1ZGVudE51bScpO1xuXG4gICAgICAgIHZhciBuO1xuICAgICAgICBzd2l0Y2ggKHRoaXMuaWQpIHtcbiAgICAgICAgICAgIGNhc2UgJ3N0YXInOlxuICAgICAgICAgICAgICAgIG4gPSAwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgICAgICAgbiA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdiJzpcbiAgICAgICAgICAgICAgICBuID0gMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2MnOlxuICAgICAgICAgICAgICAgIG4gPSAzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgICAgICAgbiA9IDQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIG4gPSBudWxsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdXNlckhlYWQuc3JjID0gZGF0YU9iai5kYXRhW25dLmhlYWRpbWd1cmw7XG4gICAgICAgIG5pY2tuYW1lLmlubmVySFRNTCA9IGRhdGFPYmouZGF0YVtuXS5uaWNrbmFtZTtcblxuICAgICAgICBpZiAoZGF0YU9iai5kYXRhW25dLnJlYWxuYW1lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG5hbWUuaW5uZXJIVE1MID0gZGF0YU9iai5kYXRhW25dLnJlYWxuYW1lO1xuICAgICAgICAgICAgc3R1ZGVudE51bS5pbm5lckhUTUwgPSBkYXRhT2JqLmRhdGFbbl0udXNlcm51bWJlcjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9LCBmYWxzZSk7XG59XG5cblxuXG4vL+mAgOWHuuivpuaDhemhtVxudmFyIHF1aXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucXVpdCcpO1xudmFyIGNvdmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdmVyJyk7XG52YXIgZGV0YWlscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXRhaWxzJyk7XG52YXIgYmF0ZXJyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iYXRlcnJ5Jyk7XG52YXIgY2lyY2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNpcmNsZVdyYXBwZXInKTtcblxucXVpdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBiYXRlcnJpZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm9kZScpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmF0ZXJyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJhdGVycmllc1tpXS5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBjb3Zlci5zdHlsZS5kaXNwbGF5ID0gZGV0YWlscy5zdHlsZS5kaXNwbGF5ID0gYmF0ZXJyeS5zdHlsZS5kaXNwbGF5ID0gY2lyY2xlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSwgMjAwKVxuICAgIGNsZWFySW50ZXJ2YWwoc2hpbmUpO1xuICAgIGNsZWFySW50ZXJ2YWwoYmF0ZXJyeWFhYSk7XG59LCBmYWxzZSk7XG5cblxuXG4vLyB3aW5kb3cub25iZWZvcmV1bmxvYWQgPSBmdW5jdGlvbihldmVudCkgeyBcbi8vICAgICBhbGVydCgyMzMpO1xuLy8gfTsgXG5cbi8vIHdpbmRvdy5vbnVubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xuLy8gICAgIGFsZXJ0KCdoYWhhYWhhaGFoJyk7XG4vLyB9XG5cblxuXG4vL1RoZSBlbmRcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9lbmQuanNcbi8vIG1vZHVsZSBpZCA9IDQwXG4vLyBtb2R1bGUgY2h1bmtzID0gMyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2VuZC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vZW5kLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9lbmQuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jc3MvZW5kLmNzc1xuLy8gbW9kdWxlIGlkID0gNDFcbi8vIG1vZHVsZSBjaHVua3MgPSAzIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiZDBkNjdjYzQzZTg2MzBkMzI0ZTcxYzIxMzJjZGE0MDIucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW1nL2VuZF9iYWNrZ3JvdW5kLnBuZ1xuLy8gbW9kdWxlIGlkID0gNDJcbi8vIG1vZHVsZSBjaHVua3MgPSAzIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiMmIyNGZiNTRmODI5NGMwOGIwZDQ4M2ZiMmIwNjg3ZDcucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW1nL2VuZF9iaWdQbGFuZS5wbmdcbi8vIG1vZHVsZSBpZCA9IDQzXG4vLyBtb2R1bGUgY2h1bmtzID0gMyIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjM2ZDEyZGEzNjM0ZmY2Mjk1MzM4OGEyYTdjOGZkY2Y3LnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltZy9kZXRhaWxzXzEucG5nXG4vLyBtb2R1bGUgaWQgPSA0NFxuLy8gbW9kdWxlIGNodW5rcyA9IDMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEb0FBQUE2Q0FZQUFBRGh1MG9vQUFBR2tFbEVRVlJvZ2IyYnoyOVVWUlRIUDNkbSt0TkN5MURhYXRwb1NpT2lhRjJpUVdOMEFheUlqWWxydzhZWUU5RzFZa1gvQUlLSllZRTdGeTdrMThxZ0NmNkN4SVNOSVlKSWFCVUt0STIwbEVJN0hkcVo2Nkl6NDVzNzUvNTZiZndtTCsrKzgrNDk5M3pldWZlK0g1MnFveGMwNnlpMW5zNkFkUXN1dDhiMklXQ2g4QktVMlRZMWVGcFFXL0ErS0ZmZ1Vsc1RURm5zWHNXQ1NzR0Uya0w5d1g4Z1NyQWw3Y0hBTWFCbVVMSEhvZExJZ0FvNXcwR3dJYUMraklXVTB5b0piWmJOZnB6QVB0RFFyTGtBUTRCdGdadmwxTmwxZ2JvQ2xzcHJ5YXdacEEweUpMc2lyQTAwQk5JRnVGNUQySnl2U1pzdHV5SnM3QnoxUWJyT3A1VUpaTzdCa2NtcUpORFFJU3J0MDJaVXlweXRUZ2hzQTdnSjZuc1E4TUg1aHJGTnljQjh3OVVGYS9NWnRCakZRc1ptMWpZMGJWbE9BMTBIbW1hWWhvSzZzaHA2MDNldHhON2hITE1ZK1NCRGhuRklYNjRGeGdkclZSVTA5QmJoZy9SbFU1cDdWWHZRL1pDd0I0a0dtMjB4OHMyMzVEa1hxRy9vMmdMMlNRSnorb2w1TXFyYXBDMWpPYzlZbnY3NVZ0NG9LWFpweFRhZ0cxaFdjQnZOUkZaemZrT1JrME16WEU4RUdRdWNqRThjSmFyeWhTRjBKUTNleHZNTTNHM2pZRm14RDhnQ0Q1WG1Md1hUd0VNTld5cmdyVUE1b3ptMXFjQ2h3VmttRXJBeEc2NXl6b0RCVWphSHBRMCtBM0N4ajczRkhFZUJEcVg1dGJuRXNjZnU4MFAzQWc4UzdibmZRdlAxTGw1YXl2Rk9XVEV5MDg3dSt5MjhQenpKY2V5UzNsVk5lOFBRVmtjdjZOaFYxUVNycy8zMktHOHZaL2tVbUd0ZDRjQ3pVNXl4QkZZWDRPKzl2RnBvNGdqUTNWVGk0UE9UZkVGajFzcUN6WmJWNUhGdGJsWGxXM0NrQzFHelhleGpaRG5MWndxdWJWNWtUd1hTckd0S0FXckhOR2UzTExCYmFhNHVaemwwc1k4Uld6K1dXS1RZYXpKQms0MXRRVW1kcXZFOEE4VWNoNEYvdGp6Z3pjSFoydUlpQlNSZXJDZnVjcXZ2QVNQQVpESEg0YkU4L2E3NmpoZ2J6a21nUG9rZDNtM2pJK0NSdG1YZWUzeU8yOVJEbW0ydGkxNy9QZTYwTC9NdTBEN1h4cWpEUjVTU3R3VkpVbERtZWNieURKUVZyMmMwUCsrWTVxeFEzeGFjNUZzOU04MzVqT2I3c21MZldKNEJWOThPMzNYMVhCbDFqZm02QU9kYkdRRXlMU3NjQy9Uam5FOEFMU3Q4Q1dRcXZsMTNCSmZmbXRJTzNUcVZGTHVBNHNBOWZzU2RmZDhjcTlrR1p6a0hMRlI4dTlvRUtRbWF4b2tDMElydFN2Tm41eEpGNmJ5dnZXUnZYMlpGYWE1cHhmYUlkdFo2YVRJcWFiTmFmZUx4ZGhoVFI4RVVzRG5DaDFYckJmcC9LUGlydktUMUFwM1IwT000SC9waWJScDZnWm5VVVNXVUJFMXp4VmJmQ0RSWHRHTGJmQXROaGg5YjJkZW5MalNSMVlvaHBma2pvcDIxWHBxTU5uU1MxZndDdE43bzRoVlBNTkt6YWJKdXpUYWU1d1dnSTZzNUo1MlBsUXRVK295UkxOYzYzMWprSkZBdTVuakw0c2NWb0FpeGxHTS9VSzc0ZHNVUjFFOG1VY2tXUk1PYmdOblIxaGx1WkRTbnk0clhMdlh5c3FXKzl3MmpXcjdjdzg2eVltOUdjM3JyRERjQ2Zka2t2cjJFU0J4Mm13cDhBaXdzTm5Ia1ppZmRqa0NjSStWbUovbkZaajRIRnJzS2pPSy8yRko4RFpKQVhWZEl1cW9hMElPelREU1hPQUQwVFhWd2ZLS1RIbGQ5b1I5OWF5T2JwanI0V3NOQWM0a0RXMmU1YWZRYmxjV2tURkRwYXZ0ZWJHdTI0VWxPTkpYNFVDdWVuTnJBdDVkNjJXV3AzK0Q3Y2c4N0p6ZnluVlk4bHl2ejhmQWtKeHg5dStJVFdWeGZHSkpsNlMybTRldENkVXQrU3Nsb3pyU3M4RlgvUEQ5MUZlb2ZFUXROWk1menZMaVVZMzlac1FkWWJDN3h3ZkFrM3dnUTVoY0dLc2Ntc0hsQmRCWFVCMmtEZG01amVmcm4yaGl0ZkJ6TEFBV2x1VnA1VkZ6UzBLY1ZUd01kckg0Y085MVZZTFF5WEczRHZBcHJ3dGtBYTJVSlZJSk1CUXNObnp1Zll2VnpKOEFkcGJtUzFaemJVT1RVMEF4L0MwR0diZ2h0NjJ3bXFBUVpDMnpXd1dodnlqYm5Rb0N0WUtaZjJ3ZHNYUW1zV2xrbGJHWndwcEx0UXR1SXdYazIwNmRrcXltWE9LbU1zczFtd2tnQksrTVl3akphUFhabDFXd1haQXY1YTVvSjdvS1ZMbzZ0cnRuTzNBY3RNc2JlcWlTb0s2c3hzTGIyMWZwbVBiTWNBaDJ5cnl1N01ob0ttMVJvNWx6bmZJdFR5TDVCSnFnNXYweDdLTFJ0UWJMSk5rK0oyRHQ5U2htMXpiT1l6Q1lWVXNjTXpIcWJzT3hkWlNCdU1VcVdiU3Z6V2hRTDVBUXo1YnVQU3NjaHc5WGx5OWFmN1RnMmV5SjB5R0prT3JBOVNQaFdZcGRzRjhncys3SVl2QmhKRGFWYlF1aURST3l3RHNtc3paK3pqOUE1Q3VIWnhYSWNxbEJZbDYxQk1iL0F0bVVYMWcvUzlHczc5dGtiRlB1YmV0OFRqbStvdXA2TVhQMkYycTFLKzE4U1B1Q2twQ0h2OGhuU2I3VFcrbjh2MGkzR1YyY3QvbFByWDg5cUxjWmROa3VuQUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW1nL2NpcmNsZV8wLnBuZ1xuLy8gbW9kdWxlIGlkID0gNDVcbi8vIG1vZHVsZSBjaHVua3MgPSAzIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRVlBQUFCR0NBWUFBQUJ4THVLRUFBQUhJa2xFUVZSNG5PM2NlNHhjVlIwSDhNOU9rYmEwV3NBdURiVFdVb2dQbXFMZ0E1QmROSWdGZ3BBMG9iNHEwclFTVFVxaW9pUW9QcUpJSkJoTmpEU0NpZGFFZDVHZ2FLSzBOZWkyTkNIbG9XTFJHSlVLaXhXYVZycFVZSzJkOVkvZm1jN3NkTGM3anp0enA3TitrODJkdVhmdU9kL2ZiOC9yOXppblo5V09FVGxnRnViak5aaVpyakNFZjJNUG5rN1hYSEJFRytxWWpyTndMczdFcWVpdDhkMWQrQjIyNGlFOGlMMHQ0SGdRZXRyUVlrN0VrNWlXUVZuL3hXK3dEbmRyWVlzcXRLcmdDanlGYjJLLzZCNS94ZlBwKzBRbzRwVjBKVnI0ZTNFTGRtQXQzcEl4WDdTK3hTekdaZmd3NWxYY0g4UTJvYlJkZUJFdnBHZEhpM0ZudG1odGk2cmUzWThwVmZYOERGL0diN01pM2dyRkZIQXByc2JiMDcxQi9Cd2J4Rmp4WEoxbHpzSFplQi9lcjZ5b0VmU2t6MFZjTHhUVU5MSlVUQTgraEsvZ2pSakdYZmdoTml0M2gyWlJRQjlXaXBaNHBMS0NWcVg2TXFra0M1d2lab3c3eEgvejJ6Z0pLekFnTzZWSVpRMmtzaGVtdWw1Snp6NG11bDdUYUZZeEJWd3IrblkvZmlER2hjL2kyU2JMcmdYUHBycGVuK3J1eCtQNG9pWmxhK2JsWHZ3Q1g4ZjJST3JqMk5rTW9RYXhNOVhkbjdoY2w3alZ1bDQ2Q0kwcVpqRWV4UkxjanJkaFM2TWtNc1FXbkM0NExjRmpnbXZkYUVReGZkaUVFM0FsUGlxbTIwN0JYc0hwU2h3dnVQYlZXMGk5aWprREQyQXFsbUZOdlJXMkVXc0V4Nm1DOHhuMXZGeVBZaGFKaGRRVVhJejc2cWtvSjl3bnVFNFIzR3Vlc1dwVnpCejhFc2ZpQTloWUo4RThzVkZ3UGxiSWNGd3RMOVdpbUNuQ2FKdUhUK1ArQmdubWlmdnhLU0hEcldxUXV4YkZYSXR6Y0NkdWFvWmR6bGdqRnFCTGNNMUVQeDdQSkZpSlAyTzNXTHc5SmV5ZVRwcDlHc0dyOFloWWhKNG1ETmt4TVZhTFdTQzBPeUFHckNOd2hjTmZLWVFNVndpWjFpZ2JvQWRoTE1WY28reFVXb2piaEpLNkJRTkNwbmNMbzNkTVZIZWx1Zmlic0ZqM0NvMmVqSCsyakdZK21JTy9DRnZyRkdNWXVkVXQ1bk5DS1lTejZQdTZUeW1FUCtpN3dqMXk2VmcvcUd3eDAvRVA0VUViRWl2R2hlbGVONklYZjhjZmhhMDNDcFV0WnFsUUNoSE91RWYzS29Xd3lPOFZSdWM3cWg5V0ttWlp1cjZjcnJlMmxsZEhvQ1RqOG5TZEwzck9BY1ZNdy9ucGMxRzBsTU5wMmQ4b05ncFpsK0ZyK0JQZVJWa3hmWkttTUFNL2xhMDdzbE5SRkxLZWdNOExIWnhMV1RIOUZUK0U5ZTFrbHpOS3NwYkcwek1wSythZDZUcVVyZysxaVZRbm9DUnJhWHBlVEZreGl5c2VQaTBmdjIxZTJJbG54UEtFbU1abkZjUkNibTY2T2RNaERLc3V4aC93Mm9ydjh3dDRYY1dOVndrdisyVERkaUY3Q2NjVmpOWVUzV2tDVElUcWtQRXhCZUdqcU1UdU5wSHBKT3lxK241a2FZeXBSQzNwR2QyR2FwbUxCYVA3MXY4UmVMR0FmVlUzcTd2V1pFQzF6SHNLeWdrN0pWUjNyY21BYXNXOFVIRHdZRHU3VFdRNkNaVXo4d2kyRjR4ZXQrd1R6dkRKaGdYS0EvQWc5aGJFVkZYS2ZoeVNVZUxOWVlaRklnT01DQnNkc0pXZVNOY1I0YXhwT0sva01FU3ZrTGtVR2RsS1dUR1BwbXNwUS92czl2SEtIU1ZaUzdwNHNQTExGdEZhZnBXK0wya2ZyOXhSS2V0L1JDTGxBY1ZzRUo2cmkwU3M1V0x0U1k3T0d6MUMxdExBdXdrdlVSYitYL2kxYURVL0Zsa0JrNkU3OVFsWlN3blY5NVFlak5VcWJrL1hWUzBtMVFsWVdmSDVaWkh1Z3JFVnMxV2toSDVRNUxCMUszcEY3THJrMGx3bmVnN0dIMGR1Rk5QWDFTMmxsaTgrSTJUc0VVR0FHeW9manBjZlV4Q2h5N2tpdzd2ZTNQOU94eHl4QytZb29aaDdWY1d3eDJzeFJSR0FtaUZhVDdmaFJpRmJqNWlScnF2K3dhR201RHRFTHNsbEl0V3NXOUF2WkJvUUU4d05ZaGZkS0V5MCsyU1JHSWk3SmRWc3BsamxONVJxVm9sdFlxL0FHM0J6VnV4eXhDMUNscSthSUV4VXkrcjJldEhzUG9MVlRWUExENnVGRE92eGpZbCtYSXRpOW9zRTRrRjhCNWMwd3k0blhDSzRENHJ4WmNLRWhWcnRvZWR3Z2ZEMjNZM3pHaVNZQjg0VGk3ZmRRb2JuYTNtcEhrTnhtekM0aWlMTmRXbWRCUFBBVXNGMXYrQmVjL2k1WGd2NllaRmdOQ3dNcms0ZWMxWUxqc09DODhQMXZOeUlhMkd6V0F2c0VDbjB0K21zeU1KTXdla213ZkVjeWNkU0R4cjF1VHdoa3ZyV2kveTFSOFF4QlhuakxHRUVMeGZjVHNmdkd5bW9HV2ZVVGx5SUx3bDdhck5ZNitRUmZwbU43eVVPSnlkT0Yyb2l6NmRaTDExUkxBRGZLc0l3bnhDcjVHOXBqOHZpK0ZUWGRueFNLT2EweEttcEhNS3MzSmZIaUdYMlNQcTdTaWhvcmVqaldicEpDNm5NdGFtT3E4VDZaRG5lSTVLQW1rWld4NlM4U1d3S242NGM3aHdXbThaWEtCOWg4SURJZWF1M2lmY0tWK3Y1Umg5aDhMaXdsTmZKT01zMHl5TU1GdUFMdUZ4NVB3TGhNaXdLTTcrRVo4VFJLYlVjZXZGbUVmY3BZVkFvNGtmSzhiRE0wWXBETCtZSjc5Z0tzUSt4RWlNaTZqa2lXdFpFTFhhZmlJNFdoY0kyaUVoR3k5SEtZMUttaXBuaGNoRzdPU3FETWtmRVBxTk5HWlIxU0xUeUtLWmgvQ1Q5VFJPTHdqNngvL2xVdGM5YVE2TExQQ1ptblNjelp6b0cybkVVMDNpWUljYWxvOVBuV2VuK1MySVQyUjRSL01zbDUvaC9WYU9PRURsTVh1b0FBQUFBU1VWT1JLNUNZSUk9XCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcvY2lyY2xlXzEucG5nXG4vLyBtb2R1bGUgaWQgPSA0NlxuLy8gbW9kdWxlIGNodW5rcyA9IDMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFGd0FBQUJjQ0FZQUFBRGo3OUpZQUFBUWNVbEVRVlI0bk8zY2U1UVUxWjBIOE8vM3h3QkdrUUVVUldYY1FVQUJZUkF3Wm5lalJ3V2pZRnhValBHeHNrWU5pNGd1UGhCUXo0WXp5WWthVERhYmM0dzZHZ1ZVQkxNSzY3b0tvdmlJdXA0VDF6VXl3eHNFTXdReHlHTVFVV0M4My8yanEzdXFxMi8xZFBmMHpQQ1lldzVXOWIyM3Fybys5ZXRmM1hvNFBISFVMYUFSb0lGR2tKRjVzMkJLTUtnSENTYnJ3L1BCTkx5K3h0clQ2eTNvbjlnV2d2YUdlaVBJTHBIMkhUUVRtTkUzdEs2WWZVcjdicDUrNGZXa1BnZmJEdVpQZS9mM3lLZVU3SWZZUjVNMkJNYkJKUHZSckJmSW5qUTdGbVJwek1Hb0kva1p6VGFDM0VDekZTQS9vdkZEa3A4M0Z6Ykl2TEFCb01TNzh5MkwzWmxtSTBDZVQrUFpwUFdEa2RGdFpvMThzcFJtcFNCUGprUzJRRnRKNDFza1g0WFpheVIzNW8yZDNGNEVtNFdBdHhKMlI1aGRRdklxbW8wRTJURWRNeS9zYkdtRU5QWW4yUjltTjVMY0EzSVJ6ZWFSWEFEam5pWmhGd1NlTDdhbmJ4N1lKNUdjQ0xNZmtlem14eXdhdGkrTmRLVFp4U1F2aG5FYnlWbWdQVWpqK2tLd2FaWTN1TFVRZG44YTU1SmNEYlBiaTROdFRUMUJkZ1B0ZGhyWGtKd0hzbi9lMklWR2VETmlId2ZhREJxdkptbWVFMlFjZGgzSS82T3htclExU0VUZ0pwcHRCZmxGcUc4bm1oMlJtUEpZa3IxQTYwdmpJSkpEWVZhYXd3bXlIY2dyYUhZNXlHZElUb1Z4VXk3WUJlZHdzRURzK0p6ZW5zWTdRTHVIeGs3K0lWNGE5ajRhMzBBaXZ5NEJXVU9qaTQvczFEYTNwNjBySE9WbVJuSWd5QkUwRzBueVhCamJaOG5aUnZJYUdDOGgrWFBTZmdWeVgxYnNRc0NiQVhzWWpVK0FWaEUvbms3Vi81RzBwMmljQzNKcmJta2tKdVdrWTRPa0E3bVVaa3RKL2hyR28waGVCZHBZR3MvSWtyTTdrWFlmeUt0b3ZCN2tCM0hZaFVTNDVZUnRPV0VieWFrMHZ0Y0lkajFwczJFY1NOcDNhSHl3R2JCOWFXUnJjSUw4VGhENVQ5S3NQb0lkWGw4RnlQZElUZ05wWG13ckFEd25iRGFLM1pYa2l6VGVEMXI3R0xTOU5ENUMyc2t3L29pMFpkbFBrSllidG5td0xXdk9Cc2hsTkxzVzVNa2tINEZ4YjB6T2JnL3lQcHE5Q0xKckZMdkFDRzh5OXNrazM2Znh3b2FkeXNCK25jYkJwRTFJbkFBYkc0MkUybk1adVVTeG1SVTduQnJXd3ppQjVHRFNsa1N3dzMwdkpQbCtjSUJDNnkwRVBFOXNtb1g3ZnBma2V6VDJqc0hlSE9UQ0VhU3RqUHMxdFJKMk9JMnNCSGtlalZlQjNCeVRzM3VUZkEvRzd6WXBoK2VMM2ZCbDdYeVNpMm5zRm9QOUNzZ0tHdWZGamJQRFNLMklIVTRqODBoV2dId2xKbWQzSTdrWTVQbE5pUEFzbCtBeDJLZFBtelM4ODRrOUg2ZnhjRmdHZGozTnBvRWNSZU9XQXdnNzJYY0x6VWFCbkVZeTQ2UUs4bkNTTDRJYzNvUlJpZ2Vic2RpREFjenZlL25vbnAzS1R0aWMrdUtKWmJiVDdIeVF2NkJSMmJFdEorek1sSk9jYnhic1pGK1IvRVVReWR2RE9UdVlkaUE1SCtScGVZUG5pZDBId0tzQVN0bXVIZnBlTnJwSHB4T08zeHg4b1kwME94UGtHMW11SVAyUm1RVWJYbXlpR2JIRHVHOEVPWHRqUm5vaFMwa3VYam42eGo1NVIzaWoyRWFjUG0xU1Z3QUxBWFJQTHN4MmhqNWpMdXBSMnV2RUdwcWRCWEo1d2RqV0V0aVdEM1p5dlN0QW5rWHlZMDk3ZHhvWHJycjBwcTY1ZytlQ1BYV1NBWmdESU9Ob3NwMXQ3SFhSQmFOQmJtZ1NObHNDbS9saUp6OXZBRGtpTGRJYjJ2dVFuTFA2c3B0enVuVm9qV0dUQmdCVEFJenlMRjhINE1LbEQ4OWN6N2ljZk9Camg5RXZKRm5uYVI5RmNrck9FWjROZTlpVVc0WUNxUFFzdXcvQW1LVVB6NnlPUXJVY3RoV09iWmFKYmJIWXlXazFqR05JN3ZPMFY2NzU0YVRUR3dmUGp0MGV3RXdBSFR6TFRsbjY4TXpYV3hlYmhXTkhNYU9SNzVzbXR2VTZ5RHVqN1VpTVhKNVllK1Z0N2JPQ1o3dEhEZUJPQUJXZTVSWXNmWGptdnpjWjIxb0EyNHFLbmZ6OEc1RHpROWpKdGtGRTl0UmljZGpESnQ5OEFvQzdQTXRzQWpDdUtOaFJ4T2JBWnRHeGs5TnhJRGVsMVlFQWNmZTZxKzg0SVI0ODV1WVJnSHNCZFBJc003bTZhdmJXUXh3YklMZUJuQmpCQmhKWG92ZkdndnV3aDk1eFUzOEExM2o2TDZtdW1qMjNEVHMxLzU4Z1h3aGhKOXV2WGo5MlN1K1lDSTlFZGlKMy93UkFkRnk1QjhETmJkaVJPbkF5aUQyUmZpVWdwdnJCSTJQbm9iZE4rQnNBUC9EMG5Wbno2Sk1yVXllNlltSmI0ZGdzTm5ZalE4TUlObnJQKzdlMUlHZW05d05BWHJ2aDJtazlNMU5LQkFqQXJRQktJdjNxQWN4SUcxVVVFenMyVWh2SFJyR3hzN1JIc2NFRURza1pJT3REMkNEWUFlU3QzZ2hQYm1qSXJUY2VCbUNzSjdybjFQenVxZlZ0MkJIc1JJRGlwRG0vWEUveTZSQjJzQXpHZm5MOTNXbkJtL2JFQjhDbEFJNktZQXZBakZiRmpsd1Z0aXAyT0lvRDhFU1k0d0dRQ21HRDVERUFSNmFubE5ET0EvaWhKN3JmV2ZiRW5PV3RpaDNhMlZiSEJ0TGJnOUxyeVJuTENiNFR3a1ppSmoxanBNYmhwOTB5cmhQOE42aG1ocU1zdkdNOHhMSFRJanpSTmpPQ0RaS2ovenp1WHp0blJqaHdIb0NPRWV5OUFCYms5NXJiSVlRZDhRYXhnT1RlRURaQUhnYmdyTFFJRDFib2krNDNsOCtldDZQWTJNbGJ1ZEdVZE1CaFJ5SzhmT1o5T3dDK0djSk9ManU4QVR6WUNRQm5lOEJmYWc3c2pDaTNlTUJDc0ptQjB6ell6QWh4QUV5WUpiRkpna0FET0l5b3VQRzY3Z0JPOWtYNGdZanRoV3NPN0VpRUI4QnZockdEbVlyYThkT1BDaUxjQUdBUU1qTlNIWUNhVnNHMkltT2JOUSsySjhCQjFnQ29TNndqZFZBTXdMY1Q0SWwwMHMrejZJY3I1enpuV2dXYlJjWk9RaFVaTzlVM1ZFNTg3R2VPNUFjSVhZa0daVkJDUGhIaHAzakFQOHJFdGt4c3l4SGJtQ08ySFVEWXZoQUhBRlo3bWs0QmtpL2srL1AzbWt6c3VDak5BWnU1WW9lM2tUdDJCbUNxUDVvUE85WWJhenkxdllIa0tBWG82K213b1EwN083WXZwUVJsdmFldURBQktrTGpvaWQ0L0FZRE4yYkhUZi9iTmcyMForSEVuUC8vQjhTRVdFVHNlZkxPbjdtZ0FzQUhYWGxrQ29JdW53NVkyN0lLd0FlQnpUMTFwN2ZqcDdVc0FIQkd6VU4yQmdKMVlCenhwSnpPZEZCczdTMHFwaTZrL1BQcWdJYTBjMU5oaHRMUit5QU03YTVSN1NhUFBMZE5MRzNaMjdMeTlNeCtscFIrT0NIYmF3NHJXeHZhMlpTSjYwUk03MXpoMjVNQTBGUnVBRE1DWE1ZMmxiZGdGWTVmRzFPKzJOZi94UWoyQUhaN0dvOU94clEwNzk4ZysybE5YVjFaVnVTOTVhYi9WMCtHNGRPd3d5TUdPN2MvMWVhU1JIcDY2ejRHR20xZStTOUh5UXhjYjNpalBvL1R5MU5VbXdCTXJXKzNwMERjL2JHdkREdHRsbG84QkpGNVhCckRLMDZFaVArelFUaDdhMkVCd0t6WlNWZ0lORWI0eW8xa2FXbmJlMlJtdk15ZE9wQVZpVzY3WTFnTFk0VHhkUE96YThkTU53REJQVTNVQ1BKSERxNUY0NFNlSkRRR2xrQVptWXJOd2JPYUt6UmJBUnRHeGczSXFNb2VGRHNEN1FQQUFZc1BMcjIxQk1vOG5zQUVKRU01cHc4NjduT3VwcXk2cnF0d0tCQkVlUlBsYkVXd0ErbjdlMkhaSVl3UEE5ejExUzVJemx0eFpTQXNqMkpCMDluRi9kMGFYdkxCNTZHTFhqcC9lQmY3WFRkNUlnU2VIZmdLV1FOb1R3Z2FFanBBdWFUM3MrR2w2WGV0akIrVVNaTDY5dGdmQUgxTGdTWVNOYjd6OUJZUkZJZXdnbit2NjFzTkdidGpZTDdBQjREcFAzYUt5cXNxZEtmQTBQT2haaFZNS0JBaG5Iak9rWWtBYmR2WlNPMzc2QUlUZUlReVZaOE1mTEl3bmFRR0ViWkVvcDZRNzg4Vk8vVE1QY3ZUZWVxRnB4SWZObHNjT3lwMkpMNVJXdGdGWWtBNGV3dnYwdmYvOUd0Q1RhU2xGQXFCcmpqcjFsUEo4c0RQN0pOOFJ5WHpuSkJNWEtCZ2JMWTlkTzM1Nk9mei8xOS9zc3FyS3I5UEFHMkFTRUpKK0E2RStoQTBJSlJLbStyRXRSK3pNeUQ0WXNJTXlCWmtQYy9ZQytIVzBJMGMrKzI0S0lvbDB6SkNLdVpLdURMQ0Q5S0k5a2didlhQL0pxblJzNW9qTmd4VzdENEFhWkk1T0hpK3Jxdnh4dExObFhOU1lRZEpQQWJrUU5pUjFoUFRiTnV5TThvQUh1eDdBL2I3T0ZzVUdpYTAxSzFaQWVEcUVIVndRYWNTUlpTZGMyWWFkS2hjak1mYU9sbWZLcWlyWCtoYXdLSGJ5QzBxNkc5THVFRGFDbFA2ckk0NDd0bHNiTnJvQmVNaFR2eHZBUFhFTG1RK2JSdXhZdmU0dmtuNmVqaTFJT2g3UzczTEN0b01XR3dBZUJYQzhwLzdlc3FyS2pYRUxaZjRSMjlEUUQ5SURrS29WSGlJbXBwY2UxcTNycEVheFl5RVBlT3hKQUM3ejFGY0RtSkZ0UVl2RHBoRTdQNm5kSitFR1NIczkrZnlCRHAyUEhINElZZytQUWQwTDRJYXlxc3A5MlJaT25UVGpMbXAyL2VYVDl5Vk5qMkJEVW50STgwdSs5YTFCeGNVT28rNTMyQU1BeklmL1QxSk5MNnVxZkwreEZUU2NOR012YWdoSU15UXREQWJsNGRSU0N1bGxhMTlTWGp4czdLL1k1UUJlZ2Y4bG4wVklEQThiTFpaNmZoaURUUkpmZmI3VkFmcEhPSzJOcGhaSlBTRXRBVkYrc0dKWFB6S3JmT2NudFM4Q3lQaHpIQURXQXJpNnJLcnltMXpXWmJFampjakQzajNiNjdaTEdnVnBpd2Y5SkVodnUvcjYvZ2NoZG4vSi9XSER3dGNHZnZucDV1aUw5bHNBakNxcnF0eWU2L29zRit4a24zMWZmcmxXMHZtUTZtSWkvZDM2cjc0Kzl5RENQbGR5NzhxcFRQWGZZTzM4Lys2eGExTUt2UTdBQlhFWE9ISEYwckROZzIzaEEyTDRacy9lUDBrYUU5eGJTVWQzNmdwcDhkNHZkazNkVzdlVG1aRitZR0JYUHpxYjFZL01taXE1eGNFK1FjN0IxWCtEdGMrOTBHUFh4azBiQVl3QjhHRys2N1kwN0NoRzlBV2VvRjdmdU5jbGpRNWZpY3FsOEVzZzNTKzVsNy8rZkd2M0F4QzdPNXhla3R6OWNpcEpZa3NDRXVpN1Y4MWJjQU9BMXd0WnYrV0xuWXg0bWkyV2RBR2tiU0hzWU9vQXA1R1NsdTdlL05jckRpRHNLK0Qwa2VSR3BmWXBoQzFwdTV4R0RwczhjWEdoMnlqSkd6dlVyMTJIRHUvVWYvWDEzME42U1ZMdkVIWVN2NGVrZWJ0cU40MlROTEZ6cnhOWDdZL1lOWTg5ZFlya0hvVFRlWkpERFBZNk9ZMGVObm5pOHFac3l3ckZUazdiSDNINEtrbmZodlJ5QkR2NHNvS2tFWkpiV3JkdS9VUGJWNjhyMzErd2x6MytkSG5OWTA4OUpMbWxqV0F2bE5NWlRjVUd3c1BDTkZUTENUdVpLanFXZHQ0dXVYK0EwMTJTOWtXd0UxRXZkWkRUQkVocnRxMVlQV3RyellvQnVXR3o2TmpMbnBnellObmpUOCtTMHhySlRZQlRCeisyOWttNlMwNFhEWnM4Y1ZzeHRzMHhiNjd4WU1kRmZMWVJCd0FTdXpmL2RaaWttWEFhRk1KR1dwNVA3SkFrdlEybldaSmIwT09Nb1R2ODJDZ0s5b3JaODdwSXVsak9YUS9wTERteDRSZnB4YTZXM0hWRGI3L3BnMnpyTGF1cXpPdDc4TEszMWhZTk8vbDVWKzJtOXBJbVMrNXVTSjA4MktGZmdFczh2bk42UzlJaXlMMHFwK1U5enpuVE5RVjcxVFBQbVp3R1NQb2VuQnNwNld3NTF6RjU4TE5nNzRMVHZaTDc1ZERiYjhwNkk2b3c4TGZYRlJVN1BGKzNibjJabk82RmRMVWtpOEVPQUpSNHFwZlkrVG81OTRHa0dpUis5dXNoYlpMVFZzbDlBU2NwQWRRSlVpZEpuZVRjc1pCNnlha3Y1QWJLYVppazB0UTJYWGhiWG13bjZSazQzVFBrdGh2L25DdGd2dUFsellWTkVsMzZuRlFMY3V5MkZhdnZnM00va2ZRRFNlMGF3WWFjSzVVMEhOTHc5SDROSitVVVlBUXp1WjYwWDFOMjdHL2szSE9TZmpaazB2aGxlZWtWVUVxYUN6dDR1eElrY2RTcC9aYUR1SExMbjJwT2d0TXRrdnNuU04xaXNFTlhyczJLdlEzU0xEbjMyOVArNVo4L2JtN29GSGh6WTRNTlE3OWpobFI4RFBLMnovNzR3VFE1alpGMEJlUkd5cWxqN3RocUN2WWV5UzJTMCs4aFBULzQ1aC92YVNub0ZIaExZWWVIZmozKzl2UTlBT2VTbUx2eHJmL3BET2w3Y3U0Q1NXZEI2cGNkT3hPekVleVZrbnNiVHE5SWVyVml3dlU3czVNME0zaExZd2YvU2MzM1BPZk1uU1NlQi9rOEFHeFkrRnAzU0VQa05GaHkvZUJVTHFsTVRzZENybk1NOWs1Sm44RzVXa2tiNU54S1NCL0o2Y09CNDhadWFUVmRUeWxwVFd6Zk9MdDgxSGxiQUN3Ty9xV1ZOYy85VjRtY096S0MvVVcvYXk2dmIzNnE0cFQvQjQwSEZIQWxZc2J0QUFBQUFFbEZUa1N1UW1DQ1wiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW1nL2NpcmNsZV8yLnBuZ1xuLy8gbW9kdWxlIGlkID0gNDdcbi8vIG1vZHVsZSBjaHVua3MgPSAzIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBY0NBWUFBQUNkejdTcUFBQUVTRWxFUVZSSWlaV1dYV2djVlJTQXY1bmRwa2wvVEF1RkZreWlRcUxVRjhFSHEyajZrTWFpUmJBRlVSTEJncHRvWWtuVmlscXRQcFM4cGJYVkNnb3Bpd2hDRTBraTI1QTBZaEtEYTM2RVJwRzJsSzRoVGRoc2s5WFFrTjJkeldabmQ4YUh1Wk9kYk81czZZR0Z2V2ZPT2Q4OVorNmNjeFhmdlBrTjBJeGMwc0NMd0xETGMvemwxUUQ0d3NFYTRBcFE1R0w2cmIrOCtoMEFGV2dCTHJzWUZnRWRRS1ViVkFBcmhaMGI4TExnQUtENDVrMkFMVmpaN0hOeHVnazhBeXhMbnBVQ1k4RGpMcjUvQURYKzh1cWtyVkQ5NWRXS3Y3eGFqMTY5L2hxbUdYRngzQXQwQXA0OHZVZm81VURUak56NWZiSmV2SUppWUJPZ2VGQXJQRUJ4cUxOUDNWbjE4UGlPcW9lT0tJcXlXUktpRXRnQkREaDBYd0t2UzNtR0VaL3BHNm43NWMyVFVhQkVBQTBnNjBHdHNIZGNkTHR2SkxIcmliMDNTaDhwZXdsRnljOEtyUEpIZ2F2QTIwQ3JTNFo2ZUhpaWFlaXRVemNFREt4RG1RSjBqeTh5eTEvbnZ6UEVManpUZ2NINWl1ZWZqVzdadmF0V0doQU9BaXZBV1RhV0c0REY2NkZUL2E4ZUh4VExqTENQQTZ1QXFRTDR3a0ZES0JKQUtuQ29vU3NSaWJhN1FJdUFNN2ljMUVRazJoNDQxUENUV0daRmRna1Izd0RyazBHQXMySkhDU0RWdGIvdWJPcnVjcThMV0pFcFUzZVhlN3YyMTUwVFM4TUJYQkViWUIzVUFVNENpV3hhVC9VZWJ2cFlUeVFuWE1EclJFOGtKM3BmYnZva205Wk5BYlFybDNRQ04wQ0ZySUZqdCtlMHNjL1B2MnZvK213aG9LSHJzMk9mblhzdk5qT25BeWJXb1pFQ3BWQmZPR2hpdmZ3a29FMTFEZnlyTFN3R0NrRzFoY1hBVlBmUFN3S29BNXJ3endoZFlhZ0RuQWEwdy8zK0o3ZVg3WEhyelFCc0w5dlRmUEQ3dG4wQ29vbGZXZ2FFWEJ1VWlwNUlQcnBwYThrRWlyS3pFQlRBTkl6bDZjRGdDeVBIVy8vR2NWTHZGMXFLMVRjZnV4ZlFBWjdTNXY5N3F2UHBWNVlLMlVuTGkvWFJkN2tCczJuOUg1bGVVZFhLYlEvdS90RVhEa3FieHIyZ1h3SFNqcFNPYThNOUI5NDRrbzVydjdyNDFnci8rNEkyQThka3h0blZkR2lrNWZSSHNaazVmYVRsOUlmWjFYVElKZTR4WHpqb2V2anlvVFZ1dXpReTJZWEp0b3VONGFIeE9FQjRhRHcyMlhheDBjaGtGMXhpWHhDM2lZTFFTcUNiM0ZSWUU5TXc0cUZMdlkzWDJqc1d5SDJMcTlmYU8rWkNuWDBOcG1IRUpiRzlRTGU0VlVpaHBVQS8xcnpNbCt5ZDBja1RvNTkrWVpmUzdsZ3hRQnM5ZWVibS9PaWZIeURwUENKZXZ5OGNMTTJIZWtTR1ZSSW5sbTVOdHc3VW4vZ3REeGpIYW5OeElIbWwvdjNocFZ2VDh0bHF4ZTF4bm1nVnVBQWNrRmtuSXRIMm50cWpseHhBZXdxdCtzTEJETG1tdnRKVGUvU0hBdU93QnZqYVhpaDRuN1AvZTdBdWFBOWdYUytjNzlzZ040ZzExcGZTQTJ3VmZzVXVmakVjemQvcnlMZ1kyQ1p4TkVWR0d2S3BZWmRjeFpxenhlVG1yUjNYdnBtc0FJWlhHR3dXd0JMV1gwSFdHcjhMVUFaV3NXNFZOdGdqNHRyZ2xKZmNZVUlBMG5ubFNRbW9QU3RsNGh4cHNMRmF0bmdBMVV0dXltY2tob2JJUWpvWEplQzA4TEd6bHNVeS9nY043TnlYaUdhZ2RBQUFBQUJKUlU1RXJrSmdnZz09XCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcvcXVpdC5wbmdcbi8vIG1vZHVsZSBpZCA9IDQ4XG4vLyBtb2R1bGUgY2h1bmtzID0gMyJdLCJzb3VyY2VSb290IjoiIn0=