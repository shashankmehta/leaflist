var  app = app || {};

app.Item = Backbone.Model.extend({

	defaults: {
		id: '',
		title: '',
		parent: ''
	}

})