window.address = "lima peru"
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_2: 'short_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};
var map = {};
var placeSearch = document.getElementById('autocomplete');
var autocomplete;
var geocoder;
var marker;

function initAutocomplete() {
    geocoder = new google.maps.Geocoder();
    var uluru = {lat: -12.1191427, lng: -77.0349046};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: uluru
        // disableDefaultUI: false
    });

    autocomplete = new google.maps.places.Autocomplete(placeSearch, {types: ['geocode'], componentRestrictions: {country: 'pe'}});

    // autocomplete.addListener('place_changed', fillInAddress);
    // google.maps.event.addListener(marker, 'dragend', function() {
    //     geocodePosition(marker.getPosition());
    // });
}

document.getElementById("search").addEventListener("click",function () {
    var place = autocomplete.getPlace();
    var location = place.geometry.location;
    addMarker(location);
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        console.log(addressType);
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
});


function geocodePosition(pos) {
    geocoder.geocode({
        latLng: pos
    }, function(responses) {
        if (responses && responses.length > 0) {
            marker.formatted_address = responses[0].formatted_address;
            window.address = responses[0].formatted_address;
            // document.getElementById("placeSaved").style.display="block";
            document.getElementById("autocomplete").value = window.address;
        } else {
            marker.formatted_address = 'Cannot determine address at this location.';
        }
    });
}

document.getElementById("encuentrame").addEventListener("click",function(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
    }
    function funcionExito(pos){
        geocoder.geocode({
            latLng: {lat: pos.coords.latitude, lng: pos.coords.longitude}
        }, function(responses) {
            window.address = responses[0].formatted_address;
            geocoder.geocode( { 'address': window.address}, function(results, status) {
                if (status === 'OK') {
                    var locationEncuentrame = results[0].geometry.location;
                    addMarker(locationEncuentrame);
                    geocodePosition(marker.getPosition());
                    popu();
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        });
    }
    function funcionError(error){
        alert("Tenemos un problema con encontrar tu ubicación");
    }
});

function popu() {
    var place = autocomplete.getPlace();
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        console.log(addressType);
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
}



/*
var place = autocomplete.getPlace();
for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    console.log(addressType);
    if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        document.getElementById(addressType).value = val;
    }
}

for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
}

*/

function addMarker(location) {
    if (!marker) {
        map.setCenter(location);
        map.setZoom(17);
        marker = new google.maps.Marker({
            position: location,
            map: map,
            draggable: true
        });
    } else {
        marker.setPosition(location);
        map.setCenter(location);
    }
    google.maps.event.addListener(marker, 'dragend', function() {
        geocodePosition(marker.getPosition());
    });
}