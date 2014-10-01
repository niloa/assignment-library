
assignmentLibraryModule.controller('uploadAssignmentController', function($scope, $http, $rootScope, $location, $upload,userIdentityService,tagDetailService, fileDetailService){
    $rootScope.tagsSelected = "";
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

    // Hide login form in upload page and only show on click of proceed
    /*$scope.showLogin = false;
    $scope.showLoginForm = function(){
        $scope.showLogin = true;
    };*/
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
       /* for(var k = 0;k<secondaryTags.length;k++){
            console.log(secondaryTags[k]);
        }*/
        $("#jqxComboBox").jqxComboBox({source: primaryTags, multiSelect: true, width: 500, height: 25});
        $("#jqxComboBoxSecondary").jqxComboBox({source: secondaryTags, multiSelect: true, width: 500, height: 25});
        /*for(var i = 0; i<t.length; i++){
            console.log("t is "+t[i]);
        }*/
/*
        *//*Test jqcombobox*//*
        $("#jqxComboBox").jqxComboBox({source: t, multiSelect: true, width: 800, height: 25});
        $("#jqxComboBox").jqxComboBox('selectItem', 'United States');
        $("#jqxComboBox").jqxComboBox('selectItem', 'Germany');
        *//*$("#arrow").jqxButton({  });
        $("#arrow").click(function () {
            $("#jqxComboBox").jqxComboBox({ showArrow: false });
        });*//*
        // trigger selection changes.
        $("#jqxComboBox").on('change', function (event) {
            var items = $("#jqxComboBox").jqxComboBox('getSelectedItems');
            var selectedItems = "Selected Items: ";
            $.each(items, function (index) {
                selectedItems += this.label;
                if (items.length - 1 != index) {
                    selectedItems += ", ";
                }
            });
            $("#log").text(selectedItems);
        });
        *//*Test jqcombobox*/


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

        /*//get the primary and secondary tag details
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
        }*/

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
            fileDetailService.setfileDetails(fileName, author, createdAt, fileDescription, tagDetails, data.files[0].deleteUrl, assignmentType, citation);
            console.log(" before xhr "+fileDetailService.getfileDetails());
            $http.post('/saveAssignment',{
                data:fileDetailService.getfileDetails()
            }).success(function(){
               toastr.success("Successfully uploaded the file");
                $location.path('/search');
            }).error(function(){
                toastr.error("Failed to upload the file, please try again after sometime");
            });
        });
    };

        $('#editor').jqxEditor({
            height: "250px",
            width: '800px'
        });

});
