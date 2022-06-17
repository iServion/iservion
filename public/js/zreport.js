/**
 * Created by sintret dev on 1/28/2022.
 * var tables
 * var obj[tables[0]]
 */

/*$("body").on("click", "#addfilters", function () {
    setTimeout(function () {

        var length = $(".td_value_zreport_filter").length || 1;
        let increment = length - 1;

        //$(".td_value_zreport_filter").eq(length -1).html(`<input type="hidden"  class="zreport_filters_value"  data-id="zreport_filters_value"  name="zreport[filters][${increment}][value]" >`);
    }, 1000);
})*/

function changeTypes(THIS) {
    let val = THIS.val();
    let td = THIS.closest("tr").find(".td_value_zreport_filter");
    let increment = THIS.closest("tr").attr("data-id");
    if(val == 1){
        var html = `<textarea tabindex="" class="form-control mb-3 zreport_filters_value"  placeholder="Value" style="display:none" data-name="value" data-id="zreport_filters_value" rows="4" name="zreport[filters][${increment}][value]"></textarea>`;
        html += `<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Date From" aria-label="DateFrom">
  <span class="input-group-text">Until</span>
  <input type="text" class="form-control" placeholder="Due Date" aria-label="DueDate">
</div>`;
        td.html(html);
    } else if(val == 2) {
        let formselect = `<div class="form-group">
                                        <div class="input-group">
                                            <div class="row">
                                                <div class="col-md-5"><input type="text"  class="form-control setting-value" placeholder="value"></div>
                                                <div class="col-md-5"><input type="text" class="form-control setting-label" placeholder="label"></div>
                                                <div class="col-md-2"><span  class="input-group-addon dropdownadd" data-id="valueid" style="cursor: pointer;" title="Add Data "><i class="fa fa-plus"></i> </span></div>
                                            </div>
                                        </div>
                                        <div class="boxy"><select class="selectval form-control form-select" ></select></div>
                                    </div>
                                    <textarea tabindex="" class="form-control mb-3 zreport_filters_value" placeholder="Value" style="display:none" data-name="value" data-id="zreport_filters_value" rows="4" name="zreport[filters][${increment}][value]"></textarea>`;
        td.html(formselect);
    } else {
        let tableOptions = tables.reduce((result,item) => {return `${result}  <option value="${item}">${item}</option>` },"");
        let selectTable = `<select class="form-control form-select selecttable" >${tableOptions}</select>`;
        let optionsHtml = "";
        for(var key in obj[tables[0]]) {
            optionsHtml += `<option value="${tables[0]}.${key}">${obj[tables[0]][key]}</option>`
        }
        selectTable += `<div class="row"><div class="col-md-6"><label>Value</label><select class="form-control form-select selectvalue" >${optionsHtml}</select> </div><div class="col-md-6"><label>Label</label><select class="form-control form-select selectlabel" >${optionsHtml}</select> </div></div>`;
        selectTable += `<textarea tabindex="" class="form-control mb-3 zreport_filters_value"  placeholder="Value" style="display:none" data-name="value" data-id="zreport_filters_value" rows="4" name="zreport[filters][${increment}][value]"></textarea>`;

        td.html(selectTable);
    }
}

$("body").on("change",".zreport_filters_type", function () {
    return changeTypes($(this));
});

$("body").on("click",".dropdownadd", function () {
    let $mythis = $(this);
    let myval = $mythis.closest("div.row").find(".setting-value").val();
    let mylabel =  $mythis.closest("div.row").find(".setting-label").val();
    if(!mylabel){
        toastr.error("Labels empty","error");
        return false;
    }
    if(!myval){
        toastr.error("Value empty","error");
        return false;
    }
    let myselect = $mythis.closest(".form-group").find(".selectval");
    myselect.append(`<option value="${myval}">${mylabel}</option>`);
    var values = [];
    $mythis.closest(".form-group").find(".selectval > option").each(function () {
        values.push({key:$(this).val(), label : $(this).text()})
    });
    $(this).closest("tr").find(".zreport_filters_value").val(JSON.stringify(values));
    $(this).closest("div.row").find(".setting-value").val("");
    $(this).closest("div.row").find(".setting-label").val("");
});

$("body").on("change",".selecttable", function () {
    let myval = $(this).val();
    let objval = obj[myval];
    let options = "";
    for(var key in objval){
        options += `<option value="${myval}.${key}">${objval[key]}</option>`;
    }
    $(this).closest("td").find(".selectvalue").html(options);
    $(this).closest("td").find(".selectlabel").html(options);
    let values = myval+".id.id";
    $(this).closest("tr").find(".zreport_filters_value").val(values);
});

function selectTable(THIS) {
    let values = THIS.closest("div.row").find(".selectlabel").find(":selected").val() || "";
    let explode = values.split(".");
    let tables = THIS.closest("div.row").find(".selectvalue").find(":selected").val() || "";
    let explode2 = tables.split(".");
    THIS.closest("td.td_value_zreport_filter").find(".zreport_filters_value").val(tables +"." + explode[1]);
}

$("body").on("change",".selectvalue", function () {
    selectTable($(this))
});

$("body").on("change",".selectlabel", function () {
    selectTable($(this));
});

$("body").on("click",".btn-setup", function () {
    var id = $(this).data("id");
    window.open(`/zreport/setup/${id}`,"_blank");
});

$(function () {
    setTimeout(function () {
        checking();
    }, 1000);
})

$("#parent_id").on("change", function () {
    if($(this).val()) {
        $(".divfilters").hide();
    } else {
        $(".divfilters").show();
    }
});

function checking() {
    parentShow();
    var url = window.location.href;
    var id = 0;
    if(url.includes("update")) {
        var id= url.split("/").pop();
        var databody = $("tbody").data("value");
        if(databody.length) {
            databody.forEach(function (item, increment) {
                var html = '';
                var value = item.value || "";
                if(item.type == 3) {
                    var table = "";
                    var explode = [];
                    if(value) {
                        explode = value.split(".");
                        table = explode[0];
                        var tableOptions = tables.reduce((result,tableItem) => {
                            var selected = tableItem == table ? " selected " : "";
                            return `${result}  <option value="${tableItem}" ${selected}>${tableItem}</option>`;
                        },"");
                        var selectTable = `<select class="form-control form-select selecttable" >${tableOptions}</select>`;
                        var optionsHtml = "";
                        var optionsHtml2 = "";
                        for(var key in obj[table]) {
                            var selected = key == explode[1] ? " selected " : "";
                            optionsHtml += `<option value="${table}.${key}"  ${selected}>${obj[table][key]}</option>`;
                            var selected2 = key == explode[2] ? " selected " : "";
                            optionsHtml2 += `<option value="${table}.${key}"  ${selected2}>${obj[table][key]}</option>`
                        }
                        selectTable += `<div class="row"><div class="col-md-6"><label>Value</label><select class="form-control form-select selectvalue" >${optionsHtml}</select> </div><div class="col-md-6"><label>Label</label><select class="form-control form-select selectlabel" >${optionsHtml2}</select> </div></div>`;
                        html = selectTable;
                    }

                } else if(item.type == 2) {
                    if(value) {
                        var values = JSON.parse(value);
                        var options = ``;
                        values.forEach(function (val) {
                            options += `<option value="${val.key}">${val.label}</option>`;
                        })

                        html = `<div class="form-group">
                                        <div class="input-group">
                                            <div class="row">
                                                <div class="col-md-5"><input type="text"  class="form-control setting-value" placeholder="value"></div>
                                                <div class="col-md-5"><input type="text" class="form-control setting-label" placeholder="label"></div>
                                                <div class="col-md-2"><span  class="input-group-addon dropdownadd" data-id="valueid" style="cursor: pointer;" title="Add Data "><i class="fa fa-plus"></i> </span></div>
                                            </div>
                                        </div>
                                        <div class="boxy"><select class="selectval form-control form-select" >${options}</select></div>
                                    </div>`;


                    }
                }

                html += `<textarea tabindex="" class="form-control mb-3 zreport_filters_value"  placeholder="Value" style="display:none" data-name="value" data-id="zreport_filters_value" rows="4" name="zreport[filters][${increment}][value]">${value}</textarea>`;
                if(item.type == 1) {
                    html += `<div class="input-group mb-3">
  <input type="text" class="form-control" disabled placeholder="Date From" aria-label="DateFrom">
  <span class="input-group-text">Until</span>
  <input type="text" class="form-control" disabled placeholder="Due Date" aria-label="DueDate">
</div>`;
                }
                $("tbody > tr").eq(increment).find(".td_value_zreport_filter").html(html);
            });
        }
        //add button setup
        if($("#zexcel").val()) {
            $(".setup").html(`<button id="form-submit" type="button" class="btn btn-block btn-lg btn-danger btn-setup"  data-id="${id}"><span class="fas fa-certificate"></span> Setup</button>`);
        }
        return databody;
    }
}


function parentShow() {
    var parent = $("#parent_id").val();
    if(parent) {
        $(".divfilters").hide();
    } else {
        $(".divfilters").show();
    }
}