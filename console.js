/*globals console:false */
define([], function () {
	var warnings = {};

	return Object.create(console, {
		warnOnce: {
			value: function () {
				var id = [].slice.call(arguments, 0).join(" ");
				if (warnings[id]) {
					return;
				}

				warnings[id] = 1;
				console.warn.apply(console, arguments);
			}
		}
	});
});