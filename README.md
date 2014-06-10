# Mobile Checker

Mobile Checker is a checker for mobile's developers who want to improve their code.

## Installation

Mobile Checker is a Node application. It will eventually be distributed through npm, but in the meantime
you can simply clone this repository and run:

    npm install -d

In order to get all the dependencies installed. Naturally, this requires that you have a reasonably
recent version of Node installed.

## Running

In the repository run :

    node app.js

Connect on the localhost:8080 port.

## Testing

Testing is done using mocha. Simply run:

    mocha

from the root and you will be running the test suite. Mocha can be installed with:

    npm install -g mocha

Some of the tests can on occasion take a long time, or fail outright because a remote service is
unavailable. To work around this, you can set SKIP_NETWORK:

    SKIP_NETWORK=1 mocha

