define([
    'remote',
    'models/contact'
], function (Remote, Model) {
    return Backbone.Collection.extend({
        url:Remote.apiUrlBase + 'contact',
        model:Model
    });
});