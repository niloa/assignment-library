
//uploadAssignmentController for uploading actions

assignmentLibraryModule.controller('indexController', function($scope, $rootScope, $http, $location, userIdentityService, userAuthService){
  // To check if user is logged in after page refresh
    userAuthService.checkUser();
});

assignmentLibraryModule.controller('MyCtrl', function($scope, $upload, $rootScope){
    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        var file = $files[0];
        $rootScope.file = file;
    };
    /*$scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        var file = $files[0];
        alert("file ob is "+file);
        $scope.upload = $upload.upload({
            url: '/upload', //upload.php script, node.js route, or servlet url
            //data: {myObj: $scope.myModelObj},
            file: file
        }).progress(function(evt) {
            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data, status, headers, config) {
            // file is uploaded successfully
            console.log(data);
        });
    };*/
    $scope.startUpload = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        //var file = $files[0];
        if(!$rootScope.file){
            toastr.error("Please select a file to upload");
            return;
        }
        var file = $rootScope.file;
        $scope.upload = $upload.upload({
            url: '/upload', //upload.php script, node.js route, or servlet url
            //data: {myObj: $scope.myModelObj},
            file: file
        }).progress(function(evt) {
            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data, status, headers, config) {
            // file is uploaded successfully
            console.log(data);
        });
    }
});
