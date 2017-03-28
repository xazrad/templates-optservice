$(document).ready(function(){
	var app = {};

    $('#defaultModal').on('hidden.bs.modal', function(){
        $(this).find('form')[0].reset();
    });

	app.CommandModel = Backbone.Model.extend({
		idAttribute: '_id',
		defaults: {
			name: ''
		}
	});

	app.CommandCollection = Backbone.Collection.extend({
		model: app.CommandModel,
		url: 'http://127.0.0.1:8080/data/commands.json'
	});

	// app.CommandItemView = Backbone.View.extend({
	// 	tagName: 'tr',
	// 	template: _.template($('#tpl_itemcommand').html()),
    //
	// 	initialize: function(){
	// 		this.render();
	// 	},
	// 	render: function(){
	// 		this.$el.html( this.template(this.model.toJSON()) );
	// 		return this;
	// 	}
	// });

	app.CommandsView = Backbone.View.extend({
		el: $("#tbody-commands"),
		initialize: function() {
			// this.listenTo(app.commandCollection, 'add', this.addOne);

			app.commandCollection.fetch({
				success: this.fetch_success,
				error: function(collection, response, options){console.log('error')}
				});
		},
        events: {
            'click tr': 'click_tr'
		},
        fetch_success: function (collection, response, options) {
            console.log(response);
            table.clear();
            table.rows.add(response);
            table.draw();
            // $('.js-basic-example').DataTable().draw();
            // http://stackoverflow.com/questions/27778389/how-to-manually-update-datatables-table-with-new-json-data

        },
        click_tr: function (e) {
            var target = $(e.currentTarget);
            if ( target.hasClass('bg-cyan') ) {
                target.removeClass('bg-cyan');
            }
            else {
                this.$('tr.bg-cyan').removeClass('bg-cyan');
                target.addClass('bg-cyan');
            }
        }
		
        // addOne: function(command) {
			// var view = new app.CommandItemView({model: command});
      	// 	this.$el.append(view.render().el);
    	// }
	}); 

    app.CommandControlView = Backbone.View.extend({
        el: $('#control-commands'),
        events: {
            'click li a[action="add"]': 'add',
            'click li a[action="change"]': 'change'
        },
        add: function () {
            console.log('control click');
            $('#defaultModal').modal('show');
        },
        change: function () {
            var data_row = table.row( $('#tbody-commands tr.bg-cyan') ).data();
            // если не выбрана команда  alert
            if (data_row == undefined) {
                var allowDismiss = true;
                $.notify({
                    message: 'Необходимо выбрать команду из списка'
                },{
                    type: 'alert-warning',
                    allow_dismiss: allowDismiss,
                    newest_on_top: true,
                    timer: 1000,
                    placement: {
                        from: 'top',
                        align: 'left'
                    },
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    },
                    template: '<div data-notify="container" class="bootstrap-notify-container alert alert-dismissible {0} ' + (allowDismiss ? "p-r-35" : "") + '" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                    '<span data-notify="icon"></span> ' +
                    '<span data-notify="title">{1}</span> ' +
                    '<span data-notify="message">{2}</span>' +
                    '<div class="progress" data-notify="progressbar">' +
                    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                    '</div>' +
                    '<a href="{3}" target="{4}" data-notify="url"></a>' +
                    '</div>'
                });
                return;
            }
            var model = app.commandCollection.get(data_row._id);
            this.template = _.template( $('#tpl_modal_body').html() );

            console.log(this.template(model.toJSON() ));

            $('#defaultModal').find('.modal-body').html( this.template(model.toJSON() ));
            $('#defaultModal').modal('show');
            // $('#defaultModal').modal('show');
        }

    });

	app.commandCollection = new app.CommandCollection();
	app.commandsView = new app.CommandsView();
    app.commandControlView = new app.CommandControlView();

});