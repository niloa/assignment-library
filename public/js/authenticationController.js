assignmentLibraryModule.controller('authenticationController', function($scope, $rootScope, $http, $location, userIdentityService, userAuthService){

    $rootScope.identity = userIdentityService;

    // highlight appropriate nav bars on click
    $scope.isActive = function (viewLocation) {
       // console.log("in func");
        return viewLocation === $location.path() || $location.path() === '/upload';// || $location.path().indexOf('tag')!=-1 || $location.path().indexOf('assignments')!=-1;
        /*if($location.path() === '/upload' ){
            console.log("in up");
            return true;}
        else if($location.path().indexOf('tag')!=-1 || $location.path().indexOf('assignments')!=-1)
            return true;
        else
            return viewLocation === $location.path();*/
    };
    $scope.isUserLoggedIn = function(){
        if(userIdentityService.currentUser != undefined)
            $location.path('/uploadFiles');
        else
            $location.path('/upload');
    };

    $scope.loginUser = function () {
        userAuthService.authenticateUser($scope.username, $scope.password).then(function(success){
            if(success){
                toastr.success('Successfully logged in');
                $location.path('/uploadFiles');
            }else{
                toastr.error('Username/ Password incorrect');
            }
        });
    };

    $scope.logoutUser = function(){
        userAuthService.logoutUser().then(function(){
          $scope.username = "";
          $scope.password = "";
          toastr.success(" You have successfully logged out");
          $location.path('/');
        })
    };
});
