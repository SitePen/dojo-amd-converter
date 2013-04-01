define({
	// Paths to skip processing. Each path should be a regular expression that matches against the path to a file,
	// starting from srcDir (excluding srcDir; e.g. excluding <srcDir>/foo/* would be a match against /^foo\//).
	excludePaths: [ /\/tests\// ],

	// Root directory of files to process.
	srcDir: "./tests",

	// Output directory for processed files.
	distDir: "./dist",

	// Print output instead of sending it to an output directory.
	printOutput: false,

	// Make declare calls anonymous instead of leaving the first argument as-is.
	makeDeclareAnonymous: false,

	// Removed dependencies that are not referenced in a module (or its template).
	removeUnusedDependencies: false,

	// Only process HTML files inside template directories.
	onlyProcessTemplates: false
});