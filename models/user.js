var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
  location : {
    type: { type: String, default: 'Point' }, 
    coordinates: [Number],
    date: {type: Date, default: Date.now}
  }
});
locationSchema.index({ location : '2dsphere' });

var userSchema = new Schema({
	username: String,
	phoneNumber: String,
	registration_id: String,
	geometry: [locationSchema]
});

module.exports = mongoose.model('users', userSchema);