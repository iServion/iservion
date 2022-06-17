
// Create;
$('body').append(`<a id="create-page-link" class="d-nonee" href="${createPageUrl}"></a>`);


let table = $('.dataTable').DataTable({
    dom: 'Blrftip',
    "language": {
        "paginate": {
        "previous": '<i class="fas fa-chevron-left"></i>',
        "next": '<i class="fas fa-chevron-right"></i>',
    }
    },
    buttons: [
        {
            text: '<i class="fas fa-plus"></i><span>Create</span>',
            className: 'create',
            action: function () {
                let href = $('#create-page-link')[0].click();
            }
        },
        {
            extend: 'copy',
            className: 'copy',
            text: '<i class="fas fa-copy"></i><span>Copy</span>',
        },
        {
            extend: 'excel',
            className: 'excel',
            text: '<i class="fas fa-file-excel"></i> <span>Excel</span>',
        },
        {
            extend: 'pdf',
            className: 'pdf',
            text: '<i class="fas fa-file-pdf"></i><span>PDF</span>',
        },
        {
            text: '<i class="fas fa-sync"></i><span>Refresh</span>',
            className: 'refresh',
            action: function () {
                // Refresh JSON Response;
            }
        },
        {
            extend: 'collection',
            text: '<i class="fas fa-cloud-download-alt"></i><span>Download</span>',
            className: 'has-submenu',
            buttons: [
                "excel", "pdf"
            ]
        }
    ]
});

// Page title;
$('h1.page-title').prependTo('.dt-buttons');
