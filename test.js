var api = require('./lib/api')
var automator = require('./lib/automator')
var client = api.createClient()

// Copy your preferred match search's url from the website.
var matchOptions = {
	searchUrl: 'http://www.okcupid.com/match?filter1=0,34&filter2=2,23,29&filter3=3,25&filter4=5,604800&filter5=1,0&filter6=35,0&filter7=9,256&filter8=30,4564&locid=0&timekey=1&matchOrderBy=SPECIAL_BLEND&custom_search=0&fromWhoOnline=0&mygender=m&update_prefs=1&sort_type=0&sa=1&using_saved_search='
}

var automatorOptions = {
	matchOptions: matchOptions,
	dryRun: false,
	maxMessages: 100
}

var message = 'How are you?'

client.authenticate('username', 'password', function(success){	
	automator.messageMatches(client, message, automatorOptions, function(){
		console.log('Complete!')
	})
})