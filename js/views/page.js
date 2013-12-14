var app = app || {};

app.PageView = Backbone.View.extend({

    el: '#dlistapp',

    events: {
        'click #new-item': 'clearInput',
        'keydown #new-item': 'keyEvents',
        'blur #new-item': 'checkPrompt',
        'click #clear': 'clearAll'
    },

    initialize: function(){
        this.$input = this.$('#new-item');
        this.$main = this.$('#main');
        this.$list = this.$('#dlist');
        this.listenTo(app.List, 'add', this.addOne);
        this.listenTo(app.List, 'reset', this.addAll);
        this.listenTo(app.List, 'destroy', this.checkInput);

        app.List.fetch();
        var temp = this.$input.detach();
        this.$list.append(temp);
        this.$list.find('#new-item label').html('Add an Item');
   },

    clearInput: function(){
        this.$input.find('label').html('');
    },

    checkPrompt: function(){
        if(!this.inputVal()){
            this.$input.find('label').html('Add an Item');
        }
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
                $(parent).append('<ul></ul>');
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
                if(!e.shiftKey){
                    this.indent();
                }
                else {
                    this.outdent();
                }
                break;
        }
    },

    createOnEnter: function() {
        event.preventDefault();
        if (!this.inputVal()) {
            return;
        }
        var attr = this.newAttributes();
        app.List.create(attr);
        this.positionInput($('#dlist li label:[data-id=' + attr.id +']').parent());
        this.$input.find('label').html('&nbsp;');
        this.$input.find('label').focus();
    },

    indent: function(){
        var parentId = this.$input.parent('ul').data('id') !== undefined ? this.$input.parent('ul').data('id') : this.$input.parent().parent().find('label').data('id');
        if(parentId === 0){
            var parent = this.$input.prev();
            if(!$(parent).find('ul')[0]){
                $(parent).append('<ul></ul>');
            }
            $(parent).find('ul').append($('#new-item'));
            if(!this.inputVal() || this.inputVal() === 'Add an Item'){
                this.$input.find('label').html('&nbsp;');
            }
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
            this.$input.find('label').focus().setCursorToEnd();
        }
    }

})