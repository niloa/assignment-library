

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
    var assignments = [];
    return {
            setAssignments: function(assignments) {
                this.assignments = assignments;
            },
            getAssignments: function() {
                return this.assignments;
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
                    //dfd.resolve(true);
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
    //var tagValues;
    return{
        uploadRubrics: function (rub) {
            //var dfd = $q.defer();
            return($upload.upload({
                url: '/upload', //upload.php script, node.js route, or servlet url
                //data: {myObj: $scope.myModelObj},
                file: rub
            }));
            //return dfd.promise;
        }
    };
});

assignmentLibraryModule.factory('assignmentUploadService', function($http, $q, $upload, $location,$rootScope){
    //var tagValues;
    return{
        uploadAssignment: function (rub) {
            //var dfd = $q.defer();
            return($upload.upload({
                url: '/upload', //upload.php script, node.js route, or servlet url
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
                console.log(this.assignmentLocation);
            },
            getAssignmentLocation: function() {
                return this.assignmentLocation;
            }
        }
});
