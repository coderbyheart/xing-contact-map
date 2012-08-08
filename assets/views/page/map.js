define([
    'events',
    'views/page/base',
    'collections/contact',
    'text!templates/page/map.html'
], function (Events, PageViewBase, ContactCollection, Template) {
    return PageViewBase.extend({
        template:_.template(Template),
        initialize:function () {
            this.model = new ContactCollection();
            Events.on('maps', this.onMapsEvent, this);

        },
        render:function () {
            $(this.el).html(this.template({model:this.model.toJSON()}));
            return this;
        },
        onMapsEvent:function () {
            var mapOptions = {
                center:new google.maps.LatLng(51.055207, 10.411743),
                zoom:6,
                mapTypeId:google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map_canvas"),
                mapOptions);

            var mc = $('#map_canvas');
            mc.height($(window).height() - 80);

            var m = this.model;

            m.fetch({success:function (model) {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'address':model.models[0].get('address')}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                    } else {
                        alert("Geocode was not successful for the following reason: " + status);
                    }
                });
                _.each(model.models, function (contact) {
                    geocoder.geocode({ 'address':contact.get('address')}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var marker = new google.maps.Marker({
                                map:map,
                                position:results[0].geometry.location,
                                title:contact.get('name')
                            });
                            var infowindow = new google.maps.InfoWindow(
                                {
                                    content:'<a href="' + contact.get('url') + '">' + contact.get('name') + '</a><br>' + contact.get('address'),
                                    size:new google.maps.Size(50, 50)
                                });
                            google.maps.event.addListener(marker, 'click', function (event) {
                                infowindow.open(map, marker);
                            });
                        }
                    });
                });
            }});
        }
    });
});