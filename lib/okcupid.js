var rest = require('restler')
var select = require('soupselect').select
var _ = require('underscore')
var htmlparser = require('htmlparser')
var querystring = require('querystring')
var uri = 'http://www.okcupid.com/'
var user_agent = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.134 Safari/534.16'
var authcodeRegex = /Profile.initialize\(user_info, .+, '(\d,\d,\d+,.+)'/

exports.createClient = function() {
	var _sessionCookie = null
	var _authcode = null
	var _username = null
	var _userId = null
	var post = function(path, params, callback) {	
		var headers = {"User-Agent": user_agent, "Cookie": _sessionCookie}
		rest.post(uri + path, {data: params, followRedirects: false, headers: headers})
			.on('complete', function (data, response) {												
				if (response.headers['set-cookie'] != null)
				{
					// console.log(response.headers['set-cookie'])
					var cookies = response.headers['set-cookie'].forEach(function(s)
					{
						if (s.indexOf('session=') > -1)
						{
							_sessionCookie = s.split(';')[0]									
						}
					})		
				}
				
				callback(data, response)
						
			})	
	}
	
	var get = function(path, params, callback)
	{
		var headers = {"User-Agent": user_agent, "Cookie": _sessionCookie}
		rest.get(uri + path, {data: params, followRedirects: true, headers: headers})
			.on('complete', function(data, response)
			{
				callback(data, response)
			})
	}
	
	var client = {
		authenticate: function(username, password, callback)
		{
			if (_sessionCookie != null)
			{
				console.log("Already logged in.")
			}
			post('login', {username: username, password: password}, function(data, response)
			{				
				
				if (_sessionCookie != null)
				{
					console.log("Succesfully authenticated. Fetching authcode to send messages.")
					_username = username
					// Getting authcode.
					get('profile/' + username, {}, function(data, response)
					{
						var match = authcodeRegex.exec(data);						
						_authcode = match != null ? match[1] : null
						if (_authcode != null && callback) 
						{
							console.log('Authcode found. You are ready to spam.')
							callback(true)
						}
						else 
						{
							console.log('Couldn\'t parse out an authcode from your profile. Okcupid has probably changed their source. Update the regex for finding the code.')
							callback(false)
						}
					})					
					
				}
				else
				{
					console.log("Login failure. Check username / password.")
					if (callback != null) callback(false)
				}
			})
		},
	
		message: function(username, message, callback)
		{
			
			var params = {
				sendmsg: '1',
				r1: username,
				body: message,
				authcode: _authcode,		
			}
			console.log(params)
			post('mailbox', params, function(data, response)			
			{
				console.log('Message to ' + username + ' sent!')
			})
			if (callback != null) callback()
		},
			
	}
	return client;
}


/*
	var handler = new htmlparser.DefaultHandler(function(err, dom) {
            if (err) {
                sys.debug("Error: " + err);
            } else {

                // soupselect happening here...
                var titles = select(dom, 'a.title');
                titles.forEach(function(title) {
                    console.log("- " + title.children[0].raw + " [" + title.attribs.href + "]\n");
                })
            }
        });

        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(body);*/