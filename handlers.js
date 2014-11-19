/*jshint es5:true */
define([
	"dojo/AdapterRegistry",
	"./console",
	"./util"
], function (AdapterRegistry, console, util) {
	function cannotProcess(callName, object, module) {
		console.warn("Cannot process " + callName + " at " + (module ? module.path + ":" : "") + object.loc.start.line + ":" + object.loc.start.column);
	}

	var DOM_EVENTS = {
			activate: 1,
			afterprint: 1,
			afterupdate: 1,
			beforeactivate: 1,
			beforecopy: 1,
			beforecut: 1,
			beforedeactivate: 1,
			beforeeditfocus: 1,
			beforepaste: 1,
			beforeprint: 1,
			beforeunload: 1,
			beforeupdate: 1,
			blur: 1,
			bounce: 1,
			cellchange: 1,
			change: 1,
			click: 1,
			contextmenu: 1,
			controlselect: 1,
			copy: 1,
			cut: 1,
			dataavailable: 1,
			datasetchanged: 1,
			datasetcomplete: 1,
			dblclick: 1,
			deactivate: 1,
			drag: 1,
			dragend: 1,
			dragenter: 1,
			dragleave: 1,
			dragover: 1,
			dragstart: 1,
			drop: 1,
			error: 1,
			errorupdate: 1,
			filterchange: 1,
			finish: 1,
			focus: 1,
			focusin: 1,
			focusout: 1,
			hashchange: 1,
			help: 1,
			input: 1,
			keydown: 1,
			keypress: 1,
			keyup: 1,
			layoutcomplete: 1,
			load: 1,
			losecapture: 1,
			message: 1,
			mousedown: 1,
			mouseenter: 1,
			mouseleave: 1,
			mousemove: 1,
			mouseout: 1,
			mouseover: 1,
			mouseup: 1,
			mousewheel: 1,
			move: 1,
			moveend: 1,
			movestart: 1,
			mscontentzoom: 1,
			msgesturechange: 1,
			msgestureend: 1,
			msgesturehold: 1,
			msgesturestart: 1,
			msgesturetap: 1,
			msgotpointercapture: 1,
			msinertiastart: 1,
			mslostpointercapture: 1,
			msmanipulationstatechanged: 1,
			mspointercancel: 1,
			mspointerdown: 1,
			mspointerhover: 1,
			mspointermove: 1,
			mspointerout: 1,
			mspointerover: 1,
			mspointerup: 1,
			mssitemodejumplistitemremoved: 1,
			msthumbnailclick: 1,
			offline: 1,
			online: 1,
			page: 1,
			paste: 1,
			popstate: 1,
			propertychange: 1,
			readystatechange: 1,
			reset: 1,
			resize: 1,
			resizeend: 1,
			resizestart: 1,
			rowenter: 1,
			rowexit: 1,
			rowsdelete: 1,
			rowsinserted: 1,
			scroll: 1,
			select: 1,
			selectionchange: 1,
			selectstart: 1,
			start: 1,
			stop: 1,
			storage: 1,
			storagecommit: 1,
			submit: 1,
			unload: 1
		},

		basicBaseFunctions = {
			require: false,
			provide: false,
			cache: false,
			moduleUrl: false,
			fromJson: false,
			toJson: false,
			xhr: false,
			xhrPost: false,
			xhrGet: false,
			xhrDelete: false,
			xhrPut: false,
			dnd: false,
			subscribe: false,
			unsubscribe: false, //"dojo/topic",
			publish: false,
			declare: false,//"dojo/_base/declare",
			style: false, //"dojo/dom-style",
			stopEvent: false,
			connect: false, //"dojo/on",
			disconnect: false, //"dojo/on",
			map: "dojo/_base/array",
			forEach: "dojo/_base/array",
			every: "dojo/_base/array",
			some: "dojo/_base/array",
			filter: "dojo/_base/array",
			indexOf: "dojo/_base/array",
			lastIndexOf: "dojo/_base/array",
			byId: "dojo/dom",
			create: "dojo/dom-construct",
			place: "dojo/dom-construct",
			destroy: "dojo/dom-construct",
			toDom: "dojo/dom-construct",
			empty: "dojo/dom-construct",
			delegate: "dojo/_base/lang",
			hitch: "dojo/_base/lang",
			partial: "dojo/_base/lang",
			isArray: "dojo/_base/lang",
			isString: "dojo/_base/lang",
			isArrayLike: "dojo/_base/lang",
			isNumber: "dojo/_base/lang",
			isFunction: "dojo/_base/lang",
			isObject: "dojo/_base/lang",
			isAlien: "dojo/_base/lang",
			mixin: "dojo/_base/lang",
			getObject: "dojo/_base/lang",
			setObject: "dojo/_base/lang",
			trim: "dojo/_base/lang",
			clone: "dojo/_base/lang",
			extend: "dojo/_base/lang",
			replace: "dojo/_base/lang",
			boxModel: "dojo/dom-geometry",
			getPadExtents: "dojo/dom-geometry",
			getBorderExtents: "dojo/dom-geometry",
			getPadBorderExtents: "dojo/dom-geometry",
			getMarginExtents: "dojo/dom-geometry",
			getMarginBox: "dojo/dom-geometry",
			getContentBox: "dojo/dom-geometry",
			setContentSize: "dojo/dom-geometry",
			setMarginBox: "dojo/dom-geometry",
			isBodyLtr: "dojo/dom-geometry",
			docScroll: "dojo/dom-geometry",
			fixIeBiDiScrollLeft: "dojo/dom-geometry",
			position: "dojo/dom-geometry",
			getMarginSize: "dojo/dom-geometry",
			normalizeEvent: "dojo/dom-geometry",
			addClass: "dojo/dom-class",
			removeClass: "dojo/dom-class",
			toggleClass: "dojo/dom-class",
			hasClass: "dojo/dom-class",
			replaceClass: "dojo/dom-class",
			query: "dojo/query",
			body: "dojo/_base/window",
			doc: "dojo/_base/window",
			back: "dojo/back"
		},

		functionModules = {
			declare: true,
			query: true
		},

		convertFunction = {
			addClass: "add",
			removeClass: "remove",
			toggleClass: "toggle",
			hasClass: "contains",
			replaceClass: "replace"
		},

		globalVariables = {
			window: 1,
			location: 1,
			Math: 1
		},

		handlers = new AdapterRegistry(),

		// Application-wide list of dependencies, identified using JS identifiers (not AMD MIDs)
		dependencies = {};

	handlers.register("dojo.provide", util.isCall("dojo.provide"), function (object, parent, module) {
		var args = object.arguments;

		if (args[0].type !== "Literal" || args.length > 1) {
			cannotProcess("dojo.provide", object, module);
			return null;
		}

		module.oldId = args[0].value;

		return {
			pre: function (module) {
				// ._base.* is replaced with nothing because this is a pre-1.7 convention for modules that augment
				// the root namespace object (dojo, dijit), so we just want to return the base module in these cases
				module.returnValue = args[0].value.replace(/\._base\..*/, "");
			},
			post: function (module) {
				module.replaceCode(object, "");
			}
		};
	});

	handlers.register("dojo.require", util.isCall("dojo.require"), function (object, parent, module) {
		function getParameterName(module) {
			//	summary:
			//		Generates a hopefully-unique parameter name for this dependency for the given module.
			//	returns: string
			//		Parameter name.

			// avoid maybeHasIdentifier giving a false positive due to a partial conversion based
			// on this same dependency.  fixes #20455
			if (dependencyMid in module.dependencies) {
				return module.dependencies[dependencyMid];
			}

			var parameterName = defaultParameterName;

			// TODO: Won't the former check protect against accidental shadowing of globals since if they are not used
			// they are not identified so it does not matter?
			if (module.maybeHasIdentifier(parameterName) || parameterName in globalVariables) {
				parameterName += "Module";
			}

			return parameterName;
		}

		var args = object.arguments;

		if (args[0].type !== "Literal" || args.length > 1) {
			cannotProcess("dojo.require", object, module);
			return null;
		}

		var dependency = args[0].value,
			dependencyMid = util.toMid(dependency),
			defaultParameterName = dependency.split(".").pop(),
			parameters = (module.parameters || (module.parameters = {}));
		if(defaultParameterName in parameters){
			defaultParameterName = dependency.split(".").slice(1).map(function (part, i) {
				return i ? part[0].toUpperCase() + part.slice(1) : part;
			}).join("");
		}
		parameters[defaultParameterName] = true;

		if (!dependencies[dependency]) {
			dependencies[dependency] = true;
			var used = false;
			// TODO: This mechanism of registering new handlers is prone to blow up since it means we will have
			// stale handlers registered after this module is done being processed & later files will get a partial
			// dependency transform.
			handlers.register(dependency, util.is(dependency), function (object) {
				return function (module) {
					var parameterName = getParameterName(module);

					if (!module.dependencies[dependencyMid]) {
						if(module.oldId === dependency){
							if(module.returnValue){
								parameterName = module.returnValue;
							}else{
								console.warn(module.path + " is trying to use itself as a dependency");
								//module.addDependency("exports", "exports"); // this might work
								//parameterName = "exports";
							}
						}else{
							console.warn(module.path + " is trying to use a dependency " + dependency + " without requiring it");
							module.addDependency(dependencyMid, parameterName);
						}
					}
					used = true;
					module.replaceCode(object, parameterName);
				};
			});
		}

		return {
			pre: function (module) {
				module.addDependency(util.toMid(dependency), getParameterName(module));
			},
			post: function (module, config) {
				if(used === false){
					for(var i in module.dependencies){
						if(i.slice(0, 9) === "dojo/text"){
							var path = i.slice(10);
							path = path.slice(path.indexOf('/') + 1);
							try{
								var targetText = config.getFile(path);
								if(~targetText.indexOf(dependency)){
									// found the dependency in the template
									used = true;
									continue;
								}
							}catch(e){
								// if we can't find the target, don't assume anything
								used = true;
								continue;
							}
						}
					}
					if(!used){
						// if it is still not used
						console.log("Unused dependency", dependency);
						if(config.removeUnusedDependencies){
							module.removeDependency(util.toMid(dependency));
						}
					}
				}
				module.replaceCode(object, "");
			}
		};
	});

	handlers.register("dojo.declare", util.isCall("dojo.declare"), function (object, parent, module) {
		var args = object.arguments;

		if (args[0].type !== "Literal") {
			cannotProcess("dojo.declare" + args[0].type, object, module);
			return null;
		}

		return function (module, config) {
			module.addDependency("dojo/_base/declare", "declare");
//console.log('eclare args[1]', args[1]);
			if(args[1].type === "ArrayExpression" && args[1].elements.length === 1){
				// if the base argument is an array with a single item, remove the array
				module.replaceCode(args[1], module.getCodeFrom(args[1].elements[0]));
			}
			if (module.returnValue === args[0].value) { // make sure it matches the module id
				var moduleShortName = module.returnValue.split(".").pop();
				module.returnValue = moduleShortName; // return exports

				if (config.makeDeclareAnonymous) {
					args[0].range[1]++; // remove the comma as well
					module.replaceCode(args[0], ""); // remove the first param

					// TODO: Should this set declaredClass on the ctor object instead then?
				}

				module.replaceCode(object.callee, "var " + moduleShortName + " = declare"); // assign to a variable so we can return it
			}
			else {
				module.replaceCode(object.callee, "declare");
			}
		};
	});

	handlers.register("dojo.moduleUrl", util.isCall("dojo.moduleUrl"), function (object, parent, module) {
		var args = object.arguments;

		if (args[0].type !== "Literal") {
			cannotProcess("dojo.moduleUrl", object, module);
			return null;
		}
		var path = util.toMid(args[0].value);
		var quoted;
		if(args[1]){
			if(args[1].type === "Literal"){
				path += "/" + args[1].value;
			}else{
				quoted = true;
				path = '"' + path + '/" + ' + module.getCodeFrom(args[1]);
			}
		}
		if(parent[0].type === "Property" && parent[0].key.name === "templatePath" && !quoted){
			return function(module){
				module.addDependency("dojo/text!" + path, "template");
				module.replaceCode(parent[0], "templateString: template");
			};
		}else{
			return function(module){
				module.replaceCode(object, quoted ? 'require.toUrl(' + path + ')' : ('require.toUrl("' + path + '")'));
			};
		}
	});

	handlers.register("dojo.requireLocalization", util.isCall("dojo.requireLocalization"), function (object, parent, module) {
		var args = object.arguments;

		if (args[0].type !== "Literal" || args[1].type !== "Literal") {
			cannotProcess("dojo.requireLocalization", object, module);
			return null;
		}

		return function (module) {
			module.addDependency("dojo/i18n!" + util.toMid(args[0].value) + "/nls/" + args[1].value, "i18n" + args[1].value);
			module.replaceCode(object, "");
		};
	});

	handlers.register("dojo.i18n.getLocalization", util.isCall("dojo.i18n.getLocalization"), function (object) {
		var args = object.arguments;

		if (args.length === 3) {
			console.warnOnce("3-argument getLocalization in use; must enable v1 i18n APIs in build");
			return function (module) {
				module.addDependency("dojo/i18n", "i18n");
				module.replaceCode(object, "i18n.getLocalization(" + [
					module.getCodeFrom(args[0]),
					module.getCodeFrom(args[1]),
					module.getCodeFrom(args[2])
				].join(", ") + ")");
			};
		}
		else {
			return function (module) {
				module.replaceCode(object, "i18n" + args[1].value);
			};
		}
	});

	handlers.register("dojo.cache", util.isCall("dojo.cache"), function (object, parent, module) {
		var args = object.arguments;

		if (args[0].type !== "Literal" || args[1].type !== "Literal") {
			cannotProcess("dojo.cache", object, module);
			return null;
		}

		return function (module) {
			var identifier = "template" + (module.hasTemplate ? args[1].value.replace(/\..*$/, "") : "");
			module.addDependency("dojo/text!" + util.toMid(args[0].value) + "/" + args[1].value, identifier);
			module.replaceCode(object, identifier);
			module.hasTemplate = true;
		};
	});

	handlers.register("dojo.fromJson", util.isCall("dojo.fromJson"), function (object) {
		var args = object.arguments;

		return function (module) {
			module.addDependency("dojo/json", "JSON");
			module.replaceCode(object, "JSON.parse(" + module.getCodeFrom(args) + ")");
		};
	});

	handlers.register("dojo.toJson", util.isCall("dojo.toJson"), function (object) {
		var args = object.arguments;

		return function (module) {
			module.addDependency("dojo/json", "JSON");
			module.replaceCode(object, "JSON.stringify(" + module.getCodeFrom(args) + ")");
		};
	});

	handlers.register("dojo.stopEvent", util.isCall("dojo.stopEvent"), function (object) {
		var args = object.arguments;
		return function (module) {
			module.addDependency("dojo/topic", "topic");
			var eventArg = module.getCodeFrom(args[0]);
			module.replaceCode(object, eventArg + ".preventDefault(), " + eventArg + ".stopPropagation();");
		};
	});

	handlers.register("dojo.publish", util.isCall("dojo.publish"), function (object) {
		var args = object.arguments;
		return function (module) {
			module.addDependency("dojo/topic", "topic");
			module.replaceCode(object, "topic.publish(" +
				module.getCodeFrom(args[0]) + (args.length > 1 ? ", " + module.getCodeFrom(args[1].type === "ArrayExpression" ? args[1].elements : args[1]) : "") + ")");
		};
	});

	handlers.register("dojo.subscribe", util.isCall("dojo.subscribe"), function (object) {
		var args = object.arguments;
		return function (module) {
			module.addDependency("dojo/topic", "topic");
			if (args.length > 2) {
				module.addDependency("dojo/_base/lang", "lang");
				module.replaceCode(object, "topic.subscribe(" +
					module.getCodeFrom(args[0]) + ", " +
					"lang.hitch(" + module.getCodeFrom(args[1]) + ", " + module.getCodeFrom(args[2]) + "))");
			}
			else {
				module.replaceCode(object, "topic.subscribe(" +
					module.getCodeFrom(args[0]) + ", " +
					module.getCodeFrom(args[1]) + ")");
			}
		};
	});

	handlers.register("dojo.unsubscribe", util.isCall("dojo.unsubscribe"), function (object) {
		var handle = object.arguments[0];
		return function (module) {
			module.replaceCode(object, module.getCodeFrom(handle) + '.remove()');
		};
	});

	handlers.register("widget.connect", function (object) {
		var isEvent;

		// leave dojo.connect for that specific handler
		if (util.isCall("dojo.connect")) {
			return false;
		}

		if (object.type === "CallExpression" && object.callee.type === "MemberExpression" &&
			object.callee.property.name === "connect" && object.arguments[1].type === "Literal") {

			var event = object.arguments[1].value;
			if (event.slice(0, 2) === "on") {
				event = event.slice(2);
				isEvent = true;
			}
			else if (event in DOM_EVENTS) {
				isEvent = true;
			}
		}

		return isEvent;
	}, function (object) {
		return function (module) {
			var args = object.arguments,
				event = args[1].value;

			if (event.slice(0, 2) === "on") {
				event = event.slice(2);
			}

			var prologue = module.getCodeFrom(object.callee.object) + ".on(" + module.getCodeFrom(args[0]) + ', "' + event + '", ';

			if (args.length > 3) {
				module.addDependency("dojo/_base/lang", "lang");
				module.replaceCode(object, prologue +
					"lang.hitch(" + module.getCodeFrom(args[2]) + ", " + module.getCodeFrom(args[3]) + "))");
			}
			else {
				module.replaceCode(object, prologue + module.getCodeFrom(args[2]) + ")");
			}
		};
	});

	handlers.register("dojo.connect", util.isCall("dojo.connect"), function (object) {
		var args = object.arguments,
			isEvent,
			event = args[1].value;

		if (event) {
			if (event.slice(0, 2) === "on") {
				event = event.slice(2);
				isEvent = true;
			}
			else if (event in DOM_EVENTS) {
				isEvent = true;
			}
		}

		return function (module) {
			if (isEvent) {
				module.addDependency("dojo/on", "on");
				var prologue = "on(" + module.getCodeFrom(args[0]) + ', "' + event + '", ';
				if (args.length > 3) {
					module.addDependency("dojo/_base/lang", "lang");
					module.replaceCode(object, prologue +
						"lang.hitch(" + module.getCodeFrom(args[2]) + ", " + module.getCodeFrom(args[3]) + "))");
				}
				else {
					module.replaceCode(object, prologue + module.getCodeFrom(args[2]) + ")");
				}
			}
			else {
				module.addDependency("dojo/aspect", "aspect");
				if (args.length > 3) {
					module.addDependency("dojo/_base/lang", "lang");
					module.replaceCode(object, "aspect.after(" +
						module.getCodeFrom(args[0]) + ", " +
						module.getCodeFrom(args[1]) + ", lang.hitch(" +
						module.getCodeFrom(args[2]) + ", " +
						module.getCodeFrom(args[3]) + "), true)");
				}
				else {
					module.replaceCode(object, "aspect.after(" + module.getCodeFrom(args) + ", true)");
				}
			}
		};
	});

	// this is essentially a copy of dojo.unsubscribe - maybe there's a way to combine them
	handlers.register("dojo.disconnect", util.isCall("dojo.disconnect"), function (object) {
		var handle = object.arguments[0];
		return function (module) {
			module.replaceCode(object, module.getCodeFrom(handle) + '.remove()');
		};
	});

	handlers.register("dojo.style", util.isCall("dojo.style"), function (object) {
		var args = object.arguments;

		return function (module) {
			module.addDependency("dojo/dom-style", "domStyle");
			if (args.length > 2 || (args.length === 2 && args[1].type === "ObjectExpression")) {
				module.replaceCode(object, "domStyle.set(" + module.getCodeFrom(args) + ")");
			}
			else {
				module.replaceCode(object, "domStyle.get(" + module.getCodeFrom(args) + ")");
			}
		};
	});

	handlers.register("dojo.attr", util.isCall("dojo.attr"), function (object) {
		var args = object.arguments;

		return function (module) {
			module.addDependency("dojo/dom-attr", "domAttr");
			if (args.length > 2 || (args.length === 2 && args[1].type === "ObjectExpression")) {
				module.replaceCode(object, "domAttr.set(" + module.getCodeFrom(args) + ")");
			}
			else {
				module.replaceCode(object, "domAttr.get(" + module.getCodeFrom(args) + ")");
			}
		};
	});

	handlers.register("widget.attr", function (object) {
		return object.type === "CallExpression" &&
			object.callee.type === "MemberExpression" &&
			object.callee.property.name === "attr";
	}, function (object) {
		var args = object.arguments;

		return function (module) {
			module.replaceCode(object.callee.property, args.length < 2 ? "get" : "set");
		};
	});

	handlers.register("dojo.is", (function (isIs) {
		return function (object) {
			return isIs(object) && !(object.property.name in basicBaseFunctions);
		};
	}(util.is("dojo.is", true))), function (object) {
		var name = object.property.name;

		return function (module) {
			module.addDependency("dojo/has", "has");
			module.replaceCode(object, 'has("' + name.slice(2).toLowerCase() + '")');
		};
	});

	handlers.register("dojo.xhr", util.isCall("dojo.xhr", true), function (object) {
		return function (module) {
			var method = object.callee.property.name.slice(3).toUpperCase();
			var parts = {
				url: false,
				load: false,
				error: false
			};
			var properties = object.arguments[0].properties;
			if(properties){
				for (var i = properties.length - 1; i >= 0; --i) {
					var property = properties[i];
					if (property.key.name in parts) {
						parts[property.key.name] = property.value;
						// remove this property, as we will write it out later
						properties.splice(i, 1);
					}
				}

				module.addDependency("dojo/request", "request");

				var newRequest = "request(" + module.getCodeFrom(parts.url) + ", {" +
					(method ? 'method: "' + method + '", ' : "") + module.getCodeFrom(properties) + "})";

				if (parts.load || parts.error) {
					// write these out in a then()
					newRequest += ".then(" +
							(parts.load ? module.getCodeFrom(parts.load) : "null") +
							(parts.error ? ", " + module.getCodeFrom(parts.error) : "") + ")";
				}
				module.replaceCode(object, newRequest);
			}else{
				cannotProcess("Non-object parameter to dojo.xhr", object, module);
			}
		};
	});

	handlers.register("dojo._base", (function (isDojo) {
		return function (object) {
			var name = util.computeNamespace(object),
				parentName = name.slice(0, name.lastIndexOf("."));

			return isDojo(object) && !(name in dependencies) && !(parentName in dependencies);
		};
	}(util.is("dojo.", true))), function (object) {
		var name = object.property.name;

		return function (module) {
			var baseModule = basicBaseFunctions[name];
			if (baseModule) {

				var moduleReference = module.getDependencyName(baseModule);
				if(!moduleReference){
					moduleReference = baseModule.split("/").pop().split("-").map(function (part, i) {
						return i ? part[0].toUpperCase() + part.slice(1) : part;
					}).join("");

					if (module.maybeHasIdentifier(moduleReference) || moduleReference in globalVariables) {
						moduleReference += "Module";
					}

					module.addDependency(baseModule, moduleReference);
				}
				if (name in convertFunction) {
					name = convertFunction[name];
				}
				module.replaceCode(object, moduleReference + (name in functionModules ? "" : "." + name));
			}
			else if (!(name in basicBaseFunctions)) {
				// this is a catch all for the dojo functions that don't have a module that we have defined
				console.log("adding dojo dep for " + name);
				module.addDependency("dojo", "dojo");
			}
		};
	});

	return handlers;
});
