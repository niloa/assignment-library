var assignmentLibraryControllers = angular.module('assignmentLibraryControllers', []);

assignmentLibraryControllers.controller("SearchController", function($scope, $http) {
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

assignmentLibraryControllers.controller("TagsController", function($scope, $routeParams, $http){
    $http.get('api/tags/'+ $routeParams.tagId)
        .success(function(assignments){
            $scope.assignments = assignments;

        })
        .error(function(data){
            console.log(data);
        });
});

assignmentLibraryControllers.controller('AssignmentDetailsController', function ($scope, $routeParams, $http) {
    $http.get('api/assignments/' + $routeParams.assignmentId)
    .success(function(assignmentDetails) {
        $scope.assignmentDetails = assignmentDetails;
    })
    .error(function(error) {
        console.log(data);
    });
});
