var app = app || {};

var List = Backbone.Collection.extend({

	model: app.Item,

	localStorage: new Backbone.LocalStorage('disposable-list')
})

app.List = new List();