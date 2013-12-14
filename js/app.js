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


$(function() {
	new app.PageView();
});