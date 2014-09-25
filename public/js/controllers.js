var assignmentLibraryControllers = angular.module('assignmentLibraryControllers', []);

assignmentLibraryControllers.controller("SearchController", function($scope, $http, $routeParams, $location, assignmentsListService) {
    //make search assignments tab highlighted when files are selected from search results
    /*$scope.isActive = function (viewLocation) {
        return true;
        //return viewLocation === $location.path();
    };*/

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

assignmentLibraryControllers.controller("AssignmentDetailsController", function($scope, $modal, $log, $routeParams, $http, $location, assignmentsLocationService) {
$scope.open = function () {
    $location.path("/survey");
};

    $http.get('api/assignments/' + $routeParams.assignmentId)
        .success(function(assignmentDetails) {
            $scope.assignmentDetails = assignmentDetails;
            assignmentsLocationService.setAssignmentLocation($scope.assignmentDetails.file_location);
        })
        .error(function(error) {
            console.log(data);
        });
});

assignmentLibraryControllers.controller("SurveyController", function($scope, $http, $location, assignmentsLocationService) {
    $scope.fourYear = false;
    $scope.twoYear = false;
    $scope.research = false;
    $scope.teaching = false;
    $scope.vocationalOrTechnical = false; 
    $scope.none = false;
    $scope.insititutionOther = false;
    $scope.collegue = false;
    $scope.newsletter = false;
    $scope.email = false;
    $scope.webSearch = false;
    $scope.conference = false;
    $scope.periodical = false;
    $scope.heardFromOther = false;

    $scope.ok = function() {
        if (($scope.category !== undefined) && ($scope.fourYear !== false || $scope.twoYear !== false 
            || $scope.research !== false || $scope.teaching !== false || $scope.vocationalOrTechnical !== false
            || $scope.none !== false || $scope.insititutionOther !== false) && ($scope.collegue !== false
            || $scope.newsletter !== false || $scope.email !== false || $scope.webSearch !== false
            || $scope.conference !== false || $scope.periodical !== false || $scope.heardFromOther !== false)) {
            var form = {
                category: "",
                insititution: {},
                heardFrom: {},
                emailAddress: ""
            };
            
            if ($scope.fourYear === true) 
                form.insititution.four_year = true;

            if ($scope.twoYear === true) 
                form.insititution.two_year = true;

            if ($scope.research === true) 
                form.insititution.research = true;

            if ($scope.teaching === true) 
                form.insititution.teaching = true;

            if ($scope.vocational_or_technical === true) 
                form.insititution.vocational_or_technical = true;

            if ($scope.insititutionOther === true) 
                form.insititution.other = true;

            if ($scope.none === true) 
                form.insititution.none = true;

            form.category = $scope.category;

            if ($scope.collegue === true) 
                form.heardFrom.collegue = true;

            if ($scope.newsletter === true) 
                form.heardFrom.newsletter = true;

            if ($scope.email === true) 
                form.heardFrom.email = true;

            if ($scope.webSearch === true) 
                form.heardFrom.web_search = true;

            if ($scope.conference === true) 
                form.heardFrom.conference = true;

            if ($scope.periodical === true) 
                form.heardFrom.periodical = true;

            if ($scope.heardFromOther === true) 
                form.heardFrom.other = true;

            if ($scope.emailAddress !== undefined)
                form.emailAddress = $scope.emailAddress;

            $http.post('api/survey/', form)
            .success(function(status) {
                // var a = document.createElement("a");
                // a.id = "download-link"
                // a.href = assignmentsLocationService.getAssignmentLocation();
                // a.download = assignmentsLocationService.getAssignmentLocation();
                // document.body.appendChild(a);
                // var alink = document.getElementById('download-link');
                // alink.onclick();
                // var index = assignmentsLocationService.getAssignmentLocation().indexOf("/uploaded");
                // $location.path(assignmentsLocationService.getAssignmentLocation().substring(index)); 
                window.open(assignmentsLocationService.getAssignmentLocation());
            })
            .error(function(error) {
                console.log(error);
            });
        } else {
            toastr.error("Some required fields are missing!")
        }
    }

    $scope.cancel = function() {
        $location.path("/search");
    }
})