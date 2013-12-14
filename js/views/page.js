var app = app || {};

app.PageView = Backbone.View.extend({

    el: '#dlistapp',

    events: {
        'click #new-item': 'clearInput',
        'keydown #new-item': 'keyEvents',
        // 'blur #new-item': 'positionInput',
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
        if(item.attributes.parent == 0){
            this.$list.append(view.render().el);
        }
        else {
            var parent = this.$('#dlist li label:[data-id=' + item.attributes.parent + ']').parent();
            if(!$(parent).find('ul')[0]){
                $(parent).append('<ul></ul>');
            }
            this.$('#dlist li label:[data-id=' + item.attributes.parent + ']').parent().find('ul').append(view.render().el);
        }
        this.positionInput();
    },

    addAll: function(){
         var temp = this.$input.detach();
        this.$list.html('');
        this.$list.append(temp);
        this.$input.find('label').html('Add an Item');
        app.List.each(this.addOne, this);
    },

    newAttributes: function() {
        var parent = this.$input.parent('ul').data('id') !== undefined ? this.$input.parent('ul').data('id') : this.$input.parent().parent().find('label').data('id');
        return {
            title: this.$input.find('label').html().stripTags().trim(),
            id: app.List.nextOrder(),
            parent: parent
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
    },

    keyEvents: function(e){
        switch(e.keyCode){
            case 13:
                this.createOnEnter();
                break;

            case 9:
                e.preventDefault();
                this.indent();
        }
    },

    createOnEnter: function() {
        if (!this.$input.find('label').html().stripTags().trim()) {
            return;
        }
        app.List.create(this.newAttributes());
        event.preventDefault();
        this.$input.find('label').html('&nbsp;');
        this.$input.find('label').focus();
    },

    indent: function(){
        var parent = this.$input.prev();
        // console.log($(parent).find('ul')[0]);
        if(!$(parent).find('ul')[0]){
            $(parent).append('<ul></ul>');
        }
        $(parent).find('ul').append($('#new-item'));

        if(!this.$input.find('label').html().stripTags().trim()){  
            this.$input.find('label').html('&nbsp;');
        }
        this.$input.find('label').focus().setCursorToEnd();
    }

})