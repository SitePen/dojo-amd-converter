dojo.requireLocalization("dijit", "common");
dojo.requireLocalization("foo.package", "Bundle");
dojo.requireLocalization("bar.package", "Bundle2");

var foo = dojo.i18n.getLocalization("foo.package", "Bundle"),
	bar = dojo.i18n.getLocalization("bar.package", "Bundle2", foo.bar),
	baz = {
		locale: "en-lol",
		i18n: dojo.i18n.getLocalization("bar.package", "Bundle2", this.locale)
	};