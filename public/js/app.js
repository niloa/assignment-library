var assignmentLibrary = angular.module('assignmentLibrary', [
    'ngRoute',
    'ngResource',
    'assignmentLibraryControllers'
    ]);

//configure routes using angular routeProvider
assignmentLibrary.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
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
   //$locationProvider.html5Mode(true);
}]);

