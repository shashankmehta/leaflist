var LeafListRouter = Backbone.Router.extend({
  routes: {
    "": "default",
    ":id": "loadPrev"
  },

  default: function(){
    this.navigate(app.listId); // updates the fragment for us, but doesn't trigger the route
  },

  loadPrev: function(id) {
    app.listId = id;
  }
});