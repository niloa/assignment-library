
assignmentLibraryModule.controller('uploadAssignmentController', function($scope, $http, $rootScope, $location, $upload,userIdentityService,tagDetailService, fileDetailService, rubricUploadService, assignmentUploadService){
    $rootScope.tagsSelected = "";
    $rootScope.file = "";
    $rootScope.rubricFiles = "";
    //Test Tag duplication
    $(".append").click(function(){
        //$("p").clone().appendTo("body");
        //alert("clicked");
        var $button = $('.tags').clone();
        $('.package').html($button);
       // $(".tags").clone().insertAfter("div.package:last");
        /*$('.package').appendTo($button);*/
        /*$('.tags').clone().appendTo(".package");*/
    });
    $(".delete").click(function(){
        //$("p").clone().appendTo("body");
        //alert("clicked");
        //var $button = $('.button').clone();
        $('.package').html('');
    });
    //Test Tag duplication
    $scope.assignmentType = [{name: "Assignment"}, {name: "Rubric"}];
    $scope.assignmentTypeSelected = $scope.assignmentType[0];
    // check if user is authenticated, as direct get to /upload with login will redirect to /uploadFiles
    if(userIdentityService.currentUser != undefined)
        $location.path('/uploadFiles');
    else
        $location.path('/upload');

    var primaryTags = [];
    var secondaryTags = [];
    //if tag data is null get all tags for tag dropdowns
    if(tagDetailService.getTagValue()==undefined){
    tagDetailService.getAllTags().then(function(data){
        if(!data){
            toastr.error("Failed to load tags");
            return;
        }
        $scope.allTags = data;
        //var t = [];
        for(var i = 0; i<data.length; i++){
            primaryTags.push(data[i].primary_tag);
           // console.log(data[i].primary_tag);
            for(var j = 0; j< data[i].secondary_tags.length; j++){
                secondaryTags.push(data[i].secondary_tags[j].secondary_tag);
                //console.log(secondaryTags[j]);
            }
        }

        $("#jqxComboBox").jqxComboBox({source: primaryTags, multiSelect: true, width: 500, height: 25});
        $("#jqxComboBoxSecondary").jqxComboBox({source: secondaryTags, multiSelect: true, width: 500, height: 25});

        tagDetailService.setTagValue(data);
        //console.log(data);
    });
    }else{
        $scope.allTags = tagDetailService.getTagValue();
        //var ts = [];
        for(var i = 0; i<$scope.allTags.length; i++){
            primaryTags.push($scope.allTags[i].primary_tag);
            //console.log("ts is "+primaryTags[i]);
            for(var j = 0; j< $scope.allTags[i].secondary_tags.length; j++){
                secondaryTags.push($scope.allTags[i].secondary_tags[j].secondary_tag);
                //console.log(secondaryTags[j]);
            }
        }
    }

    /*Test jqcombobox*/
    $("#jqxComboBox").jqxComboBox({source: primaryTags, multiSelect: true, width: 500, height: 25});
    $("#jqxComboBoxSecondary").jqxComboBox({source: secondaryTags, multiSelect: true, width: 500, height: 25});

    // trigger selection changes.
    $("#jqxComboBoxSecondary").on('change', function (event) {
        var items = $("#jqxComboBoxSecondary").jqxComboBox('getSelectedItems');
       // console.log(items);
        $rootScope.tagsSelected = items;
        var selectedItems = "Selected Items: ";
        $.each(items, function (index) {
            selectedItems += this.label;
            if (items.length - 1 != index) {
                selectedItems += ", ";
            }
        });
        $("#log").text(selectedItems);
    });
    /*Test jqcombobox*/

    //function called on selection of file, to store file object in controller
    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        $rootScope.file = $files[0];
    };

    //function called on selection of rubric, to store rubric object in controller
    $scope.onRubricSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        var rubrics = [];
        for (var i = 0; i < $files.length; i++) {
            rubrics.push($files[i]);
        }
        $rootScope.rubricFiles = rubrics;
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
        var citation = $scope.citation;
        // var fileDescription = $scope.fileDescription;
        var fileDescription = $("#editor").val();
        var createdAt = new Date().getSeconds();
        var assignmentType = $scope.assignmentTypeSelected.name;

        if(!fileName || (fileDescription.length <= 12)){
            toastr.error("Please Enter File name/ File description to proceed");
            return;
        }

        // get multiple tag details
        if($rootScope.tagsSelected == ""){
            toastr.error("Please select at least one tag to proceed");
            return;
        }
        else{
            var tagDetails = [];
            for(var p = 0; p < $rootScope.tagsSelected.length; p++){
                tagDetails.push($rootScope.tagsSelected[p].value);
            }
        }

        var file = $rootScope.file;

        var rubricAjaxData = [];
        var numberOfRubrics  = $rootScope.rubricFiles.length;
        if(numberOfRubrics >4){
            toastr.error("Cannot select more than 4 rubrics, please remove some rubrics to continue");
            return;
        }
        var nR = 0;
        //var deferred = $.Deferred();
        if(numberOfRubrics > 0) { // if atleast one rubric file is present, upload it first
            rubricUploadService.uploadRubrics($rootScope.rubricFiles[nR]).then(function (data) {
                // file is uploaded successfully
                console.log("This is "+(nR+1)+" time");
                nR++;
               // alert("NR is "+nR+" number of rub "+numberOfRubrics);
                //rubricAjaxData.push(data.data.files[0].deleteUrl + "~" + data.data.files[0].name);
                rubricAjaxData.push({
                   url: data.data.files[0].deleteUrl,
                   name: data.data.files[0].name
                });
                if(nR < numberOfRubrics)
                    return rubricUploadService.uploadRubrics($rootScope.rubricFiles[nR]);
                else
                    return assignmentUploadService.uploadAssignment($rootScope.file);
            }).then(function (data) {
                if(nR >= numberOfRubrics && data!=0){
                    fileDetailService.setfileDetails(fileName, author, createdAt, fileDescription, tagDetails, data.data.files[0].deleteUrl, assignmentType, citation, rubricAjaxData);
                    console.log("Final fileDetailService is ");
                    console.log(fileDetailService.getfileDetails());
                    assignmentUploadService.saveAssignment(fileDetailService.getfileDetails());
                    //return 0;
                   // $location.path('/search');
                  //  deferred.done(callthis);
                    return 0;
                }
                console.log("This is "+(nR+1)+" time");
                nR++;
                //rubricAjaxData.push(data.data.files[0].deleteUrl + "~" + data.data.files[0].name);
                rubricAjaxData.push({
                    url: data.data.files[0].deleteUrl,
                    name: data.data.files[0].name
                });
                if(nR < numberOfRubrics)
                    return rubricUploadService.uploadRubrics($rootScope.rubricFiles[nR]);
                else
                    return assignmentUploadService.uploadAssignment($rootScope.file);
            }).then(function (data) {
                if(data == 0)
                    return 0 ;
                if(nR >= numberOfRubrics){
                    fileDetailService.setfileDetails(fileName, author, createdAt, fileDescription, tagDetails, data.data.files[0].deleteUrl, assignmentType, citation, rubricAjaxData);
                    console.log("Final fileDetailService is ");
                    console.log(fileDetailService.getfileDetails());
                    assignmentUploadService.saveAssignment(fileDetailService.getfileDetails());
                    //return 0;
                    //$location.path('/search');
                    //alert("Done with Both Rubrics and Assignments");
                    return 0;
                }
                console.log("This is "+(nR+1)+" time");
                nR++;
                //rubricAjaxData.push(data.data.files[0].deleteUrl + "~" + data.data.files[0].name);
                rubricAjaxData.push({
                    url: data.data.files[0].deleteUrl,
                    name: data.data.files[0].name
                });
                if(nR < numberOfRubrics)
                    return rubricUploadService.uploadRubrics($rootScope.rubricFiles[nR]);
                else
                    return assignmentUploadService.uploadAssignment($rootScope.file);
            }).then(function (data) {
                if(data == 0)
                    return 0 ;
                if(nR >= numberOfRubrics){
                    fileDetailService.setfileDetails(fileName, author, createdAt, fileDescription, tagDetails, data.data.files[0].deleteUrl, assignmentType, citation, rubricAjaxData);
                    console.log("Final fileDetailService is ");
                    console.log(fileDetailService.getfileDetails());
                    assignmentUploadService.saveAssignment(fileDetailService.getfileDetails());
                    //return 0;
                   // $location.path('/search');
                    //alert("Done with Both Rubrics and Assignments");
                    return 0;
                }
                console.log("This is "+(nR+1)+" time");
                nR++;
                //rubricAjaxData.push(data.data.files[0].deleteUrl + "~" + data.data.files[0].name);
                rubricAjaxData.push({
                    url: data.data.files[0].deleteUrl,
                    name: data.data.files[0].name
                });
                if(nR < numberOfRubrics)
                    return rubricUploadService.uploadRubrics($rootScope.rubricFiles[nR]);
                else
                    return assignmentUploadService.uploadAssignment($rootScope.file);
            }).then(function (data) {
                if(data!=0){
                    fileDetailService.setfileDetails(fileName, author, createdAt, fileDescription, tagDetails, data.data.files[0].deleteUrl, assignmentType, citation, rubricAjaxData);
                    console.log("Final fileDetailService is ");
                    console.log(fileDetailService.getfileDetails());
                    assignmentUploadService.saveAssignment(fileDetailService.getfileDetails());
                }
                //toastr.success("Successfully uploaded the Assignment");
                //assignmentUploadService.saveAssignment(fileDetailService.getfileDetails());
            });

        }else{ // if no rubrics are present, just upload the assignment to AWS
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
                //fileDetailService.setfileDetails(fileName, author, createdAt, fileDescription, primaryTag, secondaryTagID, secondaryTagText, data.files[0].deleteUrl, assignmentType, citation);
                fileDetailService.setfileDetails(fileName, author, createdAt, fileDescription, tagDetails, data.files[0].deleteUrl, assignmentType, citation, "");
                //console.log(" before xhr "+fileDetailService.getfileDetails());

                assignmentUploadService.saveAssignment(fileDetailService.getfileDetails());
                /*$http.post('/saveAssignment',{
                    data:fileDetailService.getfileDetails()
                }).success(function(){
                    toastr.success("Successfully uploaded the file");
                    $location.path('/search');
                }).error(function(){
                    toastr.error("Failed to upload the file, please try again after sometime");
                });*/
            });
        }
                //working
                /*rubricUploadService.uploadRubrics($rootScope.rubricFiles[0]).then(function (data) {
                // file is uploaded successfully
                    console.log("This is first time");
                    rubricAjaxData.push(data.data.files[0].deleteUrl + "~" + data.data.files[0].name);
                    rubricUploadService.uploadRubrics($rootScope.rubricFiles[1]).then(function (data) {
                        console.log("This is second time");
                        rubricAjaxData.push(data.data.files[0].deleteUrl + "~" + data.data.files[0].name);
                        console.log("Done with 2 files ");
                        for(var k = 0;k<rubricAjaxData.length;k++){
                            console.log(rubricAjaxData[k]);
                        }
                        });
                });*/
                //working
                //for(var u = 1; u<=2; u++) {
                  /*  var rub = $rootScope.rubricFiles[1];
                    $scope.upload = $upload.upload({
                        url: '/upload', //upload.php script, node.js route, or servlet url
                        //data: {myObj: $scope.myModelObj},
                        file: rub
                    }).then(function (data) {
                        console.log("This is second time");
                        console.log(data.data);
                        console.log(data.data.files[0].deleteUrl);
                        console.log(data.data.files[0].name);
                        rubricAjaxData.push(data.data.files[0].deleteUrl + "~" + data.data.files[0].name);
                        //console.log("Final rubrix is " + rubricAjaxData);
                    });*/
                //}
               // console.log("rubricAjaxData[] = "+rubricAjaxData);
           // });
            //console.log("Finish");
        //}

        //return;
        /*  for (var i = 0; i < $rootScope.rubricFiles.length; i++) {
            var rub = $rootScope.rubricFiles[i];
            $scope.upload = $upload.upload({
                url: '/upload', //upload.php script, node.js route, or servlet url
                //data: {myObj: $scope.myModelObj},
                file: rub
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                console.log(data);
                console.log(data.files[0].deleteUrl);
                console.log(data.files[0].name);
                rubricAjaxData.push(data.files[0].deleteUrl+"~"+data.files[0].name);
                //console.log("rubricAjaxData[] = "+rubricAjaxData);
            });
        }*/


        //rubric test

        /*if(!$rootScope.file){
            toastr.error("Please select a file to upload");
            return;
        }

        //get the file details
        var fileName = $scope.fileName;
        var author = $scope.author;
        var citation = $scope.citation;
       // var fileDescription = $scope.fileDescription;
        var fileDescription = $("#editor").val();
        var createdAt = new Date().getSeconds();
        var assignmentType = $scope.assignmentTypeSelected.name;

        if(!fileName || (fileDescription.length <= 12)){
            toastr.error("Please Enter File name/ File description to proceed");
            return;
        }

        // get multiple tag details
        if($rootScope.tagsSelected == ""){
            toastr.error("Please select at least one tag to proceed");
            return;
        }
        else{
            var tagDetails = [];
            for(var p = 0; p < $rootScope.tagsSelected.length; p++){
                tagDetails.push($rootScope.tagsSelected[p].value);
            }
        }

        var file = $rootScope.file;*/
       /* $scope.upload = $upload.upload({
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
            
            *//*console.log("File name "+fileName+" File description "+fileDescription+" Primary Tag "+primaryTag+" secondary Tag "+secondaryTagText+
                " secondary tag id "+secondaryTagID+" uploaded url "+data.files[0].deleteUrl);*//*
            //fileDetailService.setfileDetails(fileName, author, createdAt, fileDescription, primaryTag, secondaryTagID, secondaryTagText, data.files[0].deleteUrl, assignmentType, citation);
            fileDetailService.setfileDetails(fileName, author, createdAt, fileDescription, tagDetails, data.files[0].deleteUrl, assignmentType, citation);
            console.log(" before xhr "+fileDetailService.getfileDetails());
            console.log("Final Rubric Data is "+rubricAjaxData);

            $http.post('/saveAssignment',{
                data:fileDetailService.getfileDetails()
            }).success(function(){
               toastr.success("Successfully uploaded the file");
                $location.path('/search');
            }).error(function(){
                toastr.error("Failed to upload the file, please try again after sometime");
            });
        });*/
    };

        $('#editor').jqxEditor({
            height: "250px",
            width: '800px'
        });


});
