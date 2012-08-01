define([
    'events',
    'vm',
    'views/menu',
], function (Events, Vm, MenuView) {
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
        },
        // Log all events
        logEvents:function (eventName) {
            if (!_.isUndefined(console) && _.isFunction(console.log)) {
                console.log('Event: ' + eventName);
            }
        }
    });
});