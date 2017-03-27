// $(document).ready(function(){
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

		initialize: function () {
        	// This will be called when an item is added. pushed or unshifted
        	this.on('add', function(model) {
            	console.log(model.toJSON());
        	});
        },
        render: function(){
			this.collection.each(function(command){
            	var commandView = new app.CommandItemView({ model: command });
            	console.log(command.el);
			});
		}

	});

	app.CommandItemView = Backbone.View.extend({
		tagName: 'tr',
		template: _.template( $('#item-command').html()),
		initialize: function(){
			this.render();
		},
		render: function(){
			this.$el.html( this.template(this.model.toJSON()));
		}
	});

	app.commandCollection = new app.CommandCollection();
	app.commandCollection.fetch();



// });