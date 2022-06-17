$(document).ready(function () {
    $('.dropdown-submenu a.test').on("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).parent().siblings().removeClass('open');
        $(this).parent().toggleClass('open');
    });
    $("#restart-server-cms").on("click", function () {
        fetch("/restart");
    })
});