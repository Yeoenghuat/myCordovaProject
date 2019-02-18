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

    document.getElementById('file-input').addEventListener('change', this.handleFileSelect);
    document.getElementById('camera-input').addEventListener('click', this.handleCameraScan);

    if(device.platform == 'browser'){
        document.getElementById('camera-input').disabled = true;
    }
}

var selectedFile;
var selectedFileBlob;

function handleFileSelect() {
    selectedFile = event.target.files[0];
    // Request for file system
    window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, onGSInitFs, onGSError);
}

function onGSInitFs(fs) {
    var reader = new FileReader();
    // Execute this when file reader load event is fired
    reader.onload = function (e) {
        selectedFileBlob = reader.result;
        var fileExt = selectedFile.name.split('.')[1];
        var cacheImgUri = `${cordova.file.cacheDirectory}scan.` + fileExt.toLowerCase();

        printToDebug('Platform: ' + device.platform);

        // Handle PDF Upload
        if (fileExt.toLowerCase() == 'pdf') {
            printToDebug('Uploading PDF file');
        }

        // Handle image upload
        if (device.platform == 'browser') {
            if (fileExt.toLowerCase() == 'jpg' || fileExt.toLowerCase() == 'png') {
                var blobURL = window.URL.createObjectURL(selectedFile);
                uploadFile(blobURL);
            } else {
                printToDebug('File format not supported');
            }
        } else if (device.platform == 'Android' || device.platform == 'IOS') {
            // create an empty temp file
            fs.root.getFile("scan." + fileExt.toLowerCase(), { create: true }, function (DatFile) {
                DatFile.createWriter(function (DatContent) {
                    // Write the content of the selected file into the temp file.
                    // The selected file is stored in memory, we need to write it into temp file to manipulate it.
                    DatContent.write(selectedFileBlob);
                    // Call GeniusScan to process the image
                    cordova.plugins.GeniusScan.scanImage(
                        cacheImgUri,
                        uploadFile,
                        onGSError,
                        {}
                    );
                })
            });
        } else {
            alert('Device not supported');
        }
    }
    // Read the selected file as Array Buffer
    reader.readAsArrayBuffer(selectedFile);
}

function handleCameraScan() {
    cordova.plugins.GeniusScan.scanCamera(
        uploadFile,
        onGSError,
        {}
    );
}

function onGSError(error) {
    debugMessage.value += '\n]' + new Date().toLocaleString() + '] ERROR: ' + JSON.stringify(error);
    debugMessage.scrollTop = debugMessage.scrollHeight;
}

function printToDebug(message) {
    debugMessage.value += '\n[' + new Date().toLocaleString() + '] INFO: ' + message;
    debugMessage.scrollTop = debugMessage.scrollHeight;
}

function uploadFile(fileUri) {
    printToDebug(fileUri);
    var imagePreview = document.getElementById("img_preview")
    imagePreview.setAttribute("src", fileUri);

    printToDebug('Uploading image file');
}