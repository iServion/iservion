$(document).ready(function () {
    "use strict";

    $(document).on("click", function () {
        $(".has-dropdown").removeClass("active");
        $(".search-page .list-data .dropdown").hide();
        $(".header .right .notifications-message .icons li").removeClass("active");
        $(".header .right .user .dropdown").hide();
    });

    // Left menu;
    $(".left-sidebar .menu .main-menu > li").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(this).siblings(".has-submenu").find(".submenu").slideUp();
        $(this).find(".submenu").slideDown();
    });

    $(".header .mobile-toggler a, .left-sidebar .mobile-title .top .left-slide").on("click", function (e) {
        e.preventDefault();
        $(".left-sidebar").toggleClass("show-inside");
        $(".main").toggleClass("margin-left");
    });

    $(".left-sidebar .menu ul ul li").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
    });

    $(".left-sidebar .menu ul li.has-submenu").append('<span class="arrow"><i class="fas fa-chevron-down"></i></span>');

    // Header;
    $(".header .left .server li").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
    });
    $(".header .left .filter li").on("click", function () {
        $(this).toggleClass("active");
    });

    // Filter server form;
    $(".header .left .filter li").on("click", function (e) {
        $(".header .left ul.filter .filter-form").toggle();
        e.stopPropagation();
    });

    $(".search-page .list-data .dot").on("click", function (e) {
        $(".search-page .list-data .dropdown").hide();
        $(this).siblings(".dropdown").show();
        e.stopPropagation();
    });

    $(".header .right .notifications-message .icons li").on("click", function (e) {
        $(this).addClass("active").siblings().removeClass("active");
        $(".header .right .user .dropdown").hide();
        e.stopPropagation();
    });

    // ============ Custom Form JS ============

    $(".has-dropdown").append('<i class="fas fa-chevron-down"></i>');

    $(".custom-dropdown").on("click", function (e) {
        $(this).parents(".input-item").addClass("active");
        $(this).parents(".input-item").siblings().removeClass("active");
        e.stopPropagation();

        var ul = this.querySelector('ul');
        let rect = ul.getBoundingClientRect();
        
        if(rect.left < 0) {
            console.log('ok');
            ul.style.cssText = `
                transform: translateX(${Math.abs(rect.left) + 20}px);
            `;
        }
    });


    $(".custom-dropdown ul li a").on("click", function (e) {
        e.preventDefault();
        let val = $(this).text();
        if ($(this).hasClass("text-uppercase")) {
            val = val.toUpperCase();
        }
        let input = $(this).parents(".custom-dropdown").find("input");
        $(this).parents(".input-item").removeClass("active");
        input.val(val);
        e.stopPropagation();
    });

    $(".input-item.status .switch span").on("click", function () {
        let data = $(this).attr("data-checked");

        $(this).addClass("active").siblings().removeClass("active");
        console.log($(this).siblings("input").val());

        if (data == "Yes") {
            $(this).siblings("input").attr("checked", "checked");
        } else {
            $(this).siblings("input").removeAttr("checked");
        }
    });

    $('input[type="file"]').on("change", function () {
        let name = $(this)[0].files[0].name;
        $(this).siblings("label").find(".output").text(name.toUpperCase());
    });

    $('input, textarea').on("focus", function() {
        $(this).parents('.input-item').addClass('active');
    })

    $('input, textarea').on("blur", function() {
        $(this).parents('.input-item').removeClass('active');
    })

    // Add menu;
    $(".menu-generate .make-menu .menu-list .menu-items > li").on("click", function () {
        $(this).toggleClass("active").siblings().removeClass("active");
        $(this).append(menuItemHandler());
    });

    function menuItemHandler() {
        return `<div class="overlay">
        <ul>
            <li>
                <a href="#">
                    <i class="fas fa-plus"></i>
                    <span>Add</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <i class="fas fa-chevron-up"></i>
                    <span>Up</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <i class="fas fa-chevron-down"></i>
                    <span>Down</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <i class="fas fa-link"></i>
                    <span>Link</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <i class="fas fa-pen-fancy"></i>
                    <span>Edit</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <i class="fas fa-trash-alt"></i>
                    <span>Delete</span>
                </a>
            </li>
        </ul>
        </div>`;
    }

    // Profile page;
    function previewFile(input, output) {
        var file = input.get(0).files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function () {
                output.attr("src", reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    $("#profile-banner").on("change", function () {
        previewFile($(this), $(".profile-page .profile-banner .top > img"));
    });

    $("#profile-img-1").on("change", function () {
        previewFile($(this), $(".profile-page .profile-banner .profile-view img"));
    });

    $("#upload-sig").on("change", function () {
        previewFile($(this), $(".profile-page .profile-form .image-upload-sec label img"));
    });

    $("#fulname").on("keyup", function () {
        console.log($(this).val());
        $(".profile-page .profile-banner .bottom .email span").text($(this).val());
    });

    $(".header .right .notifications-message .icons li .dropdown .dropdown-filter .filter-output").on("click", function () {
        $(this).siblings("ul").toggle();
    });

    $(".header .right .notifications-message .icons li .dropdown .dropdown-filter ul li a").on("click", function () {
        let val = $(this).text();
        $(this).parents(".dropdown-filter").find(".filter-output span").text(val);
        $(this).parents(".filter-time").hide();
    });

    $(".header .right .user").on("click", function (e) {
        $(".header .right .user .dropdown").toggle();
        $(".header .right .notifications-message .icons li").removeClass("active");
        e.stopPropagation();
    });

    $(".header .right .user .dropdown .has-submenu").on("click", function (e) {
        $(this).children(".submenu").slideToggle();
        e.stopPropagation();
    });

    $(".left-sidebar .mobile-title .top .dropdown ul li").on("click", function (e) {
        e.preventDefault();
        $(this).find(".submenu").slideToggle();
    });

    $(".left-sidebar .mobile-title .top .toggler-link").on("click", function () {
        $(".left-sidebar .mobile-title .top .dropdown").slideToggle();
    });

    // Copy;
    function copyText() {
        /* Get the text field */
        var copyText = document.getElementById("copy-text");
      
        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */
      
        /* Copy the text inside the text field */
        navigator.clipboard.writeText(copyText.value);
        
    }

    $('#copyBtn').on('click', function() {
        copyText();
        $(this).text('Copied')
    })
});
