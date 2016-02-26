var app = angular.module("ApiApp", [ "ngRoute"]);

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


app.controller("MapsController",['$scope', '$rootScope', '$http',
	function($scope, $rootScope, $http){
	
		$scope.message = "This is a really exciting message!"; 

}]);  



