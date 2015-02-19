assignmentLibraryModule.controller('submitAssignmentController', function($scope, $http, $rootScope, $location, $upload, tagDetailService, submitAssignmentService, rubricUploadService, assignmentUploadService){

    // jqxcombo box for tags
    $rootScope.tagsMailSelected = "";
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
        $rootScope.tagsMailSelected = items;
        var selectedItems = "Selected Items: ";
        $.each(items, function (index) {
            selectedItems += this.label;
            if (items.length - 1 != index) {
                selectedItems += ", ";
            }
        });
        $("#log").text(selectedItems);
    });
    // jqxcombo box for tags


    $scope.onAssignmentSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        var attachments = [];
        for (var i = 0; i < $files.length; i++) {
            attachments.push($files[i]);
        }
        $rootScope.attachments = attachments;
    };

    //function called on selection of rubric, to store rubric object in controller
    $scope.onRubricSelectA = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        var rubrics = [];
        for (var i = 0; i < $files.length; i++) {
            rubrics.push($files[i]);
        }
        $rootScope.rubricAttachs = rubrics;
    };

    $scope.submitAssignment = function(){
        // get all the form details
        var submitObject = {};
//        var filename = $scope.fileName;
//        var author = $scope.author;
        if($scope.fileName == undefined || $scope.fileName == "" || $scope.fileName == null) {
            toastr.error("Please enter file name");
            return;
        }
        else
            submitObject.filename = $scope.fileName;

        if($scope.author == undefined || $scope.author == "" || $scope.author == null) {
            toastr.error("Please enter the author name");
            return;
        }
        else
            submitObject.author = $scope.author;

        if($scope.institution == undefined || $scope.institution == "" || $scope.institution == null) {
            toastr.error("Please enter the Institution name");
            return;
        }
        else
            submitObject.institution = $scope.institution;

        if($scope.department == undefined || $scope.department == "" || $scope.department == null) {
            toastr.error("Please enter the Department name");
            return;
        }
        else
            submitObject.department = $scope.department;

        if($scope.email == undefined || $scope.email == "" || $scope.email == null) {
            toastr.error("Please enter your valid Email address");
            return;
        }
        else
            submitObject.emailAdd = $scope.email;

        var descVal = $("#description").val();
        if(descVal == undefined || descVal == "" ) {
            toastr.error("Please enter Brief description about assignment");
            return;
        }
        else
            submitObject.description = descVal;

        // get multiple tag details
        if($rootScope.tagsMailSelected == ""){
            toastr.error("Please select at least one tag to proceed");
            return;
        }
        else{
            var tagDetails = [];
            for(var p = 0; p < $rootScope.tagsMailSelected.length; p++){
                tagDetails.push($rootScope.tagsMailSelected[p].value);
            }

            submitObject.tagDetails = tagDetails;

        }

        var backgroundVal = $("#background").val();
        if(backgroundVal == undefined || backgroundVal == "" ) {
            toastr.error("Please enter Brief background about assignment");
            return;
        }
        else
            submitObject.background = backgroundVal;

        var reflectionsVal = $("#reflections").val();
        if(reflectionsVal == undefined || reflectionsVal == "" ) {
            toastr.error("Please enter reflections about assignment");
            return;
        }
        else
            submitObject.reflections = reflectionsVal;





        //alert("Submit Assignment Clicked "+filename+" author "+author);
        if(!$rootScope.attachments){
            toastr.error("Please select a file to upload");
            return;
        }
        var file = $rootScope.attachments;
        var numberOfRubrics = 0;
        var rubricAjaxData = [];
        if($rootScope.rubricAttachs != undefined) {
            numberOfRubrics = $rootScope.rubricAttachs.length;
            if (numberOfRubrics > 4) {
                toastr.error("Cannot select more than 4 rubrics, please remove some rubrics to continue");
                return;
            }
        }
        var nR = 0;
        if(numberOfRubrics > 0) { // if atleast one rubric file is present, upload it first
            rubricUploadService.uploadRubricsMail($rootScope.rubricAttachs[nR]).then(function (data) {
                nR++;
                // alert("NR is "+nR+" number of rub "+numberOfRubrics);
                //rubricAjaxData.push(data.data.files[0].deleteUrl + "~" + data.data.files[0].name);
                rubricAjaxData.push({
                    url: data.data.files[0].deleteUrl,
                    name: data.data.files[0].name
                });
                if(nR < numberOfRubrics)
                    return rubricUploadService.uploadRubricsMail($rootScope.rubricAttachs[nR]);
                else
                    return assignmentUploadService.uploadAssignmentMail($rootScope.attachments);
            }).then(function (data) {
                if(nR >= numberOfRubrics && data!=0){

                    submitObject.assignmentURL = data.data.files[0].deleteUrl;

                    submitObject.rubricAjaxData = rubricAjaxData;
                    submitAssignmentService.submitAssignment(submitObject);
                    return 0;
                }
                //console.log("This is "+(nR+1)+" time");
                nR++;
                //rubricAjaxData.push(data.data.files[0].deleteUrl + "~" + data.data.files[0].name);
                rubricAjaxData.push({
                    url: data.data.files[0].deleteUrl,
                    name: data.data.files[0].name
                });
                if(nR < numberOfRubrics)
                    return rubricUploadService.uploadRubricsMail($rootScope.rubricAttachs[nR]);
                else
                    return assignmentUploadService.uploadAssignmentMail($rootScope.attachments);
            }).then(function (data) {
                if(data == 0)
                    return 0 ;
                if(nR >= numberOfRubrics){

                    submitObject.assignmentURL = data.data.files[0].deleteUrl;
                    submitObject.rubricAjaxData = rubricAjaxData;
                    submitAssignmentService.submitAssignment(submitObject);
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
                    return rubricUploadService.uploadRubricsMail($rootScope.rubricAttachs[nR]);
                else
                    return assignmentUploadService.uploadAssignmentMail($rootScope.attachments);
            }).then(function (data) {
                if(data == 0)
                    return 0 ;
                if(nR >= numberOfRubrics){

                    submitObject.assignmentURL = data.data.files[0].deleteUrl;
                    submitObject.rubricAjaxData = rubricAjaxData;

                    submitAssignmentService.submitAssignment(submitObject);
                    return 0;
                }
                //console.log("This is "+(nR+1)+" time");
                nR++;
                //rubricAjaxData.push(data.data.files[0].deleteUrl + "~" + data.data.files[0].name);
                rubricAjaxData.push({
                    url: data.data.files[0].deleteUrl,
                    name: data.data.files[0].name
                });
                if(nR < numberOfRubrics)
                    return rubricUploadService.uploadRubricsMail($rootScope.rubricAttachs[nR]);
                else
                    return assignmentUploadService.uploadAssignmentMail($rootScope.attachments);
            }).then(function (data) {
                if(data!=0){
                    submitObject.assignmentURL = data.data.files[0].deleteUrl;
                    submitObject.rubricAjaxData = rubricAjaxData;

                    submitAssignmentService.submitAssignment(submitObject);
                    // console.log("Final submitAssignmentService is ");
                    //console.log(submitAssignmentService.getfileDetails());
                    //assignmentUploadService.saveAssignment(submitAssignmentService.getfileDetails());
                }
                //toastr.success("Successfully uploaded the Assignment");
                //assignmentUploadService.saveAssignment(submitAssignmentService.getfileDetails());
            });

        }else{ // if no rubrics are present, just upload the assignment to AWS
            $scope.upload = $upload.upload({
                url: '/uploadMail', //upload.php script, node.js route, or servlet url
                //data: {myObj: $scope.myModelObj},
                file: file
            }).progress(function(evt) {
                //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully

                submitObject.assignmentURL = data.files[0].deleteUrl;
                submitObject.rubricAjaxData = rubricAjaxData;
                submitAssignmentService.submitAssignment(submitObject);

            });
        }

    }
});