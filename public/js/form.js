/**
 * Created by sintret@gmail.com on 3/18/2018.
 * For bengkel io and other purpose only
 */
function trashImage(myValue, elmJsonImages, filename) {
    if (elmJsonImages) {
        var arr = JSON.parse($("#" + elmJsonImages).val());
        var index = arr.indexOf(filename);
        arr.splice(index, 1);
        $("#" + elmJsonImages).val(JSON.stringify(arr));
    }

    myValue.closest(".media").remove();
}

function submitForm(element, elmFiles, route, callback) {
    route = route || "";
    callback = callback || function () {}
    elmFiles = elmFiles || "";
    var form = document.getElementById(element);
    if (form) {
        var url = form.action;
        if (!url) {
            url = window.location.pathname;
        }
        var ajaxSetting = {
            type: 'POST',
            url: url,
            cache: false,
            beforeSend: function () {
                $("#modalpopup").show();
            },
            success: function (data) {
                toastrForm(data);
                callback(data);
                $("#modalpopup").hide();

                if (data.status == 1) {
                    if (route != "") {
                        location.href = route;
                    }
                } else {
                    var isTab = $(".arrtab").length > 0 ? true : false;
                    var message = data.message || "";
                    if (isTab && message) {
                        var split = message.split("'");
                        var elname = split[1];
                        var $closest = $("#" + elname).closest('.tab-pane');
                        var id = $closest.attr('id');
                        $('.arrtab a[href="#' + id + '"]').tab('show');
                        // Find the link that corresponds to the pane and have it show

                        $('.div' + elname).addClass('has-error');
                        $('.div' + elname).append('<div class="help-block">' + message + '</div>');

                    }
                    var errors = [];
                    if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
                        errors = data.errors;
                    }
                    if (errors && errors.length) {

                        for (var i = 0; i < errors.length; i++) {
                            var path = errors[i]['path'];
                            var message = errors[i]['message'];
                            var $closest = $("#" + path).closest('.tab-pane');
                            var id = $closest.attr('id');
                            $('.arrtab a[href="#' + id + '"]').tab('show');
                            $('.div' + path).addClass('has-error');
                            $('.div' + path).append('<div class="help-block">' + message + '</div>');
                        }
                    }
                }
            },
            error: function (x, e) {
                if (x.status == 0) {
                    toastr.error("You are offline!!\n Please Check Your Network.", "Error!");
                } else if (x.status == 404) {
                    toastr.error("Requested URL not found.", "Error " + x.status);
                } else if (x.status == 500) {
                    var res = x.responseText;
                    var path = 'documents';
                    $('.div' + path).addClass('has-error');
                    $('.div' + path).append('<div class="help-block">' + $(res).first().text() + '</div>');
                    toastr.error("" + $(res).first().text(), "Error Image");
                    setTimeout(function () {
                        location.href = '';
                    }, 2000);
                } else if (e == "parsererror") {
                    toastr.error("Error.\nParsing JSON Request failed.", "Error!");
                } else if (e == "timeout") {
                    toastr.error("Request Time out.", "Error!");
                } else {
                    toastr.error("Unknow Error.\n" + x.responseText, "Error!");
                }
            }
        }

        form.onsubmit = function (ev, data) {
            ev.preventDefault();
            $(".help-block").remove();
            $(".has-error").removeClass("");

            //for checkbox value 1 or 0
            var this_master = $(form);
            this_master.find('input[type="checkbox"]').each(function () {

                var checkbox_this = $(this);
                if (checkbox_this.is(":checked") == true) {
                    checkbox_this.attr('value', '1');
                } else {
                    checkbox_this.prop('checked', true);
                    checkbox_this.attr('value', '0');
                    setTimeout(function () {
                        checkbox_this.prop('checked', false);
                    }, 2000);
                }
            })

            if (elmFiles) {
                if (elmFiles instanceof Array) {
                    for (var i = 0; i < elmFiles.length; i++) {
                        $("#" + elmFiles[i]).remove();
                    }
                } else {
                    $("#" + elmFiles).remove();
                }
            }

            var formData = new FormData($('#' + element)[0]);
            ajaxSetting.processData = false;
            ajaxSetting.contentType = false;
            ajaxSetting.data = formData;
            $.ajax(ajaxSetting);
        }
    }
}


function jqueryForm(form, callback) {
    callback = callback || toastrForm();
    let url = form.attr("action");
    if (!url) {
        url = window.location.pathname;
    }
    let ajaxSetting = {
        method: 'POST',
        url: url,
        cache: false,
        beforeSend: function () {
            $("#modalpopup").show();
        },
        success: function (data) {
            toastrForm(data);
            callback(data);
            $("#modalpopup").hide();
        }
    }

    $(".help-block").remove();
    $(".has-error").removeClass("");

    ajaxSetting.data = form.serializeArray();
    $.ajax(ajaxSetting);
}

function goForm(element, route, cb) {
    route = route || "";
    cb = cb || function () {
        };

    var form = document.getElementById(element);
    if (form) {

        var url = form.action;

        if (!url) {
            url = window.location.pathname;
        }

        form.onsubmit = function (ev) {
            ev.preventDefault();
            $(".help-block").remove();
            $(".has-error").removeClass("");
            var url = window.location.pathname;
            $.ajax({
                type: 'POST',
                url: url,
                data: $(this).serialize(),
                success: function (data) {
                    toastrForm(data);
                    cb(data);

                    if (data.status == 1) {
                        if (route != "") {
                            location.href = route;
                        }
                    } else {

                        var errors = [];
                        if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
                            errors = data.errors;
                        }
                        if (errors && errors.length) {
                            for (i = 0; i < errors.length; i++) {
                                var path = errors[i]['path'];
                                var message = errors[i]['message'];
                                $('.div' + path).addClass('has-error');
                                $('.div' + path).append('<div class="help-block">' + message + '</div>');
                                toastr.error(message, "Error!");
                            }
                        }

                    }
                },
                error: function (x, e) {
                    if (x.status == 0) {
                        toastr.error("Server is offline!!\n Please Come back in few minutes.", "Error!");
                    } else if (x.status == 404) {
                        toastr.error("Requested URL not found.", "Error " + s.status);
                    } else if (x.status == 500) {
                        toastr.error("Internal Server Error.", "Error " + s.status);
                    } else if (e == "parsererror") {
                        toastr.error("Error.\nParsing JSON Request failed.", "Error!");
                    } else if (e == "timeout") {
                        toastr.error("Request Time out.", "Error!");
                    } else {
                        toastr.error("Unknow Error.\n" + x.responseText, "Error!");
                    }
                }
            });
        }
    }
}

var fileImage = document.getElementById("images_select"),
    fileElem = document.getElementById("images");

if (fileImage) {
    fileImage.addEventListener("click", function (e) {
        if (fileElem) {
            fileElem.click();
        }
        e.preventDefault(); // prevent navigation to "#"
    }, false);
}

function regularCallback(data) {
    if (data.status == 1) {
        toastr.success('Successfully Saved!');
    }
}
var counter = 0;

function handleFiles(thisFiles, multiple, elmFilelist, elmJsonImages) {
    multiple = multiple || false;
    elmJsonImages = elmJsonImages || "";
    var files = thisFiles.files;

    //store single/multiple files
    var newFiles = [];
    //store to div  file list
    var fileList = document.getElementById(elmFilelist);

    var photos = [];

    counter++;

    //get existing images
    if (elmJsonImages != "") {
        var photos = JSON.parse($("#" + elmJsonImages).val());
    }

    if (multiple) {
        for (var i = 0; i < files.length; i++) {
            var limit = 1 * 1000 * 1000;
            if (files[i].size > limit) {
                toastr.error("Ukuran file melebihi 1MB", "Error!");
            } else {
                newFiles.push(files[i]);
            }
        }
    } else {
        //single file
        newFiles = files[0];
    }

    if (multiple) {
        var getId = thisFiles.getAttribute("id");
        var elmnt = document.getElementById(getId);
        if (elmnt) {
            var cln = elmnt.cloneNode(true);
            cln.setAttribute("id", getId + counter);
            fileList.appendChild(cln);
        }
    }

    newFiles.forEach(function (file) {
        if (elmJsonImages != "") {
            photos.push(file.name);
        }

        var media = document.createElement("div");
        media.classList.add("media");
        fileList.appendChild(media);

        var mediaLeft = document.createElement("div");
        mediaLeft.classList.add("media-left");
        media.appendChild(mediaLeft);


        var img = document.createElement("img");
        img.src = window.URL.createObjectURL(file);
        img.width = 100;
        img.classList.add("media-object");
        img.classList.add("boxy");
        img.onload = function () {
            window.URL.revokeObjectURL(this.src);
        }
        mediaLeft.appendChild(img);

        var mediaBody = document.createElement("div");
        mediaBody.classList.add("media-body");
        media.appendChild(mediaBody);

        var row = document.createElement("div");
        row.classList.add("row");
        mediaBody.appendChild(row);

        var col8 = document.createElement("div");
        col8.classList.add("col-md-8");
        var text = '<h5>' + file.name + '</h5><p> Sizes : ' + (file.size / 1024).toFixed(1) + ' KB </p>';
        col8.innerHTML = text;
        row.appendChild(col8);

        var col4 = document.createElement("div");
        col4.classList.add("col-md-4");
        var fileElement = document.createElement("button");
        fileElement.classList.add("btn");
        fileElement.classList.add("btn-danger");
        fileElement.setAttribute("type", "button");

        var trash = document.createElement("I");
        trash.classList.add("fa");
        trash.classList.add("fa-trash");
        fileElement.appendChild(trash);
        media.setAttribute("fileData", file);
        media.setAttribute("filename", file.name);

        fileElement.addEventListener('click', function (event) {
            let fileElement = event.target;

            if (elmJsonImages != "") {
                let indexToRemove = newFiles.indexOf(media.getAttribute('fileData'));
                newFiles.splice(indexToRemove, 1);
                let jsonToRemove = photos.indexOf(media.getAttribute('filename'));
                photos.splice(jsonToRemove, 1);
                $("#" + elmJsonImages).val(JSON.stringify(photos));
            }

            media.remove();

        }, false);

        col4.appendChild(fileElement);
        row.appendChild(col4);
    });
    if (elmJsonImages != "") {
        //store the array of file in our element this is send to other page by form submit
        $("#" + elmJsonImages).val(JSON.stringify(photos));
    }
}

$(".typeahead-remove").on("click", function () {
    $(".jstypeahead").val("");
    var elm = $(this).data("element");
    $("#" + elm).val("");
    $(".kilo").removeClass("alert").removeClass("alert-block").removeClass("alert-success");
    $(".kilo").html("");
    $(".klform").removeClass("has-success").removeClass("has-feedback");
    $("#total").val("")
});

function toastrForm(data) {
    toastr.options.closeDuration = 3000;
    if (data.status == 0) {
        toastr.error(data.message, data.title);
    } else {
        toastr.success(data.message, data.title);
    }
}

function loadFile(input, elem) {
    var url = input.value;
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "bmp" || ext == "webp" || ext == "js" || ext == "css")) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#file" + elem).attr('src', e.target.result);
            $("#file" + elem).attr('height', '100px');
            $("#boxy" + elem).removeClass("boxy");
            $("#boxy" + elem).addClass('boxy');
        }
        reader.readAsDataURL(input.files[0]);
    } else {
        $("#file" + elem).attr('src', '/img/file.png');
        $("#file" + elem).attr('height', '100px');
        $("#boxy" + elem).removeClass("boxy");
        $("#boxy" + elem).addClass('boxy');
    }
}

function fileAttribute(filename) {
    "use strict";
    filename = filename.toLowerCase() || "";
    var ext = filename.split('.').pop();
    var images = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tif', 'gif', 'png'];
    var obj = {}
    obj.ext = ext;
    if (Util.in_array(ext, images)) {
        obj.type = 'image';
    } else {
        obj.type = 'fle';
    }
    return obj;

}

function viewFile(dir, file) {
    "use strict";
    var filename = dir + file;
    var html = '';
    var obj = Util.fileAttribute(filename);
    if (obj.type == 'image') {
        html = '<img src="' + filename + '" height="100px">'
    } else {
        html = '<a href="' + filename + '">' + file + '</a>'
    }

    return html;
}

function gridItems(json) {
    return json.map(function (row) {
        var obj = {};
        obj.id = row.id ? '"' + row.id + '"' : '';
        obj.name = row.name;
        return obj;
    })
}

function gridValues(value, json) {
    var html = "";
    value = value || "[]";
    value = JSON.parse(value) || [];
    if (value.length) {
        for (var i = 0; i < value.length; i++) {
            html += " " + json[value[i]] + ",";
        }
        html = html.slice(0, -1);
    }

    return html;
}

function ajaxCall(method,url,data,callback) {
    callback = callback || function () {}
    let config = {
        type: method,
        url: url,
        cache: false,
        headers: {
            'CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        beforeSend: function () {
            $("#modalpopup").show();
        }
    }
    if(data){
        config.data = data;
    }
    config.success = function (data) {
        $("#modalpopup").hide();
        callback(data);
    }

    $.ajax(config);
}

function ajaxPost(url,data,callback) {
    ajaxCall("POST",url,data,callback);
}

function ajaxDelete(url,data,callback) {
    ajaxCall("DELETE",url,data,callback);
}

function formatNumber(num) {
    num = num || "";
    let thousandSeparator = ".";
    var sep = "$1" + thousandSeparator;
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, sep)
}

function formatString(val) {
    var val = JSON.parse(val) || [];
    return val.join(", ");
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
    } else {
        navigator.clipboard.writeText(text);
    }

    toastr.info("Copied Text " + text);
}
$("body").on("click", ".can-copy", function () {
    var name = $(this).data("name");
    if(name.indexOf("{{") > -1) {
        copyToClipboard(name);
    } else {
        copyToClipboard("{{"+name+"}}");
    }
});
$(".open_advancesearch").on("click", function () {
    $(".advancesearch").toggle();
});

function chains(element,route, arr) {
    var obj = {}
    arr.forEach(function (item) {
        obj[item] = $("#"+item).val();
    });
    ajaxPost(`/${route}/chains`, {
        column: element,
        table: route,
        id: $("#"+element).val(),
        obj:obj,
    }, function (data) {
        arr.forEach(function (item) {
            $("#"+item).html(data[item]);
        });
    });

}