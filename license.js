var fs = require('fs'),
util = require('util');

var encoding = 'binary';	

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

if (process.argv.length < 5) {
	console.log("Proper use: node.js license.js MODULE PATH LICENSE_PATH\n\twhere MODULE = ADMIN | PRIV | CORE | PUB");
	return;
}

console.log("Module: " + process.argv[2]);
console.log("Open dir: " + process.argv[3]);
console.log("License: " + process.argv[4]);

var license = fs.readFileSync(process.argv[4], encoding);
console.log("License content: " + license);

readDir(process.argv[2],process.argv[3]);

function readDir(module,dir) {
	console.log("MODULE: " + module);
	console.log("READ DIR: " + dir);
	
	var files = fs.readdirSync(dir);
	
	files.forEach(function(val,index,array) {
		var absolutePath = dir + "\\" + val;
		
		var file = fs.statSync(absolutePath);
		util.inspect(file);
		
		if (file.isFile()) {
			writeLicense(module,absolutePath);
		} else {
			readDir(module,absolutePath);
		}		
	});
}

function writeLicense(module,file) {
	if (file.lastIndexOf(".java") != -1) {		
		if (file.lastIndexOf(".java") == file.length - 5) {
			console.log("OK");
			console.log("JAVA FILE");
			console.log("INDEX: " + file.lastIndexOf(".java"));
			
						
			var fileData = fs.readFileSync(file,encoding);
			
			var dataTotal = license;
			dataTotal += "\n// MODULE: " + module;
			dataTotal += "\n// FILE: " + file.substring(file.lastIndexOf("\\")+1,file.length)
			dataTotal += "\n////////////////////////////////////////////////////////////////////////////////////////////////\n";
			dataTotal += fileData;
			
			fs.writeFileSync(file + ".lic",dataTotal,encoding);
			
			fs.renameSync(file,file + ".bck");
			fs.renameSync(file + ".lic", file);
		}
	} else {
		//console.log("UNKNOWN FILE");
	}
}