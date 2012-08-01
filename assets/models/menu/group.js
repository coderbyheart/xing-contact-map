define([
], function () {
    return Backbone.Model.extend({
        defaults:{
            children:[],
            align:null
        }
    });
});