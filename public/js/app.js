var assignmentLibraryModule = angular.module('assignmentLibraryModule', [
    'ngRoute',
    'ngResource',
    'assignmentLibraryControllers'
    ]);

//configure routes using angular routeProvider
assignmentLibraryModule.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/search', {
                templateUrl: 'partials/searchAssignments.html'
            })
            .when('/upload', {
                templateUrl: 'partials/uploadAssignment.html'
            })
            .when('/dqp',{
                templateUrl: 'partials/DQP.html'
            })
            .when('/uploadFiles',{
                templateUrl: 'partials/uploadFiles.html'
            })
            .when('/login',{
                templateUrl: 'partials/login.html'
            })
            .when('/register',{
                templateUrl: 'partials/signup.html'
            })
            .when('/tags/:tagId', {
                templateUrl: 'partials/tagdetails.html'
            })
            .when('/', {
                templateUrl: 'partials/niloa.html'
            })
            .otherwise({
               redirectTo: '/'
            });
   $locationProvider.html5Mode(true);
}]);