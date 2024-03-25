# Corcentric CorSymphony automation - Project Setup

## Requirements:
- [node](https://nodejs.org/en/download) v8.9 or higher

## Installation:

1. Get the code from the Team Foundation Server (`$/QAAutomation/CorSymphony`).
2. Open cmd and run the following commands:

> cd [local project checkout folder]

> npm install -g testcafe

## Running tests:

> testcafe [browser] folder/test.js --options

> [browser]=[chrome/firefox/ie]

Where 'options' are the following:

> --env=[local/cwsdev/cwsqa/uat/prod]

> --user=[all/epayment/tem/prod]

> --culture=[en-US/zh-CN/es-AR/fr-CA]

> -c=[number] (optional)

For example:

> testcafe chrome Desktop/Level0 --env=cwsdev --user=all --culture=en-US -c 3

> testcafe ie Desktop/Level0 --env=cwsdev --user=all --culture=en-US


This command example should execute all Level 0 tests cases for the desktop version of the site, in the dev environment with english as the language.
If no parameters are passed, the test suite is executed with the default values.
The first command runs test cases using 3 browsers in parallel.

## Running tests by name:

Adding -T "name/id" to the command, will execute all the tests that match the specified "name". Our tests have numbers, so running a specific test could be achieved by executing:

> folder=[local project checkout folder]

> testcafe [browser] [folder] -T [name/id] --options

For Example:

> testcafe chrome Desktop/Level0 -T "123456" --env=cwsdev --user=all --culture=en-US -c 3

This will search for the TC "123456" inside "folder" and run it.

## Running tests against a user:

Adding "--user" argument will execute tests for a particular user that belong to a client. This client may be licensed
only for certain applications, so only tests for those applications will be executed.

> testcafe chrome Desktop/Level0 --env=cwsdev --user=admin.moran.towing --culture=en-US

The user "admin.moran-towing" belongs to the client "Moran Towing" and is licensed to some applications.


## Running tests concurrently:

When running tests locally, a paramater can be passed to TestCafé to run tests in parallel:

testcafe -c NUMBER BROWSER testsFiles

For instance...

> testcafe chrome Desktop/Level0 --options -c 3

...will run the Level 0 test suite in 3 different instances of Chrome on parallel.

Note: Some Level 1 test cases need previous tests passing, and depending on the execution order they might fail.
Level 0 test cases are atomic so those can be run without problems.

## Running tests against the Angular app running locally:

The Test Suite can be run against a local instance of the Angular MetroUI app.
To run it, first serve the app:

> cd [angular app folder]

> npm start

This will serve the Angular app to localhost:4200.
Now to execute the test suite, open another terminal instance and add the --env=local parameter like so:

> testcafe [browser] folder/test.js *--env=local*

Make sure the env option is set to local.

## Running Mobile Tests:

Instead of the desktop folder, execute the test suite located in the "e2e/Mobile" folder.
For instance, to execute mobile level 0 test cases, use the following command:

> cd [local project checkout folder]

> testcafe [browser] Mobile/Level0

## Using the "Mini" Reporter

The Default TestCafé reporter is very verborragic. To avoid unnecessary error messages, a custom reporter was created.
To install it, execute the following command:

> npm install -g testcafe-reporter-mini@latest

After installing it, run the Test Suite in the same way, but add "-r mini" to the command line options like so:

> testcafe [browser] [folder] -r mini

For Example:

> testcafe chrome Desktop/Level0 --env=cwsdev --user=all --culture=en-US -c 3 -r mini