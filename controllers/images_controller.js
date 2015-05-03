'use strict';

var fs = require("fs"),
formidable = require("formidable"),
util = require("util"),
os =require("os");

exports.postImage = function(req,res){
	var form = new formidable.IncomingForm();
	var uploadFileDirectory = process.cwd()+"/uploads/";
	form.uploadDir = uploadFileDirectory;
	form.parse(req, function(err, fields, files){
		console.log("$$$ fields is $$$");
		console.log(fields);
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
    	// console.log("$$$ this.openedFiles[0] $$$:");
    	// console.log(this.openedFiles[0]);
    	var temporaryPath = this.openedFiles[0].path;
	    var fileName = this.openedFiles[0].name;
	    fs.rename(temporaryPath,uploadFileDirectory+fileName,function(err,data){
	    	if (err) {throw err;};
	    	res.end("Success");
	    });
    });
};
exports.uploadTingz = function(req,res){
	res.writeHead(200, {'Content-Type': 'text/html' });
  	var form = '<form action="/image/upload" enctype="multipart/form-data" method="post">Add a title: <input name="title" type="text" /><br><br>Add a description son: <textarea name="description"></textarea><br><br><input multiple="multiple" name="upload" type="file" /><br><br><input type="submit" value="Upload" /></form>';
  	res.end(form); 
};
exports.getUpload = function(req,res){
	var requestedFile = req.params.file;
	console.log("$$$ req.params is $$$:");
	console.log(req.params);
	var uploadDirectory = process.cwd()+"/uploads/";
	console.log("$$$ uploadDirectory $$$: "+uploadDirectory);
	fs.readFile(uploadDirectory+requestedFile,function(err,file){
		if (err) {throw err;};
		console.log("$$$ File from callback is: $$$");
		console.log(file);
		//res.writeHead(200,{'Content-Type': 'text/plain'});
		//res.write(file);
		res.end(file,'binary');
	});
};
exports.showAllImages = function(req,res){
	fs.readdir(process.cwd()+"/uploads/", function(err,files){
		res.end("The files are:\n"+files);
	});
}
// app.get('/uploads/:file', function (req, res){
//     file = req.params.file;
//     var dirname = "/home/rajamalw/Node/file-upload";
//     var img = fs.readFileSync(dirname + "/uploads/" + file);
//     res.writeHead(200, {'Content-Type': 'image/jpg' });
//     res.end(img, 'binary');
// });
