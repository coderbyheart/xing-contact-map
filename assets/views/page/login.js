/**
 * Kümmert sich um die Anzeige des Logins
 *
 * @author Markus Tacker <m@tckr.cc>
 */
define([
    'views/page/base',
    'events',
    'models/user',
    'text!templates/page/login.html'
], function (PageViewBase, Events, UserModel, LoginPageTemplate) {
    return PageViewBase.extend({
        template:_.template(LoginPageTemplate),
        initialize:function () {
            this.model = new UserModel();
            this.model.bind('change', this.render, this);
        },
        render:function () {
            $(this.el).html(this.template({model: this.model.toJSON()}));
            return this;
        },
        complete:function () {
            this.model.fetch(
                {
                    success:function (model, response) {
                        if (model.get('authorized')) {
                            Events.trigger('userLogon');
                            Events.trigger('navigate', 'map');
                        }
                    }
                });
        }
    });
});