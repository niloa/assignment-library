var assignmentLibraryControllers = angular.module('assignmentLibraryControllers', []);

assignmentLibraryControllers.controller("SearchController", function($scope, $http, $routeParams, $location, assignmentsListService) {
    //make search assignments tab highlighted when files are selected from search results
    /*$scope.isActive = function (viewLocation) {
        return true;
        //return viewLocation === $location.path();
    };*/

	$http.get('api/tags',{
        cache: true
    })
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
    // $scope.tableParams = new ngTableParams({
    //     count: 0
    // }, {

    //     counts: [], // hides page sizes
    //     total: 1
    // });
    
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

    var validate = function validateEmail(email) { 
        console.log(email);
        if (email === undefined || email === "" || email === null) {
            // console.log("came here")
            return true;
        }
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 

    $scope.ok = function() {
        console.log($scope.emailAddress);
        if (($scope.category !== undefined) && ($scope.fourYear !== false || $scope.twoYear !== false 
            || $scope.research !== false || $scope.teaching !== false || $scope.vocationalOrTechnical !== false
            || $scope.none !== false || $scope.institutionOther !== false) && ($scope.collegue !== false
            || $scope.newsletter !== false || $scope.email !== false || $scope.webSearch !== false
            || $scope.conference !== false || $scope.periodical !== false || $scope.heardFromOther !== false) 
            && validate($scope.emailAddress)) {
            // 
            var form = {
                category: "",
                institution: {},
                heardFrom: {},
                emailAddress: ""
            };
            
            if ($scope.fourYear === true) 
                form.institution.four_year = true;

            if ($scope.twoYear === true) 
                form.institution.two_year = true;

            if ($scope.research === true) 
                form.institution.research = true;

            if ($scope.teaching === true) 
                form.institution.teaching = true;

            if ($scope.vocational_or_technical === true) 
                form.institution.vocational_or_technical = true;

            if ($scope.institutionOther === true) 
                form.institution.other = true;

            if ($scope.none === true) 
                form.institution.none = true;

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
                // $location.path("");
                // $location.path(assignmentsLocationService.getAssignmentLocation()); 
                window.open(assignmentsLocationService.getAssignmentLocation());
            })
            .error(function(error) {
                console.log(error);
            });
        } else {
            if (!validate($scope.emailAddress)) {
                toastr.error("Invalid email address!");
            } else {
                toastr.error("Some required fields are missing!");
            }
        }
    }

    $scope.cancel = function() {
        $location.path("/search");
    }
})