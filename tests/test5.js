/*globals dojo:false */
(function () {
	dojo.require('dijit.form.Button');
	dojo.require('app.code');

	var widget = foo.adopt(dijit.form.Button);
	dojo.connect(widget, 'onClick', context, 'handler');

	var widget2 = foo.adopt(dijit.form.Button);
}());
