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

            var leftMenuItems = new MenuItemCollection();
            leftMenuItems.add(new MenuItem({id:'map', label:'Karte', 'icon':'icon-flag icon-white', authOnly:true}));
            leftMenuItems.add(new MenuItem({href:'https://github.com/tacker/xing-contact-map', label:'Quellcode', 'icon':'icon-gift icon-white'}));
            var leftGroup = new MenuGroup({'align':'left', children:leftMenuItems});
            this.model.add(leftGroup);

            var rightMenuItems = new MenuItemCollection();
            rightMenuItems.add(new MenuItem({id:'login', label:'Anmelden', 'icon':'icon-user icon-white', anonOnly:true}));
            rightMenuItems.add(new MenuItem({href:'/logout', label:'Abmelden', 'icon':'icon-eject icon-white', authOnly:true}));
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