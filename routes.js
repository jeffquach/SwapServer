var requests = require('./requests');
var request = require('request');
var usersController = require('./controllers/users_controller');
var chatController = require('./controllers/chat_controller')
var imagesController = require("./controllers/images_controller");
var postsController = require("./controllers/posts_controller");
var stripeAccountsController = require("./controllers/stripe_accounts_controller");
var express = require('express');
var router = express.Router();

router.get('/', usersController.index);
router.get('/termsOfService', usersController.showTermsOfService);
router.get('/test', usersController.test);
router.post('/login', usersController.login);
router.post('/chat/send', chatController.send);
router.post('/users', usersController.users);
router.get('/users', usersController.getUsers);
router.post('/logout', usersController.logout);
router.post('/users/updateLocation', usersController.updateUserLocation);

router.post('/image/upload', imagesController.postImage);
router.get('/image/uploadTingz', imagesController.uploadTingz);
router.get('/image/uploads/:file', imagesController.getUpload);

router.post('/post/new', postsController.createNewPost);
router.get('/post/new', postsController.createTingz);
router.get('/post/index/:city', postsController.getAllPosts);
router.post('/post/seedDatabase', postsController.seedDatabase);
router.get('/post/:username/:id', postsController.getPost);

router.post('/stripe/webhook', stripeAccountsController.testWebhook);
router.post('/stripe/newAccount', stripeAccountsController.sendAndSaveAccountInformation);
router.post('/stripe/updateAccount', stripeAccountsController.updateAccountWebhook);
router.post('/stripe/receiveToken', stripeAccountsController.receiveToken);

module.exports = router;

//curl -H "Content-Type: application/json" -d '{"usernameOfSender":"douglas","phoneNumberOfSender":"888","phoneNumberOfRecipient":"777","messageBody":"Cholo son!"}' http://127.0.0.1:3000/chat/send
//curl -H "Content-Type: application/json" -d '{"phoneNumber":"111"}' http://localhost:3000/users

///////////// LOGIN //////////////
// curl -H "Content-Type: application/json" -d '{"username":"ropMeng","phoneNumber":"882229998"}' http://127.0.0.1:3000/login
// curl -H "Content-Type: application/json" -d '{"username":"andreesen","phoneNumber":"111","registration_id":"somethingMadGangsta888"}' http://127.0.0.1:8080/login
// curl -H "Content-Type: application/json" -d '{"username":"turdMeister","phoneNumber":"882229998","registration_id":"89238juffieh3rh48","longitude":"115.6905","latitude":"93.328394"}' http://127.0.0.1:3000/login
///////////// END OF LOGIN //////////////

//curl -F "image=@/Users/jeff/githubicon.png" -d '{"phoneNumber":"111"}' http://127.0.0.1:3000/post/new

//curl -H "Content-Type: application/json" -d '{"username": "chingChong","phoneNumber": "88989","title": "Da illest ting ever made son!","description": "Buy diz ting now haters!","city": "ChingChongVille","locationOfImage": "/Users/jeff/share/node/nodeDroidChat/uploads/githubicon.png"}' --data-binary "@/Users/jeff/githubicon.png" http://127.0.0.1:3000/post/new


//[{username: "jomarChong",phoneNumber: "33238989",title: "BING TINGGGting ever made son!",description: "Money on ma mind son!",city: "ChingChongVille",locationOfImage:"/someplace/mad/gangsta/uploads/githubicon.png"},{username: "skerpChong",phoneNumber: "881123989",title: "Da illest son!",description: "Watermelon poutine",city: "ChingChongVille",locationOfImage:"/someplace/mad/gangsta/uploads/joeBlowStarr.png"}]

// curl -F "username=chingChong" -F "phoneNumber=88989" -F "title=Da illest ting ever made son" -F "description=Buy diz ting now haters" -F "city=okc" http://127.0.0.1:3000/post/new

//curl -H "Content-Type: application/json" -d '{"country": "US","transitNumber": "111000025","institutionNumber":"004","bankAccountNumber": "000123456789","currency":"usd","email":"romar@turpentine.com","address":"9980 Nurble St.","city": "Toronto","state": "AZ","postalCode": "90017","firstName": "Turban","lastName": "Meister","birthdayDay": "09", "birthdayMonth": "09", "birthdayYear": "2000", "personalIdNumber":"123456789"}' http://127.0.0.1:3000/stripe/newAccount

//curl -H "Content-Type: application/json" -d '{"country": "CA","transitNumber": "11602","institutionNumber":"004","bankAccountNumber": "000123456789","currency":"cad","email":"splashyJizz@roper.com","address":"577585 TestMonkeyVille St.","city": "HoboVillage","state": "ON","postalCode": "M6P3K1","firstName": "MaHesher","lastName": "Davis","birthdayDay": "09", "birthdayMonth": "09", "birthdayYear": "2000"}' http://127.0.0.1:3000/stripe/updateAccount

//curl -H "Content-Type: application/json" -d '{"email":"jerbilMeister@123.com","account_updated_via_webhook":"true"}' http://127.0.0.1:3000/stripe/updateAccount

// stripe.account.create({country: "CA",managed: true,email:"jimboFisher@roper.com",bank_account:"btok_5zH87e2vFDjCEi",legal_entity:{address:{ line1: "9980 Nurble St.",city: "Toronto",state: "ON",postal_code: "M6P3K1",country: 'CA' },first_name: "Turban",last_name: "Meister",dob: { day: 09, month: 09, year: 2000 },type:"individual"},tos_acceptance:{ip: "99.209.108.90", date: new Date().getTime()}},function(err,res){if(err){throw err;};console.log(res);console.log(res.bank_accounts.data)});

// stripe.account.create({country: "US",managed: true,email:"jimboFisher@roper.com",legal_entity:{address:{ line1: "9980 Nurble St.",city: "Washington",state: "DC",postal_code: "20004",country: 'US' },first_name: "Turban",last_name: "Meister",dob: { day: 09, month: 09, year: 2000 }type:"individual"},tos_acceptance:{ip: "99.209.108.90", date: new Date().getTime()}});

// stripe.account.create({country: "US",managed: true,email:"jimboFisher@roper.com",legal_entity:{address:{ line1: "9980 Nurble St.",city: "Washington",state: "DC",postal_code: "20004",country: 'US' }});


// stripe.tokens.create({bank_account: {country: 'CA',routing_number: '11602-004',account_number: '000123456789',currency:'cad'}}, function(err, token) {if(err){throw err;};console.log(token)});

// stripe.tokens.retrieve("btok_5zGKdYEGjSLnoP",function(err, token) {if(err){throw err;};console.log(token)});

// CRASH SERVER request
// curl -H "Content-Type: application/json" -d '{"usernameOfSender":"douglas","phoneNumberOfSender":"888","phoneNumberOfRecipient":"777","messageBody":"Cholo son!"}' http://127.0.0.1:3000/post