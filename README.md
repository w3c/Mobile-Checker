# Mobile Checker

The Mobile Checker is a tool for Web developers who want to make their Web page or Web app work better on mobile devices.

## Installation

Mobile Checker is a Node application. It will eventually be distributed through npm, but in the meantime
you can simply clone this repository and run:

    npm install -d

In order to get all the dependencies installed. Naturally, this requires that you have a reasonably
recent version of Node installed.

In addition to the npm dependencies, the checker needs:

* google-chrome installed
* [browsermob-proxy](https://github.com/lightbody/browsermob-proxy/) running on port 8080

## Running

In the repository run :

    node app.js

Connect on the localhost:3000 port.

## Testing

Testing is done using mocha. Simply run:

    mocha --timeout 30000

from the root and you will be running the test suite. Mocha can be installed with:

    npm install -g mocha
