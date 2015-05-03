var mongoose = require('mongoose');
var request = require('request');
var User = require('./models/user');
var key = require('./config/key');

exports.login = function(username, phoneNumber, registration_id, callback){
	var newUser = new User({
		username: username,
		phoneNumber: phoneNumber,
	  	registration_id: registration_id
	});
	User.find({phoneNumber: phoneNumber}, function(err, users){
		var length = users.length;
		console.log("$$$ users.length from FIND $$$ is:");
		console.log(length);
		var phoneNumberInDatabase;

		// Loop here is for logging in, and checks if user exists in database, if the user does login them in
		for(var i = 0; i < users.length; i++){
		  if (phoneNumber === users[i].phoneNumber) {
		    phoneNumberInDatabase = phoneNumber;
		  };
		}

		if (err) {throw err;}
		if (length == 0) {
			newUser.save(function(err){
				if (err) {throw err;}
				callback({'response':"Successfully Registered"});
			});
		}else if(phoneNumber === phoneNumberInDatabase){
	  		callback({'response':"Successfully logged in!"});
		}
		// else {
		// 	callback({'response':'User already registered!'});
		// }
	});
};

exports.getUsers = function(phoneNumber, callback){
	User.find(function(err,users){
		if (err) {throw err;}
		var length = users.length;
		if (length == 0) {
			callback({'response':'User has not registered yet!'});
		}else{
			callback(getUsersFromDatabase(users,phoneNumber));
		}
	});
};

function getUsersFromDatabase(array, value){
	for(var i = 0; i < array.length; i++){
		if (array[i].phoneNumber == value) {
			array.splice(i,1);
			return array;
			break;
		};
	}
}

exports.removeUser = function(phoneNumber, callback){
	User.remove({phoneNumber:phoneNumber},function(err,users){
		if (err) {throw err;}
		callback({'response':'User was successfully removed!'});
	});
};