var assignmentLibraryControllers = angular.module('assignmentLibraryControllers', []);

assignmentLibraryControllers.controller("SearchController", function($scope, $http, $routeParams, $location, assignmentsListService) {
    //make search assignments tab highlighted when files are selected from search results
    /*$scope.isActive = function (viewLocation) {
        return true;
        //return viewLocation === $location.path();
    };*/

    $http.get('api/tags', {
        cache: true
    })
        .success(function (tags) {
            console.log(tags);
            $scope.academicDisciplines1 = [];
            $scope.academicDisciplines2 = [];
            for (i = 0; i< tags.length; i++) {
                if(tags[i]["primary_tag"] === "Academic Disciplines and Assignment Characteristics") {
                    var entries = tags[i]["secondary_tags"];
                    for (j = 0; j < entries.length; j++) {
                        if (j <= (entries.length/2)) {
                            $scope.academicDisciplines1.push(entries[j]);
                        } else {
                            $scope.academicDisciplines2.push(entries[j]);
                        }
                    }
                } else if (tags[i]["primary_tag"] === "DQP Proficiencies") {
                    $scope.dqpProficiencies = tags[i]["secondary_tags"];
                } else {
                    $scope.degreeAndCourseLevels = tags[i]["secondary_tags"];
                }
            }
        })
        .error(function (data) {
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
                if (assignments.length !== 0) {
                    $scope.tableDisplay = true;
                } else {
                    $scope.tableDisplay = false;
                }
                $scope.assignments = assignments;
        })
        .error(function(data){
            console.log(data);
        });
    }
});

assignmentLibraryControllers.controller("AssignmentDetailsController", function($scope, $modal, $log, $routeParams, $http, $location, $sce, assignmentsLocationService) {
$scope.open = function () {
    $location.path("/survey");
};

    $http.get('api/assignments/' + $routeParams.assignmentId)
        .success(function(assignmentDetails) {
            if(assignmentDetails.rubricsData.length === 1 && assignmentDetails.rubricsData[0] === "") {
                $scope.displayRubric = false;
            } else {
                $scope.displayRubric = true;
            }
            $scope.assignmentDetails = assignmentDetails;
            $scope.description = $sce.trustAsHtml(assignmentDetails.description);
            assignmentsLocationService.setAssignmentLocation($scope.assignmentDetails.file_location);
            assignmentsLocationService.setAssignmentPage('/assignments/' + $routeParams.assignmentId);
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
    $scope.fileDownloadLink = assignmentsLocationService.getAssignmentLocation();

    var validate = function validateEmail(email) {
        if (email === undefined || email === "" || email === null) {
            // console.log("came here")
            return true;
        }
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 

    $scope.ok = function() {
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
                    ($('#download-url')[0]).click();
                    $location.path(assignmentsLocationService.getAssignmentPage());
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
});

assignmentLibraryControllers.controller("AppCtrl", function ($q, $timeout) {
    var one = $q.defer();
    var two = $q.defer();
    var three = $q.defer();

    var all = $q.all([one.promise, two.promise, three.promise]);
    all.then(success1);


    function success(data) {
        console.log(data);
        //alert("Super done");
    }
    function success1(data) {
        console.log(data+ "Doner ");
        //alert("Super done");
    }
    one.promise.then(success);
    two.promise.then(success);
    three.promise.then(success);

    $timeout(function () {
        one.resolve("one done");
    }, Math.random() * 1000);

    $timeout(function () {
        two.resolve("two done");
    }, Math.random() * 1000);

    $timeout(function () {
        three.resolve("three done");
    }, Math.random() * 1000)
});