define([
], function (MenuItemCollection) {
    return Backbone.Model.extend({
        defaults:{
            active:false,
            children:[],
            icon:false,
            authOnly:false,
            anonOnly:false
        }
    });
});