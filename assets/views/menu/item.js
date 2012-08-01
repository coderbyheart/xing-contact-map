/**
 * Ein Menüeintrag
 *
 * @author Markus Tacker <m@tckr.cc>
 */
define([
], function () {
        return Backbone.View.extend({
            'tagName':'li',
            'render':function () {
                var auth = $(document.body).data('authenticated');
                var authOnly = this.model.get('authOnly');
                var anonOnly = this.model.get('anonOnly');
                if (auth && anonOnly) return this;
                if (!auth && authOnly) return this;

                var children = this.model.get('children');
                var el = $(this.el);
                if (children.length > 0) {
                    el.append(_.template('<a href="#<%= id %>" class="dropdown-toggle" data-toggle="dropdown"><%= label %><b class="caret"></b></a><ul class="dropdown-menu"></ul>', this.model.toJSON()));
                    var ul = el.find('ul');
                    _.each(children, function (child) {
                        ul.append(_.template('<li class="child"><a href="#<%= id %>"><%= label %></a></li>', child.toJSON()));
                    });
                    el.addClass('dropdown');
                } else {
                    el.append(_.template('<a href="#<%= id %>"><%= label %></a>', this.model.toJSON()));
                }

                var icon = this.model.get('icon');
                if (icon) {
                    el.find('a:first').prepend('<i class="' + icon + '"></i> ');
                }

                var active = this.model.get('active');
                if (active) el.addClass('active');

                return this;
            }
        });
    }
)
;