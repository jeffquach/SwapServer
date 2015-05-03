var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var stripeAccountSchema = mongoose.Schema({
// 	accountId: String,
// 	verificationFields: {
// 		firstName: String,
// 		lastName: String,
// 		email: String,
// 		dateOfBirthDay: Number,
// 		dateOfBirthMonth: Number,
// 		dateOfBirthYear: Number,
// 		bankAccount: String,
// 		tosAcceptanceIp: String,
// 		tosAcceptanceDate: Date
// 	},
// 	verificationStatus: {
// 		status: String,
// 		document: String,
// 		details: String
// 	},
// 	transferSchedule: {
// 		delayDays: Number,
// 		interval: String
// 	},
// 	secretKey: String,
// 	publishableKey: String,
// 	defaultCurrency: String,
// 	country: String,
// 	date: {type: Date, default: Date.now}
// });

var stripeAccountSchema = mongoose.Schema({
	accountId: String,
	email: String,
	statement_descriptor: String,
	display_name: String,
	timezone: String,
	details_submitted: Boolean,
	charges_enabled: Boolean,
	transfers_enabled: Boolean,
	currencies_supported: {type: Array, "default": []},
	default_currency: String,
	country: String,
	object: String,
	business_name: String,
	business_url: String,
	support_phone: String,
	metadata: {type: Array, "default": []},
	managed: Boolean,
	product_description: String,
	debit_negative_balances: Boolean,
	bank_accounts: Schema.Types.Mixed,
	verification: Schema.Types.Mixed,
	transfer_schedule: Schema.Types.Mixed,
	tos_acceptance: Schema.Types.Mixed,
	legal_entity: Schema.Types.Mixed,
	decline_charge_on: Schema.Types.Mixed,
	account_updated_via_webhook: {type: Boolean, default: false},
	updated_at: {type: Date}
});

module.exports = mongoose.model('stripeAccount', stripeAccountSchema);