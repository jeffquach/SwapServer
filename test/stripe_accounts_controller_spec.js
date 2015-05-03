'use strict';

var assert = require("assert"),
request = require('supertest'),
config = require("../config/key"),
app = require("../server.js"),
mongoose = require('mongoose'),
StripeAccount = require("../models/stripe_account"),
stripe = require("stripe")(config.stripe_secret_key);

describe("stripe accounts controller",function(){
	after(function(done){
		mongoose.connection.collections['stripeaccounts'].drop(function(err){
			if (err) {throw err;};
		    console.log('stripeaccounts collection dropped');
		});
		done();
	})
	describe("creating a new managed Stripe account",function(){
		it("should deliver a success response for Canadian accounts",function(done){
			this.timeout(8000);
			request(app)
			.post("/stripe/newAccount")
			.send({"country": "CA","transitNumber": "11602","institutionNumber":"004","bankAccountNumber": "000123456789","currency":"cad","email":"jimboFisher@roper.com","address":"9980 Nurble St.","city": "Toronto","state": "ON","postalCode": "M6P3K1","firstName": "Turban","lastName": "Meister","birthdayDay": "09", "birthdayMonth": "09", "birthdayYear": "2000"})
			.end(function(err,res){
				if (err) {throw err;};
				assert.equal(res.body.response,"Success");
				assert.equal(res.body.message,"Your information has been successfully processed. You may be contacted later in the future to further confirm your identity or to receive payments directly to your bank account.");
				done();
			});
		});
		it("should deliver a success response for American accounts",function(done){
			this.timeout(8000);
			request(app)
			.post("/stripe/newAccount")
			.send({"country": "US","transitNumber": "111000025","bankAccountNumber": "000123456789","currency":"usd","email":"romar@turpentine.com","address":"9980 Nurble St.","city": "Toronto","state": "AZ","postalCode": "90017","firstName": "Turban","lastName": "Meister","birthdayDay": "09", "birthdayMonth": "09", "birthdayYear": "2000", "personalIdNumber":"123456789"})
			.end(function(err,res){
				if (err) {throw err;};
				assert.equal(res.body.response,"Success");
				done();
			});
		});
	});
	describe("creating a charge on a credit card",function(){
		var stripeToken;
		before(function(done){
			stripe.tokens.create({
			  card: {
			    "number": '4242424242424242',
			    "exp_month": 12,
			    "exp_year": 2016,
			    "cvc": '123'
			  }
			}, function(err, token) {
			  stripeToken = token.id;
			});
			done();
		});
		it("should be true",function(done){
			this.timeout(8000);
			setTimeout(function(){
				request(app)
				.post("/stripe/receiveToken")
				.send({"token":stripeToken})
				.end(function(err,res){
					if (err) {throw err;};
					assert.equal(res.body.response,"Success");
					assert.equal(res.body.message,"Your transaction was successful, thank you for your purchase");
					done();
				});
			},1000);
		});
	});
});

