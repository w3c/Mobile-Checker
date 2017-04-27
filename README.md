![alt mobile checker by the World Wide Web Consortium](https://github.com/w3c/Mobile-Checker/blob/master/public/img/mobilechecker-logo-w3c.png)

[![Build Status](https://travis-ci.org/w3c/Mobile-Checker.svg?branch=master)](https://travis-ci.org/w3c/Mobile-Checker)
[![Coverage Status](https://coveralls.io/repos/w3c/Mobile-Checker/badge.svg)](https://coveralls.io/r/w3c/Mobile-Checker)
[![Dependency Status](https://david-dm.org/w3c/Mobile-Checker.svg)](https://david-dm.org/w3c/Mobile-Checker)
[![devDependency Status](https://david-dm.org/w3c/Mobile-Checker/dev-status.svg)](https://david-dm.org/w3c/Mobile-Checker#info=devDependencies)
[![Join the chat at https://gitter.im/w3c/Mobile-Checker](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/w3c/Mobile-Checker)

The Mobile Checker is a tool for Web developers who want to make their Web page or Web app work better on mobile devices.

The Mobile Checker was built to provide all of us web developers with a new and helpful experience of mobile Web developement.
We built the base. Now join us, and make it grant your wishes. We hope you will make it awesome.

## How does it work?
This tool is a full JavaScript Web application built with [Node.js](http://nodejs.org/) and [Selenium WebDriver](http://docs.seleniumhq.org/projects/webdriver/). Based on the [mobile Web browser emulator API](https://github.com/w3c/mobile-web-browser-emulator), the Mobile Checker combines powerful technologies to simulate a Web browser on a mobile device.
That's why, contrary to most of the current online mobile emulators, the Mobile Checker can provide an emulation close to what your Web app looks like on different kinds of mobile devices, including tablets and smartphones.


## Installation
Mobile Checker is a Node application. It will eventually be distributed through npm, but in the meantime
you can simply clone this repository:

    git clone https://github.com/w3c/Mobile-Checker.git

1. Install [Node.js](http://nodejs.org/)

2. Install npm dependencies:

    ```
    npm install -d
    ```

3. In addition to the npm dependencies, install:

* [Google Chrome](https://www.google.com/chrome/)
* [browsermob-proxy](https://github.com/lightbody/browsermob-proxy/) running on port 8080
* [ImageMagick](http://www.imagemagick.org/)
* [XVFB](http://www.x.org/archive/X11R7.6/doc/man/man1/Xvfb.1.xhtml)

## Running
In your terminal, run:

    node app.js

Then, connect on the localhost:3000 port.

## Testing
Testing is done using mocha. Simply run:

    mocha --timeout 30000

from the root and you will be running the test suite. Mocha can be installed with:

    npm install -g mocha

## Feedback and contributions

* **Send feedback** about the tool and join us on the [mailing list](public-qa-dev@w3.org).
* **Discuss** about the Mobile Checker in our [Gitter room](https://gitter.im/w3c/Mobile-Checker).
* **Report a bug** and open an issue on [Github](https://github.com/w3c/Mobile-Checker/issues).
* **Send a feature request** on [Github](https://github.com/w3c/Mobile-Checker/issues).
* **Contribute** to the Mobile Checker by first reading the [contribution guidelines](https://github.com/w3c/Mobile-Checker/blob/master/CONTRIBUTING.md).
