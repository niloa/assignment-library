assignmentLibraryModule.factory('assignmentsSearchService', function() {
    var assignments = [];

    return {
        areAssignmentsSet: function() {
            return assignments.length > 0;
        },

        getAssignments: function() {
            return assignments;
        },

        setAssignments: function(data) {
            assignments = data;
        },

        resetAssignmentsSearch: function() {
            assignments = [];
        }
    };
});

assignmentLibraryModule.factory('assignmentUpdateService', function() {
    var assignment;

    return{
        isAssignmentSet: function() {
            return assignment === undefined || assignment === null;
        },

        setForUpdate: function (data) {
            assignment = data;
        },

        getToUpdate: function () {
            return assignment;
        },

        clearAssignment: function() {
            assignment = null;
        }
    };
});

assignmentLibraryModule.factory('userIdentityService', function(){
    return{
        currentUser: undefined,
        isAuthenticated: function(){
            return !!this.currentUser;
        }
    }
});

assignmentLibraryModule.factory('userAuthService', function($http, userIdentityService, $q){
    return{
        authenticateUser: function(username, password){
            var dfd = $q.defer();
            $http.post('/login', {email:username, password:password}).then(function (response) {
                if(response.data.success){
                    userIdentityService.currentUser = response.data.user.local;
                    dfd.resolve(true);
                }else{
                    dfd.resolve(false);
                }
            });
            return dfd.promise;
        },
        logoutUser: function(){
            var dfd = $q.defer();
            $http.post('/logout',{logout:true}).then(function(response){
                userIdentityService.currentUser = undefined;
                dfd.resolve();
            });
            return dfd.promise;
        },
        checkUser: function () {
            var dfd = $q.defer();
            $http.get('/userDetails').then(function (data) {
                if(data.data.userData != undefined) {
                    //alert("success "+data.userData.local.email)
                    userIdentityService.currentUser = data.data.userData.local;
                    dfd.resolve();
                }
                //else
                //alert("undefined");
            });
            return dfd.promise;
        }
    }
});

assignmentLibraryModule.factory('assignmentsListService', function(){
    var dataLoaded = false;
    var displayTable = false;
    var assignments = [];
    return {
            setAssignments: function(assignments) {
                this.assignments = assignments;
            },
            getAssignments: function() {
                return this.assignments;
            },
            setDataLoaded: function(dataLoaded) {
                this.dataLoaded = dataLoaded;
            },
            isDataLoaded: function() {
                return this.dataLoaded;
            },
            setDisplayTable: function(displayTable) {
                this.displayTable = displayTable;
            },
            canDisplayTable: function() {
                return this.displayTable;
            }
        }
});

assignmentLibraryModule.factory('tagDetailService', function($http, $q){
    var tagValues;
    return{
        getAllTags: function () {
            var dfd = $q.defer();
            $http.get('/api/tags').then(function (response) {
                if (response.data) {
                    dfd.resolve(response.data);
                } else {
                    dfd.resolve(false);
                }
            });
            return dfd.promise;
        },
        setTagValue: function(tags){
            tagValues = tags;
        },
        getTagValue: function(tags){
            return tagValues;
        }
    };
});

assignmentLibraryModule.factory('rubricUploadService', function($http, $q, $upload){
    return {
        uploadRubrics: function (rub) {
            return($upload.upload({
                url: '/upload',
                file: rub
            }));
        },

        uploadRubricsMail: function (rub) {
            return($upload.upload({
                url: '/uploadMail',
                file: rub
            }));
        }
    };
});
assignmentLibraryModule.factory('submitAssignmentService', function($http, $rootScope, $location){
    //var tagValues;
    return{
        submitAssignment: function (data) {
            $http.post('/submitAssignment',{
                data:data
            }).success(function(){
                toastr.success("Successfully mailed the assignment");
                $rootScope.attachments = "";
                $rootScope.rubricAttachs = "";
                $location.path('/');
            }).error(function(){
                toastr.error("Failed to mail the assignment, Try again later");
            });
        }
//        submitAssignment: function (rub) {
//            //var dfd = $q.defer();
//            return($upload.upload({
//                url: '/submitAssignment', //upload.php script, node.js route, or servlet url
//                //data: {fl: filename},
//                file: rub
//            }));
//            //return dfd.promise;
//        }
    };
});

assignmentLibraryModule.factory('assignmentUploadService', function($http, $q, $upload, $location,$rootScope){
    //var tagValues;
    return{
        updateAssignment: function(data) {
            $http.post('updateAssignment', {
                data:data
            }).success(function() {
                toastr.success("Updated assignment.");
                $location.path("/");
            }).error(function() {
                toastr.error("There was an error while updating the assignment. Please try again.");
            });
        },
        uploadAssignment: function (rub) {
            return($upload.upload({
                url: '/upload',
                file: rub
            }));
        },
        uploadAssignmentMail: function (rub) {
            //var dfd = $q.defer();
            return($upload.upload({
                url: '/uploadMail', //upload.php script, node.js route, or servlet url
                //data: {myObj: $scope.myModelObj},
                file: rub
            }));
            //return dfd.promise;
        },
        saveAssignment: function(data){
            $http.post('/saveAssignment',{
                data:data
            }).success(function(){
                toastr.success("Successfully uploaded the file");
                $rootScope.file = "";
                $rootScope.rubricFiles = "";
                $location.path('/search');
            }).error(function(){
                toastr.error("Failed to upload the file, please try again after sometime");
            });
        }
    };
});

assignmentLibraryModule.factory('fileDetailService', function($http, $q){
    var fileDetails = {};
    return{
        setFileDetailsForUpdate: function(id, fileName, author, fileDescription, tagDetails, uploadURL,
                                    citation, rubricAjaxData) {
            fileDetails.id = id;
            fileDetails.fileName = fileName;
            fileDetails.author = author;
            fileDetails.fileDescription = fileDescription;
            fileDetails.primaryTag = tagDetails;
            fileDetails.uploadURL = uploadURL;
            fileDetails.citation = citation;
            fileDetails.rubricAjaxData = rubricAjaxData;
        },
        setfileDetails: function(fileName, author, createdAt, fileDescription, tagDetails, uploadURL, assignmentType, citation, rubricAjaxData){
            fileDetails.fileName = fileName;
            fileDetails.author = author;
            fileDetails.createdAt = createdAt;
            fileDetails.fileDescription = fileDescription;
            fileDetails.primaryTag = tagDetails;
            fileDetails.uploadURL = uploadURL;
            fileDetails.assignmentType = assignmentType;
            fileDetails.citation = citation;   
            fileDetails.rubricAjaxData = rubricAjaxData;
        },
        getfileDetails: function(){
            return fileDetails;
        }
    };
});

assignmentLibraryModule.factory('assignmentsLocationService', function(){
    var assignmentLocation = "";
    return {
            setAssignmentPage: function (assignmentPageURL) {
                this.assignmentPageURL = assignmentPageURL;
            },
            getAssignmentPage: function () {
                return this.assignmentPageURL;
            },
            setAssignmentLocation: function(assignmentLocation) {
                this.assignmentLocation = assignmentLocation;
                //console.log(this.assignmentLocation);
            },
            getAssignmentLocation: function() {
                return this.assignmentLocation;
            }
        }
});
