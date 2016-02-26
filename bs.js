
var bodyParser = require('body-parser');
var express = require('express');
var https = require('https');

var app = express();

app.use(bodyParser()); 

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Canvas API Middleware

app.post('/crosslist', function(req, res, next){

var parentCourse = req.body.parentCourse; 
var childCourse = req.body.childCourse; 
 

function crosslistAPI(parent, child){

	 	var options = {
		  host: 'canvas.longwood.edu',
		  path: '/api/v1/courses/'+ child +'/sections/?access_token=18~RbqrkxPvIWg2loHognTe9JbHTTo0IR9zQjwqWRuK74erTCNCAQHRCSCaiSRLWrog',
		  method: 'GET'
		};
		var str = '';
		
		var callback = function(response) {

			function stringJSON(string){
				string = JSON.stringify(string); 
				return string; 
			}

			function produceJSON(string){ 
				var str = stringJSON(string); 
				var obj = JSON.parse(str); 
				return obj; 
			}

		  	response.on('data', function (chunk) {
		    	str += chunk;

		  		});

		  	response.on('end', function () {
		    	console.log(str);

		    	var JSONobj = produceJSON(str);  
		    	
		    	

		    	//var courseString = JSON.stringify(str); 
		    	
		    	//var courseArray = JSON.parse(JSONstr);

		    	console.log(typeof(JSONobj)); 

		    	// if (courseArray.length != 1){
		    	// 	console.log("Error: this course"); 
		    	// 	next(); 
		    	// } else {

		    	// 	var section = courseArray[0]["id"]; 

		    	// 	var options = {
		    	// 		host: 'canvas.longwood.edu',
		  			// 	path: '/api/v1/sections/'+ section +'/crosslist/'+ parentCourse + '/?access_token=18~RbqrkxPvIWg2loHognTe9JbHTTo0IR9zQjwqWRuK74erTCNCAQHRCSCaiSRLWrog',
		  			// 	method: 'POST'
		    	// 	}; 

		    	// 	var crosslistRequest = https.request(options, function(res){
		    	// 		console.log("made a call"); 
		    	// 		console.log(res); 

		    	// 	}); 

		    	// }

		    	18~3bPQpAwJRgNHAYROD1iuxBCDf2UwR9bo3h94HC1d7GazvC4L6H97ywqhCwAzeC7z

		    	// Beta
		    	18~Q7i5unZy6ItfHFofQGxGqpUDozGbM2ALXTvPfqJTironnGS4BiXdG1mqz6MWeLhV

		    	//Test
		    	18~KNYaQwpSEHHLLo9nhST2VLByxIk743GmY6ytLmRBCt5KoArtsJx7cTpMShD8qZPe


		    	console.log(JSONobj); 

		  		});

		  	response.on("error", function (){
		  	console.log("There was an error accessing the Canvas API");
				});
		  }


		var request = https.request(options, callback); 
		
		request.end(); 

}

crosslistAPI(parentCourse, childCourse); 

next(); 
}); 





app.get('/', function(request, response) {
  response.render('pages/index');
});


app.get('/crosslist', function(request, response) {

	 response.render('pages/crosslist');


});

app.get('/new-course', function(request, response) {

	 response.render('pages/new-course');


});

app.post('/crosslist', function(req, res){

	//Access error/success messages
	res.send("Crosslisted successfully"); 


}); 


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


