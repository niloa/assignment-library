assignmentLibraryModule.controller('adminController', function($scope, $http, $location){
    $scope.redirectToUploadPage = function() {
        $location.path("/uploadFiles");
    }
    $scope.redirectToDeletePage = function() {
        $location.path("/assignments/delete");
    }
});