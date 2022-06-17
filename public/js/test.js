
$(function () {
    $(".isfile").each(function (index, value) {
        var filename = $(this).attr("data-filename") || "";
        var id = $(this).attr("data-id");
        if (filename.length > 3) {
            var ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
            if (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "bmp" || ext == "webp") {
                $("#file"+id).attr("src","/uploads/car/"+filename).attr("height","100px");
            } else {
                $("#file"+id).attr("src","/img/file.png").attr("height","100px");
            }
            $("#file"+id).on("click", function () {
                location.href = "/uploads/car/"+filename;
            });
        }
        if($(this).data("required") == true) {
            var imageElement = "#file"+id;
            if(!$(imageElement).attr("src")) {
                $("#"+id).attr("required",true);
            }
        }
    });
});$("#brand_id").on("change", function () {
    ajaxPost("/car/chains",{id:$(this).val(),key:'brand_id', data: {"trademark_id":{"select":"id,CONCAT(name) as name ","table":"trademark","where":"brand_id"}}}, function (data) {
        for(var keys in data){
            $("#"+keys).html(data[keys]);
        }
    });
});
$("#trademark_id").on("change", function () {
    ajaxPost("/car/chains",{id:$(this).val(),key:'trademark_id', data: {}}, function (data) {
        for(var keys in data){
            $("#"+keys).html(data[keys]);
        }
    });
});
$("#dropdownaddjson_brand").on("click", function () {
    var val = $("#json_brand").val();
    if(val == ""){
        alert("Please select data");
        return false;
    }
    var count = $(".spanjson_brand").length;
    var data = "<span class='spanjson_brand' > "+(count+1)+". <input type='hidden' name='car[json_brand][]' value='"+val+"' /> " + $("#json_brand option:selected").text()+"   <i class='fa fa-trash pointer text-danger pull-right' onclick='$(this).closest(`span`).remove();'  title='Delete'></i><br></span>";
    $("#dropdownboxjson_brand").append(data);
    $("#json_brand").val("");
});
var appendbrand_list = function (increment) {return `<tr data-id="${increment}"  data-name="car[brand_list]"><td><input autocomplete="nope" autofocus=""   tabindex=""   type="text"  class="form-control mb-3 car_brand_list_name"    id="name"   name="car[brand_list][${increment}][name]"   placeholder=""     value="" data-t=""   data-name=name  data-id=car_brand_list_name ></td>`}
var appendbrand_listMax = $('tbody#body-brand_list>tr').length;

function brand_listHandler(){
    var index = $("#body-brand_list>tr").length || 0;
    $("#body-brand_list>tr").each(function (index, tr) {
        let dataname = $(tr).data("name") || "";
        $(tr).attr("data-id", index);
        if(dataname != "") {
            var inputs = $(tr).find("input");
            inputs.each(function (i,input) {
                if($(input).data("name")){
                    $(input).removeAttr("name");
                    $(input).attr("name",dataname+"["+index+"]["+$(input).data("name")+"]");
                }
            });

            var selects = $(tr).find("selects");
            selects.each(function (i,input) {
                if($(input).data("name")){
                    $(input).removeAttr("name");
                    $(input).attr("name",dataname+"["+index+"]["+$(input).data("name")+"]");
                }
            });

            var textareas = $(tr).find("textareas");
            textareas.each(function (i,input) {
                if($(input).data("name")){
                    $(input).removeAttr("name");
                    $(input).attr("name",dataname+"["+index+"]["+$(input).data("name")+"]");
                }
            });
        }

    });
};
    $(function () {
        $('#addbrand_list').on('click',function(){
            $('#body-brand_list').append(appendbrand_list(appendbrand_listMax));
            appendbrand_listMax++;
            brand_listHandler();
        });
        var brand_list = $("#body-brand_list").data("value") ? $("#body-brand_list").data("value") : [];
        brand_list.forEach(function (myobj, index) {
            $("#body-brand_list").append(appendbrand_list(index));
            brand_listHandler();
            for(var key in myobj){
                if($(".car_brand_list_" + key).eq(index).attr("type") == "checkbox" && myobj[key] == 1)
                    $(".car_brand_list_" + key).eq(index).prop("checked", true);
                $(".car_brand_list_" + key).eq(index).val(myobj[key] ? myobj[key] : '');
            }
            appendbrand_listMax = index + 1;
        });
    });
