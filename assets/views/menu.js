/**
 * Kümmert sich um die Anzeige des Hauptmenüs
 *
 * @author Markus Tacker <m@tckr.cc>
 */
define([
    'vm',
    'views/menu/group',
    'models/menu/group',
    'collections/menu/group',
    'models/menu/item',
    'collections/menu/item'
], function (Vm, MenuGroupView, MenuGroup, MenuGroupCollection, MenuItem, MenuItemCollection) {
    return Backbone.View.extend({
        el:'#mainmenu',
        initialize:function () {
            this.model = new MenuGroupCollection();
            this.model.bind("change", this.render, this);

            var rightMenuItems = new MenuItemCollection();
            rightMenuItems.add(new MenuItem({id:'login', label:'Anmelden', 'icon':'icon-user icon-white', anonOnly:true}));

            var rightGroup = new MenuGroup({'align':'right', children:rightMenuItems});
            this.model.add(rightGroup);
        },
        render:function () {
            $(this.el).empty();
            _.each(this.model.models, function (menuGroup) {
                $(this.el).append(new MenuGroupView({model:menuGroup}).render().el)
            }, this);
            return this;
        }
    });
});