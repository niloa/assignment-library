

assignmentLibraryModule.factory('userIdentityService', function(){
    return{
        currentUser: undefined,
        isAuthenticated: function(){
            return !!this.currentUser;
        }
    }
});

assignmentLibraryModule.factory('userAuthService', function($http, userIdentityService, $q){
    return{
        authenticateUser: function(username, password){
            var dfd = $q.defer();
            $http.post('/login', {email:username, password:password}).then(function (response) {
                if(response.data.success){
                    userIdentityService.currentUser = response.data.user.local;
                    dfd.resolve(true);
                }else{
                    dfd.resolve(false);
                }
            });
            return dfd.promise;
        },
        logoutUser: function(){
            var dfd = $q.defer();
            $http.post('/logout',{logout:true}).then(function(response){
                userIdentityService.currentUser = undefined;
                dfd.resolve();
            });
            return dfd.promise;
        },
        checkUser: function () {
            var dfd = $q.defer();
            $http.get('/userDetails').then(function (data) {
                if(data.data.userData != undefined) {
                    //alert("success "+data.userData.local.email)
                    userIdentityService.currentUser = data.data.userData.local;
                    dfd.resolve();
                }
                //else
                //alert("undefined");
            });
            return dfd.promise;
        }
    }
});
