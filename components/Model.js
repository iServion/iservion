/**
 * Universal class Model
 * Created by sintret dev on 9/23/2021.
 */

var Util = require("./Util");

/*
 properties
 labels
 defaultValues
 attributes
 validations
 */
var Model = {};

Model.buildWidget = (fieldName, name, values = {}) => {
    let html = '';
    let properties = Model[name].properties || [];
    let typies = Model[name].typies;

    if (properties.length) {
        let labels = Model[name].labels;
        properties.map((item) => {
            var value = !values[item] ? Model[name].defaultValues[item] : values[item];
            var tag = !typies[item].tag ? "" : typies[item].tag;
            var type = !typies[item].type  ? "" : typies[item].type;

            if(tag == "array") {

                html += `<div class="form-group divselect"><label for="${name}_${item}">${labels[item]}</label>`;
                html += `<button type="button" class="btn btn-success btn-sm float-right select-plus"   data-name="${fieldName}" data-item="${item}"><i class="fa fa-plus"></i> </button>`;

                value.forEach(function (val, index) {
                    html += `<div class="input-group group-select"><div class="input-group-prepend">
        <input type="number" class="form-control cvalue" placeholder="Value"  value="${val.value}"  name="${fieldName}[${item}][${index}][value]">
        <input type="text" class="form-control clabel" placeholder="Label" value="${val.label}" name="${fieldName}[${item}][${index}][label]">
        <span class="input-group-text trash-select"  data-name="${fieldName}" data-item="${item}"><i class="fa fa-trash text-danger"></i> </span>
        </div></div>`;
                });

            } else if (tag == "select"){
                var dropdownOptions = "";
                if(typies[item].dropdown) {
                    for(var key in typies[item].dropdown) {
                        var selected = value == key ? " selected " : "";
                        dropdownOptions += `<option value="${key}" ${selected}>${typies[item].dropdown[key]}</option>`;
                    }
                }

                html += `<div class="form-group"><label for="${name}_${item}">${labels[item]}</label>`;
                html += `<select class="form-control changetableselect" data-value="${value}" id="${name}_${item}" name="${fieldName}[${item}]">${dropdownOptions}</select>`

            } else if (tag == "textarea"){
                html += `<div class="form-group"><label for="${name}_${item}">${labels[item]}</label>`;
                html += `<textarea class="form-control mb-3 editor" id="${name}_${item}" name="${fieldName}[${item}]" rows="4">${value}</textarea>`;

            } else {

                var checked = "";
                if(type == "checkbox") {
                    value = !values[item] ? false : values[item];
                    var checked = value ? "checked" : "";
                    html += `<div class="form-check">`;
                    html += `<input class="form-check-input" type="checkbox"  id="${name}_${item}" name="${fieldName}[${item}]"  ${checked} />`;
                    html += `<label class="form-check-label" for="${name}_${item}">${labels[item]}</label></div><br>`;
                } else {

                    html += `<div class="form-group"><label for="${name}_${item}">${labels[item]}</label>`;
                    html += `<${tag} type="${type}" class="form-control" id="${name}_${item}"  data-value="${value}" name="${fieldName}[${item}]"  value="${value}" >`;

                }
            }

            html += `</div>`;

        });
    }

    return html;
}

Model.buildSQL = (table, obj) => {
    var notnullor = obj.required ? "NOT NULL" : "NULL";
    var sql =  `ALTER TABLE "${table}" ADD COLUMN  "${obj.name}"  ${obj.sql} ${notnullor} AFTER id;`;
    console.log(sql);
    return sql;
}

//available Model type
Model.keys = {
    text: "Short Text",
    textarea: "Long Text",
    number: "Currency",
    integer: "Integer",
    image: "Image Upload",
    file: "File Upload",
    email:"Email",
    password:"Password",
    datepicker: "Date Picker",
    datetime: "Date Time",
    clockpicker: "Clock Picker",
    switch: "Switch",
    editor: "Editor",
    ide_editor: "IDE Editor (code)",
    multi_line_editor: "Multi Line Editor",
    select: "Select (static) ",
    relation: "Select (relation to other module)",
    typeahead: "Auto Complete",
    dropdown_multi: "Dropdown Multi",
    //dropdown_chain: "Dropdown Chain",
    dropdown_checkbox: "Dropdown Checkbox",
    table: "Table",
    json : "JSON",
    virtual : "Virtual Field (readonly)"
}

Model.text = {
    properties: ["required","unique", "tabindex", "maxlength", "length", "hidden","defaultValue","information"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
        maxlength: "Max Length",
        length: "Length",
        hidden : "Hidden",
        defaultValue : "Default Value",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
        maxlength: 255,
        length: 255,
        hidden : false,
        defaultValue: null,
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        hidden : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        maxlength : {
            tag : "input",
            type : "number"
        },
        length : {
            tag : "input",
            type : "number"
        },
        defaultValue : {
            tag : "input",
            type : "text"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    attributes: {maxlength:"this.value"},
    validations: {
        maxlength: {
            title: "Max Length"
        }
    },
    comment: (obj = {}) => {
        return ``;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var length = !obj.length ? 255 : obj.length;
        var required = !obj.required ? "NULL" : "NOT NULL";
        var indexing = !obj.unique ? "" : `	ALTER TABLE "${MYMODEL.table}" ADD CONSTRAINT unique_${MYMODEL.table}_${key}  UNIQUE (${key});`;
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" varchar(${obj.length}) ${required};`,
            index : indexing,
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `varchar(${obj.length}) `;
    },
    category : "text"
}

Model.textarea = {
    properties: ["required", "tabindex", "rows","hidden","defaultValue","information"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        rows: "Rows",
        hidden : "Hidden",
        defaultValue : "Default Value",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        rows: 3,
        hidden : false,
        defaultValue : null,
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        rows : {
            tag : "input",
            type : "number"
        },
        hidden : {
            tag : "input",
            type : "checkbox"
        },
        defaultValue : {
            tag : "input",
            type : "text"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    attributes: {rows:"this.value"},
    comment: (obj = {}) => {
        return ``;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" text ${required};`,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `text`;
    },
    category : "text"
}


Model.email = {
    properties: ["required","unique", "tabindex","hidden","defaultValue","information"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
        hidden : "Hidden",
        defaultValue : "Default Value",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
        hidden : false,
        defaultValue : null,
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        hidden : {
            tag : "input",
            type : "checkbox"
        },
        defaultValue : {
            tag : "input",
            type : "text"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    attributes: {type:"email"},
    comment: (obj = {}) => {
        return ``;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var indexing = !obj.unique ? "" : `	ALTER TABLE "${MYMODEL.table}" ADD CONSTRAINT unique_${MYMODEL.table}_${key}  UNIQUE (${key});`
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" varchar(50) ${required};`,
            index : indexing,
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `varchar(50)`;
    },
    category : "text"
}


Model.password = {
    properties: ["required", "tabindex","hidden","information"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        hidden : "Hidden",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        hidden : false,
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "email"
        },
        hidden : {
            tag : "input",
            type : "checkbox"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    attributes: {type:"password"},
    comment: (obj = {}) => {
        return ``;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var defaultValue = "";
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" varchar(255) ${required};`,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `varchar(255)`;
    },
    category : "text"
}

Model.number = {
    properties: ["required", "tabindex", "min", "max", "hidden","defaultValue","information"],
    attributes: ["min", "max"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        min: "Min",
        max: "Max",
        hidden : "Hidden",
        defaultValue : "Default Value",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        min: 0,
        max: 0,
        hidden : false,
        defaultValue: null,
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        min : {
            tag : "input",
            type : "number"
        },
        max : {
            tag : "input",
            type : "number"
        },
        hidden : {
            tag : "input",
            type : "checkbox"
        },
        defaultValue : {
            tag : "input",
            type : "number"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj = {}) => {
        return `number`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT ${obj.defaultValue};`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" real ${required}; `,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `real`;
    },
    category : "integer"
}

Model.integer = {
    properties: ["required", "tabindex", "min", "max", "hidden","defaultValue",,"information"],
    attributes: ["min", "max"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        min: "Min",
        max: "Max",
        hidden : "Hidden",
        defaultValue : "Default Value",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        min: 0,
        max: 0,
        hidden : false,
        defaultValue: null,
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        min : {
            tag : "input",
            type : "number"
        },
        max : {
            tag : "input",
            type : "number"
        },
        hidden : {
            tag : "input",
            type : "checkbox"
        },
        defaultValue : {
            tag : "input",
            type : "number"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj = {}) => {
        return `bigint`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" bigint ${required};`,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `bigint`;
    },
    category : "integer"

}

Model.image = {
    properties: ["required", "tabindex"],
    labels: {
        required: "Required",
        tabindex: "Tab Index"
    },
    defaultValues: {
        required: false,
        tabindex: 1
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        }
    },
    comment: (obj = {}) => {
        return `image`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" varchar(255)  ${required};`,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `varchar(255) `;
    },
    category : "text"
}

Model.file = {
    properties: ["required", "tabindex","information"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj = {}) => {
        return `module_file`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET ${obj.defaultValue};`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" varchar(255)  ${required};`,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `varchar(255) `;
    },
    category : "text"
}

Model.datepicker = {
    properties: ["required","unique", "tabindex","format","information"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
        format : "Format <a href='https://momentjs.com/docs/#/displaying/format/' target='blank'>Example Format</a>",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
        format : "YYYY-MM-DD",
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        format : {
            tag : "select",
            type : "",
            dropdown : {
                "YYYY-MM-DD": "2021-12-31",
                "YYYY MM DD": "2021 12 31",
                "YYYY MMM DD": "2021 Dec 31",
                "YYYY MMMM DD": "2021 December 31",
                "DD-MM-YYYY": "31-12-2021",
                "DD MM YYYY": "31 12 2021",
                "DD MMM YYYY": "31 Dec 2021",
                "DD MMMM YYYY": "31 December 2021",
                "dd YYYY MM DD": "Su 2021 12 31",
                "ddd YYYY MM DD": "Sun 2021 12 31",
                "dddd YYYY MM DD": "Sunday  2021 12 31"
            }
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj = {}) => {
        return `datepicker`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var indexing = !obj.unique ? "" : `	ALTER TABLE "${MYMODEL.table}" ADD CONSTRAINT unique_${MYMODEL.table}_${key}  UNIQUE (${key});`
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" date  ${required};`,
            index : indexing,
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `date`;
    },
    category : "date"
}

Model.datetime = {
    properties: ["required","unique", "tabindex","hidden","format","information"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
        hidden : "Hidden",
        format : "Format <a href='https://momentjs.com/docs/#/displaying/format/' target='blank'>Example Format</a>",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
        hidden : false,
        format : "YYYY-MM-DD HH:mm:ss",
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        hidden : {
            tag : "input",
            type : "checkbox"
        },
        format : {
            tag : "select",
            type : "",
            dropdown : {
                "YYYY-MM-DD HH:mm:ss": "2021-12-31 09:15:21",
                "YYYY MM DD HH:mm": "2021 12 31 09:15",
                "YYYY MMM DD HH mm": "2021 Dec 31 09 15",
                "YYYY MMMM DD HH:mm": "2021 December 31 09:15",
                "DD-MM-YYYY HH:mm:ss": "31-12-2021 09:15:21",
                "DD MM YYYY HH:mm:ss": "31 12 2021 09:15:21",
                "DD MMM YYYY HH:mm:ss": "31 Dec 2021 09:15:21",
                "DD MMMM YYYY HH:mm:ss": "31 December 2021 09:15:21",
                "dd YYYY MM DD HH:mm:ss": "Su 2021 12 31 09:15:21",
                "ddd YYYY MM DD HH:mm:ss": "Sun 2021 12 31 09:15:21",
                "dddd YYYY MM DD HH:mm:ss": "Sunday  2021 12 31 09:15:21"
            }
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj = {}) => {
        return ``;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var indexing = !obj.unique ? "" : `	ALTER TABLE "${MYMODEL.table}" ADD CONSTRAINT unique_${MYMODEL.table}_${key}  UNIQUE (${key});`
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  ${required};`,
            index : indexing,
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `datetime`;
    },
    category : "datetime"
}

Model.clockpicker = {
    properties: ["required","unique", "tabindex","information"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj = {}) => {
        return `clockpicker`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var indexing = !obj.unique ? "" : `	ALTER TABLE "${MYMODEL.table}" ADD CONSTRAINT unique_${MYMODEL.table}_${key}  UNIQUE (${key});`
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" varchar(12) ${required};`,
            index : indexing,
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `text`;
    },
    category : "text"
}

Model.switch = {
    properties: ["required", "tabindex", "active", "notactive","information"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        active: "Active",
        notactive: "Not Active",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        active: "Yes",
        notactive: "No",
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        active : {
            tag : "input",
            type : "text"
        },
        notactive : {
            tag : "input",
            type : "text"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj) => {
        var active = !obj.active ? "Yes" : obj.active;
        var notactive = !obj.notactive ? "No" : obj.notactive;
        return `module_switch_${notactive}_${active}`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" smallint ${required};`,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `smallint`;
    },
    category : "integer"
}

Model.editor = {
    properties: ["required", "tabindex","information"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj) => {
        return 'editor';
    },
    sql: (key, MYMODEL, obj = {}) => {
        var length = !obj.length ? 255 : obj.length;
        var required = !obj.required ? "NULL" : "NOT NULL";
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" text ${required};`,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `text`;
    },
    category : "text"
}

Model.ide_editor = {
    properties: ["required", "tabindex","languages","information"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        languages : "Languages",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        languages : "javascript",
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        languages : {
            tag : "select",
            type : "",
            dropdown : {
                "" : "",
                "abap": "abap",
                "actionscript" : "actionscript",
                "ada" : "ada",
                "asciidoc" : "asciidoc",
                "assembly_x86" : "assembly_x86",
                "autohotkey" : "autohotkey",
                "batchfile" : "batchfile",
                "c9search" : "c9search",
                "c_cpp" : "c_cpp",
                "clojure" : "clojure",
                "cobol" : "cobol",
                "coffee" : "coffee",
                "coldfusion" : "coldfusion",
                "csharp" : "csharp",
                "css" : "css",
                "curly" : "curly",
                "d" : "d",
                "dart" : "dart",
                "diff" : "diff",
                "django" : "django",
                "dot" : "dot",
                "ejs" : "ejs",
                "erlang" : "erlang",
                "forth" : "forth",
                "ftl" : "ftl",
                "glsl" : "glsl",
                "golang" : "golang",
                "groovy" : "groovy",
                "haml" : "haml",
                "handlebars" : "handlebars",
                "haskell" : "haskell",
                "haxe" :"haxe",
                "html" : "html",
                "html_ruby" : "html_ruby",
                "ini" : "ini",
                "jade" : "jade",
                "java" : "java",
                "javascript" : "javascript",
                "json" : "json",
                "jsoniq" : "jsoniq",
                "jsp" : "jsp",
                "jsx" : "jsx",
                "julia" : "julia",
                "latex" : "latex",
                "less" : "less",
                "liquid" : "liquid",
                "lisp" : "lisp",
                "livescript" : "livescript",
                "logiql" : "logiql",
                "lsl" : "lsl",
                "lua" : "lua",
                "luapage" : "luapage",
                "lucene" : "lucene",
                "makefile" : "makefile",
                "markdown" : "markdown",
                "matlab" : "matlab",
                "mushcode" : "mushcode",
                "mushcode_high_rules" : "mushcode_high_rules",
                "mysql" : "mysql",
                "objectivec" : "objectivec",
                "ocaml" : "ocaml",
                "pascal" : "pascal",
                "perl" : "perl",
                "pgsql" : "pgsql",
                "php" : "php",
                "powershell" : "powershell",
                "prolog" : "prolog",
                "properties" : "properties",
                "python" : "python",
                "r" : "r",
                "rdoc" : "rdoc",
                "rhtml" : "rhtml",
                "ruby" : "ruby",
                "rust" : "rust",
                "sass" : "sass",
                "scad" : "scad",
                "scala" : "scala",
                "scheme" : "scheme",
                "scss" : "scss",
                "sh" : "sh",
                "snippets" : "snippets",
                "sql" : "sql",
                "stylus" : "stylus",
                "svg" : "svg",
                "tcl" : "tcl",
                "tex" : "tex",
                "text" : "text",
                "textile" : "textile",
                "toml" : "toml",
                "twig" : "twig",
                "typescript" : "typescript",
                "vbscript" : "vbscript",
                "velocity" : "velocity",
                "verilog" : "verilog",
                "xml" : "xml",
                "xquery" : "xquery",
                "yaml" : "yaml"
            },
            information : {
                tag : "input",
                type : "text"
            }
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj) => {
        return 'ide_editor';
    },
    sql: (key, MYMODEL, obj = {}) => {
        var length = !obj.length ? 255 : obj.length;
        var required = !obj.required ? "NULL" : "NOT NULL";
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" text ${required};`,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `text`;
    },
    category : "text"
}

Model.select = {
    properties: ["required","unique", "tabindex", "select","information"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
        select: "Select",
        value: "Value",
        name: "Label",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
        value: 1,
        name: "Name",
        select : [{value:1,label:"Please Select"}],
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        select : {
            tag : "array",
            type : ""
        },
        concat : {
            tag : "input",
            type : "text"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj) => {
        //dropdown_static_1=Male,2=Female
        return `dropdown_static_1=Male,2=Female`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var indexing = !obj.unique ? "" : `	ALTER TABLE "${MYMODEL.table}" ADD CONSTRAINT unique_${MYMODEL.table}_${key}  UNIQUE (${key});`
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" smallint ${required};`,
            index : indexing,
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `smallint`;
    },
    category : "integer"
}


Model.multi_line_editor =  {
    properties: ["required","unique", "tabindex", "table","description","information"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
        table: "Module Name",
        description : "Description",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
        table: "user",
        name: "username",
        description : "This is your Text",
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        table : {
            tag : "select",
            type : ""
        },
        description : {
            tag : "textarea",
            type : "",
            class : "editor"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj) => {
        return `dropdown_table`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        return {
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" JSON ${required};`,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `json`;
    },
    category : "json"
}


Model.relation = {
    properties: ["required","unique", "tabindex", "table", "name","concat","isChain","information"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
        table: "Module Name",
        name: "Label",
        concat : "Concat",
        isChain : "is Chain",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
        table: "user",
        name: "username",
        concat: "CONCAT(fullname, ' ',email)",
        isChain : false,
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        table : {
            tag : "select",
            type : ""
        },
        name : {
            tag : "select",
            type : ""
        },
        concat : {
            tag : "input",
            type :"text"
        },
        isChain : {
            tag : "input",
            type : "checkbox"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj) => {
        return `select`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var length = !obj.length ? 255 : obj.length;
        var required = !obj.required ? "NULL" : "NOT NULL";
        var indexing = !obj.unique ? "" : `	ALTER TABLE "${MYMODEL.table}" ADD CONSTRAINT unique_${MYMODEL.table}_${key}  UNIQUE (${key});`
        var fk = `ALTER TABLE "${MYMODEL.table}" ADD CONSTRAINT fk_${MYMODEL.table}_${key}  FOREIGN KEY (${key}) REFERENCES ${obj.table};`
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        //ALTER TABLE zuser_company ADD CONSTRAINT fk_user_company_role FOREIGN KEY (role_id) REFERENCES zrole (id);
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" bigint ${required};`,
            index : indexing,
            foreignKey : fk
        }
    },
    columnType : (obj={}) => {
        return `bigint`;
    },
    category : "integer"
}


Model.typeahead = {
    properties: ["required","unique", "tabindex","table","name", "concat","information"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
        table : "Module Name",
        name : "Label",
        concat: "Concat",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
        table:"user",
        concat: "CONCAT(fullname, ' ',email)",
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        table : {
            tag : "select",
            type : ""
        },
        name : {
            tag : "select",
            type : ""
        },
        concat : {
            tag : "input",
            type : "text"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj) => {
        //module_typeahead_CONCAT(name, " (code) : ", code)
        var name = !obj.name ? "id" : obj.name;
        return `module_typeahead_${name}`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var length = !obj.length ? 255 : obj.length;
        var required = !obj.required ? "NULL" : "NOT NULL";
        var indexing = !obj.unique ? "" : `CREATE UNIQUE INDEX idx_${MYMODEL.table}_${key} ON ${MYMODEL.table}(${key});`
        var fk = `ALTER TABLE "${MYMODEL.table}" ADD CONSTRAINT fk_${MYMODEL.table}_${key}  FOREIGN KEY (${key}) REFERENCES ${obj.table};`
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" bigint ${required};`,
            index : indexing,
            foreignKey : fk
        }
    },
    columnType : (obj={}) => {
        return `bigint`;
    },
    category : "integer"
}


Model.table = {
    properties: ["required","unique", "tabindex", "table"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
        table: "Module Name"
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
        table: "user",
        name: "username"
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        table : {
            tag : "select",
            type : ""
        }
    },
    comment: (obj) => {
        return `dropdown_table`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        return {
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" JSON ${required};`,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `json`;
    },
    category : "json"
}


Model.dropdown_multi = {
    properties: ["required","unique", "tabindex", "table", "name","concat","information"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
        table: "Module Name",
        name: "Name",
        concat : "Concat",
        information : "Additional Information"
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
        table: "user",
        name: "username",
        concat: "CONCAT(fullname, ' ',email)",
        information : ""
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        table : {
            tag : "select",
            type : ""
        },
        name : {
            tag : "select",
            type : ""
        },
        concat : {
            tag : "input",
            type : "text"
        },
        information : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj) => {
        return ``;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var length = !obj.length ? 255 : obj.length;
        var required = !obj.required ? "NULL" : "NOT NULL";
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" JSON ${required};`,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `json`;
    },
    category : "json"
}


Model.dropdown_chain = {
    properties: ["required","unique", "tabindex", "table", "name","concat","field"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
        table: "Module Name",
        name: "Name",
        concat : "Concat",
        field : "Field"
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
        table: "user",
        name: "username",
        concat: "CONCAT(fullname, ' ',email)",
        field : "role_id"
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        table : {
            tag : "select",
            type : ""
        },
        name : {
            tag : "select",
            type : ""
        },
        concat : {
            tag : "input",
            type : "text"
        },
        field : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj) => {
        return ``;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var length = !obj.length ? 255 : obj.length;
        var required = !obj.required ? "NULL" : "NOT NULL";
        //var indexing = !obj.unique ? "" : "ALTER TABLE `"+MYMODEL.table+"` ADD UNIQUE INDEX `"+MYMODEL.table+"_"+key+"_UNIQUE` (`"+key+"`)";
        //var fk = "ALTER TABLE `"+MYMODEL.table+"` ADD CONSTRAINT `"+MYMODEL.table+"_"+key+"_FK` FOREIGN KEY (`"+key+"`) REFERENCES `"+obj.table+"`(`id`) ;";
        var indexing = !obj.unique ? "" : `	ALTER TABLE "${MYMODEL.table}" ADD CONSTRAINT unique_${MYMODEL.table}_${key}  UNIQUE (${key});`
        var fk = `ALTER TABLE "${MYMODEL.table}" ADD CONSTRAINT fk_${MYMODEL.table}_${key}  FOREIGN KEY (${key}) REFERENCES ${obj.table};`
        return {
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN  "${key}" bigint ${required};`,
            index : indexing,
            foreignKey : fk
        }
    },
    columnType : (obj={}) => {
        return `bigint`;
    },
    category : "integer"
}

Model.dropdown_checkbox = {
    properties: ["required","unique", "tabindex", "array"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
        array: "Array (with comma)"
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
        array : "PHP, Javascript, Python"
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        array : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj) => {
        //dropdown_static_1=Male,2=Female
        return `multi_checkbox`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        //ALTER TABLE zuser_company ADD CONSTRAINT fk_user_company_role FOREIGN KEY (role_id) REFERENCES zrole (id);
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN "${key}" JSON ${required};`,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `json`;
    },
    category : "json"
}


Model.json = {
    properties: ["required","unique", "tabindex"],
    labels: {
        required: "Required",
        unique : "Unique",
        tabindex: "Tab Index",
    },
    defaultValues: {
        required: false,
        unique :false,
        tabindex: 1,
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        unique : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        }
    },
    comment: (obj) => {
        //dropdown_static_1=Male,2=Female
        return `multi_checkbox`;
    },
    sql: (key, MYMODEL, obj = {}) => {
        var required = !obj.required ? "NULL" : "NOT NULL";
        var defaultValue = "";
        if(!obj.defaultValue ) {
            defaultValue = ``
        } else if(obj.defaultValue == "null") {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET DEFAULT NULL;`
        } else {
            defaultValue = `ALTER TABLE "${MYMODEL.table}" ALTER COLUMN "${key}" SET  DEFAULT '${obj.defaultValue}';`
        }
        //ALTER TABLE zuser_company ADD CONSTRAINT fk_user_company_role FOREIGN KEY (role_id) REFERENCES zrole (id);
        return {
            defaultValue : defaultValue,
            column :  `ALTER TABLE "${MYMODEL.table}"  ADD COLUMN "${key}" JSON ${required};`,
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return `json`;
    },
    category : "json"
}

Model.virtual = {
    properties: ["required", "tabindex", "sql"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        sql: "SQL Query",
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        sql: "",
    },
    typies : {
        required : {
            tag : "input",
            type : "checkbox"
        },
        tabindex : {
            tag : "input",
            type : "number"
        },
        sql : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj = {}) => {
        return ``;
    },
    sql: (key, MYMODEL, obj = {}) => {
        return {
            column : "",
            index : "",
            foreignKey : ""
        }
    },
    columnType : (obj={}) => {
        return ``;
    },
    category : "virtual"
}

Model.hardcodeGrid = `var relations = await zRoute.relations(req, res, MYMODEL.table);
    var body = req.body;
    var fields = body.fields;
    var select = Util.selectMysql(fields);
    var whereArray = [];
    var columns = body.columns;
    whereArray.push({
        field: "company_id",
        option: "=",
        value : res.locals.companyId,
        operator: "AND"
    });
    columns.forEach(function (item) {
        if (item.search.value) {
            whereArray.push({
                field: fields[item.data],
                option: MYMODEL.options[fields[item.data]],
                value : item.search.value,
                operator: "AND"
            })
        }
    })
    var orderColumn = fields[body.order[0].column] == "actionColumn" ? "id" : fields[body.order[0].column] == "no" ? "id" : fields[body.order[0].column] == "actionColum" ? "id" : fields[body.order[0].column];
    var rows = await connection.results({
        select: select,
        table: MYMODEL.table,
        whereArray: whereArray,
        limit: body.length,
        offset : body.start,
        orderBy: [orderColumn, body.order[0].dir]
    })
    var count = await connection.result({
        select: "count(id) as count",
        table: MYMODEL.table,
        whereArray: whereArray

    })
    var datas = [];
    var levels = zRole.levels(MYMODEL.routeName, zRole.routes.indexOf(MYMODEL.routeName) > -1 ? await zRole.rules(res.locals.roleId) : {});
    rows.forEach(function (row, index) {
        var arr = [];
        fields.forEach(function (item) {
            if (item == "no") {
                arr.push((index + 1 + parseInt(body.start)));
            } else if (item == "actionColumn") {
                arr.push(zRoute.actionButtons(levels, row, MYMODEL.table));
            } else {
                arr.push(zRoute.dataTableData(item, row[item], MYMODEL, relations));
            }
        })
        datas.push(arr)
    });
    var data = {
        draw: body.draw,
        recordsTotal: count.count || 0,
        recordsFiltered: count.count || 0,
        data: datas
    }
    //save grid filter async
    zRoute.dataTableSave(MYMODEL.routeName, res.locals.userId, body);
    res.json(data);`;

module.exports = Model;