var app = app || {};

app.PageView = Backbone.View.extend({

    el: '#dlistapp',

    events: {
        'click #new-item': 'clearInput',
        'keypress #new-item': 'createOnEnter',
        'blur #new-item': 'positionInput',
        'click #clear': 'clearAll'
    },

    initialize: function(){
        this.$input = this.$('#new-item');
        this.$main = this.$('#main');
        this.$list = this.$('#dlist');
        this.listenTo(app.List, 'add', this.addOne);
        this.listenTo(app.List, 'reset', this.addAll);

        app.List.fetch();
    },

    clearInput: function(){
        this.$input.find('label').html('');
    },

    positionInput: function(){
        var temp = this.$input.detach();
        this.$list.append(temp);
        this.$input.find('label').html('Add an Item');
    },

    addOne: function(item){
        var view = new app.ItemView({model: item});
        this.$list.append(view.render().el);
        this.positionInput();
    },

    addAll: function(){
         var temp = this.$input.detach();
        this.$list.html('');
        this.$list.append(temp);
        this.$input.find('label').html('Add an Item');
        app.List.each(this.addOne, this);
    },

    createOnEnter: function(event) {
        if (event.which !== ENTER_KEY || !this.$input.find('label').html().trim().stripTags()) {
            return;
        }
        app.List.create(this.newAttributes());
        event.preventDefault();
        this.$input.find('label').html('&nbsp;');
        this.$input.find('label').focus();
    },

    newAttributes: function() {
        return {
            title: this.$input.find('label').html().trim().stripTags(),
            id: app.List.nextOrder(),
            parent: this.$list.find('li').last().find('label').data('id')
        };
    },

    clearAll: function(){
        var list = [];
        app.List.each(function(item){
            list.push(item);
        })

        _.each(list, function(item){
            item.destroy();
        })
        app.List.reset();
    }

})