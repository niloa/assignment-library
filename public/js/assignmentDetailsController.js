assignmentLibraryControllers.controller('AssignmentDetailsController', function ($scope, $routeParams, $http) {
    $http.get('api/assginments/' + $routeParams.assignmentId)
    .success(function(assignmentDetails) {
        $scope.assignmentDetails = assignmentDetails;
    })
    .error(function(error) {
        console.log(data);
    });
});