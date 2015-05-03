var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
  location : {
    type: { type: String, default: 'Point' }, 
    coordinates: {type: [Number], required: true},
  }
});
locationSchema.index({ location : '2dsphere' });

var postSchema = mongoose.Schema({
	username: {type: String, required: true},
	phoneNumber: {type: String, required: true},
	title: {type: String, required: true},
	description: {type: String, required: true},
	city: {type: String, required: true},
	locationOfImage: String,
	imageUrl: String,
	geometry: [locationSchema],
	date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('posts', postSchema);