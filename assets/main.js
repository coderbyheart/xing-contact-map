require.config({
    urlArgs:"bust=" + (new Date()).getTime(),
    paths:{
        text:'../vendor/require-text',
        templates:'../assets/templates'
    }
});

require([
    'views/app',
    'router'
], function (AppView, Router) {

    // App initialisieren
    var appView = new AppView();
    new Router(appView);
    appView.render();
    Backbone.history.start();
});
