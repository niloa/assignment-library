assignmentLibraryModule.controller('assignmentsController', function($scope, $route, $http, $location,
    assignmentsSearchService, assignmentUpdateService) {

    $scope.searchTypes = [{name: "Title", value:"name"},
                          {name: "Author", value:"author"},
                          {name: "Citation", value:"citation"},
                          {name: "Description", value:"description"}];

    $scope.searchType = $scope.searchTypes[0].value;

    $scope.search = function(searchType, searchKey) {
        $http.get('api/assignments/' + searchType + '/'+ searchKey)
        .success(function(assignments){
            if(assignments !== undefined && assignments.length !== 0) {
                assignmentsSearchService.setAssignments(assignments);
                $scope.assignments = assignmentsSearchService.getAssignments();
            } else {
                toastr.error("No assignments match this search.");
            }
        })
        .error(function(data){
            console.log("Unable to retrieve assignments for edit/delete.\n Reason: " + data);
        });
    }

    $scope.searchPopulated = function() {
        return assignmentsSearchService.areAssignmentsSet();
    }

    $scope.selectedAssignment = function (id) {
        for (var i in $scope.assignments) {
            if ($scope.assignments[i]._id === id) {
                assignmentUpdateService.setForUpdate($scope.assignments[i]);
            }
        }
    };

    $scope.clearAssignments = function() {
        assignmentsSearchService.resetAssignmentsSearch();
        assignmentUpdateService.clearAssignment();
        $route.reload();
    };

    $scope.deleteAssignment = function() {
        if (assignmentUpdateService.isAssignmentSet()) {
            toastr.error("Select an assignment to update/delete.");
        } else {
            var assignment = assignmentUpdateService.getForUpdate();
            $http.delete('api/assignments/' + assignment._id)
                .success(function(data){
                    toastr.success("Assignment has been deleted.");
                    assignmentsSearchService.resetAssignmentsSearch();
                    assignmentUpdateService.clearAssignment();
                    $location.path("/");
                })
                .error(function(data){
                    toastr.error("Could not delete assignment.\n" + "Reason: " + data);
                });
        }
    };

    $scope.updateAssignment = function() {
        if (assignmentUpdateService.isAssignmentSet()) {
            toastr.error("Select an assignment to update/delete.");
        } else {
            $location.path("/assignments/update/" + assignmentUpdateService.getToUpdate()._id);
        }
    }
});
