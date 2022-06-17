/**
 * Created by sintret dev on 10/1/2021.
 */
var Util = require("./Util");
var configGenerator = require('./../config/config_generator');
var Model = require('./Model');
var fs = require('fs-extra');
var connection = require('./../config/connection');
var generatorModel = require('./../components/generatorModel');


var generatorApp = {}

//generate model file
generatorApp.CREATE_MODEL = async(MYMODEL) => {
    return generatorModel.create(MYMODEL);
}

//genereate route file
/*
 [[[TABLE_NAME]]]
 [[[HARDCODE_GRID]]]
 [[[ADDITIONAL_FIELDS_CREATE]]]
 ///additional_fields///


 */
generatorApp.CREATE_ROUTER = async(MYMODEL, zFields) => {
    var CONTENT =  zFields.router || fs.readFileSync(generatorApp.DIRECTORY + "/routerApp.ejs", 'utf-8');
    var zfields = await connection.result({table: "zfields", where: {table: MYMODEL.table}});
    var ADDITIONAL_FIELDS = generatorApp.ADDITIONAL_FIELDS(MYMODEL);

    var OBJ = {
        TABLE_NAME: MYMODEL.table,
        HARDCODE_GRID: zfields.hardcode_grid,
        ADDITIONAL_FIELDS_CREATE: ADDITIONAL_FIELDS.CREATE,
        ADDITIONAL_FIELDS_UPDATE: ADDITIONAL_FIELDS.UPDATE,
        BEFORE_CREATE: zfields.before_create || "",
        AFTER_CREATE: zfields.after_create || "",
        BEFORE_UPDATE: zfields.before_update || "",
        AFTER_UPDATE: zfields.after_update || "",
        BEFORE_DELETE: zfields.before_delete || "",
        AFTER_DELETE: zfields.after_delete || "",
    }

    for (var KEY in OBJ) {
        CONTENT = Util.replaceAll(CONTENT, "[[[" + KEY + "]]]", OBJ[KEY]);
    }

    fs.writeFileSync(generatorApp.DIRECTORY_ROUTES + "/" + MYMODEL.table + ".js", CONTENT, 'utf-8');
}

//generate views file
generatorApp.CREATE_VIEWS = async(MYMODEL, zFields) => {

    var views = ["_form.ejs", "create.ejs", "createjs.ejs", "import.ejs", "importjs.ejs", "index.ejs", "indexcss.ejs", "indexjs.ejs", "update.ejs", "updatejs.ejs", "view.ejs", "approval.ejs", "preview.ejs"];

    var GENERATE_FORM = generatorApp.GENERATE_FORM(MYMODEL, zFields);
    var GENERATE_INDEXJS = await generatorApp.GENERATE_INDEXJS(MYMODEL);
    var GENERATE_VIEW = await generatorApp.GENERATE_VIEW(MYMODEL, zFields);

    var OBJ = {
        "[[[NO_VALI_DATE_NOVALIDATE]]]": "[[[NO_VALI_DATE_NOVALIDATE]]]",
        "[[[GENERATE_FORM]]]": GENERATE_FORM,
        "[[[GENERATE_INDEXJS]]]": GENERATE_INDEXJS,
        "[[[GENERATE_VIEW]]]": GENERATE_VIEW
    }

    var DIR_VIEW = generatorApp.DIRECTORY_VIEWS + "/" + MYMODEL.table;
    if (!fs.existsSync(DIR_VIEW)){
        fs.mkdirSync(DIR_VIEW);
    }

    views.forEach(function async(item) {
        var name = item.replace("_","");
        name = name.replace(".","_");
        var source = zFields[name];
        if(source) {
            fs.writeFileSync(DIR_VIEW + "/" + item, source);
        } else {
            source = generatorApp.DIRECTORY_GENERATOR_VIEWS + "/" + item;
            fs.copySync(source, DIR_VIEW + "/" + item);
        }
        console.log(DIR_VIEW + "/" + item);
        for (var KEY in OBJ) {
            generatorApp.MODIFIY(DIR_VIEW + "/" + item, DIR_VIEW + "/" + item, KEY, OBJ[KEY]);
        }
    });

}

generatorApp.DIRECTORY = dirRoot + "/views/zgenerator";
generatorApp.DIRECTORY_MODELS = dirRoot + "/models";
generatorApp.DIRECTORY_ROUTES = dirRoot + "/routes";
generatorApp.DIRECTORY_VIEWS = dirRoot + "/views";
generatorApp.DIRECTORY_GENERATOR_VIEWS = generatorApp.DIRECTORY + "/views";


generatorApp.MODIFIY = (SOURCE, TARGET, REPLACE, REPLACE_NEW) => {
    var data = fs.readFileSync(SOURCE, 'utf-8');
    var newValue = Util.replaceAll(data, REPLACE, REPLACE_NEW)
    fs.writeFileSync(TARGET, newValue, 'utf-8');
    console.log(TARGET);
}


generatorApp.ADDITIONAL_FIELDS = (MYMODEL) => {
    var bytime = configGenerator.createdUpdatedAt;
    var byman = configGenerator.createdUpdatedBy;
    var create = [], update = [], str = "";
    var fields = MYMODEL.fields || {};
    for (var key in fields) {
        if (Util.in_array(key, bytime)) {
            create.push({field: key, value: 'Util.now()'});
        }
        if (Util.in_array(key, byman)) {
            create.push({field: key, value: 'res.locals.userId'});
        }
    }

    var update = create.filter((item)=> {
        return item.field.indexOf("create") < 0
    })
    var widgets = MYMODEL.widgets;
    for (var key in widgets) {
        if (widgets[key].name == "number") {
            str += `${Util.tabs(2)}data.${key} = Util.replaceAll(data.${key},'.','')${Util.newLine}`
        }
    }

    return {
        CREATE: str + create.reduce((result, item)=> {
            return result + `${Util.tabs(2)}data.${item.field} = ${item.value};${Util.newLine}`
        }, ""),
        UPDATE: str + update.reduce((result, item)=> {
            return result + `${Util.tabs(2)}data.${item.field} = ${item.value};${Util.newLine}`
        }, "")
    }
}

generatorApp.GENERATE_INDEXJS = async(MYMODEL) => {
    var fields = MYMODEL.fields;
    var widgets = MYMODEL.widgets;
    var widgetsArr = Object.keys(widgets) || [];
    var out = '';
    out += Util.newLine;
    for (var key in fields) {
        if (key != "company_id") {
            if (Util.in_array(key, widgetsArr)) {
                var widgetName = widgets[key].name;

                switch (widgetName) {
                    case "text" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", width: 80}, ${Util.newLine} `;
                        break;
                    case "textarea" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", itemTemplate: function (value) {return (value && value.length > 100) ? value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').substring(0,50) + '...' : value}, width: 90},  ${Util.newLine} `;
                        break;
                    case "number" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", itemTemplate: function (value) {return formatNumber(value)}, align: 'right', width: 70},  ${Util.newLine} `;
                        break;
                    case "image" :
                        var itemTemplate = `function (value) { return value == null || value == '' ? '' : '<img width="60" height="60" src="/uploads/<%- routeName  %>/'+value+'" class="img-circle" />'; }`;
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", itemTemplate: ${itemTemplate}, align: 'right', width: 70}, ${Util.newLine} `;
                        break;
                    case "file" :
                        var itemTemplate = 'function(value) { return value ? `<a href="/uploads/<%- routeName%>/${value}">${value}</a>`:""}';
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", itemTemplate: ${itemTemplate}, width: 80}, ${Util.newLine} `;
                        break;
                    case "email" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", width: 80}, ${Util.newLine} `;
                        break;
                    case "password" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", itemTemplate: function (value) {return "xxxxxx"}, width: 80}, ${Util.newLine} `;
                        break;
                    case "datepicker" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", itemTemplate: function (value) {return value ? value == '0000-00-00' ? '' : moment(value).format('YYYY-MM-DD') : '';}, width: 80}, ${Util.newLine} `;
                        break;
                    case "datetime" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", itemTemplate: function (value) {return value ? value == '0000-00-00 00:00:00' ? '' : moment(value).format('YYYY-MM-DD HH:mm:ss') : '';}, width: 80}, ${Util.newLine} `;
                        break;
                    case "clockpicker" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text",  width: 80}, ${Util.newLine} `;
                        break;
                    case "switch" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"select", items: ${Util.ejsOpen} JSON.stringify(relations.${key}) ${Util.ejsClose}, valueField: 'id', textField: 'name', width: 50}, ${Util.newLine} `;
                        break;
                    case "editor" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", itemTemplate: function (value) {return (value && value.length > 100) ? value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').substring(0,50) + '...' : value}, width: 90},  ${Util.newLine} `;
                        break;
                    case "ide_editor" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", itemTemplate: function (value) {return (value && value.length > 100) ? value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').substring(0,50) + '...' : value}, width: 90},  ${Util.newLine} `;
                        break;
                    case "select" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"select", items: ${Util.ejsOpen} JSON.stringify(relations.${key}Row) ${Util.ejsClose}, valueField: "id", textField: "name", width: 80}, ${Util.newLine} `;
                        break;
                    case "relation" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"select", items: ${Util.ejsOpen} JSON.stringify(relations.${key}Row) ${Util.ejsClose}, valueField: "${Util.ejsOpen} relations.${key}[0] ${Util.ejsClose}", textField: "name", width: 80}, ${Util.newLine} `;
                        break;
                    case "typeahead" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"select", items: ${Util.ejsOpen} JSON.stringify(relations.${key}) ${Util.ejsClose}, valueField: "id", textField: "name", width: 80}, ${Util.newLine} `;
                        break;
                    case "table" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", itemTemplate: function (value) {return (value && value.length > 100) ? value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').substring(0,50) + '...' : value}, width: 90},  ${Util.newLine} `;
                        break;
                    case "dropdown_multi" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"select", itemTemplate: function (value) {return gridValues(value,${Util.ejsOpen}  JSON.stringify(relations.${key}Row ) ${Util.ejsClose})}, items: ${Util.ejsOpen} JSON.stringify(relations.${key}) ${Util.ejsClose}, valueField: "id", textField: "name", width: 80}, ${Util.newLine} `;
                        break;
                    case "dropdown_chain" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"select", items: ${Util.ejsOpen} JSON.stringify(relations.${key}Row) ${Util.ejsClose}, valueField: "id", textField: "name", width: 80}, ${Util.newLine} `;
                        break;
                    case "dropdown_checkbox" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", itemTemplate: function (value) {return formatString(value)}, width: 90}, ${Util.newLine} `;
                        break;
                    case "virtual" :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", width: 80}, ${Util.newLine} `;
                        break;

                    default :
                        out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", width: 80}, ${Util.newLine} `;
                        break;
                }
            } else {
                out += `${Util.tabs(2)} ${key} : {name: "${key}", title: "${Util.ejsOpen} attributeData.labels['${key}'] ${Util.ejsClose}", type:"text", width: 80}, ${Util.newLine} `;
            }
        }
    }

    return out;
}

var formBuild = (arr, properties, tables) => {
    var out = ''
    arr.forEach(function (item, index) {
        var tabindex = !properties[item] ? index : properties[item].values.tabindex;
        var isHidden = !properties[item].values.hidden ? false : properties[item].values.hidden;
        var formLabel = Util.in_array(item, tables) ? '""' : `zForms.label["${item}"]`;
        if (!isHidden) {
            out += `${Util.tabs(3)}<%- UI.Form.group("${item}", ${formLabel}, zForms.fn("${item}",{tabindex:${tabindex}})); %>${Util.newLine}`;
        }
    });
    return out;
}

var formBuildDiv = (type = 1, obj = {})=> {
    var out = '';

    if (type == 1) {
        out += `${Util.tab}<div class="row">${Util.newLine}${Util.tabs(2)}<div class="col-md-12">${Util.newLine}`;
        out += formBuild(obj.oneColumn, obj.properties, obj.tables)
        out += `${Util.tabs(2)}</div>${Util.newLine}`;
        out += `${Util.tab}</div>${Util.newLine}`;
    } else {
        out += `${Util.tab}<div class="row">${Util.newLine}`;
        out += `${Util.tabs(2)}<div class="col-md-6">${Util.newLine}`;
        out += formBuild(obj.left, obj.properties, obj.tables);
        out += `${Util.tabs(2)}</div>${Util.newLine}`;
        out += `${Util.tabs(2)}<div class="col-md-6">${Util.newLine}`;
        out += formBuild(obj.right, obj.properties, obj.tables);
        out += `${Util.tabs(2)}</div>${Util.newLine}`;
        out += `${Util.tab}</div>${Util.newLine}`;
    }

    return out;
}


generatorApp.GENERATE_FORM = (MYMODEL, zFields) => {
    let out = '';
    //check if it has a tab
    let details = zFields.details;
    let properties = zFields.properties || {};
    let labels = zFields.labels;
    let tabs = zFields.tabs ? zFields.tabs : [];
    let left = zFields.left;
    let leftTab = [], rightTab = [];
    let sorting = zFields.sorting || [];
    let right = zFields.right;
    let oneColumn = zFields.one_column;
    let tabView = '';
    let tabContent = '';
    var isTab = tabs.length ? true : false;
    let tables = [];
    for (var key in properties) {
        if (properties[key].type == "table") {
            tables.push(key)
        }
    }

    var obj = {
        left: left,
        right: right,
        oneColumn: oneColumn,
        properties: properties,
        tables: tables

    }


    if (!isTab) {
        sorting.forEach(function (item, index) {
            out += formBuildDiv(item, obj)
        });

    } else {

        var tabsArr = [];
        tabs.forEach(function (tab, index) {
            var active = index == 0 ? true : false;
            tabsArr.push({label: tab, active: active});
        });

        out += `${Util.tab}<% var tabUI = UI.Form.tab(frameworkcss, ${JSON.stringify(tabsArr)})%>${Util.newLine}`;
        out += `${Util.tab}<%- tabUI.html %>${Util.newLines(2)}`;

        out += `${Util.tab}<div class="tab-content">${Util.newLine}`;

        tabs.forEach(function (tab, index) {
            var arrName = "arr" + index;
            var tablesLeft = [];
            var tablesRight = [];


            out += `${Util.tabs(2)}<div role="tabpanel" class="<%- tabUI.class%> <%- tabUI.active%>" id="arr${index}">${Util.newLine}`;
            out += `${Util.tabs(3)}<div class="container-fluid boxy mtop20">${Util.newLine}`;

            out += `${Util.tabs(4)}<div class="row">${Util.newLine}`;
            out += `${Util.tabs(5)}<div class="col-md-6">${Util.newLine}`;
            left.forEach(function (items) {
                if (typeof items == "string") {
                    leftTab.push(items);
                } else {
                    for (var key in items) {
                        if (key == arrName) {
                            items[arrName].forEach(function (item) {
                                if (!Util.in_array(item, tables)) {
                                    var tabindex = !properties[item] ? index : properties[item].values.tabindex;
                                    out += `${Util.tabs(6)}<%- UI.Form.group("${item}", zForms.label["${item}"], zForms.fn("${item}",{tabindex:${tabindex}})); %>${Util.newLine}`;
                                } else {
                                    tablesLeft.push(item);
                                }
                            });
                        }
                    }
                }
            });

            out += `${Util.tabs(5)}</div>${Util.newLine}`;
            out += `${Util.tabs(5)}<div class="col-md-6">${Util.newLine}`;

            right.forEach(function (items) {
                if (typeof items == "string") {
                    rightTab.push(items);
                } else {
                    for (var key in items) {
                        if (key == arrName) {
                            items[arrName].forEach(function (item) {
                                if (!Util.in_array(item, tables)) {
                                    var tabindex = !properties[item] ? index : properties[item].values.tabindex;
                                    out += `${Util.tabs(6)}<%- UI.Form.group("${item}", zForms.label["${item}"], zForms.fn("${item}",{tabindex:${tabindex}})); %>${Util.newLine}`;
                                } else {
                                    tablesRight.push(item);
                                }
                            });
                        }
                    }
                }
            });

            out += `${Util.tabs(5)}</div>${Util.newLine}`;
            out += `${Util.tabs(4)}</div>${Util.newLine}`; //end row

            if (tablesLeft.length || tablesRight.length) {

                tablesLeft.forEach(function (item) {
                    out += `${Util.tabs(5)}<%- zForms.field["${item}"] %>${Util.newLine}`;
                });

                tablesRight.forEach(function (item) {
                    out += `${Util.tabs(5)}<%- zForms.field["${item}"] %>${Util.newLine}`;
                });
            }


            if (index == 0) {
                if (leftTab.length || rightTab.length) {
                    out += `${Util.tabs(4)}<div class="row">${Util.newLine}`;
                    out += `${Util.tabs(5)}<div class="col-md-6">${Util.newLine}`;
                    leftTab.forEach(function (item) {
                        out += `${Util.tabs(5)}<%- zForms.field["${item}"] %>${Util.newLine}`;
                    });
                    out += `${Util.tabs(5)}</div>${Util.newLine}`;
                    out += `${Util.tabs(5)}<div class="col-md-6">${Util.newLine}`;
                    rightTab.forEach(function (item) {
                        out += `${Util.tabs(5)}<%- zForms.field["${item}"] %>${Util.newLine}`;
                    });
                    out += `${Util.tabs(5)}</div>${Util.newLine}`;
                    out += `${Util.tabs(4)}</div>${Util.newLine}`; //end row

                }
            }


            out += `${Util.tabs(3)}</div>${Util.newLine}`;
            out += `${Util.tabs(2)}</div>${Util.newLine}`;
        });


        out += `${Util.tab}</div>${Util.newLine}`;


    }

    return out;
}


generatorApp.GENERATE_VIEW = (MYMODEL, zFields) => {
    let out = '';
    //check if it has a tab
    let details = zFields.details;
    let properties = zFields.properties || {};
    let labels = zFields.labels;
    let tabs = zFields.tabs ? zFields.tabs : [];
    let left = zFields.left || [];
    let right = zFields.right || [];
    let oneColumn = zFields.one_column || [];
    let leftTab = [], rightTab = [], lefts = [], rights = [];
    let tabView = '';
    let tabContent = '';
    var isTab = tabs.length ? true : false;
    var tables = [];

    left.forEach((item)=>{
        if(properties[item].type == "editor" || properties[item].type == "ide_editor") {
            tables.push(item);
        }  else {
            lefts.push(item)
        }
    })
    right.forEach((item)=>{
        if(properties[item].type == "editor" || properties[item].type == "ide_editor") {
            tables.push(item);
        } else {
            rights.push(item)
        }
    })

    if (!isTab) {
        var maxNumber = lefts.length > rights.length ? lefts.length : rights.length;
        out += `<table class="table table-striped"><tbody>${Util.newLine}`;
        for (var i = 0; i < maxNumber; i++) {
            out += `${Util.tabs(3)}<tr>${Util.newLine}`;
            var colspanRight = !rights[i] ? ` colspan="3" ` : "";
            var colspanLeft = !lefts[i] ? ` colspan="3" ` : "";
            if (lefts[i]) {
                    out += `${Util.tabs(4)}<th class="can-copy"   data-name="{${lefts[i]}}"><%- attributeData.labels.${lefts[i]} %></th>
				<td  class="can-copy" ${colspanRight}><%- data.${lefts[i]} %></td>${Util.newLine}`;
            }
            if (rights[i]) {
                    out += `${Util.tabs(4)}<th class="can-copy"  data-name="{${rights[i]}}"><%- attributeData.labels.${rights[i]} %></th>
				<td class="can-copy"   ${colspanLeft}><%- data.${rights[i]} %></td>${Util.newLine}`;
            }

            out += `${Util.tabs(3)}</tr>${Util.newLine}`;
        }
        
        tables.forEach(function (item) {
            out += `${Util.tabs(3)}<tr>${Util.newLine}`;
            if(properties[item].type == "editor") {
                out += `${Util.tabs(4)}<th class="can-copy"  data-type="${properties[item].type}" colspan="4" data-name="{${item}}"><%- attributeData.labels.${item} %><br><%- data.${item} %></th>${Util.newLine}`;
            } else {
                //var textdata = "`"+data[item]+"`";
                out += `${Util.tabs(4)}<th class="can-copy" data-type="${properties[item].type}"  colspan="4" data-name="{${item}}"><%- attributeData.labels.${item} %><br><div class="ide_editor_200" id="editor_${item}"></div></th>${Util.newLine}`;
            }
            out += `${Util.tabs(3)}</tr>${Util.newLine}`;
        })

        out += `</tbody></table>`;

        if (oneColumn.length) {
            out += `<table class="table">`;
            oneColumn.forEach(function (item) {
                out += `<tr><th class="can-copy"  data-name="{${item}}"><%- attributeData.labels.${item} %></th></tr>`
                out += `<tr><td class="can-copy"  data-name="{${item}}"><%- data.${item} %></td></tr>`
            });

            out += `</table>`;
        }

    } else {


    }

    return out;
}


module.exports = generatorApp;