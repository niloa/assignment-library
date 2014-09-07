learningModule.controller('authenticationController', function($scope, $rootScope, $http, $location, userIdentityService, userAuthService){
    //$scope.showLogin = false;
    $rootScope.identity = userIdentityService;
   /* $scope.showLoginForm = function(){
        $scope.showLogin = true;
    };*/

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
                //userIdentityService.currentUser = response.data.user.local;
                $location.path('/uploadFiles');
            }else{
                toastr.error('Username/ Password incorrect');
            }
        });
    };

    $scope.logoutUser = function(){
        //alert(" logout Clicked by "+userIdentityService.currentUser.email);
        userAuthService.logoutUser().then(function(){
          $scope.username = "";
          $scope.password = "";
          toastr.success(" You have successfully logged out");
          $location.path('/');
        })
    };
});
