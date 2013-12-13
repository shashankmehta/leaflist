var app = app || {};

var List = Backbone.Collection.extend({

	model: app.Item,

	localStorage: new Backbone.LocalStorage('disposable-list'),

	nextOrder: function() {
	      if (!this.length) {
			return 1;
	      }
		return this.last().get('id') + 1;
	}
})

app.List = new List();