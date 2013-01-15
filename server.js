var 	http = require('http'),
	https = require('https'),
	fs = require('fs'),
	nconf = require('nconf');

var localPort, remoteHost, remotePort;

var inputMessages, outputMessage;

// int configuration 
init();

// start server
startServer();


function startServer() {
	http.createServer(function (request, response) {
		inputMessage.write("-----------------------------------------------------------------------");
		inputMessage.write("URL: " + request.url);
		inputMessage.write("Method: " + request.method);
		inputMessage.write("HEADERS: " + request.headers);
		
		var data = "";
		
		request.on("data", function(chunk) {
			data += chunk;
		});

		request.on("end", function() {
			//console.log("raw: " + data);
			inputMessage.write(data);
			
			sendRequest(request, response, data);
			//console.log("Return data: " + ret);
			console.log("send request");
		});
		

	}).listen(localPort);	
	
	console.log('Server running at http://127.0.0.1:8124/');
}

function sendRequest(request, response, data) {	
	var options = {
		hostname: remoteHost,
		port: remotePort,
		path: request.url,
		method: request.method,		
		headers: request.headers,
		rejectUnauthorized:false
	};	

	//var responseData = "";	
	
	var req = http.request(options, function(res) {			
		console.log("statusCode: ", res.statusCode);
		console.log("headers: ", res.headers);

		response.headers = res.headers;
		//response.statusCode = res.statuscode;
		
		res.on('data', function(chunk) {
			//process.stdout.write(d);
			//responseData += chunk;
			outputMessage.write(chunk);
			response.write(chunk);
		});
		
		res.on('end',function() {
			//console.log("response: " + response);
			response.end();
		});
	});	
	
	req.write(data);
	
	req.end();

	req.on('error', function(e) {
		console.error("ERROR: " + e);
	});
	
	return response;
}


function init() {		
	nconf.file({file: 'config.json'});

	localPort = nconf.get('local:port');
	console.log("Local port: " + localPort);
	
	remoteHost = nconf.get('remote:host');
	remotePort = nconf.get('remote:port');
	console.log("Remote host: " + remoteHost + ":" + remotePort);
	
	https.globalAgent.options.secureProtocol = 'SSLv3_method';
	
	outputMessage = fs.createWriteStream("outputMessage.log",  { 	flags: 'w',
									encoding: null,
									mode: 0666 });
									
	inputMessage = fs.createWriteStream("inputMessage.log",  { 	flags: 'w',
									encoding: null,
									mode: 0666 });
	
									/*
	fs.open("outputMessage.log","w+",function(error,fd) {
		outputMessage = fd.WriteStream();
	});
	
	fs.open("inputMessage.log","w+",function(error,fd) {
		inputMessage = fd.WriteStream();
	});
									*/
}

function getIndex() {
	var fileData;
	console.log("getIndex()");
	
	fileData = fs.readFileSync('index.html');
	
	console.log("data: " + fileData);
	return fileData;
}


