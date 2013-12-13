var app = app || {};

app.PageView = Backbone.View.extend({

    el: '#dlistapp',

    events: {
        'keypress #new-item': 'createOnEnter'
    },

    initialize: function(){
        this.$input = this.$('#new-item');
        this.$main = this.$('#main');
        this.listenTo(app.List, 'add', this.addOne);
        this.listenTo(app.List, 'reset', this.addAll);

        app.List.fetch();
    },

    addOne: function(item){
        var view = new app.ItemView({model: item});
        $('#dlist').append(view.render().el);
    },

    addAll: function(){
        this.$('#dlist').html('');
        app.List.each(this.addOne, this);
    },

    createOnEnter: function( event ) {
        if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
            return;
        }

        app.List.create( this.newAttributes() );
        this.$input.val('');
    },

    newAttributes: function() {
        return {
            title: this.$input.val().trim(),
        };
    },

})