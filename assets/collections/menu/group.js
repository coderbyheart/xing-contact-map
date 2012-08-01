define([
    'models/menu/group'
], function (MenuGroup) {
    return Backbone.Collection.extend({
        model:MenuGroup
    });
});