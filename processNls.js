define([
	"dojo/node!fs",
	"dojo/node!path"
], function (fs, pathUtil) {
	return function (code, path, config) {
		var dirname = pathUtil.dirname(path);

		// root bundle
		if (pathUtil.basename(dirname) === "nls") {
			var availableLocales = {},
				hasLocales = false,
				basename = pathUtil.basename(path);

			fs.readdirSync(pathUtil.join(config.srcDir, dirname)).sort().forEach(function (filename) {
				var stats;
				try {
					stats = fs.statSync(pathUtil.join(config.srcDir, dirname, filename, basename));
				}
				catch (e) {
					stats = null;
				}

				if (stats) {
					availableLocales[filename] = true;
					hasLocales = true;
				}
			});

			return "define({\n\troot: " +
				code.replace(/\n/g, "\n\t\t").replace(/\n\t\t\}\)\s*$/, "\n\t})") +
				(hasLocales ? ",\n" + JSON.stringify(availableLocales, null, "\t").slice(1, -1) : "") +
				"});";
		}

		// language bundle
		else {
			return "define(\n\t" + code.replace(/\n/g, "\n\t") + "\n);";
		}
	};
});