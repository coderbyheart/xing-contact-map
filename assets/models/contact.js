define([
    'remote'
], function (Remote) {
    return Backbone.Model.extend({
        urlRoot:Remote.apiUrlBase + 'contact',
        defaults:{
            name:null,
            lon:null,
            lat:null,
            url:null
        }
    });
});