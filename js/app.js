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


$(function() {
	new app.PageView();
});