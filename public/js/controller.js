
//uploadAssignmentController for uploading actions

learningModule.controller('uploadAssignmentController', function($scope, $http, $location){
    $scope.showLogin = false;

    $scope.showLoginForm = function(){
        $scope.showLogin = true;
    }

    $scope.login = function(){
        alert("name is "+$scope.username+ " password is "+$scope.password);
        $http.post('/login', {
            email: $scope.username,
            password: $scope.password
        }).success(function(data){
            $location.path('/dqp');
           alert(data);
        }).error(function(data){
            alert("e");
        });
    }
});
