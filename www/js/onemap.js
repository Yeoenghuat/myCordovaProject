document.addEventListener('deviceready', onDeviceReady, false);

var debugMessage = document.getElementById('debugging-message');

var onemapToken;

function onDeviceReady() {
    receivedEvent('deviceready');
}

function receivedEvent(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);

    var form = new FormData();
    form.append("email", "");
    form.append("password", "");

    var options = {
        "async": true,
        "crossDomain": true,
        "url": "https://developers.onemap.sg/privateapi/auth/post/getToken",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    }

    // Ajax call to request for token
    $.ajax(options).done(function (response) {
        onemapToken = JSON.parse(response)['access_token'];
        printToDebug('Token Received');
        printToDebug(onemapToken);
    });

    // Add event listener
    document.getElementById('start-point-name').addEventListener('change', this.searchLocation);
    document.getElementById('end-point-name').addEventListener('change', this.searchLocation);
    document.getElementById('ddl-start-point').addEventListener('change', this.updateCoords);
    document.getElementById('ddl-end-point').addEventListener('change', this.updateCoords);
    document.getElementById('ddl-route-via').addEventListener('change', this.changeRouteDistance);
    document.getElementById('distance-btn').addEventListener('click', this.calculateDistance);
}

function searchLocation(event) {
    var location;

    if (event.target.id == 'start-point-name') {
        location = document.getElementById('start-point-name').value;
        retrieveLocationByName(location, event.target.id);
    } else if (event.target.id == 'end-point-name') {
        location = document.getElementById('end-point-name').value;
        retrieveLocationByName(location, event.target.id);
    }
    printToDebug(event.target.id + " : " + location);
}

// Get location based on name, might receive more than one location
function retrieveLocationByName(location, point) {

    // Remove previous options from dropdown list
    document.getElementById((point == 'start-point-name') ? 'ddl-start-point' : 'ddl-end-point').innerText = null;

    var options = {
        "url": "https://developers.onemap.sg/commonapi/search?searchVal=" + location + "&returnGeom=Y&getAddrDetails=Y&pageNum=1",
        "method": "GET"
    }

    // Add all returned values into a dropdown list for user to select
    $.ajax(options).done(function (response) {
        console.log(response);
        var counter = 0;
        var ddlElement = document.getElementById((point == 'start-point-name') ? 'ddl-start-point' : 'ddl-end-point');
        response.results.forEach(function (element) {
            var option = document.createElement('option');
            option.value = JSON.stringify(element);
            option.innerHTML = element.ADDRESS;
            ddlElement.appendChild(option);
            // automatically retrieve the lat / long value of the first option in the dropdown list
            if (counter == 0) {
                if (point == 'start-point-name' || point == 'ddl-start-point') {
                    document.getElementById('start-x').value = response.results[0].LATITUDE;
                    document.getElementById('start-y').value = response.results[0].LONGITUDE;
                } else {
                    document.getElementById('end-x').value = response.results[0].LATITUDE;
                    document.getElementById('end-y').value = response.results[0].LONGITUDE;
                }
            }
        });
    });
}

// Get the distance between start and end point
function calculateDistance() {
    // Transit method configured to 'drive'
    var options = {
        "url": "https://developers.onemap.sg/privateapi/routingsvc/route?start=" + document.getElementById('start-x').value + "," + document.getElementById('start-y').value +
            "&end=" + document.getElementById('end-x').value + "," + document.getElementById('end-y').value + "&routeType=drive&token=" + onemapToken,
        "method": "GET"
    }

    $.ajax(options).done(function (response) {
        var counter = 0;
        var ddlElement = document.getElementById('ddl-route-via');
        ddlElement.innerText = null;

        var option = document.createElement('option');
        option.value = response.route_summary.total_distance;
        option.innerHTML = response.viaRoute;
        ddlElement.appendChild(option);

        if (counter == 0) {
            document.getElementById('total-distance-tb').value = document.getElementById('ddl-route-via').value + " m";
        }

        if (response.hasOwnProperty('alternativeroute')) {
            response.alternativeroute.forEach(function (element) {
                var option = document.createElement('option');
                option.value = element.route_summary.total_distance;
                option.innerHTML = element.viaRoute;
                ddlElement.appendChild(option);
                counter++;
            });
        }
    });
}

// Update route distance in textbox
function changeRouteDistance() {
    document.getElementById('total-distance-tb').value = document.getElementById('ddl-route-via').value + " m";
}

function updateCoords(event) {
    if (event.target.id == 'ddl-start-point') {
        var startPoint = JSON.parse(document.getElementById('ddl-start-point').value);
        document.getElementById('start-x').value = startPoint.LATITUDE;
        document.getElementById('start-y').value = startPoint.LONGITUDE;
    } else {
        var endPoint = JSON.parse(document.getElementById('ddl-end-point').value);
        document.getElementById('end-x').value = endPoint.LATITUDE;
        document.getElementById('end-y').value = endPoint.LONGITUDE;
    }
}

function printToDebug(message) {
    debugMessage.value += '\n[' + new Date().toLocaleString() + '] INFO: ' + message;
    debugMessage.scrollTop = debugMessage.scrollHeight;
}