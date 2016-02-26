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

.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
})


app.controller("MapsController",['$scope', '$rootScope', '$http', 'uiGmapGoogleMapApi'
	function($scope, $rootScope, $http, uiGmapGoogleMapApi){
	
		$scope.message = "This is a really exciting message!"; 

		uiGmapGoogleMapApi.then(function(maps) {

    	
    	});

}]);  



