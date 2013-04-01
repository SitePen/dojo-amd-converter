dojo.require("dijit._Widget");

// this require is used by test4 to test amdone's ability to fix implicit global dependencies
dojo.require("dijit._Templated");

dojo.attr("foo", "bar");

dojo.declare("foo", dijit._Widget, {
	postCreate: function(){
		this.inherited(arguments);
		var foo = this.attr("foo");
		foo += 2;
		this.attr("foo", foo);
		this.attr("lol", lets, get, crazy, and, send, a, bunch, of, arguments, "for", "funzies");

		var subHandle = dojo.subscribe("a Topic", subHandler);
		var connectHandle = dojo.connect(obj, "onEvent", context, "handler");
		dojo.publish("a Topic");
		dojo.unsubscribe(subHandle);
		dojo.disconnect(connectHandle);
	}
});
