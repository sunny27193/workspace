// global variable declaration

var map;
var markers = [];
var fs = 'https://api.foursquare.com/v2/venues/search?client_id=' +
    'RXTKNR13PAJ1HTJ5C0S5G0FR4OANS3A3XFWNLIGDGNN3Q0VX' +
    '&client_secret=OZSMXEMARDPACMGMTUEXHVGLG1QDD123JB4TLHD0SYYCKFP0';
// initialize map

function initMap() {
    var mapOptions = {
        zoom: 18,
        center: new google.maps.LatLng(12.9382328, 77.6289805)
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    ko.applyBindings(new appViewModel());
}

// listing to be displayed

var placeArray = [{
    name: 'Oasis Center',
    lat: 12.9375433,
    long: 77.6280165
}, {
    name: 'Barleyz',
    lat: 12.9376218,
    long: 77.6269792
}, {
    name: 'HDFC Bank ATM',
    lat: 12.9386243,
    long: 77.6304922
}, {
    name: 'Food Affairs',
    lat: 12.9383949,
    long: 77.6304051
}, {
    name: 'Bak Bak Bar',
    lat: 12.9380433,
    long: 77.6277269
}];

// setting up data for info Window
var Location = function(data) {
    var self = this;
    this.name = ko.observable(self.name);
    this.lat = ko.observable(self.lat);
    this.long = ko.observable(self.long);
    this.URL = ko.observable("");
    this.street = ko.observable("");
    this.city = ko.observable("");
    this.phone = ko.observable("");
    this.filtervisible = ko.observable(true);

    // set up foursquare url

    var fsurl = fs +
        '&v=20140806' + '&ll=' + data.lat + ',' +
        data.long + '&query=\'' + data.name + '\'&limit=1';

    $.getJSON(fsurl).done(function(data) {
        var results = data.response.venues[0];
        self.URL = results.url;
        self.street = results.location.formattedAddress[0];
        self.city = results.location.formattedAddress[1];
        self.phone = results.contact.phone;
    });


    this.infoWindow = new google.maps.InfoWindow({
        content: self.contentString
    });

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.long),
        map: map,
        title: data.name
    });

    this.showInfo = ko.computed(function() {
        if (this.filtervisible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);

    this.marker.addListener('click', function() {
        self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
            '<div class="content"><a href="' + self.URL + '">' + self.URL + "</a></div>" +
            '<div class="content">' + self.street + "</div>" +
            '<div class="content">' + self.city + "</div>" +
            '<div class="content"><a href="tel:' + self.phone + '">' + self.phone + "</a></div></div>";

        self.infoWindow.setContent(self.contentString);
        self.infoWindow.open(map, this);
    });

    this.bounce = function(place) {
        google.maps.event.trigger(self.marker, 'click');
    };
};

function appViewModel() {
    var self = this;
    self.searchItem = ko.observable("");
    self.locationList = ko.observableArray([]);
    self.showList = ko.observableArray();

    placeArray.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem));
    });



//

        self.filterMarkers = function() {
            var filter = self.searchItem().toLowerCase();
            self.showList().removeAll();

            self.locationList().forEach(function(locationItem) {

                locationItem.marker.setVisible(!1), -1 !== locationItem.name().toLowerCase().indexOf(filter) && this.showList.push(locationItem)
            }), self.showList().forEach(function(self) {
                self.marker.setVisible(!0)
            });
        }

}

function googleError() {
    "use strict";
    document.getElementById("map").innerHTML = "<h2>Google Maps is not loading. Please try refreshing the page later.</h2>"
}

function foursquareError() {
    "use strict";
    document.getElementById("map").innerHTML = "<h2>Four Square data is not loading. Please try refreshing the page later.</h2>"
}
