
# myCordovaProject

Cordova, formerly called as Phone Gap is a platform to build Native Mobile Applications using HTML5, CSS and Java Script.

In other words, it acts a container for running a web application written in HTML, CSS, JS Typically Web applications cannot use the native device functionality like Camera, GPS, Accelerometer, Contacts etc. With Cordova we can very much achieve this and package the web application in the devices installer format.


## Prerequisites

1. Download and install Nodejs LTS

2. Update node package manager to the latest version globally

```bash

npm install npm@latest -g

```

3. Download and install Java (Version 1.8)

4. Download and install Android Studio

5. Download Android SDK and Setup Android Emulator using AVD Manager (API 27, Android Oreo)

6. Install Cordova CLI globally (Version 8.1.2)

```bash

npm install -g cordova

```


## Usage

Add cordova plaform for project

It will download all required dependencies

```bash

cordova platform add android browser

```

  
## Useful Commands

1. Create new Cordova project

cordova create <Dir Name> <Reverse Domain Name> <App Name>

```bash

cordova create myCordovaProject com.example.cordova.myApp myApp

```


2. Add the necessary platforms to project <Optional>

Enter the following command in the project folder

cordova platform add <android,  IOS,  windows,  browser>

```bash

cordova platform add android

```


3. Build project for specific platform

cordova build <android,  IOS,  windows,  browser>

```bash

cordova build android

```


4. Add live reload plugin for development purpose <Optional>

```bash

cordova plugin add cordova-plugin-browsersync

```


5. Run project for specific platform

cordova run <android,  IOS,  windows,  browser>

```bash

cordova run android

cordova run browser -- --live-reload --target=chrome (if browsersync plugin is installed)

```

## Additional Info

**Splash Screen & App Icon**

Splash screen and App Icon are configured in the config.xml file. Multiple icon / screen images are required for different phone sizes. You can use this [link](https://pgicons.abiro.com/) to help you generate icons / screens for different resolution.

**Screen capture / Task switcher**

This [plugin](https://www.npmjs.com/package/cordova-plugin-privacyscreen) is used to block screen capture and task snapshots. No configuration is needed.

**Is device rooted**

This [plugin](https://www.npmjs.com/package/cordova-plugin-iroot) is used check if device is rooted.
Set adb to root for android emulator (use Google API Image for root enabled emulator) to test out.

**Bootstrap**
  
 Bootstrap 4.2.1 requires additional packages: Jquery, Poppy.js

  
**Plugin Installation**

Additional packages installed using npm will only be available to the browser platform. Use cordova command to install plugins for android / ios projects.

## Useful links

1. Supported Plugin APIs: [link](https://cordova.apache.org/docs/en/latest/guide/support/index.html)

2. FileSystem API [link](https://www.jotform.com/blog/html5-filesystem-api-create-files-store-locally-using-javascript-webkit/)

3. Blob File [link](https://stackoverflow.com/questions/30864573/what-is-a-blob-url-and-why-it-is-used)