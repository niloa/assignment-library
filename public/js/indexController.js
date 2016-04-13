
//uploadAssignmentController for uploading actions

assignmentLibraryModule.controller('indexController', function($scope, $rootScope, $http, $location, userIdentityService, userAuthService){
  // To check if user is logged in after page refresh
    userAuthService.checkUser();

    // highlight appropriate nav bars on click
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

 var menuExpanded = false;
    $scope.isMenuExpanded = function() {
	return menuExpanded;
    };
    $scope.toggleMenu = function() {
	menuExpanded = !menuExpanded;
    };
    
});


