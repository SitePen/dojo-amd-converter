dojo.provide("foo.bar");
dojo.require("dijit._Widget");

// dijit._Templated is required in test3, but we use it here globally to test what happens
// when someone has created an implicit global dependency. amdone should automatically add it
// as a dependency in this file to fix it.

dojo.declare("foo.bar", [ dijit._Widget, dijit._Templated ], {
	templateString: dojo.cache("foo", "foo.html"),
	templateOther: dojo.cache("foo", "bar.html")
});