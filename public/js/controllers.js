var assignmentLibraryControllers = angular.module('assignmentLibraryControllers', []);

assignmentLibraryControllers.controller("SearchController", function($scope, $http, $routeParams, $location, assignmentsListService) {
    assignmentsListService.setAssignments([]);
    assignmentsListService.setDataLoaded(false);
    assignmentsListService.setDisplayTable(false);

    $scope.searchTypes = [
                            {name: "Title", value:"name"},
                            {name: "Author", value:"author"},
                            {name: "Citation", value:"citation"},
                            {name: "Description", value:"description"}
                         ]

    $scope.search_type = $scope.searchTypes[0].value;

    $http.get('api/tags', {
        cache: true
    }).success(function (tags) {
            $scope.academicDisciplines1 = [];
            $scope.academicDisciplines2 = [];
            $scope.academicDisciplines3 = [];

            $scope.dqpProficiencies1 = [];
            $scope.dqpProficiencies2 = [];

            for (i = 0; i< tags.length; i++) {
                if(tags[i]["primary_tag"] === "Academic Disciplines and Assignment Characteristics") {
                    var entries = tags[i]["secondary_tags"];

                    for (j = 0; j < entries.length; j++) {
                        if ((j % 3) == 0) {
                            $scope.academicDisciplines1.push(entries[j]);
                        } else if ((j % 3) == 1){
                            $scope.academicDisciplines2.push(entries[j]);
                        } else {
                            $scope.academicDisciplines3.push(entries[j]);
                        }
                    }
                } else if (tags[i]["primary_tag"] === "DQP Proficiencies") {
                    var entries = tags[i]["secondary_tags"];

                    for (j = 0; j < entries.length; j++) {
                        if ((j % 2) == 0) {
                            $scope.dqpProficiencies1.push(entries[j]);
                        } else {
                            $scope.dqpProficiencies2.push(entries[j]);
                        }
                    }
                } else {
                    $scope.degreeAndCourseLevels = tags[i]["secondary_tags"];
                }
            }
        })
        .error(function (data) {
            console.log("Failure " + data);
        });

    $scope.search = function() {
        $http.get('api/assignments/' + $scope.search_type + '/'+ $scope.search_key)
            .success(function(assignments){
                assignmentsListService.setDataLoaded(true);
                assignmentsListService.setDisplayTable(assignments !== undefined && assignments.length > 0);
                assignmentsListService.setAssignments(assignments);
                $location.path("/assignments/" + $scope.search_type + "/"+ $scope.search_key);
            })
            .error(function(data){
                console.log(data);
            });
    }
});

assignmentLibraryControllers.controller("TagsController", function($scope, $routeParams, $http,  assignmentsListService){
    $scope.dataLoaded = assignmentsListService.isDataLoaded();
    $scope.displayTable = assignmentsListService.canDisplayTable();
    $scope.assignments = assignmentsListService.getAssignments();
    
    if($routeParams.tagId !== undefined) {
        $http.get('api/tags/'+ $routeParams.tagId)
        .success(function(assignments){
            $scope.dataLoaded = true;
                if (assignments.length !== 0) {
                    $scope.displayTable = true;
                } else {
                    $scope.displayTable = false;
                }
                $scope.assignments = assignments;
        })
        .error(function(data){
            console.log(data);
        });
    }
});

assignmentLibraryControllers.controller("AssignmentDetailsController", function($scope, $modal, $log, $routeParams, $http, $location, $sce, assignmentsLocationService) {
    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size
        });
    };

    $http.get('api/assignments/' + $routeParams.assignmentId)
        .success(function(assignmentDetails) {
            if(assignmentDetails.rubricsData.length === 0 || assignmentDetails.rubricsData[0] === "") {
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

assignmentLibraryControllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $http, $location, assignmentsLocationService) {
    $scope.fileDownloadLink = assignmentsLocationService.getAssignmentLocation();
    $scope.ok = function () {
        window.location.assign($scope.fileDownloadLink);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
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