var app = app || {};

app.ListCollection = function(id){
	var collection = Backbone.Firebase.Collection.extend({

		model: app.Item,

		// localStorage: new Backbone.LocalStorage('disposable-list'),
		firebase: new Firebase("https://leaflist.firebaseio.com/" + id),

		initialize: function(){
			this.listenTo(this, 'sync', function(){
				// console.log("synced");
			});
		},

		nextOrder: function() {
		      if (!this.length) {
				return 1;
		      }
			return this.last().get('id') + 1;
		}
	});

	return new collection(); 
};
