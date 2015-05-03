'use strict';

var assert = require("assert"),
request = require('supertest'),
app = require("../server.js"),
fs = require("fs"),
config = require("../config/environment/test"),
mongoose = require('mongoose'),
Post = require("../models/post"),
distanceCalculator = require("../controllers/posts_controller");

describe("posts controller",function(){
	var newPost = new Post({
		username: "chingChong",
		phoneNumber: "88989",
		title: "Da illest ting ever made son!",
		description: "Buy diz ting now haters!",
		city: "ChingChongVille",
		locationOfImage: process.cwd()+"/uploads/githubicon.png",
		geometry: [{
			location: {
				coordinates: ["-79.456693","43.653249"]
			}
		}]
	});
	var newPost2 = new Post({
		username: "bingChong",
		phoneNumber: "88989777",
		title: "Diamonds",
		description: "Cool tingz!",
		city: "ChingChongVille",
		locationOfImage: process.cwd()+"/uploads/linkedinicon.png",
		geometry: [{
			location: {
				coordinates: ["-79.456693","43.653249"]
			}
		}]
	});
	var newPost3 = new Post({
		username: "bingWongChong",
		phoneNumber: "11189777",
		title: "Diamond Studs",
		description: "Cool tingz meng!",
		city: "BrapperTown",
		locationOfImage: process.cwd()+"/uploads/resumeicon.png",
		geometry: [{
			location: {
				coordinates: ["-79.456693","43.653249"]
			}
		}]
	});
	before(function(done){
		newPost.save(function(err){
			if (err) {throw err;};
		});
		done();
	});
	after(function(done){
		fs.unlink(process.cwd()+"/uploads/githubicon.png",function(err){
			if (err) {throw err;};
			console.log("deleted image file");
		});
		// mongoose.connection.collections['posts'].drop(function(err){
		// 	if (err) {throw err;};
		//     console.log('collection dropped');
		// });
		done();
	});
	//request = request('http://localhost:3000');
	describe("creating a new post",function(){
		it("should deliver a success response",function(done){
			request(app)
			.post("/post/new")
			.field("username", "chongChong")
			.field("phoneNumber", "88989")
			.field("title", "Da illest ting ever made son!")
			.field("description", "Buy diz ting now haters!")
			.field("city", "ChingChongVille")
			.field("locationOfImage", process.cwd()+"/uploads/githubicon.png")
			.field("longitude","-79.456693")
			.field("latitude","43.653249")
			.attach("randomImage",config.testImagePath)
			.end(function(err,res){
				if (err) {throw err;};
				assert.equal(res.text,"Success");
				done();
			});
		});
		it("should show the right image url",function(done){
			Post.findOne({"username":"chongChong"},function(err,data){
				if (err) {throw err;};
				var imageUrl = (/http\:\/\/127\.0\.0\.1\:\d*\/image\/uploads\/githubicon\.png/).test(data.imageUrl);
				assert.ok(imageUrl);
				done();
			});
		})
		it("should show that the file exists",function(done){
			fs.stat(process.cwd()+"/uploads/githubicon.png",function(err,file){
				assert.ifError(err);
				done();
			})
		})
	});
	describe("creating a new post without attaching an image",function(){
		it("should deliver a success response",function(done){
			request(app)
			.post("/post/new")
			.field("username", "chongChong")
			.field("phoneNumber", "88989")
			.field("title", "Da illest ting ever made son!")
			.field("description", "Buy diz ting now haters!")
			.field("city", "ChingChongVille")
			.field("longitude","-79.456693")
			.field("latitude","43.653249")
			.end(function(err,res){
				if (err) {throw err;};
				assert.equal(res.text,"Success");
				done();
			});
		})
	})
	describe("getting the posted image",function(){
		var requestUrl = "merp";
		before(function(done){
			Post.findOne({username:"chingChong",phoneNumber: "88989"},function(err,ting){		
				requestUrl = "/post/chingChong/"+ting._id;
			});
			done();
		});
		it("should deliver a success response",function(done){
			setTimeout(function(){
				console.log("$$$ (AFTER) requestUrl is:");
				console.log(requestUrl);
				request(app)
				.get(requestUrl)
				.end(function(err,res){
					if (err) {throw err;};
					assert.equal(res.body.username,"chingChong");
					assert.equal(res.body.phoneNumber,"88989");
					assert.equal(res.body.title,"Da illest ting ever made son!");
					assert.equal(res.body.description,"Buy diz ting now haters!");
					assert.equal(res.body.city,"ChingChongVille");
					assert.equal(res.body.locationOfImage,process.cwd()+"/uploads/githubicon.png");
				});
				done();
			},5);
		});
	});
	describe("getting all the posts in the same city",function(){
		before(function(done){
			mongoose.connection.collections['posts'].drop(function(err){
				if (err) {throw err;};
			    console.log('collection dropped');
			});
			var result = [];
			var coordinates = [[-79.477721,43.665259],[-79.476584,43.664630],[-79.478408,43.664149],[-79.477088,43.663691],[-79.476927,43.663955],[-79.477314,43.664010],[-79.477142,43.664273],[-79.477700,43.664273],[-79.477346,43.664638],[-79.477507,43.663839],[-79.478108,43.664056],[-79.472879,43.665510],[-79.472177,43.665494]];
			for(var i = 0; i < 10; i++){
				result[i] = addTingz("1st ten entries"+i,"1st ten entries",coordinates[i]);
			}
			for(var i = 10; i < 13; i++){
				result[i] = addTingz("2nd set of entries"+i,"2nd set of entries",coordinates[i]);
			}
			function addTingz(username,title,coordinates){
				var terp = new Object;
				terp["username"] = username;
				terp["phoneNumber"] = "94989889890289990893";
				terp["title"] = title;
				terp["description"] = "Sauce is too hot ma gangstas";
				terp["city"] = "turbanVille";
				terp["locationOfImage"] = "/app/uploads/churdMoneySon.jpg";
				terp["imageUrl"] = "https://api.blingMoney.com/v8/cacheMoney";
				terp.geometry = new Object;
				terp.geometry.location = new Object;
				terp.geometry.location.type = "Point";
				terp.geometry.location.coordinates = coordinates;
				return terp;
			}
			if (result.length == 13) {
				Post.collection.insert(result,function(err){
					if (err) {throw err;};
				});
				// MAKE SURE THIS IS HERE OR ELSE THE TESTS WILL FAIL BECAUSE THE INDEX FOR THE GEOSPATIAL QUERY WON'T BE SET!
				Post.ensureIndexes(function (err) {
				  if (err) return (err);
				});
			};
			done();
		});
		it("should return the first 10 posts by closest distance to lat, long points of: 43.664342, -79.477351",function(done){
			request(app)
			.get("/post/index/turbanVille")
			.query({distance_from_latitude: "43.664342", distance_from_longitude: "-79.477351"})
			.end(function(err,res){
				if (err) {throw err;};
				var lastUser = res.body.length-1;
				assert.equal(res.body.length,10);
				assert.equal(res.body[0].city,"turbanVille");
				assert.equal(res.body[0].username,"1st ten entries6");
				assert.equal(res.body[0].title,"1st ten entries");
				assert.notEqual(res.body[lastUser].username,"2nd set of entries");
				assert.notEqual(res.body[lastUser].city,"2nd set of entries");
			});
			done();
		});
		describe("returning 2nd set of posts sorted by nearest first when passing a previous lat, long coordinate",function(){
			var latitude, longitude, previousId;
			before(function(done){
				Post.findOne({"city":"turbanVille","geometry.location":{ $near :{$geometry: { type: "Point",  coordinates: [ -79.477351, 43.664342 ] },$minDistance: 0,$maxDistance: 100000}}}).skip(9).sort({}).limit(1).exec(function(err,ting){	
					var coordinates = ting["geometry"][0]["location"]["coordinates"];
					latitude = coordinates[1];
					longitude = coordinates[0];
					previousId = ting._id;
				});
				done();
			});
			it("Should be true son",function(done){
				process.nextTick(function(){
					request(app)
					.get("/post/index/turbanVille?previous_id="+previousId)
					.query({distance_from_latitude: "43.664342", distance_from_longitude: "-79.477351", previous_longitude: longitude, previous_latitude: latitude})
					.end(function(err,res){
						if (err) {throw err;};
						var lastUser = res.body.length-1;
						assert.equal(res.body.length,3);
						assert.equal(res.body[0].city,"turbanVille");
						assert.equal(res.body[1].username,"2nd set of entries11");
						assert.equal(res.body[1].title,"2nd set of entries");
						assert.notEqual(res.body[lastUser].username,"1st ten entries");
						assert.notEqual(res.body[lastUser].city,"1st ten entries");
					});
					done();
				})
			})
		})
		it("should return the first 10 posts with the newest posts first",function(done){
			request(app)
			.get("/post/index/turbanVille")
			.end(function(err,res){
				if (err) {throw err;};
				var lastUser = res.body.length-1;
				assert.equal(res.body.length,10);
				assert.equal(res.body[0].city,"turbanVille");
				assert.equal(res.body[0].username,"2nd set of entries12");
				assert.equal(res.body[0].title,"2nd set of entries");
				assert.equal(res.body[lastUser].title,"1st ten entries");
			});
			done();
		});
		it("should return the proper message when no posts are found",function(done){
			request(app)
			.get("/post/index/toronto")
			.end(function(err,res){
				if (err) {throw err;};
				assert.equal(res.body.length,undefined);
				assert.deepEqual(res.body,{});
			});
			done();
		});
		describe("returning the next 10 posts",function(){
			var objectId;
			before(function(done){
				Post.find({city:"turbanVille"}).sort({"_id":-1}).limit(10).exec(function(err,ting){	
					console.log("$$$ 10 tingz yo $$$:");
					console.log(ting);
				});
				Post.findOne({city:"turbanVille"}).skip(9).sort({"_id":-1}).limit(1).exec(function(err,ting){	
					objectId = ting._id;
					console.log("$$$ ting id: $$$");
					console.log(ting._id);
				});
				done();
			});
			it("should return the next 10 posts",function(done){
				// setTimeout(function(){
					process.nextTick(function(){
						request(app)
						.get("/post/index/turbanVille?object_id="+objectId)
						.end(function(err,res){
							if (err) {throw err;};
							console.log("$$$ res.body from object_id query: $$$");
							console.log(res.body);
							var lastUser = res.body.length-1;
							assert.equal(res.body.length,3);
							assert.equal(res.body[0].username,"1st ten entries2");
							assert.equal(res.body[0].title,"1st ten entries");
							assert.equal(res.body[0].city,"turbanVille");
							assert.equal(res.body[2].city,"turbanVille");
							assert.notEqual(res.body[2].username,"WingWongJamaal999");
							assert.notEqual(res.body[0].city,"BrapperTown");
							assert.notEqual(res.body[1].city,"BrapperTown");
						});
					})
					
				// },1000)
				done();
			});
		})
	})
});