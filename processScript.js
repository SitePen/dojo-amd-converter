define([
	"./Module",
	"./util",
	"./handlers",
	"esprima/esprima"
], function (Module, util, handlers, esprima) {
	return function (code, path, config) {
		//	summary:
		//		Processes a JavaScript file.

		var operations = [],
			tree = esprima.parse(code, {
				range: true,
				loc: true
			}),
			module = new Module({ code: code, path: path });

		util.traverse(tree, function (object, parent) {
			try {
				var operation = handlers.match(object, parent, module);
				if (operation) {
					if (operation.pre) {
						operation.pre(module, config);
						operations.push(operation.post);
					}
					else {
						operations.push(operation);
					}
				}
			}
			catch (e) {
				if (e.message !== "No match found") {
					throw e;
				}
			}
		});

		for (var i = operations.length - 1; i >= 0; --i) {
			operations[i] && operations[i](module, config);
		}

		return module.toString();
	};
});