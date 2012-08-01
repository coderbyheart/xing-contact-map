define([
    'models/menu/item'
], function (MenuItem) {
    return Backbone.Collection.extend({
        model:MenuItem
    });
});