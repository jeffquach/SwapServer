'use strict';

var requests = require('../requests');
var User = require('../models/user');

exports.index = function(req,res){
	console.log("$$$ INDEX this: $$$");
	console.log(this);
	res.end("nodeAndroidChat Sample");
};
exports.test = function(req,res){
	var socket = require('socket.io-client')('http://localhost:3000');
	socket.emit("add user", "nexus-5-21-2", "merp-nexus-5-21-2", "something gangsta","CHOLO IN DA HTML SON!");
	socket.emit("typing","TURD MEISTER HTML", "merp-nexus-5-21-2", "nexus-5-21-2", "merp");
	res.send("Success!");
};
exports.login = function(req,res,next){
	var username = req.body.username;
	var phoneNumber = req.body.phoneNumber;
	var registration_id = req.body.registration_id;
	var coordinates = [req.body.longitude,req.body.latitude];
	User.findOne({username: username,phoneNumber: phoneNumber}, function(err, user){
		if (err) {return next(err)};
		if (!user) {
			var newUser = new User({
				username: username,
				phoneNumber: phoneNumber,
			  	registration_id: registration_id,
				geometry: [{
					location: {
						coordinates: coordinates
					}
				}]
			});
			newUser.save(function(err){
				if (err) {throw err;}
				res.json({'response':"Successfully Registered"});
			});
		}else if(user){
			res.json({'response':"Successfully logged in!"});
		}
		// else if (user && (username !== user.username || phoneNumber !== user.phoneNumber)) {
		// 	res.json({'response':'User already registered!'});
		// };
	});
};
exports.updateUserLocation = function(req,res,next){
	var username = req.body.username;
	var phoneNumber = req.body.phoneNumber;
	var coordinates = [req.body.longitude,req.body.latitude];
	User.findOne({"username": username,"phoneNumber": phoneNumber},function(err,user){
		if (err) {return next(err)};
		if(user){
			user.geometry.push({location:{coordinates: coordinates}});
			user.save(function(err){
				if (err) {throw err;}
				res.json({'response':"Successfully updated location"});
			});
		}else{
			res.json({"response":"User not found"});
		}
	});
}
exports.users = function(req,res){
	var phoneNumber = req.body.phoneNumber;
	User.find({phoneNumber: {$nin: [phoneNumber]}},function(err,users){
		if (err) {throw err;}
		if (!users) {
			res.json({'response':'User has not registered yet!'});
		}else{
			res.json(users);
		}
	});
};
exports.getUsers = function(req,res){
	var phoneNumber = req.query.phoneNumber;
	User.find({phoneNumber: {$nin: [phoneNumber]}},function(err,users){
		if (err) {throw err;}
		if (!users) {
			res.json({'response':'User has not registered yet!'});
		}else{
			res.json(users);
		}
	});
};
exports.logout = function(req,res){
	var phoneNumber = req.body.phoneNumber;
	requests.removeUser(phoneNumber,function(found){
		console.log(found);
		res.json(found);
	});
};
exports.showTermsOfService = function(req,res){
	res.render("termsOfService");
}