var app = angular.module("ApiApp", [ "ngRoute", 'uiGmapgoogle-maps', 'nvd3']);

app.config(["$routeProvider", "$locationProvider", 
	function($routeProvider, $locationProvider){

	$routeProvider. 
		when("/home", {
			templateUrl: "views/home.html", 
			controller: "MapsController"
		}).
		otherwise({
				
			redirectTo: "/home"	

			}); 
		 // enable html5Mode for pushstate ('#'-less URLs)
	    //$locationProvider.html5Mode(true);
	   // $locationProvider.hashPrefix('!')

}]);

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCmh_iyP9lGOmWBXFl0Z7EzUxhJjno9768',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
})


app.controller("MapsController",['$scope', '$rootScope', '$http', 'uiGmapGoogleMapApi',
	function($scope, $rootScope, $http, uiGmapGoogleMapApi){
	
		$scope.farmvilleData = [

					{
						"key": "Temperature", 
						"values": [ ]
					}, 
					{
						"key": "dewPoint", 
						"values": [ ]
					}
				

		]; 

		$scope.currentData = [

					{
						"key": "temperature", 
						"values": [ ]
					}, 
					{
						"key": "dewPoint", 
						"values": [ ]
					}
				

		]; 
		
		$scope.farmvilleOptions = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return new Date(d.x); },
                y: function(d){ return d.y },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Date', 
                    tickFormat: function(d) {
                        return d3.time.format('%m/%d/%y')(new Date(d))
                    },
                },
                yAxis: {
                    axisLabel: 'Temp (f)'
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Historic Farmville Weather'
            },
            subtitle: {
                enable: true,
                text: 'The data displays the historic temperature, visibility, and dew point for Farmville, VA collected every hour since I started this project. The data is collected and stored using Google Apps Script and is served from a Google Spreadsheet as CSV using Node.js as a proxy server.',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                text: 'This weather data was collected using the Forecast.io API.',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

        $scope.currentOptions = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return new Date(d.x); },
                y: function(d){ return d.y },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Date', 
                    tickFormat: function(d) {
                        return d3.time.format('%H:%M:%S')(new Date(d))
                    },
                },
                yAxis: {
                    axisLabel: 'Temp (f)'
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Current Position Forecast'
            },
            subtitle: {
                enable: true,
                text: 'The data displays the current forecasted temperature and dew point for your current location.',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                text: 'This weather data was collected using the Forecast.io API.',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

		$scope.currentPosition = {
			latitude: "", 
			longitude: ""
		}
		
			
			$scope.checkCurrentWeather = function(){

				$http.post("/checkWeather", $scope.currentPosition)
				.success(function(data){
					console.log(data);
					$scope.currentWeather = data;
					console.log($scope.currentWeather); 
					for(var i = 0; i < data.hourly.data.length; i++){

						$scope.currentData[0].values.push({
							"x": data.hourly.data[i]['time'], 
							"y": data.hourly.data[i].temperature
						});

						$scope.currentData[1].values.push({
							"x": data.hourly.data[i]['time'], 
							"y": data.hourly.data[i].dewPoint
						}); 


					}  
			
				})
				.error(function(data){
					console.log('Error: ' + data);

				});
			}; 


			$scope.getSheet = function(){

				$http.get("/getSheet")
				.success(function(data){ 
					
					 weatherArray = []; 
					
					d3.csv.parse(data, function(d){
						weatherArray.push(d); 

						$scope.farmvilleData[0].values.push({
							"x": d.Timestamp, 
							"y": d.Temperature
						}); 

						$scope.farmvilleData[1].values.push({
							"x": d.Timestamp, 
							"y": d.dewPoint
						}); 
						
					});
					console.log($scope.farmvilleData);
					console.log(weatherArray);  
		
				})
				.error(function(data){
					console.log('Error: ' + data);

				});
			}; 






			function updateCurrentPosition(position){
				$scope.currentPosition.latitude = position.coords.latitude; 
				$scope.currentPosition.longitude = position.coords.longitude;
				console.log(position);
				drawMap();   

			}

			function updateErrorMessage(){
				$scope.errorMessage = "Sorry, it doesn't look like your browser supports geolocation";
			}

			var geo_options = {
				enableHighAccuracy: true, 
				maximumAge: 1000

			}

			if (navigator.geolocation){
				var body = document.querySelector("body"); 

				var spinner = new Spinner({scale:3.00}).spin(body); 

				navigator.geolocation.getCurrentPosition(updateCurrentPosition, updateErrorMessage, geo_options); 

				navigator.geolocation.watchPosition(updateCurrentPosition, updateErrorMessage, geo_options); 


			} else {

				updateErrorMessage();  
			}

		function drawMap(){
				uiGmapGoogleMapApi.then(function(maps) {

					$scope.map = { center: $scope.currentPosition, zoom: 15 };
					$scope.marker = {
					id: 'current', 
					coords: $scope.currentPosition
				}; 

		    	
		    	});

		    	spinner.stop(); 
		}

}]);  



