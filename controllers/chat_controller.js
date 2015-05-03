'use strict';

var key = require('../config/key');
var request = require('request');
var User = require('../models/user');

exports.send = function(req,res,next){
    var usernameOfSender = req.body.usernameOfSender;
	var phoneNumberOfSender = req.body.phoneNumberOfSender;
	var phoneNumberOfRecipient = req.body.phoneNumberOfRecipient;
	var messageBody = req.body.messageBody;
	// console.log("$$$ usernameOfSender is $$$:");
	// console.log(usernameOfSender);
	// console.log("$$$ phoneNumberOfSender is $$$:");
	// console.log(phoneNumberOfSender);
	// console.log("$$$ phoneNumberOfRecipient is $$$:");
	// console.log(phoneNumberOfRecipient);
	// console.log("$$$ messageBody is $$$:");
	// console.log(messageBody);
	User.findOne({phoneNumber: phoneNumberOfRecipient},function(err,user){
		if (err) {return next(err);}
		if (!user) {
			res.json({'response':'Failure'});
		}else{
			var recipient_registration_id = user.registration_id;
			var username = user.username;
			request({
				method: 'POST',
				uri: 'https://android.googleapis.com/gcm/send',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': key.gcm
				},
				body: JSON.stringify({
					"registration_ids": [recipient_registration_id],
					"data": {
						"msg": messageBody,
						"phoneNumber": phoneNumberOfSender,
						"username": usernameOfSender
					},
					"time_to_live":108
				})
			},function(error,response,body){
				if (error) {throw error;}
				// console.log("$$$ response in CB $$$:");
				// console.log(response);
				// console.log("$$$ body in CB $$$:");
				// console.log(body);
				res.json({'response':'Success'});
			});
		}
	});
};