# Contributing to Mobile Checker

Looking to contribute to Mobile Checker? There is many ways to get involved in its developement. 
Please take few minutes to read this document to understand how you can help in Mobile Checker developement.

## Introduction

We made it very easy for a web developer to contribute to the Mobile Checker. For example it will take only few minutes to be able to create a new check for the Mobile Checker. Please take the time to read this document before create your first pull request.

## Add a new check

It is pretty simple to add a new check to the mobile checker. Create a new check require only an experience in client side JavaScript developement.

A new check is composed by 3 composants:
* the check itself, who will execute a script on the tested web page.
* the issue sent to the user.
* testing.

### Add an check

All check scripts are located in the [lib](https://github.com/w3c/Mobile-Checker/tree/master/lib) directory. You just have to add your own script file in the correct category. Of course, feel free to create a new category if no category match with your check. Ready? Let's create your first check!

This is the basic template of check file. Save it in the lib directory:

````javascript
var self = this;
exports.name = "name-of-the-check"; //write here the name of your check. Have to match with the file's name.
exports.category = "name-of-the-category"; //write here the name. Have to match with a category's directory name.
exports.check = exports.check = function(checker, browser) {
	/*
	 * here your code.
	 */
};
````

the ```check(checker, browser)``` function, contain the main code of your check.



### Add an issue

### Add a test
