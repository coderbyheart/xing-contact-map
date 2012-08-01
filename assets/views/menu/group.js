/**
 * Eine Gruppe von Menüeinträgen (erzeugt ein Drop-Down-Menü)
 *
 * @author Markus Tacker <m@tckr.cc>
 */
define([
    'events',
    'views/menu/item'
], function (Events, MenuItemView) {
    return Backbone.View.extend({
        'tagName':'ul',
        'className':'nav',
        initialize:function () {
            Events.on('userAuthChange', this.userAuthChange, this);
        },
        'render':function () {
            var el = $(this.el);
            el.empty();
            _.each(this.model.get('children').models, function (menuItem) {
                el.append(new MenuItemView({'model':menuItem}).render().el);
            });

            var align = this.model.get('align');
            if (align) {
                if (align == 'left') el.addClass('pull-left');
                if (align == 'right') el.addClass('pull-right');
            }

            return this;
        },
        clean:function () {
            Events.off('userAuthChange', this.userAuthChange);
        },
        userAuthChange:function () {
            this.render();
        }
    });
});