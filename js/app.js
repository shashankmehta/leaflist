var app = app || {};
var ENTER_KEY = 13;

String.prototype.stripTags = function(){
	var entity = {
		quot: '"',
		lt: '<',
		gt: '>',
		nbsp: ' '
	};
	return function ( ) {
		return this.replace(/&([^&;]+);/g,
			function (a, b) {
				var r = entity[b];
				return typeof r === 'string' ? r : a;
			}
		);
	};
}( );

$.fn.setCursorToEnd = function(){
	return this.each(function(){
		var ele = $(this).get(0);
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStart(ele, 1);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	});
};

$.fn.exists = function () {
	return this.length !== 0;
};


app.listId = (function(){
	var ID_CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	var ID_LENGTH     = 7;

	var id = '';
	for (var x = 0; x < ID_LENGTH; x++) {
		id += ID_CHARACTERS.charAt(Math.floor(Math.random() * 62));
	}

	return id;
}());


$(function() {
	var leafListRouter = new LeafListRouter();
	Backbone.history.start();
	
	app.List = app.ListCollection(app.listId);
	new app.PageView();
});