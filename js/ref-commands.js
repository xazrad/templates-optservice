$(document).ready(function(){
	var app = {};

	app.CommandModel = Backbone.Model.extend({
		idAttribute: '_id',
		defaults: {
			name: ''
		}
	});

	app.CommandCollection = Backbone.Collection.extend({
		model: app.CommandModel,
		
		url: 'http://127.0.0.1:8080/data/commands.json',

		// initialize: function () {
  //       	// This will be called when an item is added. pushed or unshifted
  //       	this.on('add', function(model) {
  //           	console.log(model.toJSON());
  //       	});
  //       },
  //       render: function(){
		// 	this.collection.each(function(command){
  //           	var commandView = new app.CommandItemView({ model: command });
  //           	console.log(command.el);
		// 	});
		// }

	});

	app.CommandItemView = Backbone.View.extend({
		tagName: 'tr',
		template: _.template($('#tpl_itemcommand').html()),

		initialize: function(){
			this.render();
		},
		render: function(){
			this.$el.html( this.template(this.model.toJSON()) );
			return this;
		}
	});

	app.CommandsView = Backbone.View.extend({
		el: $("#tbody-commands"),
		initialize: function() {
			this.listenTo(app.commandCollection, 'add', this.addOne);
			app.commandCollection.fetch({
				success: function(collection, response, options){
					// console.log(collection),
					// console.log(response),
					// console.log(options),
					// $('.js-basic-example').DataTable().draw();
					console.log(table.data());
					// http://stackoverflow.com/questions/27778389/how-to-manually-update-datatables-table-with-new-json-data
				},
				error: function(collection, response, options){console.log('error')}
				});
		},
		
		addOne: function(command) {
			var view = new app.CommandItemView({model: command});
      		this.$el.append(view.render().el);
    	}

	}); 

	app.commandCollection = new app.CommandCollection();
	app.commandsView = new app.CommandsView();



});