var mail = require('./mailBot.js');

function init() {
	// Program checkMail interval
	setInterval(checkMail, 60000);		
	
	// First check 
	checkMail();
}

function checkMail() {
	mail.checkMail(processMessage);
}

function processMessage(body) {
	console.log("PROCESSING: " + body);
	
	var commands = body.split('\r\n');
	for (c in commands) {
		console.log("COMMAND: " + c);
	}
}

init();