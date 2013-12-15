var app = app || {};

app.PageView = Backbone.View.extend({

    el: '#dlistapp',

    events: {
        'click #new-item': 'clearInput',
        'keydown #new-item': 'keyEvents',
        'blur #new-item': 'checkPrompt',
        'click #clear': 'clearAll',
        'click .addItem': 'addBetween'
    },

    initialize: function(){
        this.$input = this.$('#new-item');
        this.$main = this.$('#main');
        this.$list = this.$('#dlist');
        this.listenTo(app.List, 'add', this.addOne);
        this.listenTo(app.List, 'reset', this.addAll);
        this.listenTo(app.List, 'remove', this.checkInput);

        // Not needed anymore due to backbone.firebase.collection's auto syncing
        // app.List.fetch();

        var temp = this.$input.detach();
        this.$list.append(temp);
        this.$list.find('#new-item label').html('Add an Item');
        this.$list.append('<button class="addItem level1"></button>');
   },

    clearInput: function(){
        this.$input.find('label').html('');
    },

    checkPrompt: function(){
        this.$input.removeClass('active');
    },

    checkInput: function(){
        if(!$('#new-item').exists()){
            this.$list.append(this.$input);
        }
    },

    inputVal: function(){
        return this.$input.find('label').html().stripTags().trim();
    },

    positionInput: function(obj, focus){
        if($(obj).is('#new-item')){
            obj = $(obj).prev();
        }
        var temp = this.$input.detach();
        $(obj).after(temp);
        $(obj).find('#new-item label').html('Add an Item');

        if(focus){
            this.$input.find('label').html('&nbsp;');
            this.$input.find('label').focus();
        }
    },

    addOne: function(item){
        var view = new app.ItemView({model: item});
        if(item.attributes.parent == 0){
            this.$list.append(view.render().el);
        }
        else {
            var parent = this.$('#dlist li label:[data-id=' + item.attributes.parent + ']').parent();
            if(!$(parent).find('ul')[0]){
                var sublistTpl = _.template($('#sublist-template').html());
                $(parent).append(sublistTpl());
            }
            this.$('#dlist li label:[data-id=' + item.attributes.parent + ']').parent().find('ul').append(view.render().el);
        }
        // this.positionInput();
    },

    addAll: function(){
        var temp = this.$input.detach();
        this.$list.html('');
        this.$list.append(temp);
        this.$input.find('label').html('Add an Item');
        this.$list.append('<button class="addItem level1"></button>');
        app.List.each(this.addOne, this);
    },

    newAttributes: function() {
        var parent = this.$input.parent('ul').data('id') !== undefined ? this.$input.parent('ul').data('id') : this.$input.parent().parent().find('label').data('id');
        return {
            title: this.inputVal(),
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
            // item.destroy();
            app.List.remove({'id': item.get('id')});
        })
        app.List.reset();
    },

    keyEvents: function(e){
        switch(e.keyCode){
            case 13:
                this.createItem();
                e.preventDefault();
                break;

            case 9:
                e.preventDefault();
                if(!e.shiftKey){
                    this.indent();
                }
                else {
                    this.outdent();
                }
                break;
        }
    },

    createItem: function() {
        if (!this.inputVal()) {
            return;
        }
        var attr = this.newAttributes();
        app.List.create(attr);

        this.positionInput($('#dlist li label:[data-id=' + attr.id +']').parent());
        this.$input.addClass('active')
        this.$input.find('label').html('&nbsp;');
        this.$input.find('label').focus();
    },

    indent: function(){
        var parentId = this.$input.parent('ul').data('id') !== undefined ? this.$input.parent('ul').data('id') : this.$input.parent().parent().find('label').data('id');
        if(parentId === 0){
            var parent = this.$input.prev();
            if(!$(parent).find('ul')[0]){
                var sublistTpl = _.template($('#sublist-template').html());
                $(parent).append(sublistTpl());
            }
            $(parent).find('ul').append($('#new-item'));
            if(!this.inputVal() || this.inputVal() === 'Add an Item'){
                this.$input.find('label').html('&nbsp;');
            }
            this.$input.addClass('active');
            this.$input.find('label').focus().setCursorToEnd();
        }
    },

    outdent: function(){
        var parentId = this.$input.parent('ul').data('id') !== undefined ? this.$input.parent('ul').data('id') : this.$input.parent().parent().find('label').data('id');
        if(parentId !== 0){
            var parent = this.$input.parent().parent();
            $(parent).after($('#new-item'));
            if(!this.inputVal() || this.inputVal() === 'Add an Item'){
                this.$input.find('label').html('&nbsp;');
            }
            this.$input.addClass('active');
            this.$input.find('label').focus().setCursorToEnd();
        }
    },

    addBetween: function(e){
        if($(e.target).hasClass('level1')){
            var temp = this.$input.detach();
            this.$list.append(temp);
            this.$input.addClass('active');
            this.$input.find('label').html('&nbsp;');
            this.$input.find('label').focus();
        }
        else {
            this.$input.addClass('active');
            this.positionInput($(e.target).parent().find('ul li').last(), true);
        }
    }

})