'use strict';

var fs = require("fs"),
formidable = require("formidable"),
util = require("util"),
os = require("os"),
Post = require("../models/post"),
config = require('../config/environment/'+process.env.NODE_ENV),
mongoose = require('mongoose');

exports.createNewPost = function(req,res){
	var temporaryPath,imageFileName,newFilePath,imageUrlToSave,form = new formidable.IncomingForm(),uploadFileDirectory = process.cwd()+"/uploads/",formFields;
	form.uploadDir = uploadFileDirectory;
	imageUrlToSave = config.transport_protocol+req.headers.host+"/image/uploads/";
	form.parse(req, function(err, fields, files){
		formFields = fields;
	});

	form.on('progress', function(bytesReceived, bytesExpected) {
      	console.log('Progress so far: '+(100*(bytesReceived/bytesExpected))+"%");
    });

    form.on('error', function(err) {
      	console.log('ERROR!');
      	res.end();
    });
    
    form.on('aborted', function() {
      	console.log('ABORTED!');
      	res.end();
    });
    
    form.on('end', function(fields,files) {
		if (this.openedFiles.length > 0 && this.openedFiles[0].size > 0) {
			temporaryPath = this.openedFiles[0].path;
			imageFileName = this.openedFiles[0].name;
			newFilePath = uploadFileDirectory+imageFileName;
		    fs.rename(temporaryPath,newFilePath,function(err,data){
		    	if (err) {throw err;};
		    });
		};
		var newPost = new Post({
			username: formFields.username,
			phoneNumber: formFields.phoneNumber,
			title: formFields.title,
			description: formFields.description,
			city: formFields.city,
			locationOfImage: newFilePath,
			imageUrl: imageUrlToSave+imageFileName,
			geometry: [{
				location: {
					coordinates: [formFields.longitude,formFields.latitude]
				}
			}]
		});
		newPost.save(function(err){
			if (err) {throw err;};
			res.end("Success");
		});
    });
};
exports.getPost = function(req,res){
	var _id = req.params.id;
	var username = req.params.username;
	Post.findOne({_id:_id,username:username},function(err,post){
		if (err) {throw err;};
		if (!post) {
			res.json({"response":"Post does not exist"});
		}else if(post){
			res.json({
				"username": post.username,
				"phoneNumber": post.phoneNumber,
				"title": post.title,
				"description": post.description,
				"city": post.city,
				"locationOfImage": post.locationOfImage
			});
		}
	});
}
exports.getAllPosts = function(req,res){
	var distanceFromLatitude = req.query.distance_from_latitude, distanceFromLongitude = req.query.distance_from_longitude,previousLatitude = req.query.previous_latitude, previousLongitude = req.query.previous_longitude, previousId = req.query.previous_id, city = req.params.city, objectId = req.query.object_id;
	var queryHash = {}, sortOrder, min_distance = 0;
	if (city) {
		queryHash["city"] = city;
		sortOrder = {"_id":-1};
	};
	if (objectId) {
		queryHash["_id"] = {$lt:objectId};
	};
	if (distanceFromLatitude && distanceFromLongitude) {
		if (previousLatitude && previousLongitude) {
			min_distance = parseFloat(getDistanceFromLatLonInMeters(distanceFromLatitude,distanceFromLongitude,previousLatitude,previousLongitude));
			queryHash["_id"] = {$nin: [mongoose.Types.ObjectId(previousId)]};
		};
		queryHash["geometry.location"] = { $near :{$geometry: { type: "Point",  coordinates: [ parseFloat(distanceFromLongitude), parseFloat(distanceFromLatitude) ] },$minDistance: min_distance,$maxDistance: 100000}};
		sortOrder = {};
	};
	console.log("$$$ queryHash $$$:");
	console.log(queryHash);
	Post.find(queryHash).sort(sortOrder).limit(10).exec(function(err,posts){
		if (err) {throw err;};
		if (posts.length === 0) {
			res.json(null);
		}else{
			console.log("$$$ POST COUNT $$$");
			console.log(posts.length);
			res.json(posts);
		}
	});
}
function getDistanceFromLatLonInMeters(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d*1000;
}
function deg2rad(deg) {
  return deg * (Math.PI/180)
}
exports.latLongTingz = getDistanceFromLatLonInMeters;
exports.seedDatabase = function(req,res){
	var noob = req.body;
	console.log("STERGIS");
	console.log(noob);
	Post.collection.insert(req.body,function(err){
		if (err) {throw err;};
		res.end("Success");
	})
}
exports.createTingz = function(req,res){
	res.writeHead(200, {'Content-Type': 'text/html' });
  	var form = '<form action="/post/new" enctype="multipart/form-data" method="post">Enter username: <input name="username" type="text" /><br><br>Add a title<input name="title" type="text" /><br><br>Description time hater<input name="description" type="text" /><br><br>City of yo ting<input name="city" type="text" /><br><br><input multiple="multiple" name="upload" type="file" /><br><br><input type="submit" value="Upload" /></form>';
  	res.end(form); 
};