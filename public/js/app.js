var app = angular.module("ApiApp", [ "ngRoute"]);

app.config(["$routeProvider", "$locationProvider", 
	function($routeProvider, $locationProvider){

	$routeProvider. 
		when("/home", {
			templateUrl: "views/auth-screen.html", 
			controller: "ApiConnectController"
		}).
		when("/dashboard", {
			templateUrl: "views/dashboard.html", 
			controller: "DashboardController"
		}).
		when("/new-course", {
			templateUrl: "views/new-course.html", 
			controller: "NewCourseController"
		}).
		when("/crosslist", {
			templateUrl: "views/crosslist.html", 
			controller: "CrosslistController"
		}).
		when("/dev-shells", {
			templateUrl: "views/dev-shells.html", 
			controller: "DevShellsController"
		}).
		otherwise({
				
				redirectTo: "/home"	

			}); 
		 // enable html5Mode for pushstate ('#'-less URLs)
	    //$locationProvider.html5Mode(true);
	   // $locationProvider.hashPrefix('!')

}]); 


app.controller("ApiConnectController",['$scope', '$rootScope', '$http', 'Authentication',
	function($scope, $rootScope, $http, Authentication){
	
	$rootScope.apiCreds = {
		apiKey: "",
		url: "", 
		account: {
			id: "", 
			name: ""
		} 

	}; 

	$scope.authSuccess = false; 

	$scope.checkCreds = function(){

		console.log($rootScope.apiCreds); 


		$http.post("/checkCreds", $rootScope.apiCreds)
			.success(function(data){

				$scope.authSuccess = true; 
				$rootScope.apiCreds.account = {
				 	id: data[0]["id"], 
				 	name: data[0]["name"] 

				}; 
				console.log($rootScope.apiCreds); 
				
				//Authentication.setAuth($rootScope.apiCreds); 

			})
			.error(function(data){
				console.log('Error: ' + data);

			}); 

	}

}]);  


app.controller("DashboardController",['$scope', '$http', '$rootScope', 'Authentication',
	function($scope, $http, $rootScope, Authentication){

		console.log($rootScope.apiCreds); 

		//Authentication.checkAuth();
		
		$http.post("/getAcctAnalytics", $rootScope.apiCreds)
			.success(function(data){
				console.log(data);
			})
			.error(function(data){
				console.log('Error: ' + data);

			}); 

		$http.post("/getTerms", $rootScope.apiCreds)
			.success(function(data){
				console.log(data);
			})
			.error(function(data){
				console.log('Error: ' + data);

			}); 	

}]);  



app.controller("NewCourseController", function($scope, $http, $rootScope){
		
		$scope.section = ""; 
		$scope.multipleCourses = false; 
		$scope.newCourseObj = {
			apiCreds: $rootScope.apiCreds,
			courseObj:{ 
			course: {
				name: "", 
				course_code: "" 
			}
		  }
		}; 

		$scope.successMessages = [];
		$scope.errorMessages = [];  

		//TODO: Create a collapsable element with advanced options, 
		// incl. calendar for start date/end date using Angular Bootstrap UI 
		// radio buttons for terms  

		// $scope.getEnrollmentTerms = function(){

		// };

		$scope.createNewCourse = function(){

			if ($scope.multipleCourses === false){

				var section = $scope.section; 
				$scope.newCourseObj.courseObj.course.name = $scope.newCourseObj.courseObj.course.name + "-" + section;
				$scope.newCourseObj.courseObj.course.course_code = $scope.newCourseObj.courseObj.course.course_code + "-" + section;

				var validJSON = JSON.stringify($scope.newCourseObj); 

				console.log(validJSON); 
				
				$http.post("/newCourse", validJSON,{ 
				headers:{'Content-Type':'application/json'}
				})
				.success(function(data){
					console.log(data);
					$scope.successMessages.push(data); 
				})
				.error(function(data){
					console.log('Error: ' + data);
					$scope.errorMessages.push(data); 

				}); 	
			}

			if ($scope.multipleCourses === true){
					
				var numberOfCourses = $scope.numberOfCourses; 
				
				//create references to canonical name and course code so that we can modify and 
				//post $scope variables 
				var courseName = $scope.newCourseObj.courseObj.course.name; 
				var courseCode = $scope.newCourseObj.courseObj.course.course_code;  

				for (var i = 1; i <= numberOfCourses; i++){

					if (i < 10){
						i = i.toString(); 
						i = "0"+i;
						console.log(i);  
					}

				$scope.newCourseObj.courseObj.course.name = courseName + "-" + i;
				$scope.newCourseObj.courseObj.course.course_code = courseCode + "-" + i;

				var validJSON = JSON.stringify($scope.newCourseObj); 
				console.log(validJSON);

					$http.post("/newCourse", validJSON,{ 
						headers:{'Content-Type':'application/json'}
						})
						.success(function(data){
							console.log(data);
							$scope.successMessages.push(data);
						})
						.error(function(data){
							console.log('Error: ' + data);
							$scope.errorMessages.push(data); 

						}); 
					};  


				}

				$scope.newCourseObj.courseObj.course.name = "";
				$scope.newCourseObj.courseObj.course.course_code = ""; 
				$scope.numberOfCourses = ""; 
				$scope.section = ""; 


		}
 
});


app.controller("CrosslistController", function($scope, $http, $rootScope){
		
		
		$scope.newCourseObj = {
			apiCreds: $rootScope.apiCreds,
			courseObj:{ }
		}; 

		$scope.parentSectionGood = false;
		$scope.childSectionGood = false;  

		//Function that checks parent section. If parent section returns good
		//then call checkChildSection from within check parent section. If child section returns good
		//call crosslist from checkChildSection

		$scope.checkParentSection = function(){

			validJSON = JSON.stringify($scope.newCourseObj); 

			$http.post("/checkParentSection", validJSON,{ 
				headers:{'Content-Type':'application/json'}
				})
				.success(function(data){
					console.log(data);
					if (data.length !== 0){

						$scope.parentSectionGood = true; 	
						checkChildSection(); 
					} else {
						$scope.errorMessage = "Something is funky with this parent course. It is likely already the child course of something else: " + data;
					}
				})
				.error(function(data){
					console.log('Error: ' + data);
					$scope.errorMessage = 'Error: ' + data; 

				});		

		};

		function checkChildSection(){

			//returns section object from node, parses id from section object and adds to $scope

			var validJSON = JSON.stringify($scope.newCourseObj); 

			$http.post("/checkChildSection", validJSON,{ 
				headers:{'Content-Type':'application/json'}
				})
				.success(function(data){
					console.log(data);
					//write two error check statements here (===1 is good, ===0 || >1 bad)
					if (data.length !== 0){
						$scope.newCourseObj.courseObj.childSectionID = data[0].id; 
						$scope.childSectionGood = true; 
						console.log(data); 
						console.log($scope.newCourseObj.courseObj.childSectionID); 
						console.log("Would crosslist these two sections"); 
						crosslistCourses(); 

					} else {
						$scope.errorMessage = "Something is funky with this child course. It is likely already crosslisted somewhere else: " + data;
					}
				})
				.error(function(data){
					console.log('Error: ' + data);
					$scope.errorMessage = "Error: " + data;

				});
		}

		function crosslistCourses(){

			var validJSON = JSON.stringify($scope.newCourseObj); 

			$http.post("/crosslist", validJSON, { 
				headers:{'Content-Type':'application/json'}
				})
				.success(function(data){
					console.log(data); 
					$scope.successMessage = "Successfully crosslisted section " + data.name + "."; 
				})
				.error(function(data){
					console.log('Error: ' + data);
					$scope.errorMessage = "Error: " + data;

				});

		}


});

app.controller("DevShellsController", function($scope, $http, $rootScope){

	$scope.enrollmentsObject = {
		apiCreds: $rootScope.apiCreds, 
		enrollment: {
			course_id: ""
		}
	}; 

	$scope.successMessages = [];
	$scope.errorMessages = [];  


	$scope.createNewDevShells = function(){

		$http.post("/getCourseEnrollments", $scope.enrollmentsObject)
			.success(function(data){
				console.log(data);
				loopStudents(data); 
			})
			.error(function(data){
				console.log('Error: ' + data);

			}); 

	}

	
	//First callback function for createNewDevShells
	function loopStudents(enrollments){

		for(var i = 0; i < enrollments.length; i ++){

			if(enrollments[i].type === "StudentEnrollment"); 

			var sortableName = enrollments[i].user.sortable_name; 
			var nameSplit = sortableName.split(","); 
			console.log(nameSplit); 
			var name = "LOTI_"+ enrollments[i].user.login_id; 
			var course_code = "LOTI_" + name; 
			var user_id = enrollments[i].user.id; 

			createCourse(name, course_code, user_id); 

		}

	}

	//Second callback function for createCourse
	function createCourse(name, course_code, user_id){

		$scope.newCourseObj = {
			apiCreds: $rootScope.apiCreds,
			courseObj:{ 
			course: {
				name: name, 
				course_code: course_code 
			}
		  }
		}; 

		var validJSON = JSON.stringify($scope.newCourseObj); 

		$http.post("/newCourse", validJSON,{ 
				headers:{'Content-Type':'application/json'}
				})
				.success(function(data){
					console.log(data);
					//put success callback to enroll teacher here 
					$scope.successMessages.push("Successfully created course: " + data); 
				})
				.error(function(data){
					console.log('Error: ' + data);
					$scope.errorMessages.push(data); 

				}); 


	}	

	//Third callback function for createNewDevShells
	function enrollTeacher(){



	}	
	

});




