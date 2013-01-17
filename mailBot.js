var Imap = require('imap');
var util = require('util');

var imap = new Imap({
	user: 'lucene.bot@gmail.com',
	password: 'lucene012345678',
	host: 'imap.gmail.com',
	port: 993,
	secure: true
});	

var incomingMailCB;

module.exports = {
  checkMail: function (mailCB) {	
	imap.connect(function(err) {
		console.log("imap connected");
		
		console.log(imap._state.box.permFlags);
		incomingMailCB = mailCB;
		
		if (err) {
			console.log("Error openCB");
			die(err);
		}
		imap.openBox('INBOX', false, function(err,mailbox) { 
								openCB(err,mailbox); 
		});
	});
  }, 
};




function show(obj) {
	return util.inspect(obj, false, Infinity);
}

function die(err) {
	console.log('Uh oh: ' + err);
	process.exit(1);
}

function processMessage(fetch) {	
	fetch.on('message', function(msg) {
		console.log('Saw message no. ' + msg.seqno);
		var body = '';
		msg.on('headers', function(hdrs) {
			//console.log('Headers for no. ' + msg.seqno + ': ' + show(hdrs));
		});
		msg.on('data', function(chunk) {
			body += chunk.toString('utf8');
		});
		msg.on('end', function() {
			console.log('Finished message no. ' + msg.seqno);
			incomingMailCB(body);

			//imap.addFlags(msg.uid, '\\Seen', function(err) { });
		});
	});
}

function errorMessage(err) {
	if (err) {
		console.log("Error openCB");
		throw err;
	}

	console.log('Done fetching all messages!');
	imap.logout();
}

function openCB(err, mailbox) {
	if (err) {
		console.log("Error openCB");
	}
	
	imap.search([ 'UNSEEN', ['SINCE', 'Jan 1, 2013'], ['SUBJECT', '[*LUCENE*]'] ], 
		function(err, results) {
			if (err) die(err);
			
			if (results == "") {
				console.log("No results. End");
				return;
			}
		
			imap.fetch(results, { markSeen: false },							
						  { 	headers: ['from', 'to', 'subject', 'date'], 
							body: true, 							
							cb: processMessage }, 
							errorMessage );	
		});		
}