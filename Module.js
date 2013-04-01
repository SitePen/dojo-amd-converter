define([], function () {
	function compareIds(a, b, override) {
		// if a is the override then a wins
		if (a === override) {
			return -1;
		}
		// if b is the override then b wins
		if (b === override) {
			return 1;
		}

		var overrideSlash = override + '/',
			aIndex = a.indexOf(overrideSlash),
			bIndex = b.indexOf(overrideSlash);

		// if a starts with the override followed by a slash...
		if (aIndex === 0) {
			if (bIndex !== 0) {
				// a wins if b doesn't also start with the same prefix
				return -1;
			}
			// when both start with the prefix then just alpha sort
			return a > b;
		}
		// if only b starts with the prefix then b wins
		else if (bIndex === 0) {
			return 1;
		}

		// null indicates that nothing matched the override
		return null;
	}

	function Module(kwArgs) {
		this.dependencies = {};

		for (var key in kwArgs) {
			this[key] = kwArgs[key];
		}
	}

	Module.prototype = {
		constructor: Module,

		//	code: string
		//		Raw source code for this module.
		code: null,

		//	dependencies: Object
		//		A map of module ID to parameter name for this module.
		dependencies: null,

		//	returnValue: string
		//		A JavaScript string representing the return value of this module, if one exists.
		returnValue: null,

		//	hasTemplate: boolean
		//		Whether or not this module requires a template from a file.
		hasTemplate: false,

		addDependency: function (mid, identifier) {
			//	summary:
			//		Adds a dependencies to the module.
			//	mid: string
			//		The module ID of the dependency.
			//	identifier: string
			//		The string to use as the identifier for the parameter.

			this.dependencies[mid] = identifier;
		},

		removeDependency: function (mid) {
			//	summary:
			//		Removes a dependencies to the module.
			//	mid: string
			//		The module ID of the dependency.

			delete this.dependencies[mid];
		},

		getDependencyName: function (mid) {
			//	summary:
			//		Gets the argument name for the given dependency
			//	mid: string
			//		The module ID of the dependency.
			// returns: string
			//		The argument name, or undefined if it hasn't been defined

			return this.dependencies[mid];
		},

		replaceCode: function (object, newCode) {
			//	summary:
			//		Replaces code in the raw source based on the range of the provided object.
			//	object: Object
			//		An object with a `range` property that defines the range in the original source code to replace.
			//	newCode: string
			//		Well-formed replacement JavaScript code.

			var originalLength = this.code.length,
				sliceTo = object.range[1];

			// The ranges provided for an object typically exclude any terminating semicolon or whitespace, so
			// we need to do extra work if a semicolon is provided or we are trying to completely delete a line to
			// avoid having empty statements or whitespace left behind
			if ((!newCode || newCode.charAt(newCode.length - 1) === ";") && this.code.charAt(sliceTo) === ";") {
				sliceTo += 1;

				if (!newCode) {
					while (this.code.charAt(sliceTo) === "\r" || this.code.charAt(sliceTo) === "\n") {
						sliceTo += 1;
					}
				}
			}

			this.code = this.code.slice(0, object.range[0]) + newCode + this.code.slice(sliceTo);

			var delta = this.code.length - originalLength;

			(function updateRange(object, andStart) {
				//	summary:
				//		Updates the range values of an object to correct for changes in the length of the new code.
				//	object: Object
				//		Object to update.
				//	andStart: boolean
				//		Whether or not to update the start range in addition to the end range. Useful for objects
				//		that are after the changed object in the source code.

				if (object.range) {
					if (andStart) {
						object.range[0] += delta;
					}

					object.range[1] += delta;
				}

				if (object.parent && !andStart) {
					updateRange(object.parent);

					// TODO: Document why this is happening
					if (object.parent instanceof Array) {
						var foundChildObject;

						for (var i = 0, parentObject; (parentObject = object.parent[i]); ++i) {
							foundChildObject && updateRange(parentObject, true);

							if (parentObject === object) {
								foundChildObject = true;
							}
						}
					}
				}
			}(object));
		},

		maybeHasIdentifier: function (identifier) {
			//	summary:
			//		Performs a brute-force search against the raw source code for this module to determine if
			//		the given identifier might already be in use.
			//	returns: boolean
			//		Whether or not the given identifier might be used somewhere in the source.

			return this.code.match(",\\s*" + identifier + "[^\\w]") || this.code.match("\\(\\s*" + identifier + "[^\\w]") || this.code.match("var\\s*" + identifier + "[^\\w]");
		},

		getCodeFrom: function (object) {
			//	summary:
			//		Retrieves the raw source code used to generate an object.
			//	object: Object|Array
			//		An object containing a range object, or an array of objects that were used as arguments.

			return object.range ?
				this.code.slice(object.range[0], object.range[1]) :
				object.map(this.getCodeFrom, this).join(", ");
		},

		toString: function () {
			//	summary:
			//		Outputs the module as an AMD module.

			var midDeps = [],
				idDeps = [];

			// sort the list of dependencies (for readability)
			Object.keys(this.dependencies).sort(function (a, b) {
				// dojo first
				var result = compareIds(a, b, 'dojo');

				// dijit next
				if (result === null) {
					result = compareIds(a, b, 'dijit');
				}
				// followed by dojox
				if (result === null) {
					result = compareIds(a, b, 'dojox');
				}
				// alphabetize the rest
				if (result === null) {
					return a > b;
				}
				return result;
			}).forEach(function (key) {
				midDeps.push(key);
				idDeps.push(this.dependencies[key]);
			}, this);

			midDeps = midDeps.join('",\n\t"');
			idDeps = idDeps.join(", ");

			return "define([" + (midDeps ? '\n\t"' + midDeps + '"\n' : "") + "], function (" + idDeps + ") {\n\n\t" +
				this.code.replace(/\n/g, "\n\t") +
				(this.returnValue ? "\n\treturn " + this.returnValue + ";" : "") +
				"\n});";
		}
	};

	return Module;
});