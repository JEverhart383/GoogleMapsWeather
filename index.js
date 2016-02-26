
var bodyParser = require('body-parser');
var express = require('express');
var https = require('https');

var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var linkParser = require('parse-link-header'); 

var app = express();

app.use(bodyParser.json());    // parse application/json


app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {

  response.render('pages/index');

});

// Route Controllers for Angular Auth CTRL 

app.post('/checkCreds', function(request, response) {   

		var host = request.body.url; 
		var apiKey =  request.body.apiKey; 
		var path = '/api/v1/accounts'; 	
  	
  		var str = '';
  		var options = {
		    	host: host,
		  		path: path,
		  		method: 'GET', 
		  		headers: { 
    			'Authorization' : 'Bearer ' + apiKey
  				} 
		    };
  		
  		  var req = https.request(options, function(res){
  			
  			res.on('data', function (chunk) {
  				console.log("Here");
		    	str += chunk;
		  		
		  		});

		  	res.on('end', function () {
		    	response.send(str); 

		  		});
		  }); 

		  req.end(); 

		  req.on('error', function(e){
			  console.error(e);
			});

});

//Route Controllers for Angular Dashboard CTRL 

app.post('/getAcctAnalytics', function(request, response){

		var host = request.body.url; 
		var apiKey =  request.body.apiKey; 
		var acctID = request.body.account.id; 
		var path = '/api/v1/accounts/' + acctID + '/analytics/completed/statistics' ;  	
  	
  		var str = '';
  		var options = {
		    	host: host,
		  		path: path,
		  		method: 'GET', 
		  		headers: { 
    			'Authorization' : 'Bearer ' + apiKey
  				} 
		    };
  		
  		  var req = https.request(options, function(res){
  			
  		  res.on('data', function (chunk) {
  				console.log("Here");
		    	str += chunk;
		  		
		  });

		  res.on('end', function () {
		    	response.send(str); 

		  		});
		  }); 

		  req.end(); 

		  req.on('error', function(e){
			  console.error(e);
			});

}); 

app.post('/getTerms', function(request, response){

		var host = request.body.url; 
		var apiKey =  request.body.apiKey; 
		var acctID = request.body.account.id; 
		var path = '/api/v1/accounts/' + acctID + '/terms' ;  	
  	
  		var str = '';
  		var options = {
		    	host: host,
		  		path: path,
		  		method: 'GET', 
		  		headers: { 
    			'Authorization' : 'Bearer ' + apiKey
  				} 
		    };
  		
  		  var req = https.request(options, function(res){
  		   
  		  res.on('data', function (chunk) {
  				console.log("Here"); 
		    	str += chunk;
		  });

		  res.on('end', function () {
		  		var links = res.headers["link"]; 
		  		var parsedLinks = linkParser(links); 
		    	response.send(parsedLinks); 

		  		});
		  }); 

		  req.end(); 

		  req.on('error', function(e){
			  console.error(e);
			});

}); 

// Route Controllers for Angular New Course CTRL 

app.post('/newCourse', function(request, response){


		var	jsonParams = JSON.stringify(request.body.courseObj); 
		var host = request.body.apiCreds.url; 
		var apiKey =  request.body.apiCreds.apiKey; 
		var acctID = request.body.apiCreds.account.id; 
		var path = '/api/v1/accounts/' + acctID + '/courses'; 	
  	
  		console.log(jsonParams); 

  		var str = '';
  		var options = {
		    	host: host,
		  		path: path,
		  		method: 'POST',
		  		headers: {
    			'Content-Type': 'application/json', 
    			'Authorization' : 'Bearer ' + apiKey, 
    			'Content-Length': jsonParams.length
  				} 
		    };
  		
  		  var req = https.request(options, function(res){
  			
  		  res.on('data', function (chunk) {
  				console.log("Here Response");
		    	str += chunk;	
		  });

		  res.on('end', function () {
		    	response.send(str); 

		  		});
		  }).write(jsonParams); 

}); 

// Route Controllers for Angular Crosslist CTRL 

app.post('/checkParentSection', function(request, response){

		var	jsonParams = JSON.stringify(request.body.courseObj); 
		var host = request.body.apiCreds.url; 
		var apiKey =  request.body.apiCreds.apiKey; 
		var courseID =  request.body.courseObj.parentCourseID; 
		var path = '/api/v1/courses/' + courseID + '/sections';	
  	
  		console.log(jsonParams); 

  		var str = '';
  		var options = {
		    	host: host,
		  		path: path,
		  		method: 'GET',
		  		headers: {
    			'Content-Type': 'application/json', 
    			'Authorization' : 'Bearer ' + apiKey, 
    			'Content-Length': jsonParams.length
  				} 
		    };
  		
  		  var req = https.request(options, function(res){
  			
  		  res.on('data', function (chunk) {
  				console.log("Here Response");
		    	str += chunk;	
		  });

		  res.on('end', function () {
		    	response.send(str); 

		  		});
		  }).write(jsonParams); 





});

app.post('/checkChildSection', function(request, response){

		var	jsonParams = JSON.stringify(request.body.courseObj); 
		var host = request.body.apiCreds.url; 
		var apiKey =  request.body.apiCreds.apiKey; 
		var courseID =  request.body.courseObj.childCourseID; 
		var path = '/api/v1/courses/' + courseID + '/sections';	
  	
  		console.log(jsonParams); 

  		var str = '';
  		var options = {
		    	host: host,
		  		path: path,
		  		method: 'GET',
		  		headers: {
    			'Content-Type': 'application/json', 
    			'Authorization' : 'Bearer ' + apiKey, 
    			'Content-Length': jsonParams.length
  				} 
		    };
  		
  		  var req = https.request(options, function(res){
  			
  		  res.on('data', function (chunk) {
  				console.log("Here Response Child");
		    	str += chunk;	
		  });

		  res.on('end', function () {
		    	response.send(str); 

		  		});
		  }).write(jsonParams); 


});

app.post('/crosslist', function(request, response){

		var	jsonParams = JSON.stringify(request.body.courseObj); 
		var host = request.body.apiCreds.url; 
		var apiKey =  request.body.apiCreds.apiKey; 
		var courseID =  request.body.courseObj.parentCourseID; 
		var sectionID = request.body.courseObj.childSectionID; 
		var path = '/api/v1/sections/' + sectionID  + '/crosslist/' + courseID; 	
  	
  		console.log(jsonParams); 

  		var str = '';
  		var options = {
		    	host: host,
		  		path: path,
		  		method: 'POST',
		  		headers: {
    			'Content-Type': 'application/json', 
    			'Authorization' : 'Bearer ' + apiKey, 
    			'Content-Length': jsonParams.length
  				} 
		    };
  		
  		  var req = https.request(options, function(res){
  			
  		  res.on('data', function (chunk) {
  				console.log("Here Response");
		    	str += chunk;	
		  });

		  res.on('end', function () {
		    	response.send(str); 

		  		});
		  }).write(jsonParams); 


}); 

// Create Dev Shells Paths 

app.post('/getCourseEnrollments', function(request, response){

		var host = request.body.apiCreds.url; 
		var apiKey =  request.body.apiCreds.apiKey; 
		var courseID = request.body.enrollment.course_id; 
		var path = '/api/v1/courses/' + courseID + '/enrollments' ;  	
  	
  		var str = '';
  		var options = {
		    	host: host,
		  		path: path,
		  		method: 'GET', 
		  		headers: { 
    			'Authorization' : 'Bearer ' + apiKey
  				} 
		    };
  		
  		  var req = https.request(options, function(res){
  			
  		  res.on('data', function (chunk) {
  				console.log("Here");
		    	str += chunk;
		  		
		  });

		  res.on('end', function () {
		    	response.send(str); 

		  		});
		  }); 

		  req.end(); 

		  req.on('error', function(e){
			  console.error(e);
			});

}); 

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

