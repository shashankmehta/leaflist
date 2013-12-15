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
		this.listenTo(this.model, 'remove', this.remove);
	},

	render: function(){
		this.$el.html( this.template(this.model.toJSON()));
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

	close: function(e){
		if(e.target.parentElement.id === "new-item"){
			return;
		}
		var val = this.$label.html().stripTags().trim();
		if(val){
			this.model.set({'title': val});
		}
		// this.$button.removeClass('active');
	},

	delete: function(e){
		e.stopPropagation();
		app.List.remove({'id': this.model.get('id')});
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