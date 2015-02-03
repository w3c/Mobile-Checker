# Mobile Checker

The Mobile Checker is a tool for Web developers who want to make their Web page or Web app work better on mobile devices.

This tool, is a full JavaScript web application, built with Node.js and Selenium WebDriver. Based on the mobile web browser emulator API, the Mobile Checker combines powerful technologies to simulate a web browser on a mobile device.
That's why, contrary to most of the current online mobile emulators, the Mobile Checker can provide an emulation close of what your web app looks like on different kinds of mobile devices, as well as tablets and smartphones.

The Mobile Checker was built to provide to all of us, web developers, a new and helpful experience of the mobile web developement.
We built the base. Now join us, and make it grant your wishes. We think you will make it awesome.

## Installation

Mobile Checker is a Node application. It will eventually be distributed through npm, but in the meantime
you can simply clone this repository:

	git clone https://github.com/w3c/Mobile-Checker.git

 and run:

    npm install -d

In order to get all the dependencies installed. Naturally, this requires that you have a reasonably
recent version of Node installed.

In addition to the npm dependencies, the checker needs:

* [google-chrome](https://www.google.com/chrome/)
* [browsermob-proxy](https://github.com/lightbody/browsermob-proxy/) running on port 8080
* [ImageMagick](http://www.imagemagick.org/)

## Running

It's pretty simple to run your own mobile checker:

    node app.js

Then, connect on the localhost:3000 port.

## Contribute

To contribute to the Mobile Checker please read the contribute [Guideline](https://github.com/w3c/Mobile-Checker/blob/master/CONTRIBUTING.md).

## Testing

Testing is done using mocha. Simply run:

    mocha --timeout 30000

from the root and you will be running the test suite. Mocha can be installed with:

    npm install -g mocha
