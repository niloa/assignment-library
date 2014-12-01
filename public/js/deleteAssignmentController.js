assignmentLibraryModule.controller('deleteAssignmentController', function($scope, $http, $location){
    $scope.searchPopulated = false;
    $scope.deleteID = "";
    $scope.search = function() {
        $http.get('api/assignments/name/'+ $scope.search_key)
            .success(function(assignments){
                console.log(assignments);
                $scope.searchPopulated = true;
                $scope.assignments = assignments;
            })
            .error(function(data){
                console.log(data);
            });
    };
    $scope.selectedAssignment = function (id) {
        $scope.deleteID = id;
    };
    $scope.deleteAssignment = function() {
        $http.delete('api/assignments/' + $scope.deleteID)
            .success(function(data){
                toastr.success(data);
                $scope.searchPopulated = false;
                $scope.deleteID = "";
                $scope.search_key = "";
                $location.path("/assignments/delete");
            })
            .error(function(data){
                toastr.success(data);
            });
    }
});
