
assignmentLibraryModule.controller('uploadAssignmentController', function($scope, userIdentityService, $location){
    // check if user is authenticated, as direct get to /upload with login will redirect to /uploadFiles
    if(userIdentityService.currentUser != undefined)
        $location.path('/uploadFiles');
    else
        $location.path('/upload');

    // Hide login form in upload page and only show on click of proceed
    $scope.showLogin = false;
    $scope.showLoginForm = function(){
        $scope.showLogin = true;
    };

   /* // if user is already logged in, on click of upload nav link, it should direct to uploadFiles path
    $scope.isUserLoggedIn = function(){
        if(userIdentityService.currentUser != undefined)
            $location.path('/uploadFiles');
        else
            $location.path('/upload');
    }*/
});
