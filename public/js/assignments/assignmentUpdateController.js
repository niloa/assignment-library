assignmentLibraryModule.controller('assignmentUpdateController', function($scope, $http, $location, $upload,
    assignmentUpdateService, tagDetailService, rubricUploadService, assignmentUploadService,
    fileDetailService){

    var rubricsForUpdate = {};
    $scope.assignment = assignmentUpdateService.getToUpdate();
    $scope.displayRubric = false;

    if ($scope.assignment !== undefined && $scope.assignment !== null) {
        if($scope.assignment.rubricsData.length === 0 || $scope.assignment.rubricsData[0] === "") {
            $scope.displayRubric = false;
        } else {
            $scope.displayRubric = true;
        }

        // Setup the description field of the update assignment page.
        $('#editor').jqxEditor({
            height: "250px",
            width: '800px'
        });
        $('#editor').val($scope.assignment.description);

        // Setup the tags for the update assignment page.
        var secondaryTags = [], tags, selectedItems = "Selected Items: ";
        if(tagDetailService.getTagValue() === undefined || tagDetailService.getTagValue() === null) {
            tagDetailService.getAllTags().then(function(data) {
            if(!data){
                toastr.error("Failed to load tags");
                return;
            }

            tagDetailService.setTagValue(data);
            tags = data;
            for(var i = 0; i< tags.length; i++){
                for(var j = 0; j< tags[i].secondary_tags.length; j++){
                    secondaryTags.push(tags[i].secondary_tags[j].secondary_tag);
                }
            }

            $("#jqxComboBoxSecondary").jqxComboBox({source: secondaryTags, multiSelect: true, width: 500, height: 25});
            for(i in $scope.assignment.tags) {
                $("#jqxComboBoxSecondary").jqxComboBox('selectItem', $scope.assignment.tags[i]);
            }
         });
        } else {
            tags = tagDetailService.getTagValue();
            for(var i = 0; i< tags.length; i++){
                for(var j = 0; j< tags[i].secondary_tags.length; j++){
                    secondaryTags.push(tags[i].secondary_tags[j].secondary_tag);
                }
            }
            $("#jqxComboBoxSecondary").jqxComboBox({source: secondaryTags, multiSelect: true, width: 500, height: 25});
            for(i in $scope.assignment.tags) {
                $("#jqxComboBoxSecondary").jqxComboBox('selectItem', $scope.assignment.tags[i]);
            }
        }

        $("#jqxComboBoxSecondary").on('change', function (event) {
            var items = $("#jqxComboBoxSecondary").jqxComboBox('getSelectedItems');
            var selectedItems = [];
            $.each(items, function (index) {
                selectedItems.push(this.label);
            });
            $scope.assignment.tags = selectedItems;
        });

        // Setup the rubrics for the update assignment page.
        for (var i in $scope.assignment.rubricsData) {
            rubricsForUpdate[$scope.assignment.rubricsData[i].name] = false;
        }
    }

    $scope.toggleRubricSelection = function(rubricName) {
        if (rubricsForUpdate[rubricName] === undefined || rubricsForUpdate[rubricName] === null)
            rubricsForUpdate[rubricName] = true;
        else if (rubricsForUpdate[rubricName] === true)
            rubricsForUpdate[rubricName] = false;
        else if (rubricsForUpdate[rubricName] === false)
            rubricsForUpdate[rubricName] = true;
    }

    $scope.onFileSelect = function($files) {
        $scope.file = $files[0];
    };

    $scope.rubricFiles = [];
    $scope.onRubricSelect = function($files) {
        var rubrics = [];
        for (var i = 0; i < $files.length; i++) {
            rubrics.push($files[i]);
        }
        $scope.rubricFiles = rubrics;
    };

    $scope.startUpload = function() {
        var id = $scope.assignment._id;
        var fileName = $scope.assignment.name;
        var author = $scope.assignment.author;
        var citation = $scope.assignment.citation;
        var fileDescription = $("#editor").val();
        var tagDetails = $scope.assignment.tags;
        var assignmentUrl = $scope.assignment.file_location;

        var rubricAjaxData = [];
        // Remove the rubric that has been marked for update from the list of rubrics listed in the assignment currently
        for (var i in $scope.assignment.rubricsData) {
            if (rubricsForUpdate[$scope.assignment.rubricsData[i].name] === undefined
                || rubricsForUpdate[$scope.assignment.rubricsData[i].name] === null
                || rubricsForUpdate[$scope.assignment.rubricsData[i].name] === false) {
                rubricAjaxData.push({
                    url: $scope.assignment.rubricsData[i].url,
                    name: $scope.assignment.rubricsData[i].name
                });
            }
        }

        var file, newAssignment;
        if ($scope.file !== undefined && $scope.file !== null) {
            file = $scope.file;
            newAssignment = true;
        } else {
            file = $scope.assignment.file_location;
            newAssignment = false;
        }

        if(!fileName || (fileDescription.length <= 12)){
            toastr.error("Please enter file name and file description to proceed");
            return;
        }

        if(tags === undefined || tags === null || tags.length === 0){
            toastr.error("Please select at least one tag to proceed");
            return;
        }


        var numberOfRubrics  = $scope.rubricFiles.length;
        if(numberOfRubrics > 4){
            toastr.error("Cannot select more than 4 rubrics, please remove some rubrics to continue.");
            return;
        }

        var nR = 0;

        if(numberOfRubrics > 0) {
            rubricUploadService.uploadRubrics($scope.rubricFiles[nR]).then(function(rubric) {

                nR++;
                rubricAjaxData.push({
                   url: rubric.data.files[0].deleteUrl,
                   name: rubric.data.files[0].name
                });

                if(nR < numberOfRubrics) {
                    return rubricUploadService.uploadRubrics($scope.rubricFiles[nR]);
                }
                else if (newAssignment) {
                    return assignmentUploadService.uploadAssignment($scope.file);
                }
                else if (!newAssignment) {
                    fileDetailService.setFileDetailsForUpdate(id, fileName, author, fileDescription, tagDetails,
                        assignmentUrl, citation, rubricAjaxData);
                    assignmentUploadService.updateAssignment(fileDetailService.getfileDetails());
                    return 0;
                }

            }).then(function (data) {

                if(nR >= numberOfRubrics && data != 0){
                    fileDetailService.setFileDetailsForUpdate(id, fileName, author, fileDescription, tagDetails,
                                                data.data.files[0].deleteUrl, citation, rubricAjaxData);
                    assignmentUploadService.updateAssignment(fileDetailService.getfileDetails());
                    return 0;
                }

                nR++;
                rubricAjaxData.push({
                    url: data.data.files[0].deleteUrl,
                    name: data.data.files[0].name
                });

                if(nR < numberOfRubrics)
                    return rubricUploadService.uploadRubrics($scope.rubricFiles[nR]);
                else if (newAssignment) {
                    return assignmentUploadService.uploadAssignment($scope.file);
                }
                else if (!newAssignment) {
                    fileDetailService.setFileDetailsForUpdate(id, fileName, author, fileDescription, tagDetails,
                        assignmentUrl, citation, rubricAjaxData);
                    assignmentUploadService.updateAssignment(fileDetailService.getfileDetails());
                    return 0;
                }

            }).then(function (data) {

                if(data == 0)
                    return 0;

                if(nR >= numberOfRubrics){
                    fileDetailService.setFileDetailsForUpdate(id, fileName, author, fileDescription, tagDetails,
                                                data.data.files[0].deleteUrl, citation, rubricAjaxData);
                    assignmentUploadService.updateAssignment(fileDetailService.getfileDetails());
                    return 0;
                }

                nR++;
                rubricAjaxData.push({
                    url: data.data.files[0].deleteUrl,
                    name: data.data.files[0].name
                });

                if(nR < numberOfRubrics)
                    return rubricUploadService.uploadRubrics($scope.rubricFiles[nR]);
                else if (newAssignment) {
                    return assignmentUploadService.uploadAssignment($scope.file);
                }
                else if (!newAssignment) {
                    fileDetailService.setFileDetailsForUpdate(id, fileName, author, fileDescription, tagDetails,
                        assignmentUrl, citation, rubricAjaxData);
                    assignmentUploadService.updateAssignment(fileDetailService.getfileDetails());
                    return 0;
                }

            }).then(function (data) {

                if(data == 0)
                    return 0;

                if(nR >= numberOfRubrics){
                    fileDetailService.setFileDetailsForUpdate(id, fileName, author, fileDescription, tagDetails,
                                                 data.data.files[0].deleteUrl, citation, rubricAjaxData);
                    assignmentUploadService.updateAssignment(fileDetailService.getfileDetails());
                    return 0;
                }

                nR++;
                rubricAjaxData.push({
                    url: data.data.files[0].deleteUrl,
                    name: data.data.files[0].name
                });

                if(nR < numberOfRubrics)
                    return rubricUploadService.uploadRubrics($scope.rubricFiles[nR]);
                else if (newAssignment) {
                    return assignmentUploadService.uploadAssignment($scope.file);
                }
                else if (!newAssignment) {
                    fileDetailService.setFileDetailsForUpdate(id, fileName, author, fileDescription, tagDetails,
                        assignmentUrl, citation, rubricAjaxData);
                    assignmentUploadService.updateAssignment(fileDetailService.getfileDetails());
                    return 0;
                }

            }).then(function (data) {
                if(data != 0){
                    fileDetailService.setFileDetailsForUpdate(id, fileName, author, fileDescription, tagDetails,
                                                 data.data.files[0].deleteUrl, citation, rubricAjaxData);
                    assignmentUploadService.updateAssignment(fileDetailService.getfileDetails());
                }
            });
        } else {
            if (newAssignment) {
                $scope.upload = $upload.upload({
                    url: '/upload',
                    file: file
                }).success(function(data, status, headers, config) {
                    fileDetailService.setFileDetailsForUpdate(id, fileName, author, fileDescription, tagDetails,
                                                     data.files[0].deleteUrl, citation, rubricAjaxData);
                    assignmentUploadService.updateAssignment(fileDetailService.getfileDetails());
                });
            } else {
                fileDetailService.setFileDetailsForUpdate(id, fileName, author, fileDescription, tagDetails,
                    assignmentUrl, citation, rubricAjaxData);
                assignmentUploadService.updateAssignment(fileDetailService.getfileDetails());
            }
        }


    };
});
