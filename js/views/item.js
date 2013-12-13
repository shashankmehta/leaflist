var app = app || {};

app.ItemView = Backbone.View.extend({

	tagName: 'li',

	template: _.template( $('#item-template').html() ),

	events: {
		'keypress label': 'updateOnEnter',
		'blur label': 'close'
	},

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},

	render: function(){
		this.$el.html( this.template( this.model.toJSON() ) );
		this.$label = this.$('label');
		return this;
	},

	updateOnEnter: function(e){
		if(e.which === ENTER_KEY){
			this.close();
			e.preventDefault();
		}
	},

	close: function(){
		var val = this.$label.html().trim().stripTags();
		if(val){
			this.model.save({title: val});
		}
	},

	parent: function(){
		var obj = this.$el.prev();
	}

});