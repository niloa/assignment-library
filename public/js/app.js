var assignmentLibrary = angular.module('assignmentLibrary', ['ngRoute','ngResource']);

//config routes using angular routeProvider

assignmentLibrary.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

    $routeProvider
        .when('/search', {
            templateUrl: 'partials/searchAssignments.html'
        })
        .when('/upload', {
            templateUrl: 'partials/uploadAssignment.html'
        })
        .when('/dqp',{
            templateUrl: 'partials/DQP.html'
        })
        .when('/login',{
            templateUrl: 'partials/login.html'
        })
        .when('/register',{
            templateUrl: 'partials/signup.html'
        })
        .when('/tags/:tagId', {
            templateUrl: 'partials/tagdetails.html'
        })
        .when('/', {
            templateUrl: 'partials/niloa.html'
        })
        .otherwise({
           redirectTo: '/'
        });

   //$locationProvider.html5Mode(true);
}]);

assignmentLibrary.controller("SearchController", function($scope, $http) {
	$http.get('api/tags')
		.success(function(tags) {
			$scope.tags = tags;
			console.log("Success " + tags.toString());
		})
		.error(function(data) {
			console.log("Failure " + data);
		});

    $scope.search = function(search_key) {
        // do nothing right now.
    }
});

assignmentLibrary.controller("TagsController", function($scope, $routeparams, $http){
    $http.get('api/tags/'+ $routeparams.tagId)
        .success(function(tagDetails){
            console.log(tagDetails);
        })
        .error(function(data){
            console.log("Boo");
        });
})
