
assignmentLibraryModule.controller('uploadAssignmentController', function($scope, $http, $rootScope, $location, $upload,userIdentityService,tagDetailService, fileDetailService){
    // check if user is authenticated, as direct get to /upload with login will redirect to /uploadFiles
    if(userIdentityService.currentUser != undefined)
        $location.path('/uploadFiles');
    else
        $location.path('/upload');

    // Hide login form in upload page and only show on click of proceed
    $scope.showLogin = false;
    $scope.showLoginForm = function(){
        $scope.showLogin = true;
    };

    //if tag data is null get all tags for tag dropdowns
    if(tagDetailService.getTagValue()==undefined){
    tagDetailService.getAllTags().then(function(data){
        if(!data){
            toastr.error("Failed to load tags");
            return;
        }
        $scope.allTags = data;
        tagDetailService.setTagValue(data);
        console.log(data);
    });
    }else{
        $scope.allTags = tagDetailService.getTagValue();
    }

    //function called on selection of file, to store file object in controller
    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        $rootScope.file = $files[0];
    };

    //on click of upload button, below function is called and it does the below functions
    // 1. takes the input from the form like File name, File Description, Tag details
    // 2. Uploads the file to node server and returns the upload url and file properties
    // 3. Use the returned value along with other information like tag details, file name etc and store it in file DB
    $scope.startUpload = function() {
        if(!$rootScope.file){
            toastr.error("Please select a file to upload");
            return;
        }

        //get the file details
        var fileName = $scope.fileName;
        var author = $scope.author;
        var fileDescription = $scope.fileDescription;
        var createdAt = new Date().getSeconds();

        if(!fileName || !fileDescription){
            toastr.error("Please Enter File name/ File description to proceed");
            return;
        }

        //get the primary and secondary tag details
        if(!($scope.primaryTag)){
            toastr.error("Please select primary tag");
            return;
        }else{
            var primaryTag = $scope.primaryTag.primary_tag;
        }

        if(!($scope.secondaryTag) || ($("#secondary").val() == "")){
            toastr.error("Please select secondary tag");
            return;
        }else {
            var secondaryTag = $scope.secondaryTag;
            var delim = secondaryTag.indexOf('~');
            var secondaryTagID = secondaryTag.substring(0,delim);
            var secondaryTagText = secondaryTag.substring(delim+1, secondaryTag.length);
        }

        var file = $rootScope.file;
        $scope.upload = $upload.upload({
            url: '/upload', //upload.php script, node.js route, or servlet url
            //data: {myObj: $scope.myModelObj},
            file: file
        }).progress(function(evt) {
            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data, status, headers, config) {
            // file is uploaded successfully
            console.log(data);
            console.log(data.files[0].deleteUrl);
            console.log(data.files[0].name);
            /*console.log("File name "+fileName+" File description "+fileDescription+" Primary Tag "+primaryTag+" secondary Tag "+secondaryTagText+
                " secondary tag id "+secondaryTagID+" uploaded url "+data.files[0].deleteUrl);*/
            fileDetailService.setfileDetails(fileName, author, createdAt, fileDescription, primaryTag, secondaryTagID, secondaryTagText, data.files[0].deleteUrl);
            console.log(" before xhr "+fileDetailService.getfileDetails());
            $http.post('/saveAssignment',{
                data:fileDetailService.getfileDetails()
            }).success(function(){
               toastr.success("Successfully uploaded the file");
            }).error(function(){
                toastr.error("Failed to upload the file, please try again after sometime");
            });
        });
    };
});
