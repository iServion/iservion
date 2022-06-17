/**
 * Created by sintret dev on 10/1/2021.
 */
var Util = require("./Util");
var configGenerator = require('./../config/config_generator');
var Model = require('./Model');
var fs = require('fs-extra');
var connection = require('./../config/connection');


var me = {}

me.prepare = (MYMODEL) => {
    console.log(MYMODEL)
    var labels = MYMODEL.labels || {};
    var left = MYMODEL.left || [];
    var right = MYMODEL.right || [];
    var properties = MYMODEL.properties || {};
    var datas = {}

    var obj = {}
    obj.table = MYMODEL.table;
    obj.routeName = MYMODEL.route;
    obj.title = MYMODEL.name;
    obj.keys = Object.keys(labels);
    obj.keysExcel = obj.keys;
    obj.labels = labels;
    obj.labels.no = "#";
    obj.labels.actionColumn = "Action";
    obj.fields = me.fields(MYMODEL);
    obj.options = {}
    for(var key in obj.fields){
        obj.options[key] = obj.fields[key].search;
        datas[key] = "";
    }

    obj.grids = {
        visibles : ["no"],
        invisibles : []
    }
    var visibles = [];
    left.forEach(function (item) {
       if(typeof item == "object") {
           for(var key in item) {
               visibles = [...visibles,...item[key]];
           }
       } else {
           visibles.push(item);
       }
    });

    if(visibles.length < 4) {
        right.forEach(function (item) {
            if(typeof item == "object") {
                for(var key in item) {
                    visibles = [...visibles,...item[key]];
                }
            } else {
                visibles.push(item);
            }
        });
    }

    obj.grids.visibles = [...["no"],...visibles.filter((item, index) => { return index < 6}),...["actionColumn"]];
    obj.grids.invisibles = Object.keys(labels).filter((item)=>{ return !obj.grids.visibles.includes(item)});

    obj.datas = datas;

    //define what are widgets
    //except text,textarea,
    //var nots = ['text','textarea'];
    var widgets = {}
    var labelsArray = Object.keys(obj.fields);

    widgets["id"] = {
        name :"integer",
        hidden : false
    }
    if(Util.in_array("created_at", labelsArray)) {
        widgets["created_at"] = {
            name :"datetime",
            hidden : true
        }
    }
    if(Util.in_array("updated_at", labelsArray)) {
        widgets["updated_at"] = {
            name :"datetime",
            hidden : true
        }
    }
    if(Util.in_array("created_by", labelsArray)) {
        widgets["created_by"] = {
            name :"relation",
            table : "zuser",
            fields : ["id", "fullname"],
            hidden : true
        }
    }
    if(Util.in_array("updated_by", labelsArray)) {
        widgets["updated_by"] = {
            name :"relation",
            table : "zuser",
            fields : ["id", "fullname"],
            hidden : true
        }
    }

    for(var key in properties) {
        var property = properties[key];
        var hidden = !property.values.hidden ? false : property.values.hidden == "on" ? true : false;
/*        console.log("property start")
        console.log(property)
        console.log("property end")*/
        var type = property.type;
            widgets[key] = {
                name : type,
                hidden : hidden
            }

        if(property.values.information){
            widgets[key].information = property.values.information;
        }

            switch (type) {
                case "datepicker" :
                    widgets[key].format = !property.values.format ? "YYYY-MM-DD" :property.values.format;
                    break;
                case "datetime" :
                    widgets[key].format = !property.values.format ? "YYYY-MM-DD HH:mm:ss" :property.values.format;
                    break;
                case "switch" :
                    widgets[key].fields = [property.values.notactive,property.values.active];
                    break;
                case "table" :
                    widgets[key].table = property.values.table;
                    widgets[key].hasCompanyId = true;
                    break;
                case "multi_line_editor" :
                    widgets[key].table = property.values.table;
                    widgets[key].fields = property.values.fields;
                    widgets[key].description = property.values.description;
                    widgets[key].hasCompanyId = true;
                    break;
                case "select" :
                    var values = property.values.select || [];
                    widgets[key].fields = values.reduce((result,item)=> { return {...result, [item.value] : item.label}},{});
                    break;
                case "relation" :
                    widgets[key].table = property.values.table;
                    widgets[key].fields = ["id",property.values.concat];
                    widgets[key].isChain = property.values.isChain;
                    widgets[key].chains = property.values.chains || {};
                    //widgets[key].chainsTable = property.values.chainsTable || {};
                    widgets[key].hasCompanyId = true;
                    break;
                case "typeahead" :
                    widgets[key].table = property.values.table;
                    widgets[key].fields = ["id",property.values.concat];
                    widgets[key].hasCompanyId = true;
                    break;
                case "dropdown_multi" :
                    widgets[key].table = property.values.table;
                    widgets[key].fields = ["id",property.values.concat];
                    widgets[key].hasChains = property.values.chains ? true : false;
                    widgets[key].hasCompanyId = true;
                    break;
                case "dropdown_chain" :
                    var fieldValue = property.values.field || "";
                    widgets[key].table = property.values.table;
                    widgets[key].fields = ["id",property.values.concat];
                    widgets[key].chains = fieldValue.indexOf(",") > -1 ? fieldValue.split(",") : [fieldValue];
                    widgets[key].hasCompanyId = true;
                    break;
                case "dropdown_checkbox" :
                    var fieldValue = property.values.array || "";
                    widgets[key].fields = fieldValue.indexOf(",") ? fieldValue.split(",").map((item) => { return item.trim()}) : [fieldValue.trim()];
                    break;
                case "virtual" :
                    var fieldValue = property.values.field || "";
                    widgets[key].fields = fieldValue.indexOf(",") > -1 ? fieldValue.split(",") : [fieldValue];
                    break;

                case "ide_editor" :
                    widgets[key].language = property.values.languages || ""
                    break;

                default : break;
            }
    }
    obj.widgets = widgets;

    return obj
}


me.build = (json, index = 0) => {
    var text = '';
    var separator = index == 0 ? "" : Util.tabs(index);
    for(var key in json) {
        text += `${separator}${Util.tabs(2)} ${key} : `;
        var type = typeof json[key];

        if(type == "string") {
            var title = Util.replaceAll(json[key],'"',"'");
            text += `"${title}",${Util.newLine}`;
        } else if(Array.isArray(json[key])) {
            var textArray = json[key].reduce((result, item)=> {return  result+ `${Util.tabs(3)} ${separator}"${Util.replaceAll(item,'"',"'")}",${Util.newLine}`},"");
            text += `[${Util.newLine}${textArray.slice(0,-3)}${Util.newLine}${separator}${Util.tabs(2)} ], ${Util.newLine}`;
        } else if(type == "boolean") {
            text += json[key] ? "true" : "false";
            text += ","+Util.newLine;
        } else if(type == "object") {
            text += `{${Util.newLine}`
            var textObjext =  me.build(json[key], (index + 1));
            text += textObjext.slice(0,-3);
            text += `${Util.newLine}${separator}${Util.tabs(2)} }, ${Util.newLine}`
        } else {
            text += `"", ${Util.newLine}`
        }
    }
    return text;
}


me.create = async (ZFIELDS) => {
    var jsonText = `module.exports = {${Util.newLine}`;

    //CHECK IF HAS multi_line_editor
    var properties = ZFIELDS.properties || {};
    var labels = ZFIELDS.labels || {};
    var multi_line_editors = [];
    for(var key in properties) {
        if(properties[key].type == "multi_line_editor") {
            multi_line_editors.push(key);
        }
    }

    //join into MYMODEL [JSON_MODEL]
    if(multi_line_editors.length) {

        // multi line editor skip
        /*for(var i = 0; i < multi_line_editors.length;i++) {
            var item = multi_line_editors[i];
            var table = properties[item].table;
            var ZFIELDS_OTHER = await connection.result({
                table:"zfields",
                where:{table:table}
            })
            console.log("ZFIELDS_OTHER")
            console.log(ZFIELDS_OTHER)

            var JSON_MODEL_OTHER = me.prepare(ZFIELDS_OTHER);
        }*/
    }
    var JSON_MODEL = me.prepare(ZFIELDS);
    jsonText += me.build(JSON_MODEL);
    jsonText += `}`;
    var filename = `${dirRoot}/models/${ZFIELDS.table}.js`;
    fs.writeFile(filename, jsonText, function (err) {
        if (err) {
            return console.log(err.toString());
        }
        console.log("The file models of " + ZFIELDS.table + " is saved!");
    });

    return await me.build_sql(ZFIELDS);
}


me.build_sql = async(MYMODEL) => {
    var labels = MYMODEL.labels || {};
    let properties = MYMODEL.properties || {}
    var columns = await connection.query(connection.describeTable(MYMODEL.table));
    var fields = columns.reduce((result, item) => { return [...result, item.Field]},[]);
    var sql = '';
    var Model = require("./../components/Model");
    var error = "";

    for(var key in labels) {
        if(!Util.in_array(key, fields)) {
            var property = properties[key];
            if(property) {
                var sqlObject = Model[property.type].sql(key, MYMODEL, property.values);
                if(sqlObject.column) {
                    try {
                        await connection.query(sqlObject.column);
                    } catch (err) {
                        error += err.toString();
                    }
                }
            }
        }
    }


    var constraintList = await connection.query(connection.constraintList(MYMODEL.table));
    //make a object instead of array
    var constraintObject = Util.arrayToObject(constraintList,"conname");

    //check required,index, relations, unique if have changes
    for(var key in properties) {
        var property = properties[key];
        //required
        var required = properties[key].values.required ? true : false;
        if(required){
            //ALTER TABLE mytable ALTER COLUMN mycolumn SET NOT NULL;
            await connection.query(`ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET NOT NULL; `);
        } else {
            await connection.query(`ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT  NULL; `)
        }

        var sqlObject = Model[property.type].sql(key, MYMODEL, property.values);

        //unique
        var unique = properties[key].values.unique ? true : false;
        var idx= `unique_${MYMODEL.table}_${key}`;

        if(sqlObject.index) {
            if(!constraintObject.hasOwnProperty(idx)) {
                await connection.query(sqlObject.index);
            }
        } else {
            if(constraintObject.hasOwnProperty(idx)) {
                await connection.query(`DROP INDEX ${idx}; `);
            }
        }

        //relations foreign key
        var fk = `fk_${MYMODEL.table}_${key}`;
        if(sqlObject.foreignKey) {
            if (!constraintObject.hasOwnProperty(fk)) {
                await connection.query(sqlObject.foreignKey);
            }
        }
        
        //default value
        if(sqlObject.defaultValue) {
            await connection.query(sqlObject.defaultValue);
        }
    }

    return error;
}

me.fields = (MYMODEL) => {
    var obj = {}
    var properties = MYMODEL.properties || {};
    var labels = MYMODEL.labels || {};
    for (var key in labels) {
        obj[key] = {
            name: key,
            title: labels[key],
            placeholder: labels[key]
        }
        if (key == "id") {
            Object.assign(obj[key], me.integer({key: "PRI"}));
        } else if (key == "company_id") {
            Object.assign(obj[key], me.integer({key: "MUL"}));
        } else if (Util.in_array(key, configGenerator.createdUpdatedAt)) {
            Object.assign(obj[key], me.datetime());
        } else if (Util.in_array(key, configGenerator.createdUpdatedBy)) {
            Object.assign(obj[key], me.integer());
        } else {
            if(properties.hasOwnProperty(key)) {
                var property = properties[key];
                var type = property.type;
                obj[key].type = Model[type].columnType(property.values);
                obj[key].category = Model[type].category;
                obj[key].length = !property.length ? "" : property.length;
                obj[key].required = property.values.required ? true : false;
                obj[key].search = obj[key].category == "integer" ? "=" : "ILIKE";
                obj[key].key = "";
            }
        }
    }

    return obj;
}


me.integer = (obj = {}) => {
    var defaultObj = {
        type: "int",
        category: "integer",
        length: 11,
        required: true,
        search: "=",
        key: ""
    }

    return Object.assign(defaultObj, obj);
}

me.datetime = (obj = {}) => {
    var defaultObj = {
        type: "datetime",
        category: "datetime",
        length: "",
        required: false,
        search: "ILIKE",
        key: ""
    }

    return Object.assign(defaultObj, obj);
}

module.exports = me;