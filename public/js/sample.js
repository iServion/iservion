$(function(){
    let inputFile = $('#myInput');
    let button = $('#myButton');
    let buttonSubmit = $('#mySubmitButton');
    let filesContainer = $('#myFiles');
    let files = [];

    inputFile.change(function() {
        let newFiles = [];
        for(let index = 0; index < inputFile[0].files.length; index++) {
            let file = inputFile[0].files[index];
            newFiles.push(file);
            files.push(file);
        }

        newFiles.forEach(file => {
            let fileElement = $("<p>${file.name}</p>");
            fileElement.data('fileData', file);
            filesContainer.append(fileElement);

            fileElement.click(function(event) {
                let fileElement = $(event.target);
                let indexToRemove = files.indexOf(fileElement.data('fileData'));
                fileElement.remove();
                files.splice(indexToRemove, 1);
            });
        });
    });

    button.click(function() {
        inputFile.click();
    });

    buttonSubmit.click(function() {
        let formData = new FormData();

        files.forEach(file => {
            formData.append('file', file);
        });

        console.log('Sending...');

        $.ajax({
            url: 'https://this_is_the_url_to_upload_to',
            data: formData,
            type: 'POST',
            success: function(data) { console.log('SUCCESS !!!'); },
            error: function(data) { console.log('ERROR !!!'); },
            cache: false,
            processData: false,
            contentType: false
        });
    });
});