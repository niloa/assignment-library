
//uploadAssignmentController for uploading actions

learningModule.controller('indexController', function($scope, $rootScope, $http, $location, userIdentityService, userAuthService){
  // To check if user is logged in after page refresh
    userAuthService.checkUser();
});
