
//

var param = process.argv.splice(2);
var action = param[0];
var filepath = param[1];
var filename = filepath;
var index;
if (filename) {
	while ( (index = filename.indexOf('/')) != -1) {
		filename = filename.slice(index+1);
	}
}
var UPYUN = require('upyun');
var upyun = new UPYUN('staticfile00', 'xiatianhan', 'zxzczvxia', '', 'legacy');
if (action == "upload") {
	upyun.uploadFile("/"+filename, filepath, "text/plain", true, {}, function(err, result) {
		console.log(result);
	})
} else if (action == "update") {
	upyun.removeFile("/"+filename, function(err, result) {
		upyun.uploadFile("/"+filename, filepath, "text/plain", true, {}, function(err, result) {
			console.log(result);
		})
	});
	console.log("message");
} else if (action == "delete") {
	upyun.removeFile("/"+filename, function(err, result) {
		console.log(result);
	});
} else if (action == "help") {
	console.log("usage: node upyun.js <action> [<filepath>]"
		+ "\n"
		+ "<action> : 1.upload 2.delete 3.update 4.info");
} else if (action == "info") {
	upyun.listDir("/", function(err,result) {
		console.dir(result.data.files);
	})
}

