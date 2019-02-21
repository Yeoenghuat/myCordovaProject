document.addEventListener('deviceready', onDeviceReady, false);

var debugMessage = document.getElementById('debugging-message');

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

    document.getElementById('device-plugin').addEventListener('click', this.deviceFeature);
    document.getElementById('camera-plugin').addEventListener('click', this.cameraFeature);
    document.getElementById('battery-plugin').addEventListener('click', this.batteryFeature);
    document.getElementById('dialog-plugin').addEventListener('click', this.dialogFeature);
    document.getElementById('screen-plugin').addEventListener('click', this.screenFeature);
    document.getElementById('geolocation-plugin').addEventListener('click', this.geolocationFeature);
    document.getElementById('inAppBrowser-plugin').addEventListener('click', this.inAppBrowserFeature);
    document.getElementById('vibration-plugin').addEventListener('click', this.vibrationFeature);
    document.getElementById('file-upload-plugin').addEventListener('click', this.fileUploadFeature);
    document.getElementById('file-download-plugin').addEventListener('click', this.fileDownloadFeature);
    document.getElementById('scan_img_btn').addEventListener('click', this.geniusScanImageFeature);
    document.getElementById('scan_camera_btn').addEventListener('click', this.geniusScanCameraFeature);
    document.getElementById('scan_pdf_btn').addEventListener('click', this.geniusScanPDFFeature);
    document.getElementById('file-input').addEventListener('change', this.handleFileSelect);
}

/*Camera Feature*/
function cameraFeature() {
    navigator.camera.getPicture(this.onCameraSuccess, this.onCameraFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA
    });
}

function onCameraSuccess(imageData) {
    var image = document.getElementById('my-capture-img');
    image.src = "data:image/jpeg;base64," + imageData;
}

function onCameraFail(message) {
    alert('Failed because: ' + message);
}
/*End of Camera Feature*/

/*Device Info Feature*/
function deviceFeature() {
    alert("Device model: " + device.model + '\n' +
        "Device version: " + device.version + '\n' +
        "Device Platform: " + device.platform);
}
/*End of Device Info Feature* */

/*Battery Status Feature*/
function batteryFeature() {
    window.addEventListener("batterystatus", onBatteryStatus, false);
}

function onBatteryStatus(status) {
    alert("Battery Level: " + status.level + '\n' +
        "is Plugged: " + status.isPlugged);
}
/*End of Battery Status Feature*/

/*Dialog Feature*/
function dialogFeature() {
    navigator.notification.confirm(
        'Confirm Notification', // message
        onConfirm, // callback to invoke with index of button pressed
        'Notification', // title
        ['Continue', 'Exit'] // buttonLabels
    );
}

function onConfirm(btnIndex) {
    alert('Callback function: Button ' + btnIndex);
}
/*End of Dialog Feature*/

/*Screen Orientation Feature*/
function screenFeature() {
    screen.orientation.lock('landscape');
    screen.orientation.unlock();
    alert('Orientation is: ' + screen.orientation.type);
}
/*End of Screen Orientation Feature*/

/*Geolocation Feature*/
function geolocationFeature() {
    navigator.geolocation.getCurrentPosition(geolocationSuccess,
        geolocationError);
}

function geolocationSuccess(position) {
    alert('Latitude: ' + position.coords.latitude + '\n' +
        'Longitude: ' + position.coords.longitude + '\n' +
        'Altitude: ' + position.coords.altitude + '\n' +
        'Accuracy: ' + position.coords.accuracy + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
        'Heading: ' + position.coords.heading + '\n' +
        'Speed: ' + position.coords.speed + '\n' +
        'Timestamp: ' + position.timestamp + '\n');
}

function geolocationError() {
    alert('Failed to get geolocation' + '\n' +
        'code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}
/*End of Geolocation Feature*/

/*In App Browser Feature*/
function inAppBrowserFeature() {
    var url = document.getElementById('url-tb').value;
    var ddl = document.getElementById('target-ddl');
    var target = ddl.options[ddl.selectedIndex].value;
    var options = "location=yes,hidden=yes";

    if (url) {
        var iABrowser = cordova.InAppBrowser.open(url, target, options);

        iABrowser.addEventListener('loadstart', loadStartCallBack);
        iABrowser.addEventListener('loadstop', loadStopCallBack);
        iABrowser.addEventListener('loaderror', loadErrorCallBack);

        iABrowser.show();

    } else {
        alert('Empty URL');

    }
}

function loadStartCallBack() {
    alert('Loading page, please wait.');
}

function loadStopCallBack() {
    alert('Page Loaded.');
}

function loadErrorCallBack() {
    alert('Error loading page.');
}
/*End of In App Browser Feature*/

/*Vibration Feature*/
function vibrationFeature() {
    var time = [1000, 500, 1500, 500, 1000];
    navigator.vibrate(time)
}
/*End of Vibration Feature*/

/*File Upload Feature*/
function fileUploadFeature() {
    var serverURL = document.getElementById('file-upload-url').value;

    var options = new FileUploadOptions();
    options.fileKey = "fle"
    options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
    options.mimeType = "text/plain";

    var params = {};
    params.value1 = "test";
    params.value2 = "param";

    var headers = { 'headerParam': 'headerValue', 'headerParam2': 'headerValue2' };

    options.params = params;
    options.headers = headers; // For android and ios only

    this.fileUpload(options, serverURL);
}

function fileUploadSuccess(result) {
    alert('Code: ' + result.responseCode + '\n' +
        'Response: ' + result.response + '\n' +
        'Sent: ' + result.bytesSent);
}

function fileUploadFail(error) {
    alert('An error has occurred: Code = : ' + error.code + '\n' +
        'Upload error source: ' + error.source + '\n' +
        'Upload error target: ' + error.target);
}

function fileUpload(options, url) {
    var fileTransfer = new FileTransfer();
    fileTransfer.upload(fileURL, encodeURI(url), this.fileUploadSuccess, this.fileUploadFail, options);
}
/*End of File Upload Feature*/

/*File Download Feature*/
function fileDownloadFeature() {
    window.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, function(fs) {

        console.log('file system open: ' + fs.name);
        var url = 'http://cordova.apache.org/static/img/cordova_bot.png'
            // create the download directory is doesn't exist
        fs.root.getDirectory('downloads', { create: true });

        // we will save file in .. downloads/phonegap-logo.png
        var filePath = fs.root.fullPath + '/downloads/' + url.split('/').pop();
        var fileTransfer = new window.FileTransfer();
        var uri = encodeURI(decodeURIComponent(url));

        fileTransfer.download(uri, filePath, function(entry) {
                alert('Download Success: ' + entry.fullPath);
            },
            function(error) {
                alert('An error has occurred: Code = : ' + error.code + '\n' +
                    'Download error source: ' + error.source + '\n' +
                    'Download error target: ' + error.target);
            },
            false);

    }, this.onErrorLoadFs);
}

function onErrorLoadFs() {
    alert('Failed to load Fs');
}

/*End of File Download Feature*/

/*Genius Scan Feature*/
function geniusScanCameraFeature() {
    var bwFilterCheckbox = document.getElementById("bw_filter");
    cordova.plugins.GeniusScan.scanCamera(
        setPicture,
        onGSError,
        bwFilterCheckbox.checked ? { defaultEnhancement: cordova.plugins.GeniusScan.ENHANCEMENT_BW } : {}
    );
}

var selectedFile;
var selectedFileBlob;

function geniusScanImageFeature() {
    // Open file browser
    var fileInput = document.getElementById('file-input');
    fileInput.click();
}

function handleFileSelect(event) {
    selectedFile = event.target.files[0];
    // Request for file system
    window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, onGSInitFs, onErrorLoadFs);
}

function onGSInitFs(fs) {
    var bwFilterCheckbox = document.getElementById("bw_filter");
    var cacheImgUri = `${cordova.file.cacheDirectory}scan.jpg`;

    var reader = new FileReader();
    // Execute this when file reader load event is fired
    reader.onload = function(e) {
        selectedFileBlob = reader.result;
        // create an empty temp file, "scan.jpg"
        fs.root.getFile("scan.jpg", { create: true }, function(DatFile) {
            DatFile.createWriter(function(DatContent) {
                // Write the content of the selected file into the temp file.
                // The selected file is stored in memory, we need to write it into temp file to manipulate it.
                DatContent.write(selectedFileBlob);
                // Call GeniusScan to process the image
                cordova.plugins.GeniusScan.scanImage(
                    cacheImgUri,
                    setPicture,
                    onGSError,
                    bwFilterCheckbox.checked ? { defaultEnhancement: cordova.plugins.GeniusScan.ENHANCEMENT_BW } : {}
                );
            })
        });
    }

    // Read the selected file as Array Buffer
    reader.readAsArrayBuffer(selectedFile);
}

function geniusScanPDFFeature() {
    var fileUri = document.getElementById("file-uri").value;

    cordova.plugins.GeniusScan.generatePDF(
        'Demo scan', [fileUri],
        onPDFSuccess,
        onGSError, { password: 'test' }
    );
}

function onPDFSuccess(pdfUri) {
    alert('PDF generated at: ' + pdfUri);
}

function onGSError(error) {
    //alert("Error: " + JSON.stringify(error));
    debugMessage.value += '\n[' + new Date().toLocaleString() + '] Error: ' + JSON.stringify(error)
    debugMessage.scrollTop = debugMessage.scrollHeight;
}

function setPicture(fileUri) {
    var imagePreview = document.getElementById("img_preview")
    var pdfButton = document.getElementById("scan_pdf_btn");
    var fileUriTb = document.getElementById("file-uri");

    imagePreview.setAttribute("src", fileUri);
    fileUriTb.value = fileUri;
    pdfButton.disabled = false;
}
/*End of Genius Scan Feature*/