'use strict';

var assert = require("assert");
var mongoose = require('mongoose');
var request = require('supertest');
var app = require("../server.js");
var User = require('../models/user');

describe("the users controller",function(){
	var registrationCredentials = {
			username: "derp",
			phoneNumber: "01110",
		  	registration_id: "jajkajgjksgj85h58q8",
			longitude: "-79.456693",
			latitude: "43.653249"
	};
	var newUser = new User({
		username: "derp",
		phoneNumber: "01110",
	  	registration_id: "jajkajgjksgj85h58q8",
		geometry: [{
			location: {
				coordinates: ["-79.456693","43.653249"]
			}
		}]
	});
	var loginCredentials = {
		username: "derp",
		phoneNumber: "01110",
	  	registration_id: "jajkajgjksgj85h58q8",
		geometry: [{
			location: {
				coordinates: ["-79.456693","43.653249"]
			}
		}]
	};
	before(function(done){
		mongoose.connection.collections['users'].drop( function(err) {
			if (err) {throw err;};
		    console.log('collection dropped');
		});
		done();
	});
	describe("registering a new user", function(){
		it("should return a success response message", function(done){
			request(app)
			.post('/login')
			.send(registrationCredentials)
			.end(function(err,res){
				if (err) {throw err;};
				assert.equal(res.body.response,"Successfully Registered");
				done();
			})
		})
	});
	describe("logging in a user", function(){
		before(function(done){
			newUser.save(function(err){
				if (err) {throw err;}
			});
			done();
		});
		it("should return a success response message", function(done){
			request(app)
			.post('/login')
			.send(loginCredentials)
			.end(function(err,res){
				if (err) {throw err;};
				assert.equal(res.body.response,"Successfully logged in!");
				done();
			});
		});
	});
	describe("returning an array of all users in the database", function(){
		before(function(done){
			mongoose.connection.collections['users'].drop( function(err) {
				if (err) {throw err;};
			    console.log('collection dropped');
			});
			User.collection.insert([{username: "derp",phoneNumber: "01110",registration_id: "jajkajgjksgj85h58q8",geometry: [{location: {coordinates: ["-79.456693","43.653249"]}}]},{username: "kuldeep",phoneNumber: "019010",registration_id: "jajkajgjksgj85h58q8",geometry: [{location: {coordinates: ["-79.456693","43.653249"]}}]},{username: "derfth",phoneNumber: "0236410",registration_id: "jajkajgjksgj85h58q8",geometry: [{location: {coordinates: ["-79.456693","43.653249"]}}]}],function(err,stuff){
				if (err) {throw err;};
			})
			done();
		});
		it("should return all the users in the database", function(done){
			request(app)
			.post("/users")
			.send({"phoneNumber":"01110"})
			.end(function(err,res){
				if (err) {throw err;};
				assert.equal(res.body[0].username,"kuldeep");
				assert.equal(res.body[1].username,"derfth");
			});
			done();
		});
		it("should return all the users in the database (testing different numbers)", function(done){
			request(app)
			.post("/users")
			.send({"phoneNumber":"0236410"})
			.end(function(err,res){
				if (err) {throw err;};
				assert.equal(res.body[0].username,"derp");
				assert.equal(res.body[1].username,"kuldeep");
			});
			done();
		});
	});
	describe("updating a user's location", function(){
		before(function(done){
			newUser.save(function(err){
				if (err) {throw err;}
			});
			done();
		});
		it("should return a success response message", function(done){
			request(app)
			.post('/users/updateLocation')
			.send({"username":"derp","phoneNumber":"01110","longitude":"-79.456693","latitude":"43.653249"})
			.end(function(err,res){
				if (err) {throw err;};
				assert.equal(res.body.response,"Successfully updated location");
				done();
			});
		});
	});
});