/**
 * Created by sintret dev on 2/23/2022.
 */

var connection = require('./../config/connection');
const Util = require('./Util');
const fs = require('fs-extra');
var cnf = require('./../config/config')

var z = {}
z.notRenderField = cnf.generator.notRenderField;


z.generateFields = async(table) => {
    let rows = []
    let sql = connection.describeTable(table);
    let rowsFields = await connection.query(sql);
    for (let k = 0; k < rowsFields.length; k++) {
        let obj = rowsFields[k];
        let Type = obj.Type;
        if (Type.indexOf("character varying") > -1) {
            obj.Type = Util.replaceAll(Type, "character varying", "varchar");
        } else if (Type.indexOf("integer()") > -1) {
            obj.Type = "int(11)";
        } else if (Type.indexOf("smallint()") > -1) {
            obj.Type = "int(4)";
        } else if (Type.indexOf("()")) {
            obj.Type = Util.replaceAll(Type, "()", "");
        }

        rows.push(obj)
    }
    return rows;
}


z.fieldsTable = async(table) => {
    let rows = await z.generateFields(table);
    let arr = [];
    if (rows.length > 0) {
        for (let i = 0; i < rows.length; i++) {
            if (!Util.in_array(rows[i].Field, z.notRenderField))
                arr.push({name: rows[i].Field, label: Util.fieldToName(rows[i].Field)});
        }
    }

    return arr;
}

//insert into zfields for the table
z.zFieldsProperty = async(table) => {
    let data = {}
    data.table = table;
    data.name = Util.fieldToName(table);
    data.route = table;
    let label = {}
    let details = [], lefts = [], rights = [];
    let nots = Util.nots;
    let fields = await connection.query(connection.showFullFields(table));
    fields.forEach(function (item) {
        label[item.Field] = Util.fieldToName(item.Field);
    });
    data.labels = JSON.stringify(label);
    let num = 1;
    fields.forEach(function (item) {
        if (!Util.in_array(item.Field, nots)) {
            details.push(item.Field);

            if (num % 2 == 0) {
                rights.push(item.Field)
            } else {
                lefts.push(item.Field)
            }

            num++;
        }
    });
    let notabs = {
        notabs: details
    }

    data.details = JSON.stringify(notabs);
    data.left = JSON.stringify(lefts);
    data.right = JSON.stringify(rights);
    return data;
}


z.dragable_with_icon = (name, label, tab, leftright, type = "") => {
    let myname = tab === "" ? name : name + "___arr" + tab;
    leftright = leftright || "LEFT";
    var Model = require("./Model");
    var typeName = type ? Model.keys[type] : "";
    return `<li>
<div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text modal_setting" data-type="${typeName}" data-name="${name}" data-label="${label}"><i class="fa fa-cog text-info" ></i> </span>
            <span class="input-group-text can-copy"  data-name="${name}" title="click to copy"><i class="fa fa-copy"></i></span>
            <span class="input-group-text" >${name}</span>
            <input type="text" class="form-control" data-name="${name}" name="${myname}" value="${label}">
            <input type="hidden" name="${leftright}" value="${name}">
        </div>
</div><br></li>`;
}


module.exports = z;