var app = app || {};

app.ItemView = Backbone.View.extend({

	tagName: 'li',

	template: _.template( $('#item-template').html() ),

	events: {
		'keypress label': 'updateOnEnter',
		'blur label': 'close',
		'click .destroy': 'delete',
		'mouseover label, .destroy': 'addClass',
		'mouseout label, .destroy': 'removeClass'
	},

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render: function(){
		this.$el.html( this.template( this.model.toJSON() ) );
		this.$label = this.$('label');
		this.$button = this.$('button')
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
		this.$button.removeClass('active');
	},

	delete: function(e){
		e.stopPropagation();
		this.model.destroy();
	},

	addClass: function(e){
		e.stopPropagation();
		this.$button.addClass('active');
	},

	removeClass: function(e){
		e.stopPropagation();
		this.$button.removeClass('active');
	}
});