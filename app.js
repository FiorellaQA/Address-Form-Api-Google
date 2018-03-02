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
/*
for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    console.log(addressType);
    if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        document.getElementById(addressType).value = val;
    }
}

*/
var map = {};
var latitud,
    longitud,
    miUbicacion,
    placeSearch,
    autocomplete,
    geocoder,
    marker;

function initAutocomplete() {
    geocoder = new google.maps.Geocoder();
    var uluru = {lat: -12.1191427, lng: -77.0349046};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: uluru,
        // disableDefaultUI: true
    });

    placeSearch = document.getElementById('autocomplete');
    autocomplete = new google.maps.places.Autocomplete(placeSearch, {
        types: ['geocode'],
        componentRestrictions: {
            country: 'pe'
        }
    });

    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    var place = autocomplete.getPlace();
    map.setCenter(place.geometry.location);
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: place.geometry.location
    });
    map.setZoom(17);  // Why 17? Because it looks

    google.maps.event.addListener(marker, 'dragend', function() {
        geocodePosition(marker.getPosition());
    });

    // for (var component in componentForm) {
    //     document.getElementById(component).value = '';
    //     document.getElementById(component).disabled = false;
    // }

    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        console.log(addressType);
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
}



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



// --------Ubicandome------//
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
                    map.setCenter(results[0].geometry.location);
                    marker = new google.maps.Marker({
                        map: map,
                        draggable: true,
                        position: results[0].geometry.location
                    });
                    map.setZoom(18);
                    geocodePosition(marker.getPosition());
                    google.maps.event.addListener(marker, 'dragend', function() {
                        geocodePosition(marker.getPosition());
                    });
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
