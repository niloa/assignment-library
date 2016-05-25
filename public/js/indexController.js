
//uploadAssignmentController for uploading actions

assignmentLibraryModule.controller('indexController', function($scope, $rootScope, $http, $location, userIdentityService, userAuthService){
  // To check if user is logged in after page refresh
    userAuthService.checkUser();

    // highlight appropriate nav bars on click
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $(".a").click(function () {
         if ($("#btnCollapse").css('display')!='none')
            $("#btnCollapse").click();
    });

   var submenucheck = false;
// To prevent the menu from closing on clicking Assignments
    $scope.clickedAssignment = function(event) {
	  event.stopPropagation();
	  if (!submenucheck) {
	      $(".displayblock").css('display','block');
	  } else {
	      $(".displayblock").css('display','none');
	  }
	  submenucheck = !submenucheck;
    };
    
// To close the Assignments sub menu on clicking any of the options
    $scope.closeSubmenu = function() {
	  $(".displayblock").css('display','none');
    };
});


