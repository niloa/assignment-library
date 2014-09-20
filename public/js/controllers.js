var assignmentLibraryControllers = angular.module('assignmentLibraryControllers', []);

assignmentLibraryControllers.controller("SearchController", function($scope, $http, $routeParams, $location, assignmentsListService) {
	$http.get('api/tags')
		.success(function(tags) {
			$scope.tags = tags;
			console.log("Success " + tags.toString());
		})
		.error(function(data) {
			console.log("Failure " + data);
		});

    $scope.search = function() {
        $http.get('api/assignments/name/'+ $scope.search_key)
            .success(function(assignments){
                assignmentsListService.setAssignments(assignments);
                $location.path("/assignments/name/" + $scope.search_key);
            })
            .error(function(data){
                console.log(data);
            });
    }
});

assignmentLibraryControllers.controller("TagsController", function($scope, $routeParams, $http, ngTableParams, assignmentsListService){
    $scope.assignments = assignmentsListService.getAssignments();

    // Hide the pagination, not working right now, check later
    $scope.tableParams = new ngTableParams({
        counts: [], // hides page sizes
        total: 1
    });
    if($routeParams.tagId !== undefined) {
        $http.get('api/tags/'+ $routeParams.tagId)
        .success(function(assignments){
            $scope.assignments = assignments;
        })
        .error(function(data){
            console.log(data);
        });
    }
});

assignmentLibraryControllers.controller("AssignmentDetailsController", function($scope, $modal, $log, $routeParams, $http) {
$scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'surveycontent.html',
      controller: 'SurveryController'
    });
  };

    $http.get('api/assignments/' + $routeParams.assignmentId)
        .success(function(assignmentDetails) {
            $scope.assignmentDetails = assignmentDetails;
        })
        .error(function(error) {
            console.log(data);
        });
});

var SurveryController = function ($scope, $modalInstance, $http) {
    $scope.form = {
        institution: {},
        category: "",
        heardFrom: {},
        emailAddress: ""
    };

      $scope.ok = function () {
        $http.post('api/survey/', $scope.form)
        .success(function(status) {
            $modalInstance.close(status); 
        })
        .error(function(error) {
            console.log(error);
        });
      };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
