var assignmentLibraryModule = angular.module('assignmentLibraryModule', [
    'ngRoute',
    'ngResource',
    'angularFileUpload',
    'ui.bootstrap',
    'assignmentLibraryControllers',
    'angularUtils.directives.dirDisqus'
    ]);

//configure routes using angular routeProvider
assignmentLibraryModule.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/search', {
                templateUrl: 'partials/searchAssignments.html'
            })
            .when('/resources', {
                templateUrl: 'partials/resources.html'
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
            .when('/assignments/name/:name', {
                templateUrl: 'partials/tagdetails.html'
            })
            .when('/assignments/delete', {
                templateUrl: 'partials/assignment/delete.html'
            })
            .when('/assignments/:assignmentId', {
                templateUrl: 'partials/assignmentdetails.html'
            })
            .when('/admin', {
                templateUrl: 'partials/admin.html'
            })
            .when('/testFUP', {
                templateUrl: 'partials/testFUP.html'
            })
            .when('/submitAssignment', {
                templateUrl: 'partials/submitAssignment.html'
            })
            .when('/', {
                templateUrl: 'partials/niloa.html'
            })
            .otherwise({
               redirectTo: '/'
            });
   $locationProvider.html5Mode(true);
}]);
