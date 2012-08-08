define([
    'events',
    'vm',
    'views/menu',
    'models/user'
], function (Events, Vm, MenuView, UserModel) {
    return Backbone.View.extend({
        el:$('#app'),
        initialize:function () {
            Events.on('userLogon', this.userLogon, this);
            Events.on('all', this.logEvents, this);
        },
        render:function () {
            Vm.create(this, 'mainmenu', MenuView);
        },
        userLogon:function () {
            $(document.body).data('authenticated', true);
            Events.trigger('userAuthChange');
            Events.trigger('navigate', 'map');
        },
        complete:function () {
            var user = new UserModel();
            user.bind('change', function (user) {
                if (user.get('authorized')) {
                    this.userLogon();
                }
            }, this);
            user.fetch();
        },
        // Log all events
        logEvents:function (eventName) {
            if (!_.isUndefined(console) && _.isFunction(console.log)) {
                console.log('Event: ' + eventName);
            }
        }
    });
});