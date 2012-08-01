define([
    'remote'
], function (Remote) {
    return Backbone.Model.extend({
        urlRoot:Remote.apiUrlBase + 'auth',
        defaults:{
            name:'',
            authorized:false,
            auth_url:null
        }
    });
});