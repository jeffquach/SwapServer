'use strict';

var assert = require("assert"),
request = require('supertest'),
app = require("../server.js"),
fs = require("fs"),
config = require("../config/environment/test");

describe("images controller",function(){
	after(function(done){
		fs.unlink(process.cwd()+"/uploads/githubicon.png",function(err){
			if (err) {throw err;};
			console.log("deleted image file");
		});
		done();
	});

	describe("posting an image",function(){
		it("should deliver a success response",function(done){
			request(app)
			.post("/image/upload")
			.attach("randomImage",config.testImagePath)
			.end(function(err,res){
				if (err) {throw err;};
				assert.equal(res.text,"Success");
				done();
			});
		});
		it("should show that the file exists",function(done){
			fs.stat(process.cwd()+"/uploads/githubicon.png",function(err,file){
				assert.ifError(err);
				done();
			})
		})
	})
	describe("getting the posted image",function(){
		it("should deliver a success response",function(done){
			request(app)
			.get("/image/uploads/githubicon.png")
			.end(function(err,res){
				if (err) {throw err;};
				assert.ifError(err);
				assert.ok(res.text);
				done();
			});
		});
	})
});