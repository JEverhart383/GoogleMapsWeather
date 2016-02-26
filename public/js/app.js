var app = angular.module("ApiApp", [ "ngRoute", 'uiGmapgoogle-maps']);

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
	
		$scope.currentPosition = {
			latitude: "", 
			longitude: ""
		}
		
			
			$scope.checkCurrentWeather = function(){

				$http.post("/checkWeather", $scope.currentPosition)
				.success(function(data){
					console.log(data);
					$scope.currentWeather = data;  
			
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
		}

}]);  



