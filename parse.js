define([
	"require",
	"./processScript",
	"./processHtml",
	"./processNls",
	"dojo/node!fs",
	"dojo/node!path"
], function (require, processScript, processHtml, processNls, fs, pathUtil) {
	function ensureDirectoryExists(path) {
		//	summary:
		//		Ensures that the parent directory exists for the file given in path.

		path = pathUtil.dirname(path);

		var stats;
		try {
			stats = fs.statSync(path);
		}
		catch (e) {
			stats = null;
		}

		if (!stats) {
			ensureDirectoryExists(path);
			fs.mkdirSync(path, /* 0755 */ 493);
		}
		else if (!stats.isDirectory()) {
			throw new Error("Cannot put file inside non-directory.");
		}
	}

	function processPath(parent, path) {
		//	summary:
		//		Processes a file or directory at the given path.

		path = pathUtil.join(parent, path || "");

		var stats;
		try {
			stats = fs.statSync(path);
		}
		catch (error) {
			console.error(error);
			return;
		}

		config.getFile = function(path){
			return fs.readFileSync(pathUtil.join(config.srcDir, path), "utf-8");
		};
		if (stats.isDirectory()) {
			fs.readdirSync(path).sort().forEach(processPath.bind(this, path));
		}
		else if (stats.isFile()) {
			path = path.slice(config.srcDir.length);

			// Skip excluded paths
			if (config.excludePaths.some(function (exclude) { return exclude.test(path); })) {
				console.info("Skipping " + path);
				return;
			}

			var processor;
			if (/(?:^|\/|\\)nls[\/\\].*\.js$/.test(path)) {
				processor = processNls;
			}
			else if (/\.js$/.test(path)) {
				processor = processScript;
			}
			else if (/\.html?$/.test(path)) {
				processor = processHtml;
			}
			else {
				return;
			}
			var code, output;
			try{
				code = fs.readFileSync(pathUtil.join(config.srcDir, path), "utf-8");
				output = processor(code, path, config);
				if (output == null) {
					console.warn("No output for file " + path);
					output = code;
				}
			}catch(e){
				console.warn("Unable to process file: " + path, e.stack);
			}


			if (config.printOutput) {
				console.log(output);
			}
			else {
				var outputFilename = pathUtil.join(config.distDir, path);

				ensureDirectoryExists(outputFilename);
				fs.writeFileSync(outputFilename, output, "utf-8");
				console.info("Wrote " + pathUtil.resolve(outputFilename));
			}
		}
	}

	var args = [].concat.apply([], require.rawConfig.commandLineArgs.slice(2)),
		config;

	if (!args.length) {
		console.log("Usage: ./parse.sh config.js");
		return;
	}

	require([ pathUtil.resolve(args[0]) ], function () {
		config = arguments[0];

		// If paths are not normalised, attempting to slice off srcDir from the resolved path will not
		// work correctly in certain circumstances because pathUtil.join does some of its own path normalising.
		for (var key in { srcDir: 1, distDir: 1 }) {
			config[key] = pathUtil.normalize(config[key]);
		}

		processPath(config.srcDir);
	});
});