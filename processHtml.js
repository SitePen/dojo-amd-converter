define([ "./util", "dojo/node!libxmljs" ], function (util, libxmljs) {
	var VALID_ATTRIBUTES = {
		accept: 1,
		"accept-charset": 1,
		accesskey: 1,
		action: 1,
		alt: 1,
		async: 1,
		autocomplete: 1,
		autofocus: 1,
		autoplay: 1,
		border: 1,
		challenge: 1,
		charset: 1,
		checked: 1,
		cite: 1,
		"class": 1,
		cols: 1,
		colspan: 1,
		command: 1,
		content: 1,
		contenteditable: 1,
		contextmenu: 1,
		controls: 1,
		coords: 1,
		crossorigin: 1,
		data: 1,
		datetime: 1,
		"default": 1,
		defer: 1,
		dir: 1,
		dirname: 1,
		disabled: 1,
		draggable: 1,
		dropzone: 1,
		enctype: 1,
		"for": 1,
		form: 1,
		formaction: 1,
		formenctype: 1,
		formmethod: 1,
		formnovalidate: 1,
		formtarget: 1,
		headers: 1,
		height: 1,
		hidden: 1,
		high: 1,
		href: 1,
		hreflang: 1,
		"http-equiv": 1,
		icon: 1,
		id: 1,
		ismap: 1,
		keytype: 1,
		kind: 1,
		label: 1,
		lang: 1,
		list: 1,
		loop: 1,
		low: 1,
		manifest: 1,
		max: 1,
		maxlength: 1,
		media: 1,
		mediagroup: 1,
		method: 1,
		min: 1,
		multiple: 1,
		muted: 1,
		name: 1,
		novalidate: 1,
		onabort: 1,
		onafterprint: 1,
		onbeforeprint: 1,
		onbeforeunload: 1,
		onblur: 1,
		oncanplay: 1,
		oncanplaythrough: 1,
		onchange: 1,
		onclick: 1,
		oncontextmenu: 1,
		oncuechange: 1,
		ondblclick: 1,
		ondrag: 1,
		ondragend: 1,
		ondragenter: 1,
		ondragleave: 1,
		ondragover: 1,
		ondragstart: 1,
		ondrop: 1,
		ondurationchange: 1,
		onemptied: 1,
		onended: 1,
		onerror: 1,
		onfocus: 1,
		onhashchange: 1,
		oninput: 1,
		oninvalid: 1,
		onkeydown: 1,
		onkeypress: 1,
		onkeyup: 1,
		onload: 1,
		onloadeddata: 1,
		onloadedmetadata: 1,
		onloadstart: 1,
		onmessage: 1,
		onmousedown: 1,
		onmousemove: 1,
		onmouseout: 1,
		onmouseover: 1,
		onmouseup: 1,
		onmousewheel: 1,
		onoffline: 1,
		ononline: 1,
		onpagehide: 1,
		onpageshow: 1,
		onpause: 1,
		onplay: 1,
		onplaying: 1,
		onpopstate: 1,
		onprogress: 1,
		onratechange: 1,
		onreset: 1,
		onresize: 1,
		onscroll: 1,
		onseeked: 1,
		onseeking: 1,
		onselect: 1,
		onshow: 1,
		onstalled: 1,
		onstorage: 1,
		onsubmit: 1,
		onsuspend: 1,
		ontimeupdate: 1,
		onunload: 1,
		onvolumechange: 1,
		onwaiting: 1,
		open: 1,
		optimum: 1,
		pattern: 1,
		placeholder: 1,
		poster: 1,
		preload: 1,
		radiogroup: 1,
		readonly: 1,
		rel: 1,
		required: 1,
		reversed: 1,
		rows: 1,
		rowspan: 1,
		sandbox: 1,
		spellcheck: 1,
		scope: 1,
		scoped: 1,
		seamless: 1,
		selected: 1,
		shape: 1,
		size: 1,
		sizes: 1,
		span: 1,
		src: 1,
		srcdoc: 1,
		srclang: 1,
		start: 1,
		step: 1,
		style: 1,
		tabindex: 1,
		target: 1,
		title: 1,
		translate: 1,
		type: 1,
		typemustmatch: 1,
		usemap: 1,
		value: 1,
		width: 1,
		wrap: 1
	};

	return function (data, path, config) {
		//	summary:
		//		Processes an HTML file.

		var fileIsTemplate = /(?:^|\/)templates\//.test(path);

		if (!fileIsTemplate && config.onlyProcessTemplates) {
			console.info("Skipping non-template " + path);
			return;
		}

		var fragment = libxmljs.parseHtmlString(data).root();

		if (fileIsTemplate) {
			// When parsing HTML, libxml creates a complete DOM with <html> and <body> elements;
			// walk past these to get back to the fragment
			fragment = fragment.child(0).child(0);
		}

		util.traverseDom(fragment, function (node, parent) {
			var attribute;

			if (node.name() === "script" && (attribute = node.attr("djconfig"))) {
				node.attr({ "data-dojo-config": attribute.value() });
				attribute.remove();
			}

			if ((attribute = node.attr("jsid"))) {
				node.attr({ "data-dojo-id": attribute.value() });
				attribute.remove();
			}

			if ((attribute = node.attr("dojoattachpoint"))) {
				node.attr({ "data-dojo-attach-point": attribute.value() });
				attribute.remove();
			}

			if ((attribute = node.attr("dojoattachevent"))) {
				node.attr({ "data-dojo-attach-event": attribute.value() });
				attribute.remove();
			}

			if (node.name() === "script" && node.attr("type") && node.attr("type").value().indexOf("dojo/") === 0) {
				if ((attribute = node.attr("event"))) {
					node.attr({ "data-dojo-event": attribute.value() });
					attribute.remove();
				}

				if ((attribute = node.attr("args"))) {
					node.attr({ "data-dojo-args": attribute.value() });
					attribute.remove();
				}

				// TODO: Process content with script processor?
			}

			if ((attribute = node.attr("dojotype"))) {
				node.attr({ "data-dojo-type": util.toMid(attribute.value()) });
				attribute.remove();

				var dataDojoProps = {},
					hasDataDojoProps = false;

				node.attrs().forEach(function (attr) {
					var name = attr.name(),
						value = attr.value();

					if (VALID_ATTRIBUTES[name] || name.indexOf("data-") === 0) {
						return;
					}

					if (!isNaN(value)) {
						value = +value;
					}
					else if (value === "true" || value === "false") {
						value = value === "true";
					}

					// TODO: Arrays and objects and stuff

					hasDataDojoProps = true;
					dataDojoProps[name] = value;
					attr.remove();
				});

				dataDojoProps = JSON.stringify(dataDojoProps).slice(1, -1);
				if (dataDojoProps.length) {
					node.attr({ "data-dojo-props": dataDojoProps });
				}
			}
		});

		// libxmljs currently will only write out well-formed XML if we try to serialise the Document node; we do not
		// want this, so we regenerate the DOCTYPE ourselves and then serialise the root node to get a some valid
		// HTML instead
		var originalDoctype = /<!DOCTYPE[^>]+>\r?\n/.exec(data);
		if (!originalDoctype && !fileIsTemplate) {
			console.warn("Quirks mode in " + path);
		}

		return ((originalDoctype ? originalDoctype[0] : "") + fragment.toString()).replace(/src="[^"]+|href="[^"]+"/g, decodeURIComponent);
	};
});
