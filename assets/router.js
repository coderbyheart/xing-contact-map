define([ "events", "vm" ], function (Events, Vm) {
    return Backbone.Router.extend({
        initialize:function (appView) {
            this.appView = appView;
            Events.on('navigate', function (target) {
                this.navigate(target, {trigger:true});
            }, this);
        },
        routes:{
            "":"home",
            "*page":"showPage"
        },
        home:function () {
            this.showPage('login');
        },
        showPage:function (pageId, options) {
            var appView = this.appView;
            require([ 'views/page/' + pageId ], function (PageView) {
                $('#page').html(
                    Vm.create(appView, 'page', PageView, options).el);
            });
        }
    });
});
