var okcupid = require('./lib/okcupid')

var client = okcupid.createClient()

client.authenticate('lurker215', 'test', function(success){
	//client.message('mmeme', 'hi there')
})