/**
 * Universal class Form UI HTML
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
var Form = {};

Form.buildWidget = (fieldName, name, values = {}) => {
    let html = '';
    let properties = Form[name].properties || [];
    let typies = Form[name].typies;

    if (properties.length) {
        let labels = Form[name].labels;
        properties.map((item) => {
            var value = !values[item] ? Form[name].defaultValues[item] : values[item];
            var tag = typies[item].tag;
            var type = typies[item].type;

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
                html += `<div class="form-group"><label for="${name}_${item}">${labels[item]}</label>`;
                html += `<select class="form-control" data-value="${value}" id="${name}_${item}" name="${fieldName}[${item}]"></select>`

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
                    html += `<${tag} type="${type}" class="form-control" id="${name}_${item}" name="${fieldName}[${item}]"  value="${value}" >`;


                }
            }

            html += `</div>`;

        });

    }

    return html;
}

Form.buildSQL = (table, obj) => {
    var notnullor = obj.required ? "NOT NULL" : "NULL";
    return "ALTER TABLE `" + table + "` ADD COLUMN `" + obj.name + "` " + obj.sql + " " + notnullor + " AFTER `id`; ";
}

//available form type
Form.keys = {
    text: "Short Text",
    textarea: "Long Text",
    number: "Number",
    image: "Image Upload",
    file: "File Upload",
    datepicker: "Date Picker",
    time: "Time",
    clockpicker: "Clock Picker",
    switch: "Switch",
    typeahead: "Type Ahead",
    editor: "Editor",
    select: "Select (static) ",
    relation: "Select (relation to other module)",
    table: "Table",
    dropdown_multi: "Dropdown Multi",
    dropdown_chain: "Dropdown Chain",
    multi_checkbox: "Multi Checkbox",
    virtual : "Virtual Field (readonly)"
}

Form.text = {
    properties: ["required", "tabindex", "maxlength", "length"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        maxlength: "Max Length",
        length: "Length",
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        maxlength: 255,
        length: 255,
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
        maxlength : {
            tag : "input",
            type : "number"
        },
        length : {
            tag : "input",
            type : "number"
        },

    },
    attributes: ["maxlength"],
    validations: {
        maxlength: {
            title: "Max Length"
        }
    },
    comment: (obj = {}) => {
        return ``;
    },
    sql: (obj = {}) => {
        var length = !obj.length ? 255 : obj.length;
        return `varchar(${length})`
    },
    category : "text"
}

Form.textarea = {
    properties: ["required", "tabindex", "rows"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        rows: "Rows"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        rows: 3
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
        }
    },
    attributes: ['rows'],
    comment: (obj = {}) => {
        return ``;
    },
    sql: (obj = {}) => {
        return `text`
    },
    category : "text"
}

Form.number = {
    properties: ["required", "tabindex", "min", "max"],
    attributes: ["min", "max"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        min: "Min",
        max: "Max"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        min: 0,
        max: 0
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

    },
    comment: (obj = {}) => {
        return `module_number`;
    },
    sql: (obj = {}) => {
        return `double`
    },
    category : "integer"

}

Form.image = {
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
        return `module_image`;
    },
    sql: (obj = {}) => {
        return `varchar(125)`
    },
    category : "text"
}

Form.file = {
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
        return `module_file`;
    },
    sql: (obj = {}) => {
        return `varchar(125)`
    },
    category : "text"
}

Form.datepicker = {
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
        return `module_datepicker`;
    },
    sql: (obj = {}) => {
        return `date`
    },
    category : "date"
}

Form.time = {
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
        return ``;
    },
    sql: (obj = {}) => {
        return `datetime`
    },
    category : "datetime"
}

Form.clockpicker = {
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
        return `module_clockpicker`;
    },
    sql: (obj = {}) => {
        return `varchar(10)`
    },
    category : "text"
}

Form.switch = {
    properties: ["required", "tabindex", "active", "notactive"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        active: "Active",
        notactive: "Not Active",
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        active: "Yes",
        notactive: "No",
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
        }
    },
    comment: (obj) => {
        var active = !obj.active ? "Yes" : obj.active;
        var notactive = !obj.notactive ? "No" : obj.notactive;
        return `module_switch_${notactive}_${active}`;
    },
    sql: (obj = {}) => {
        return `TINYINT(1)`
    },
    category : "integer"
}


Form.typeahead = {
    properties: ["required", "tabindex","table", "concat"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        table : "Table",
        concat: "Concat",
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        table:"user",
        concat: '"CONCAT(fullname, " (email) : ", email)"',
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
        table : {
            tag : "select",
            type : ""
        },
        concat : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj) => {
        //module_typeahead_CONCAT(name, " (code) : ", code)
        var name = !obj.name ? "id" : obj.name;
        return `module_typeahead_${name}`;
    },
    sql: (obj = {}) => {
        return `INT(11)`
    },
    category : "integer"
}

Form.editor = {
    properties: ["required", "tabindex"],
    labels: {
        required: "Required",
        tabindex: "Tab Index"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
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
    comment: (obj) => {
        return 'module_editor';
    },
    sql: (obj = {}) => {
        return `TEXT`
    },
    category : "text"
}

Form.select = {
    properties: ["required", "tabindex", "select"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        select: "Select",
        value: "Value",
        name: "Label"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        value: 1,
        name: "Name",
        select : [{value:1,label:"Please Select"}]
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
        select : {
            tag : "array",
            type : ""
        }
    },
    comment: (obj) => {
        //dropdown_static_1=Male,2=Female
        return `dropdown_static_1=Male,2=Female`;
    },
    sql: (obj = {}) => {
        return `TINYINT(2)`
    },
    category : "integer"
}

Form.relation = {
    properties: ["required", "tabindex", "table", "name"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        table: "Module Name",
        name: "Name"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        table: "user",
        name: "username"
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
        table : {
            tag : "select",
            type : ""
        },
        name : {
            tag : "select",
            type : ""
        }
    },
    comment: (obj) => {
        return ``;
    },
    sql: (obj = {}) => {
        return `INT(11)`
    },
    category : "integer"
}


Form.table = {
    properties: ["required", "tabindex", "table"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        table: "Module Name"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        table: "user",
        name: "username"
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
        table : {
            tag : "select",
            type : ""
        }
    },
    comment: (obj) => {
        return `dropdown_table`;
    },
    sql: (obj = {}) => {
        return `text`
    },
    category : "text"
}

Form.dropdown_multi = {
    properties: ["required", "tabindex", "table", "name"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        table: "Module Name",
        name: "Name"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        table: "user",
        name: "username"
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
        table : {
            tag : "select",
            type : ""
        },
        name : {
            tag : "select",
            type : ""
        }
    },
    comment: (obj) => {
        return ``;
    },
    sql: (obj = {}) => {
        return `INT(11)`
    },
    category : "integer"
}

Form.multi_checkbox = {
    properties: ["required", "tabindex", "array"],
    labels: {
        required: "Required",
        tabindex: "Tab Index",
        array: "Array (with comma)"
    },
    defaultValues: {
        required: false,
        tabindex: 1,
        array : "PHP, Javascript, Python"
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
        array : {
            tag : "input",
            type : "text"
        }
    },
    comment: (obj) => {
        //dropdown_static_1=Male,2=Female
        return `multi_checkbox`;
    },
    sql: (obj = {}) => {
        return `json`
    },
    category : "json"
}



Form.virtual = {
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
    sql: (obj = {}) => {
        return ``
    }
}

module.exports = Form;