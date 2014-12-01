assignmentLibraryModule.controller('deleteAssignmentController', function($scope, $http, $location){
    $scope.searchPopulated = false;
    $scope.deleteID = "";
    $scope.search = function() {
        $http.get('api/assignments/name/'+ $scope.search_key)
            .success(function(assignments){
                if(assignments.length != 0) {
                    $scope.searchPopulated = true;
                    $scope.assignments = assignments;
                } else {
                    toastr.error("There are no assignments matching this name!")
                }
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
