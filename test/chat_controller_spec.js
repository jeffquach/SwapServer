'use strict';

var assert = require("assert");
var mongoose = require('mongoose');
var request = require('supertest');
var app = require("../server.js");
var User = require('../models/user');
var config = require("../config/environment/test");

describe("chat controller",function(){
	before(function(done){
		mongoose.connection.collections['users'].drop( function(err) {
			if (err) {throw err;};
		    console.log('collection dropped');
		});
		done();
	});
	describe("sending messages to GCM successfully", function(){
		before(function(done){
			User.collection.insert([{username: "derp",phoneNumber: "01110",registration_id: "jajkajgjksgj85h58q8"},{username: "nexus5-19-2",phoneNumber: "5192",registration_id: config.gcm.keys["nexus5-19-2"]},{username: "nexus-5-21-2",phoneNumber: "5212",registration_id: config.gcm.keys["nexus-5-21-2"]}],function(err,stuff){
				if (err) {throw err;};
			});
			done();
		});
		it("should return a success response",function(done){
			request(app)
			.post("/chat/send")
			.send({"usernameOfSender":"merp","phoneNumberOfSender":"11","phoneNumberOfRecipient":"5192","messageBody":"Cholo son!"})
			.end(function(err,res){
				if (err) {throw err;};
				assert.equal(res.body.response,"Success");
				done();
			});
		});
	});
	describe("unsuccessfully sending messages to GCM", function(){
		before(function(done){
			User.collection.insert([{username: "derp",phoneNumber: "01110",registration_id: "jajkajgjksgj85h58q8"},{username: "nexus5-19-2",phoneNumber: "5192",registration_id: config.gcm.keys["nexus5-19-2"]},{username: "nexus-5-21-2",phoneNumber: "5212",registration_id: config.gcm.keys["nexus-5-21-2"]}],function(err,stuff){
				if (err) {throw err;};
			});
			done();
		});
		it("should return a success response",function(done){
			request(app)
			.post("/chat/send")
			.send({"usernameOfSender":"merp","phoneNumberOfSender":"11","phoneNumberOfRecipient":"08908","messageBody":"Cholo son!"})
			.end(function(err,res){
				if (err) {throw err;};
				assert.equal(res.body.response,"Failure");
				done();
			});
		});
	});
})