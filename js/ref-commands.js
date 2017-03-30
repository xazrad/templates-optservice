$(function () {
    function showNotification(text, type){
        allowDismiss = true;
        $.notify({
            message: text
        }, {
            type: type,
            allow_dismiss: true,
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
    }
    app = {};

    // модели
    app.AssortimentModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    app.PriceListModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    app.PersonModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    app.CommandModel = Backbone.Model.extend({
		idAttribute: '_id'
	});

    // collections
    app.AssortimentCollection = Backbone.Collection.extend({
        model: app.AssortimentModel
    });

    app.PriceListCollection = Backbone.Collection.extend({
        model: app.PriceListModel
    });

    app.PersonCollection = Backbone.Collection.extend({
        model: app.PersonModel
    });

	app.CommandCollection = Backbone.Collection.extend({
		model: app.CommandModel
	});

    // views
	app.CommandCollectionView = Backbone.View.extend({
		el: $("#tbody-commands"),
		initialize: function(options) {
            this.collectionPersons = options.collectionPersons;
            this.collectionPriceLists = options.collectionPriceLists;
            this.assortimentCollection = options.assortimentCollection;

            this.router = options.router;

            this.listenTo(this.router, 'route:showCommand', this.change_router);
            this.render();
		},
        events: {
            'click tr': 'click_tr'
		},
        change_router: function (id) {
            this.$('tr.bg-cyan').removeClass('bg-cyan');
            var target = this.$('tr#'+id);
            target.addClass('bg-cyan');
        },
        render: function () {
            response = this.collection.toJSON();
            var _this = this;

            _.each(response, function (value, key) {
                // проставим имя пользователя
                response[key].supervisor = _this.collectionPersons.get(value.supervisor_id).get('name');
                response[key].pricelist = _this.collectionPriceLists.get(value.pricelist_id).get('name');
                response[key].assortiment = _this.assortimentCollection.get(value.assortiment_id).get('name');
                console.log(value.van);
                response[key].van = value.van ? "Да" : "Нет";
            });

            table.clear();
            table.rows.add(response);
            table.draw();
        },
        click_tr: function (e) {
            var target_id = $(e.currentTarget).attr('id');
            this.router.navigate('!'+target_id, true);
        }
	});

    app.CommandModalView = Backbone.View.extend({
        el: '#defaultModal',
        initialize: function (options) {
            this.collectionPersons = options.collectionPersons;
            this.collectionPriceLists = options.collectionPriceLists;
            this.assortimentCollection = options.assortimentCollection;

            this.init_prepare();
        },
        init_prepare: function () {
            var _this = this;

            this.collectionPersons.each(function(person) {
                // console.log(person);
                _this.$('select[name="persons"]').append(
                    $("<option></option>")
                        .attr("value", person.get('_id') )
                        .text(person.get('name'))
                );
            });

            this.collectionPriceLists.each(function(priceList) {
                _this.$('select[name="priceLists"]').append(
                    $("<option></option>")
                        .attr("value", priceList.get('_id') )
                        .text(priceList.get('name'))
                );
            });

            this.assortimentCollection.each(function(assortiment) {
                _this.$('select[name="assortiment"]').append(
                    $("<option></option>")
                        .attr("value", assortiment.get('_id') )
                        .text(assortiment.get('name'))
                );
            });
            this.$('select').selectpicker('refresh');
        },
        show: function (model) {
            this.$('form')[0].reset();
            this.$('.form-line').removeClass('focused');

            this.$('select option').prop('selected', false);

            if (model) {
                this.$('input[name="name"]').val(model.get('name'));
                this.$('select[name="persons"]').val(model.get('supervisor_id'));
                this.$('select[name="priceLists"]').val(model.get('pricelist_id'));
                this.$('select[name="assortiment"]').val(model.get('assortiment_id'));
                this.$('#van').prop('checked', model.get('van'));

                this.$('input[name="name"]').parent().addClass('focused');

            }
            this.$('select').selectpicker('refresh');
            this.$el.modal('show');

        }
    });

    app.CommandControlView = Backbone.View.extend({
        el: $('#control-commands'),

        initialize: function (option) {
            this.modal = option.modal;
        },
        events: {
            'click li a[action="add"]': 'add',
            'click li a[action="change"]': 'change'
        },
        add: function () {
            console.log('add');
            this.modal.show();
        },
        change: function () {
            var id = Backbone.history.getFragment().replace('!', '');
            // если не выбрана команда  alert
            if (!id) {
                showNotification('Необходимо выбрать команду из списка', 'alert-warning');
                return
            }

            this.modal.show(this.collection.get(id));

            // console.log(app.router.routes[Backbone.history.getFragment()]);
            // var data_row = table.row($('#tbody-commands tr.bg-cyan')).data();
            // // если не выбрана команда  alert
            // if (data_row == undefined) {
            //     var allowDismiss = true;
            //     $.notify({
            //         message: 'Необходимо выбрать команду из списка'
            //     }, {
            //         type: 'alert-warning',
            //         allow_dismiss: allowDismiss,
            //         newest_on_top: true,
            //         timer: 1000,
            //         placement: {
            //             from: 'top',
            //             align: 'left'
            //         },
            //         animate: {
            //             enter: 'animated fadeInDown',
            //             exit: 'animated fadeOutUp'
            //         },
            //         template: '<div data-notify="container" class="bootstrap-notify-container alert alert-dismissible {0} ' + (allowDismiss ? "p-r-35" : "") + '" role="alert">' +
            //         '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            //         '<span data-notify="icon"></span> ' +
            //         '<span data-notify="title">{1}</span> ' +
            //         '<span data-notify="message">{2}</span>' +
            //         '<div class="progress" data-notify="progressbar">' +
            //         '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            //         '</div>' +
            //         '<a href="{3}" target="{4}" data-notify="url"></a>' +
            //         '</div>'
            //     });
            //     return;
            // }
            // var model = app.commandCollection.get(data_row._id);
            //
            // app.commandModalView.show(model);
        }

    });

    // router
    app.Router = Backbone.Router.extend({
        routes: {
            '!:id': 'showCommand',
            '': 'clearCommand'
        },
        showCommand: function (id) {
            var command = app.commandCollection.get(id);
            if (command == undefined) {
                this.navigate('', true);
                return;
            }
        },
        clearCommand: function () {
            // console.log('!!!clear');
        }
    });

});
