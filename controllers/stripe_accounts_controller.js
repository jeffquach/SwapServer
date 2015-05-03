'use strict';
var config = require('../config/key');
var StripeAccount = require("../models/stripe_account");
var stripe = require("stripe")(config.stripe_secret_key);
var async = require("async");

// Using Express
exports.testWebhook = function(request, response) {
  // Retrieve the request's body and parse it as JSON
  //var event_json = JSON.parse(request.body);
  response.send(200);
};

exports.sendAndSaveAccountInformation = function(req, res){
	var reqObj = req.body;
	var bankAccountToken,routingNumber;
	if(reqObj.country === "CA"){
		routingNumber = reqObj.transitNumber+"-"+reqObj.institutionNumber;
	}else{
		routingNumber = reqObj.transitNumber;
	}
	async.waterfall([
			function(callback){
				stripe.tokens.create({
					bank_account: {
						country: reqObj.country,
						routing_number: routingNumber,
						account_number: reqObj.bankAccountNumber,
						currency:reqObj.currency}}, function(err, token) {
							if(err){
								res.json({"response":"Error","message":err.message});
							}
							callback(null,token.id);
						});
				// callback(null,bankAccountToken);
			},
			function(bankAccountToken,callback){
				stripe.account.create({
					country: reqObj.country,
					managed: true,
					email: reqObj.email,
					bank_account: bankAccountToken,
					legal_entity:{
						address:{ 
							line1: reqObj.address,
							city: reqObj.city,
							state: reqObj.state,
							postal_code: reqObj.postalCode,
							country: reqObj.country 
						},
						first_name: reqObj.firstName,
						last_name: reqObj.lastName,
						dob: { 
							day: reqObj.birthdayDay, 
							month: reqObj.birthdayMonth, 
							year: reqObj.birthdayYear 
						},
						personal_id_number: reqObj.personalIdNumber,
						type:"individual"
					},
					tos_acceptance:{
						ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress, 
						date: new Date().getTime()
					}},function(err,stripeResponse){
						if(err){
							res.json({"response":"Error","message":err});
						}
						var newStripeAccount = new StripeAccount({
							accountId: stripeResponse.id,
							email: stripeResponse.email,
							statement_descriptor: stripeResponse.statement_descriptor,
							display_name: stripeResponse.display_name,
							timezone: stripeResponse.timezone,
							details_submitted: stripeResponse.details_submitted,
							charges_enabled: stripeResponse.charges_enabled,
							transfers_enabled: stripeResponse.transfers_enabled,
							currencies_supported: stripeResponse.currencies_supported,
							default_currency: stripeResponse.default_currency,
							country: stripeResponse.country,
							object: stripeResponse.object,
							business_name: stripeResponse.business_name,
							business_url: stripeResponse.business_url,
							support_phone: stripeResponse.support_phone,
							metadata: stripeResponse.metadata,
							managed: stripeResponse.managed,
							product_description: stripeResponse.product_description,
							debit_negative_balances: stripeResponse.debit_negative_balances,
							bank_accounts:stripeResponse.bank_accounts,
							verification:stripeResponse.verification,
							transfer_schedule:stripeResponse.transfer_schedule,
							tos_acceptance:stripeResponse.tos_acceptance,
							legal_entity:stripeResponse.legal_entity,
							decline_charge_on: stripeResponse.decline_charge_on,
							updated_at: new Date()
						});
						newStripeAccount.save(function(err){
							if (err){
								res.json({"response":"Error","message":err});
							}
							callback(null,"Done");
						});
					});
			}
		],function(err,results){
		if(err){
			res.json({"response":"Error","message":"There was an error processing your information, your information may have been entered incorrectly"});
		}else{
			res.json({"response":"Success","message":"Your information has been successfully processed. You may be contacted later in the future to further confirm your identity or to receive payments directly to your bank account."});
		}
	});
}

exports.updateAccountWebhook = function(req,res){
	var stripeResponse = req.body.data.object
	StripeAccount.findOneAndUpdate({email:stripeResponse.email},{
		$set:{
			accountId: stripeResponse.id,
			email: stripeResponse.email,
			statement_descriptor: stripeResponse.statement_descriptor,
			display_name: stripeResponse.display_name,
			timezone: stripeResponse.timezone,
			details_submitted: stripeResponse.details_submitted,
			charges_enabled: stripeResponse.charges_enabled,
			transfers_enabled: stripeResponse.transfers_enabled,
			currencies_supported: stripeResponse.currencies_supported,
			default_currency: stripeResponse.default_currency,
			country: stripeResponse.country,
			object: stripeResponse.object,
			business_name: stripeResponse.business_name,
			business_url: stripeResponse.business_url,
			support_phone: stripeResponse.support_phone,
			metadata: stripeResponse.metadata,
			managed: stripeResponse.managed,
			product_description: stripeResponse.product_description,
			debit_negative_balances: stripeResponse.debit_negative_balances,
			bank_accounts:stripeResponse.bank_accounts,
			verification:stripeResponse.verification,
			transfer_schedule:stripeResponse.transfer_schedule,
			tos_acceptance:stripeResponse.tos_acceptance,
			legal_entity:stripeResponse.legal_entity,
			decline_charge_on: stripeResponse.decline_charge_on,
			account_updated_via_webhook: true,
			updated_at: new Date()}},{upsert:true},function(err,data){
	});
	res.sendStatus(200);
}

exports.receiveToken = function(req,res){
	var token = req.body.token;
	stripe.charges.create({
		amount: 9000000,
		currency: 'cad',
		source: token,
		destination: "acct_15o1sCEny2Ozf04j",
		application_fee: 1000000
	}, function(err, data) {
		if(err && err.type === 'StripeCardError'){
			res.json({"response":"Error","message":"There was an error with your credit card, it has been declined"});
		}else if(err){
			res.json({"response":"Error","message":"There was an error processing your credit, your information may have been entered incorrectly"});
		}else{
			res.json({"response":"Success","message":"Your transaction was successful, thank you for your purchase"});
			// stripe.transfers.create({amount: 9000000,currency: "cad",destination: "acct_15necyJBqrGLFjl4"}, function(err, transfer) {
			//   if(err) throw err;
			//   console.log("$$$$$$$$$$$$$ TRANSFER RESPONSE $$$$$$$$$$$$$$$$$");
			//   console.log(transfer);
			// });
		}
	});
}