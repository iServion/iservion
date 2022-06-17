var m = {}
var Util = require('./Util');
var config = require('./../config/config')
var newLine = Util.newLine;

//module for ide code editor

m.ideCDN = function (req,res) {
    var end = res.locals.moduleEnd;
    end += '<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.6/ace.js"></script>';
    res.locals.moduleEnd = end;
}

m.ide = function (req,res,elem) {
    elem = elem || "#ide_editor";
    var end = res.locals.moduleEnd;
        end += `<script>   var editor_${elem} = ace.edit("${elem}");
    editor_${elem}.getSession().setMode("ace/mode/ejs");
     </script> ${Util.newLine}`;
     res.locals.moduleEnd = end;
}

//module for datepicker
m.datepicker = function (req, res, elem) {
    elem = elem || ".datepicker";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (head.indexOf("bootstrap-datepicker") < 0){
      /*  head += '<link href="/css/bootstrap-datepicker.css" rel="stylesheet">';
        end += '<script src="/js/bootstrap-datepicker.min.js"></script>';*/
        head += '<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css" rel="stylesheet">';
        end += '<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"></script>';
        end += '<script>';
        end += '$.fn.datepicker.defaults.format = "yyyy-mm-dd";';
        end += '$.fn.datepicker.defaults.todayHighlight = true;';
        end += `$("body").on("click", "${elem}", function(){
            $(this).datepicker();
            $(this).datepicker("show");
    });`;
        end += '</script>';

        res.locals.moduleHead = head;
        res.locals.moduleEnd = end;
    }
}


//module for datepicker
m.datetimepicker = function (req, res, elem) {
    elem = elem || ".datetimepicker";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (head.indexOf("datetimepicker") < 0) {
        head += '<link href="/css/bootstrap-datetimepicker.min.css" rel="stylesheet" />';
        end += '<script type="text/javascript" src="/js/moment-with-locales.min.js" ></script>';
        end += '<script type="text/javascript" src="/js/bootstrap-datetimepicker.min.js" ></script>';

       /* head += '<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.37/css/bootstrap-datetimepicker.min.css" rel="stylesheet" />';
        end += '<script type="text/javascript" src="/js/moment-with-locales.min.js" ></script>';
        end += '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.37/js/bootstrap-datetimepicker.min.js" ></script>';
*/      /*  end += '<script>';
        end += `$("body").on("click", "${elem}", function(){
            $(this).datetimepicker({format:'YYYY-MM-DD hh:mm:ss'});
    });`;
        end += '</script>';*/
        end += '<script>';
        end += `$(function () { $("${elem}").datetimepicker({format:'YYYY-MM-DD hh:mm:ss'}); });`;
        end += `setTimeout(function () { $("body").click();},1000);`;
        end += `$("body").on("click", function(){$("${elem}").datetimepicker({format:'YYYY-MM-DD hh:mm:ss'});});`;
        end += '</script>';

        res.locals.moduleHead = head;
        res.locals.moduleEnd = end;
    }
}


//using ckeditor
m.ckeditor = function (req, res, elem) {
    elem = elem || ".editor";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (head.indexOf("ckeditor") < 0) {
        end += '<script src="/modules/ckeditor5-build-classic/ckeditor.js"></script>' + newLine;
    }

    end += '<script>';
    end += 'ClassicEditor.create( document.querySelector( "' + elem + '" ) ).catch( error => {console.error( error );} );' + newLine;
    end += '</script>';

    res.locals.moduleHead = head;
    res.locals.moduleEnd = end;
}

//using froala
m.froala = function (req, res, elem) {
    elem = elem || ".editor";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (head.indexOf("froala_style") < 0) {
        head += '<link href="https://cdn.jsdelivr.net/npm/froala-editor@2.9.0/css/froala_editor.pkgd.min.css" rel="stylesheet" type="text/css" />';
        head += '<link href="https://cdn.jsdelivr.net/npm/froala-editor@2.9.0/css/froala_style.min.css" rel="stylesheet" type="text/css" />';
        end += '<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/froala-editor@2.9.0/js/froala_editor.pkgd.min.js"></script>';
        end += '<script>';
        end += `$(function() {$("${elem}").froalaEditor({height: 200})});`;
        end += '</script>';

        res.locals.moduleHead = head;
        res.locals.moduleEnd = end;
    }
}

//using tinymce
m.tinymce = function (req, res, elem) {
    elem = elem || ".editor";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (head.indexOf("tinymce") < 0) {
        end += '<script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/5/tinymce.min.js" referrerpolicy="origin"></script>' + newLine;
    }

    end += '<script>';
    end += 'tinymce.init({selector: "' + elem + '"});' + newLine;
    end += '</script>';

    res.locals.moduleHead = head;
    res.locals.moduleEnd = end;
}


//Default editor is froala
m.editor = (req, res, elem) => {
    elem = elem || ".editor";
    //Default editor is froala
    return m.froala(req, res, elem);
    //return m.tinymce(req, res, elem);
    //return m.ckeditor(req, res, elem);
}

m.switch = function (req, res, elem, array) {
    if (config.hasOwnProperty("frameworkcss")) {
        if (config.frameworkcss == "bootstrap3") {
            return m.switch3(req, res, elem, array)
        } else {
            return m.switch4(req, res, elem, array)
        }
    } else {
        return m.switch3(req, res, elem, array)
    }
}

m.clockpicker = function (req, res, elem) {
    if (config.hasOwnProperty("frameworkcss")) {
        if (config.frameworkcss == "bootstrap3") {
            return m.clockpicker3(req, res, elem)
        } else {
            return m.clockpicker3(req, res, elem)
        }
    } else {
        return m.clockpicker3(req, res, elem)
    }
}

m.clockpicker3 = function (req, res, elem) {
    elem = elem || ".clockpicker";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (head.indexOf("bootstrap-clockpicker") < 0) {
       /* head += '<link href="/clockpicker/bootstrap-clockpicker.min.css" rel="stylesheet" type="text/css" />' + newLine;
        end += '<script type="text/javascript" src="/clockpicker/bootstrap-clockpicker.js"></script>' + newLine;*/

         head += '<link href="https://cdnjs.cloudflare.com/ajax/libs/clockpicker/0.0.7/bootstrap-clockpicker.css" rel="stylesheet" type="text/css" />' + newLine;
         end += '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/clockpicker/0.0.7/bootstrap-clockpicker.js"></script>' + newLine;
    }

    end += '<script>' + newLine;
    end += `$("body").on("click", "${elem}", function(){
            $(this).clockpicker({donetext: "Done"});
    });`;
    //end += '$("' + elem + '").clockpicker({donetext: "Done"});' + newLine;
    end += '</script>' + newLine;
    res.locals.moduleHead = head;
    res.locals.moduleEnd = end;
}

m.switch3 = function (req, res, elem, array) {
    //http://www.acceleraise.org/static/public/t1-r1/plugins/bootstrap-switch/
    elem = elem || ".switch";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (head.indexOf("bootstrap-switch") < 0) {
        head += '<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.4/css/bootstrap3/bootstrap-switch.css" rel="stylesheet" type="text/css" />' + newLine;
        end += '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.4/js/bootstrap-switch.js"></script>' + newLine;
    }

    var labels = '';
    if (Array.isArray(array)) {
        labels = '{offText:"' + array[0] + '", onText:"' + array[1] + '"}';
    }

    end += '<script>' + newLine;
    end += '$("' + elem + '").bootstrapSwitch(' + labels + ');' + newLine;
    end += '</script>' + newLine;
    res.locals.moduleHead = head;
    res.locals.moduleEnd = end;
}


m.switch45 = function (req, res, elem, array) {
    //http://www.acceleraise.org/static/public/t1-r1/plugins/bootstrap-switch/
    m.switch3(req, res, elem, array)
    var head = res.locals.moduleHead;
    head += '<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/1.3/bootstrapSwitch.min.js" rel="stylesheet" type="text/css" />' + newLine;
    res.locals.moduleHead = head;
}
//https://gitbrent.github.io/bootstrap4-toggle
// bootstrap 4 switch
m.switch4 = function (req, res, elem, array) {
    elem = elem || ".switch";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (head.indexOf("bootstrap-switch") <0) {
        head += '<link href="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/css/bootstrap4-toggle.min.css" rel="stylesheet">' + newLine;
        end += '<script src="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/js/bootstrap4-toggle.min.js"></script>' + newLine;
    }

    var labels = '';
    if (Array.isArray(array)) {
        labels = '{off:"' + array[0] + '", on:"' + array[1] + '"}';
    }

    end += '<script> $(function(){' + newLine;
    end += '$("' + elem + '").bootstrapToggle(' + labels + ');' + newLine;
    end += ' });</script>' + newLine;
    res.locals.moduleHead = head;
    res.locals.moduleEnd = end;
}

m.number = (req, res, elem) => {
    elem = elem || ".number";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (head.indexOf("jquery-currency") < 0) {
        end += '<script type="text/javascript" src="/js/jquery-currency.js"></script>';
        end += '<script>';
        end += `$(function () { $(".number").formatCurrencyLive({symbol:"",roundToDecimalPlace :0,digitGroupSymbol :"."}); });`;
        end += `setTimeout(function () { $("body").click();},1000);`;
        end += `$("body").on("click", function(){$(".number").formatCurrencyLive({symbol:"",roundToDecimalPlace :0,digitGroupSymbol :"."});});`;
        end += '</script>';
        res.locals.moduleHead = head;
        res.locals.moduleEnd = end;
    }
}
m.typeahead = (req, res, elem, data) => {
    data = data || [];
    elem = elem || ".typeahead";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (head.indexOf("typeahead") < 0) {
        end += '<script type="text/javascript" src="/modules/typeahead/typeahead.js"></script>' + newLine;
    }

    var elemData = elem.replace(".", "");
    elemData = elemData.replace("#", "");
    var element = elem.replace("Typeahead", "");
    end += '<script>' + newLine;
    end += 'var ' + elemData + 'Data = ' + JSON.stringify(data.filter(function (value, index, arr) {
            return index > 0;
        })) + ';' + newLine;
    /*end += `$("body").on("click", "${elem}", function(){
            $(this).typeahead({source: ${elemData}Data ,items: 50, displayText: function(item){  return item.name.toString();}});
    });${Util.newLine}`;*/
    end += `$("body").on("change", "${elem}", function(){
            var current = $("${elem}").typeahead("getActive");
            if(current){
                $("${element}").val(current.id);
                $("${element}").change();
            }
    });${Util.newLine}`;
    end += `$("body").on("click", "${element}Clear", function(){
            $("${elem}").val("");
            $("${element}").val("");
            $("${elem}").change();
    });${Util.newLine}`;



    end += '$("' + elem + '").typeahead({source: ' + elemData + 'Data ,items: 50, displayText: function(item){  return item.name.toString();}});' + newLine;
  /*  end += '$("' + elem + '").change(function () {' + newLine;
    end += 'var current = $("' + elem + '").typeahead("getActive");' + newLine;
    end += 'if (current) { ' + newLine;
    end += '$("' + element + '").val(current.id);' + newLine;
    end += '$("' + element + '").change();' + newLine;
    end += '};' + newLine;
    end += '});' + newLine;

    end += `$("${element}Clear").on("click", function () {
    $("${elem}").val("");
    $("${element}").val("");
    $("${elem}").change();
});`;*/
    end += '</script>';

    res.locals.moduleHead = head;
    res.locals.moduleEnd = end;
}

m.custom = (req, res, script, css, src)=> {
    src = src || "";
    css = css || "";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;

    if (script) {
        end += '<script>' + newLine;
        end += script + newLine;
        end += '</script>';
    }

    if (css) {
        head += css;
    }

    if (src) {
        end += `<script src="${src}"> ${newLine}`;
    }

    res.locals.moduleHead = head;
    res.locals.moduleEnd = end;
}

m.script = async(req, res, table) => {
    const fs = require('fs');
    var file = dirRoot + "/runtime/scripts/" + table + '.js';
    try {
        let companyId = res.locals.companyId;
        if (fs.existsSync(file)) {
            let content = fs.readFileSync(file, 'utf8');
            if (content.length > 10) {
                const gHelper = require('./gHelper');

                var head = res.locals.moduleHead;
                var end = res.locals.moduleEnd;
                end += '<script>' + newLine;
                end += content + newLine;
                end += await gHelper.buildScriptForm(table, companyId);
                end += '</script>';

                res.locals.moduleHead = head;
                res.locals.moduleEnd = end;
            }
        }


    } catch (err) {
        // Here you get the error when the file was not found,
        // but you also get any other error
        console.log(err)
    }
}


/*
 add scrip code in the body html
 end in the bottom html body (javascript) default
 top in the top html body (css)

 type : script / css
 */
m.addScript = (req, res, contentScript, at = "end", type = "script") => {
    if (contentScript) {
        var generateId = "app_"+ Util.generate(6);
        var tagOpen = type == "script" ? `<script  id="${generateId}">` : '<style type="text/css">';
        var tagClose = type == "script" ? '</script>' : '</style>';

        var content = at == "end" ? res.locals.moduleEnd : res.locals.moduleHead;
        content += tagOpen + newLine;
        content += contentScript + newLine;
        content += tagClose + newLine;

        if(at == "end")
            res.locals.moduleEnd = content;
        else res.locals.moduleHead = content;
    }
}

m.addModule = (req,res, content, isModuleHead = false) => {
    var moduleContent = isModuleHead ? res.locals.moduleHead : res.locals.moduleEnd;
    moduleContent += content;
    if(isModuleHead) {
        res.locals.moduleHead = moduleContent;
    } else {
        res.locals.moduleEnd = moduleContent;
    }
}

m.highchart = async(req, res, obj) => {
    obj = obj || {};
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (end.indexOf("highcharts") < 0) {
        end += '<script src="https://code.highcharts.com/highcharts.js"></script>' + newLine;
    }

    if (!Util.isEmptyObject(obj)) {
        const highcharts = require('./highcharts');
        end += '<script>' + newLine;
        end += await highcharts.build(obj);
        end += '</script>' + newLine;
    }

    res.locals.moduleHead = head;
    res.locals.moduleEnd = end;
}

m.tableForm = (req, res, name, table) => {
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    res.locals.moduleHead = head;
    res.locals.moduleEnd = end;
}

m.tags = (req, res, elem, data)=> {
    data = data || "";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (head.indexOf("bootstap-tagsinput") < 0) {
        head += '<link href="/modules/tags/bootstrap-tagsinput.css" rel="stylesheet" type="text/css" />' + newLine;
        end += '<script type="text/javascript" src="/modules/tags/bootstrap-tagsinput.js"></script>' + newLine;
    }
    end += '<script>' + newLine;
    if (data) {
        var str = data;
        if (data.indexOf(",") > -1) {
            var explode = data.split(",");
            str = "'" + explode.join("','") + "'";
        }
        end += `$("${elem}").tagsinput(${str});`;
    } else {
        end += `$("${elem}").tagsinput({trimValue: true});`;
    }

    end += '</script>' + newLine;
    res.locals.moduleHead = head;
    res.locals.moduleEnd = end;
}

m.selectYear = (req, res, elem, val, startYear, endYear) => {
    var dt = new Date();
    endYear = endYear || dt.getFullYear();
    val = val || "";
    var options = "";
    for (var i = endYear; i >= startYear; i--) {
        var selected = i == val ? " selected " : "";
        options += `<option value="${i}" ${selected}>${i}</option>`
    }
    var end = res.locals.moduleEnd;
    end += '<script>' + newLine;
    end += `$("${elem}").html('${options}')`;
    end += '</script>' + newLine;
    res.locals.moduleEnd = end;
}

//https://highlightjs.org/usage/
m.highlight = (req, res, elem) => {
    elem = elem || ".codes";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (head.indexOf("highlight") < 0) {
        head += '<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.4.1/styles/default.min.css"> ' + newLine;
        end += '<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.4.1/highlight.min.js"></script>' + newLine;
    }
    //hljs.initHighlightingOnLoad();
    //end += '<script>$(function(){hljs.initHighlightingOnLoad(); })</script>' + newLine;

    end += '<script>$(function(){ document.querySelectorAll("' + elem + '").forEach((block) => {hljs.highlightBlock(block);}); })</script>' + newLine;
    res.locals.moduleHead = head;
    res.locals.moduleEnd = end;
}

//https://developer.snapappointments.com/bootstrap-select/
m.selectpicker = function (req, res, elem) {
    elem = elem || ".selectpicker";
    var head = res.locals.moduleHead;
    var end = res.locals.moduleEnd;
    if (head.indexOf("bootstrap-select") < 0) {
        head += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/css/bootstrap-select.min.css">' + newLine;
        end += '<script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/bootstrap-select.min.js"></script>' + newLine;
        end += `<script>$(function () {$('${elem}').selectpicker();});</script>${newLine}`;
    }
    res.locals.moduleHead = head;
    res.locals.moduleEnd = end;
}

module.exports = m;