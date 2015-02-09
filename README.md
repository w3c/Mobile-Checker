[![Join the chat at https://gitter.im/w3c/Mobile-Checker](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/w3c/Mobile-Checker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Mobile Checker

The Mobile Checker is a tool for Web developers who want to make their Web page or Web app work better on mobile devices.

The Mobile Checker was built to provide to all of us, web developers, a new and helpful experience of the mobile web developement.
We built the base. Now join us, and make it grant your wishes. We think you will make it awesome.

##How it work?
This tool, is a full JavaScript web application, built with [Node.js](http://nodejs.org/) and [Selenium WebDriver](http://docs.seleniumhq.org/projects/webdriver/). Based on the mobile web browser emulator API, the Mobile Checker combines powerful technologies to simulate a web browser on a mobile device.
That's why, contrary to most of the current online mobile emulators, the Mobile Checker can provide an emulation close of what your web app looks like on different kinds of mobile devices, as well as tablets and smartphones.


## Installation
Mobile Checker is a Node application. It will eventually be distributed through npm, but in the meantime
you can simply clone this repository:

	git clone https://github.com/w3c/Mobile-Checker.git
 
1. Install [Node.js](http://nodejs.org/)

2. Install npm dependencies:


	npm install -d

3. In addition to the npm dependencies, install:

* [google-chrome](https://www.google.com/chrome/)
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

* Send feedback about the tool and join us on the [mailing list](public-qa-dev@w3.org).
* Report a bug and open an issue on [Github](https://github.com/w3c/Mobile-Checker/issues).
* Send a feature request on [Github](https://github.com/w3c/Mobile-Checker/issues).
* Contribute to the Mobile Checker in following the contribute [guideline](https://github.com/w3c/Mobile-Checker/blob/master/CONTRIBUTING.md).




