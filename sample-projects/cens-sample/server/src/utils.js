
var utils = (function() {

	var log4js = require('log4js'),
		logger = log4js.getLogger('adams-server'),
		request = require('request'),
		Promise = require('promise');

	function makeApiCallWithOAuthToken(url, token, accept, method, body, contentType) {
		var promise = new Promise(function(resolve, reject) {

			var options;
			
			if (contentType) {
				options = {
					method: (method) ? method : 'GET',
					url: encodeURI(url),
					headers: {
						access_token: token,
						accept: accept,
						'content-type': contentType
					}
				};	
			}
			else {
				options = {
					method: (method) ? method : 'GET',
					url: encodeURI(url),
					headers: {
						access_token: token,
						accept: accept			
					}
				};
			}

			if (body) {
				options.body = body;
				options.json = true;
			}			

			function callback(error, response, body) {
				
				var responseObject;
				try {
					responseObject = ('object' === typeof body) ? body : JSON.parse(body);
				} catch(e) {
					responseObject = {error: {http_status: response ? response.statusCode : 500 , user_message: response ? response.body : 'Unknown Error'}};
				}

				if (!error && response && response.statusCode.toString().startsWith(2)) {
					resolve(responseObject);
				} else {
					logger.error('An error occurred while attempting to make an API call to', url);
					logger.error('Request options: ', options);
					logger.error('Response object body: ', responseObject);

					reject((responseObject && responseObject.error) ? responseObject.error : 'An unknown error occurred');
				}
			}

			request(options, callback);			
		});
		
		return promise;

	}


	function callApiWithOAuthToken(url, token, accept, method, body, contentType) {
		var promise = new Promise(function(resolve, reject) {

			var options = {
				method: (method) ? method : 'GET',
				url: encodeURI(url),
				headers: {
					access_token: token,
					accept: accept,
					'Content-Type': contentType
				}
			};

			if (body) {
				options.body = body;
				options.json = true;
			}
			
			function callback(error, response, body) {

				var responseObject;
				try {
					responseObject = ('object' === typeof body) ? body : JSON.parse(body);
				} catch(e) {
					responseObject = {error: {http_status: response ? response.statusCode : 500 , user_message: response ? response.body : 'Unknown Error'}};
				}

				if (!error && response && response.statusCode.toString().startsWith(2)) {
					resolve(responseObject.data);
				} else {
					logger.error('An error occurred while attempting to make an API call to', url);
					logger.error('Request options: ', options);
					logger.error('Response object body: ', responseObject);

					reject((responseObject && responseObject.error) ? responseObject.error : 'An unknown error occurred');
				}
			}
			
			request(options, callback);
		});
		
		return promise;

	}


	var service =  {
		makeApiCallWithOAuthToken : makeApiCallWithOAuthToken
	};

	return service;

})();

module.exports = utils;