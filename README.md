Node.js server for Swap Android app. In order to run the server locally you must create a "config/environment" folder with files containing "environment/development.js", "environment/test.js" and "environment/production.js". Also secret keys are stored in a file path of "config/key.js". All these files must be created to run the server, but you can always set up the server however you like.

Run "nodemon server.js" to start the server and run the tests with mocha to make sure everything is working correctly.
