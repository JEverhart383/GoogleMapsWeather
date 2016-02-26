app.factory('Authentication', function( $rootScope, $location){

var authObject = {

	setAuth: function(apiCreds) {
		
		var url = JSON.stringify(apiCreds.url); 
		var apiKey = JSON.stringify(apiCreds.apiKey); 
		var accountID = JSON.stringify(apiCreds.account.id); 
		var accountName = JSON.stringify(apiCreds.account.name); 

		if(window.localStorage){

			localStorage.setItem("apiKey", apiKey);
			localStorage.setItem("url", url); 
			localStorage.setItem("accountID", accountID ); 
			localStorage.setItem("accountName", accountName); 

		}; 


	},
	checkAuth: function(){
		if(window.localStorage){

			if($rootScope.apiCreds.apiKey){

			$rootScope.apiCreds.apiKey = localStorage.getItem("apiKey"); 
			$rootScope.apiCreds.url = localStorage.getItem("url"); 
			$rootScope.apiCreds.account.id = localStorage.getItem("accountID"); 
			$rootScope.apiCreds.account.name = localStorage.getItem("accountName"); 

			} 

		}; 
	}, 
	deleteAuth: function(){
		$rootScope.apiCreds = ""; 
		
		if(window.localStorage){
			localStorage.removeItem("apiKey");
			localStorage.removeItem("url");
		}
		$location.path('/home'); 
	}
}; 


return authObject; 

}); 