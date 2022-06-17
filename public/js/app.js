if ($(".VIRTUAL_JAVASCRIPT").length) {
    $("body").append("<script>" + $(".VIRTUAL_JAVASCRIPT").text() + "</script>");
}
if ($(".VIRTUAL_CSS").length) {
    $("head").append("<style type='text/css'>" + $(".VIRTUAL_CSS").text() + "</style>");
}
toastr.options.toastClass = 'toastr';

function addScript(src) {
    var s = document.createElement('script');
    s.setAttribute('src', src);
    document.body.appendChild(s);
}

function addStyle(src) {
    var s = document.createElement('style');
    s.setAttribute('src', src);
    document.head.appendChild(s);
}
$("#SWITCH_COMPANY").on("change", function () {
    location.href = `/session/${$(this).val()}`;
});