var learningModule = angular.module('learningModule',['ngRoute','ngResource']);

//config routes using angular routeProvider

learningModule.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

    $routeProvider.when('/search', {
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
        .when('/', {
            templateUrl: 'partials/niloa.html'
        })
        .otherwise({
           redirectTo: '/'
        });

   //$locationProvider.html5Mode(true);
}]);