/**
 * Universal class Form UI HTML
 * Created by sintret dev on 8/23/2021.
 */

var Util = require("./Util");
var addProperties = (obj, defaultObj = {}) => {
    var html = '';
    for (var key in obj) {
        var value = defaultObj.hasOwnProperty(key) ? defaultObj[key] + obj[key] : obj[key];
        html += ` ${key}="${obj[key]}" `;
    }

    return html;
}

var Form = {};

Form.options = {
    button: {
        id: "form-submit",
        type: "button",
        class: "btn btn-block btn-lg btn-success",
        label: `<span class="fa fa-paper-plane"></span> Submit`
    },
    field: {}
}


Form.label = (field, label, required, htmlOptions = "") => {
    required = required || false;
    var mark = required ? "*" : "";

    return `<label for="${field}">${label} ${mark} ${htmlOptions}</label>`;
}

Form.textarea = (obj) => {
    obj.type = "textarea";
    return Form.field(obj);
}

Form.input = (obj) => {
    obj.type = "input";
    return Form.field(obj);
}


Form.addProperty = (property, options = []) => {
    ///We expect options to be a non-empty Array
    if (!options.length) return;
    var optionsString = options.join(" ");
    return ` ${property}="${optionsString}" `;
}

Form.field = (obj) => {
    //options and default options
    var options = obj.options || {};
    var htmlOptions = '';
    for (var key in options) {
        var val = options[key];
        val = Util.replaceAll(val, '"', "");
        if (obj.hasOwnProperty(key)) {
            obj[key] = options[key];
        } else {
            htmlOptions += ` ${key}=${val} `;
        }
    }

    var type = obj.type || "text",
        id = Form.addProperty("id", [obj.id]),
        name = obj.name ? ` name="${obj.name}" ` : "",
        title = obj.title || "",
        prepend = obj.prepend || "",
        append = obj.append || "",
        placeholder = Form.addProperty("placeholder", [obj.placeholder]),
        tabindex = Form.addProperty("tabindex", [obj.tabindex]),
        value = obj.value || "",
        classview = obj.class ? ` class="form-control  ${obj.class}" ` : ` class="form-control " `,
        disabled = obj.disable ? ` disabled="disabled" ` : '',
        data = obj.data,
        required = obj.required == true ? ` required ` : '',
        table = !obj.table ? "" : obj.table,
        frameworkcss = !obj.frameworkcss ? "bootstrap3" : obj.frameworkcss,
        form_css = !obj.form_css ? "bootstrap" : obj.form_css,
        style = !obj.style ? "" : ` style=${obj.style} `,
        information = !obj.information ? "" : `<div id="information-${obj.id}" class="form-text">${obj.information}</div>`
        ;

    var attributeDate = "";
    if(obj.hasOwnProperty.attributeData) {
        for(var key in obj.attributeData) {
            attributeDate += ` data-${key}="${obj.attributeData[key]}" `;
        }
    }

    var displayForm = '';
    switch (type) {
        case "text" :
            displayForm = `${prepend}<input autocomplete="off" autofocus=""  ${tabindex}  type="${type}" ${classview}  ${id} ${name} ${placeholder}  ${style}    ${required} value="${value}" data-t="${value}"  ${htmlOptions}>${information}${append}`;
            break;

        case "hidden" :
            displayForm = `${prepend}<input autocomplete="off" autofocus=""  ${tabindex}  type="${type}"  ${style}  ${classview}  ${id} ${name} ${placeholder}   ${required} value="${value}" data-t="${value}"  ${htmlOptions}>${append}`;
            break;

        case "textarea" :
            displayForm = `${prepend}<textarea ${tabindex} ${classview} ${id} ${name} ${placeholder}  ${style}  ${htmlOptions}  rows="4">${value}</textarea>${information}${append}`;
            break;

        case "image" :
            var boxyclass = value ? "boxy" : "";
            displayForm = `${prepend}<input ${tabindex} type="file" accept="image/*" onchange="loadFile(this,'${obj.id}' )"  class="form-control ${obj.class || ''}" ${id} ${name} ${placeholder}  value="${value}" ${htmlOptions}>
					<div  id="body${obj.id}" class="isfile"  data-id="${obj.id}" data-name="${obj.title}" data-filename="${value}" data-required="${obj.required}"> <img class="mb-3" id="file${obj.id}" /> ${value}</div>${append}`;
            break;

        case "file" :
            var boxyclass = value ? "boxy" : "";
            displayForm = `${prepend}<input ${tabindex} type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf" onchange="loadFile(this,'${obj.id}' )"  class="form-control ${obj.class || ''}"  ${id} ${name} ${placeholder} value="${value}" ${htmlOptions}>
					<div  id="body${obj.id}" class="isfile"  data-id="${obj.id}" data-name="${obj.title}"  data-filename="${value}" data-required="${obj.required}"> <img class="mb-3" id="file${obj.id}" /> ${value}</div>${information}${append}`;
            break;

        case "email" :
            displayForm = `${prepend}<input autocomplete="off" autofocus=""  ${tabindex}  ${style}  type="email" ${classview}  ${id} ${name} ${placeholder}   ${required} value="${value}"  ${htmlOptions}>${information}${append}`;
            break;

        case "number" :
            displayForm = `${prepend}<input autocomplete="off" autofocus=""  ${tabindex}  ${style}  type="text" class="form-control mb-3 number ${obj.class}" ${id} ${name} ${placeholder}   ${required} value="${value}"  ${htmlOptions}>${information}${append}`;
            break;

        case "integer" :
            displayForm = `${prepend}<input autocomplete="off" autofocus=""  ${tabindex}  ${style}  type="text" class="form-control mb-3  ${obj.class}" ${id} ${name} ${placeholder}   ${required} value="${value}"  ${htmlOptions}>${information}${append}`;
            break;

        case "datepicker" :
            displayForm = `${prepend}<input autocomplete="off" autofocus=""  ${tabindex}  ${style}  type="text"  class="form-control mb-3 datepicker ${obj.class}"  ${id} ${name} ${placeholder}   ${required} value="${value}" data-t="${value}"  ${htmlOptions}>${information}${append}`;
            break;


        case "datetimepicker" :
            displayForm = `${prepend}<input autocomplete="off" autofocus=""  ${tabindex}  type="text"  ${style}  class="form-control mb-3 datetimepicker ${obj.class}"  ${id} ${name} ${placeholder}   ${required} value="${value}" data-t="${value}"  ${htmlOptions}>${information}${append}`;
            break;


        case "password" :
            displayForm = `${prepend}<input autocomplete="off" autofocus=""  ${tabindex}  ${style}  type="password" ${classview}  ${id} ${name} ${placeholder}   ${required} value="${value}"  ${htmlOptions}>${information}${append}`;
            break;

        case "switch" :
            var checked = value == 1 ? " checked " : "";
            displayForm = `${prepend}<p><input  ${tabindex}  type="checkbox" ${classview}  ${style}   ${id} ${name} ${checked} ></p>${information}${append}`;
            break;

        case "checkbox" :
            var checked = value == 1 ? " checked " : "";
            displayForm = `${prepend}<input  ${tabindex}  type="${type}" ${classview}   ${style}  ${id} ${name} ${checked} >${information}${append}`;
            break;

        case "dropdown_checkbox" :
            var checkboxes = "";
            var val = [];
            if (typeof  value == "object") {
                val = value;
            } else if (typeof value == "string") {
                if (value) {
                    val = JSON.parse(value);
                }
            }
            data.forEach(function (item) {
                var checked = Util.in_array(item, val) ? " checked " : "";
                checkboxes += `<div class="checkbox">
							<label class="form-check">
								<input type="checkbox" name="${obj.name}[${item}]" ${checked} value="${item}">
								${item}
							</label>
						</div>`;
            });
            displayForm = `${prepend}<div class="input-group">${checkboxes}</div>${information}${append}`;
            break;

        case "select" :
            var selects = '';
            if (Array.isArray(data)) {
                // for array item.value and item.text
                // proptery is value and text
                data.map((item) => {
                    var selected = item.id == value ? ' selected ' : '';
                    selects += `<option value="${item.id}" ${selected}>${item.name}</option>`;
                });

            } else {
                for (var keys in data) {
                    var selected = keys == value ? ' selected ' : '';
                    selects += `<option value="${keys}" ${selected}>${data[keys]}</option>`;
                }
            }

            if (form_css == "material_design") {
                classview = Form.addProperty("class", ["selectpicker", obj.class]);
            }

            displayForm = `${prepend}<select ${tabindex}  ${style}  class="form-control form-select ${obj.class}"  ${id} ${name} ${placeholder} ${required} ${htmlOptions} >${selects}</select>${information}${append}`;
            break;

        case "select_user" :
            var selects = '';
            data.map((item) => {
                var selected = item.value == value ? ' selected ' : '';
                selects += `<option value="${item.id}" ${selected}>${item.fullname}</option>`;
            });

            if (form_css == "material_design") {
                classview = Form.addProperty("class", ["selectpicker", obj.class]);
            }

            displayForm = `${prepend}<select ${tabindex} class="form-control form-select  ${obj.class}"  ${id} ${name} ${placeholder} ${required} ${htmlOptions} >${selects}</select>${information}${append}`;
            break;

        case "chain" :
            var selects = '';
            // for array item.value and item.text
            // proptery is value and text
            data.map((item) => {
                var selected = item.id == value ? ' selected ' : '';
                selects += `<option value="${item.id}" ${selected}>${item.name}</option>`;
            });


            if (form_css == "material_design") {
                classview = Form.addProperty("class", ["selectpicker", obj.class]);
            }

            displayForm = `${prepend}<select ${tabindex} class="form-control form-select  ${obj.class}"  ${id} ${name} ${placeholder} ${required} ${htmlOptions} >${selects}</select>${information}${append}`;
            break;


        case "multi" :
            var selects = "";
            if (data) {
                data.map((item) => {
                    var selected = value == item.id ? " selected " : "";
                    selects += `<option value="${item.id}"  ${selected} >${item.name}</option>`;
                });
            }

            var spanmulti = '';
            if (value) {
                var arr = [];
                arr = typeof value == "string" ? JSON.parse(value) : value;
                if(Array.isArray(arr)) {
                    arr.forEach(function (item, index) {
                        spanmulti += `<span class='span${obj.id}'>${index + 1}. <input type='hidden' name='${obj.name}[]' value='${item}' />${obj.multi[item]}<i class='fa fa-trash pointer text-danger pull-right' onclick='$(this).closest("span").remove();'  title='${LANGUAGE['delete']}'></i><br></span>`;
                    });
                }

            }
            if (form_css == "material_design") {
                classview = Form.addProperty("class", ["selectpicker", obj.class]);
            }

            var g = `<div class="input-group ">
            <span class="input-group-text" id="dropdownadd${id}" class="dropdownadd" data-id="${id}" style="cursor: pointer" title="Add Data">+</span>
            </div>
            <div id="dropdownbox${id}" class="boxy">
            <span class="span${id}">
            </span>
            </div>`
            return `<div class="input-group">
					<select ${tabindex} class="form-control"  ${id}  ${placeholder} ${required} ${htmlOptions} >${selects}</select>
					<span id="dropdownadd${obj.id}" class="input-group-text dropdownadd" data-id="${obj.id}" style="cursor: pointer;" title=" ${LANGUAGE["form_add_data"]} ">+</span>
				</div>
				<div id="dropdownbox${obj.id}" class="boxy mb-3">${spanmulti}</div>`;
            break;

        case "typeahead" :
            displayForm = `${prepend}<div class="input-group">
                <input  ${tabindex}  type="text" class="form-control"  id="${obj.id}Typeahead"  autocomplete="off" data-provide="typeahead" id="${obj.id}Typeahead"   placeholder="Please type a word"  value="${obj.typeaheadvalue}" >
				<input type="hidden" ${id} ${name} ${placeholder} ${classview} ${required}  value="${value}">
					<span id="${obj.id}Clear" class="input-group-addon input-group-text dropdownadd" title="Clear"  style="cursor: pointer;" title=" Add Data "><i class="fa fa-ban"></i></span>
				</div>${information}${append}`;
            break;

        case "table" :
            var html = '';
            for (var key in obj.data) {
                html += `<th>${obj.data[key]}</th>`;
            }
            var btnAdd = '';
            if (!obj.isAddButton) {
                btnAdd = `<th><button type="button" class="btn" title="Add" id="add${obj.id}"><i class="fa fa-plus"></i></button></th>`;
            }
            obj.btnAdd = btnAdd;
            obj.html = html;
            obj.title = title;;
            obj.table = table;
            obj.value = value;
            var datavalue = "";
            if(obj.value) {
                datavalue = JSON.stringify(obj.value);
                datavalue = Util.replaceAll(datavalue,"'","");
            }

            obj.prepend = prepend;
            obj.body = `<div class="table-responsive">
                        <table id="table${obj.id}" class="table table-hover table-sm">
                            <thead>
                                <tr>
                                    ${html}
                                    ${obj.btnAdd}
                                </tr>
                            </thead>
                            <tbody id="body-${obj.id}"  data-value='${datavalue}'>${obj.table}</tbody>
                        </table></div>`;

            displayForm = Form.card(frameworkcss, obj);
            break;

        case "multi_line_editor" :
            value = obj.value ? obj.value : {};
            var description = obj.description || "";
            for(var key in obj.fields) {
                var val = !value[key] ? obj.fields[key] : value[key];
                description = Util.replaceAll(description,`[[[${key}]]]`,`<span  class="text-danger text-toggle"  id="a_${key}" data-id="${key}" style="text-decoration: underline; cursor: pointer">${val}</span> <input type="hidden"  name="${obj.name}[${key}]" class="editor-value" id="${key}" data-id="${key}" value="${val}" >`);
            }
            displayForm = `${prepend}<div class="boxy">${description}</div>${information}${append}`;
            break;

        case "ide_editor" :
            displayForm = `<div class="ide_editor" id="editor_${obj.id}"></div>`
            displayForm += `<textarea hidden  ${classview} ${id} ${name} ${placeholder}  ${style}  ${htmlOptions}  rows="4">${value}</textarea>${information}${append}`;
            break;

        case "json" :
            displayForm += `<textarea   ${classview} ${id} ${name} ${placeholder}  ${style}  ${htmlOptions}  rows="4">${JSON.stringify(obj.value)}</textarea>${information}${append}`;
            break;

        default :
            displayForm = `${prepend}<input autocomplete="nope" autofocus=""  ${tabindex}  type="${type}" ${classview}  ${id} ${name} ${placeholder}   ${required} value="${value}" data-t="${value}"  ${htmlOptions}>${information}${append}`;
            break;

    }

    return displayForm;
}


Form.group = (name, label, field)=> {
    return `<div class="form-group div${name} mb-3">${label}${field}</div>`;
}

Form.button = (optionsExtends = {})=> {
    var options = Form.options.button;
    var htmlOptions = "";
    for (var key in optionsExtends) {
        var val = optionsExtends[key];
        val = Util.replaceAll(val, '"', "");
        if (options.hasOwnProperty(key)) {
            options[key] = optionsExtends[key]
        } else {
            htmlOptions += ` ${key}=${val} `;
        }
    }

    return `<button id="${options.id}" type="${options.type}" class="${options.class}" ${htmlOptions}>${options.label}</button>`;
}


Form.buttonGroup = (buttons = []) => {
    var html = `<div class="btn-group" role="group" aria-label="...">`;
    html += buttons.join(" ");
    html += `</div>`;
    return html;
}

Form.submit = (optionsExtends = {}) => {
    var options = {
        id: "form-submit",
        type: "submit",
        class: "btn btn-block btn-lg btn-success",
        label: `<span class="fa fa-paper-plane"></span> ${LANGUAGE['submit']}`
    };
    var settings = {...options, ...optionsExtends}
    return Form.button(settings);
}


Form.pullRight = (frameworkcss) => {
    if (frameworkcss == "bootstrap3") {
        return "pull-right";
    } else if (frameworkcss == "bootstrap4") {
        return "float-right";
    } else {
        return "float-end"
    }
}

Form.breadcrumb = (type, arr) => {
    var html = "";

    switch (type) {
        case "bootstrap3" :
            html = `<nav class="breadcrumb pull-right boxy-small">`;
            arr.map((item) => {
                if (item.active == true) {
                    html += `<span class="breadcrumb-item active">${item.text}</span>`;
                } else {
                    html += `<a class="breadcrumb-item" href="${item.href}">${item.text}</a> /`;
                }
            });
            html += `</nav>`;
            break;

        case "bootstrap4" :
            html = `<nav aria-label="breadcrumb" class="float-right"><ol class="breadcrumb">`;
            arr.map((item) => {
                if (item.active == true) {
                    html += `<li class="breadcrumb-item active" aria-current="page">${item.text}</li>`;
                } else {
                    html += `<li class="breadcrumb-item"><a href="${item.href}">${item.text}</a></li>`;
                }
            });
            html += `</nav>`;
            break;

        case "bootstrap5" :
            html += `<nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb"><ol class="breadcrumb float-end">`;
            arr.map((item) => {
                if (item.active == true) {
                    html += `<li class="breadcrumb-item active" aria-current="page">${item.text}</li>`;
                } else {
                    html += `<li class="breadcrumb-item"><a href="${item.href}">${item.text}</a></li>`;
                }
            });
            html += `</ol></nav>`;
            break;

        default :
            html += `<nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb"><ol class="breadcrumb float-end">`;
            arr.map((item) => {
                if (item.active == true) {
                    html += `<li class="breadcrumb-item active" aria-current="page">${item.text}</li>`;
                } else {
                    html += `<li class="breadcrumb-item"><a href="${item.href}">${item.text}</a></li>`;
                }
            });
            html += `</ol></nav>`;
    }
    return html;
}


Form.grid = (type, obj)=> {
    if (type == "bootstrap3") {
        return gridBootstrap3(obj);
    } else if (type == "bootstrap4") {
        return gridBootstrap4(obj);
    } else {
        return gridBootstrap5(obj);
    }
}

/*
 tab property
 label,active,content,headerOptions
 */
Form.tab = (type, obj) => {
    if (type == "bootstrap3") {
        return tabBootstrap3(obj);
    } else if (type == "bootstrap4") {
        return tabBootstrap4(obj);
    } else {
        return tabBootstrap5(obj);
    }
}


Form.card = (type, obj) => {
    if (type == "bootstrap3")
        return card3(obj)
    else return card45(obj);
}


//card 3 using panel
var card3 = (obj) => {
    var html = obj.prepend;
    var headerOptions = obj.headerOptions ? addProperties(obj.headerOptions, {class: "panel panel-default"}) : addProperties({class: "panel panel-default"});
    var title = obj.title = `<div class="panel-heading">${obj.title}</div>`;
    var img = obj.img ? `<img ${addProperties(obj.img)} >` : "";
    var footer = obj.footer = obj.footer ? `<div class="panel-footer">${obj.footer}</div>` : ``;
    var append = !obj.append ? "" : obj.append;

    html += `<div ${headerOptions}>
                    ${title}
                    <div class="panel-body">
                        ${img}
                        ${obj.body}
                    </div>
                    ${footer}
                 </div>`;

    html += append;

    return html;
}

//card 4 & 5 bootstrap
var card45 = (obj) => {
    var html = obj.prepend;
    var objHeader = obj.headerOptions || {}
    var headerOptions = obj.headerOptions ? addProperties(obj.headerOptions, {class: "card"}) : addProperties({class: "card"});
    var img = obj.img ? `<img ${addProperties(obj.img)} >` : "";
    var title = `<div class="card-header"><h5 class="card-title">${obj.title}</h5></div>`;
    var footer = obj.footer = obj.footer ? `<div class="card-footer">${obj.footer}</div>` : ``;
    var append = !obj.append ? "" : obj.append;
    html += `<div ${headerOptions}>
  ${img}
      ${title}
  <div class="card-body">
    ${obj.body}
  </div>
  ${footer}
</div>`;

    html += append;

    return html;
}

var cardBootstrap3 = (obj) => {
    var html = obj.prepend;
    html += ``;
    return `<div class="form-group div${obj.id}">
                <div class="panel panel-default">
                    <div class="panel-heading">${obj.title}</div>
                    <div class="panel-body">
                        <table id="table${obj.id}" class="table">
                            <thead>
                                <tr>
                                    ${obj.html}
                                    ${obj.btnAdd}
                                </tr>
                            </thead>
                            <tbody id="body-${obj.id}"  data-value='${obj.value}'>${obj.table}</tbody>
                        </table>
                    </div>
                 </div>
            </div>`;
}


var cardBootstrap4 = (obj) => {
    return `${obj.prepend}<div class="card div${obj.id}">
                <div class="card-body">
                    <div class="card-header">${obj.title}</div>
                    <div class="table-responsive">
                        <table id="table${obj.id}" class="table">
                            <thead>
                                <tr>
                                    ${obj.html}
                                    ${obj.btnAdd}
                                </tr>
                            </thead>
                            <tbody id="body-${obj.id}"  data-value='${obj.value}'>${obj.table}</tbody>
                        </table>
                    </div>
                 </div>
            </div>`;
}


var cardBootstrap5 = (obj) => {
    return `${obj.prepend}<div class="card div${obj.id}">
               <div class="card-content">
                <div class="card-body">
                    <div class="card-title">${obj.title}</div>
                    <div class="table-responsive">
                        <table id="table${obj.id}" class="table">
                            <thead>
                                <tr>
                                    ${obj.html}
                                    ${obj.btnAdd}
                                </tr>
                            </thead>
                            <tbody id="body-${obj.id}"  data-value='${obj.value}'>${obj.table}</tbody>
                        </table>
                    </div>
                 </div>
                </div>
            </div>`;
}


var gridBootstrap3 = (obj) => {
    var levels = obj.levels;
    var routeName = obj.routeName;
    var advanceSearch = !obj.advanceSearch ? "" : `<div style="padding-top: 7px;"><a href="#" class="open_advancesearch"> Advance Search</a></div> ${obj.advanceSearch}`;
    var createBtn = "", exportBtn = "", importBtn = "", superBtn = '', exportBtnGroup = "";
    if (levels.create) {
        createBtn = `<button type="button" id="create_btn" class="btn btn-success"  title="${obj.LANGUAGE['data_add']}"><i class="fa fa-plus white-icon"></i></button>`;
    }
    if (levels.export) {
        exportBtn = `<button type="button" id="backupExcel" class="btn btn-info" title="${obj.LANGUAGE['download_excel']}"><i class="fas fa-file-excel"></i></button>`;

        exportBtnGroup = `<div class="btn-group">
                            <button id="w9" class="btn btn-default dropdown-toggle" title="Export" data-toggle="dropdown" aria-expanded="false"><i class="glyphicon glyphicon-export"></i>
                                <span class="caret"></span>
                            </button>
                        <ul id="exportscolumn" class="dropdown-menu dropdown-menu-right">
                            <li role="presentation" class="dropdown-header">${obj.LANGUAGE['grid_export_data']}</li>
                            <li title="Microsoft Excel All"><a class="export-xls" href="#"><i class="text-success fa fa-file-excel-o"></i> Excel</a></li>
                            <li title="Portable Document Format"><a class="export-pdf" href="#"><i class="text-danger fa fa-file-pdf-o"></i> PDF</a></li>
                        </ul>
                    </div>`;
    }
    if (levels.import) {
        importBtn = `<a type="button" id="importExcel" href="/${obj.routeName}/import" class="btn btn-warning" title="${obj.LANGUAGE['data_import']}"><i class="fas fa-file-import"></i></a>`;
    }

    var dataselect = [];
    obj.paginationApp.map((item) => {
        dataselect.push({value: item, text: item})
    })
    var selectPage = Form.field({
        type: "select",
        id: "pageSize",
        data: dataselect,
        value: obj.gridFilters.pageSize
    });


    var toolbarDefault = `<div class="pull-right"><div class="btn-toolbar kv-grid-toolbar" role="toolbar">
                    <div class="btn-group">
                        ${createBtn}
                        ${exportBtn}
                        ${importBtn}

                        <button type="button" class="btn btn-default" title="${obj.LANGUAGE['grid_personalize_labeling']}" data-toggle="modal" data-target="#grid-labels">
                            <i class="fa fa-font"></i>
                        </button>

                        <button type="button" class="btn btn-default" title="${obj.LANGUAGE['grid_personalize_setting']}" data-toggle="modal" data-target="#grid-modal">
                            <i class="fa fa-cog"></i>
                        </button>

                        <a id="reloadgrid" class="btn btn-default" title="${obj.LANGUAGE['grid_refresh']}"><i class="fas fa-redo"></i></a>

                    </div>
                    <div class="btn-group">
                        ${selectPage}
                    </div>


                    ${exportBtnGroup}
                </div></div>`;
    var toolbar = obj.toolbar ? obj.toolbar : toolbarDefault;

    var html = '';
    html += `<div class="panel panel-info boxy">
        <div class="panel-heading">
            <div class="pull-right">
                <div class="summary"></div>
            </div>
            <h3 class="panel-title"><i class="fa fa-book"></i> ${obj.header}
            </h3>
            <div class="clearfix"></div>
        </div>
        <div class="kv-panel-before">
            ${toolbar}
            ${advanceSearch}
            
            <div class="clearfix"></div>
        </div>
        <div id="jsGrid" class="table-responsive "></div>
    </div>`;
    //}

    return html;
}


var gridBootstrap4 = (obj) => {
    var levels = obj.levels;
    var routeName = obj.routeName;
    var advanceSearch = !obj.advanceSearch ? "" : obj.advanceSearch;
    var createBtn = "", exportBtn = "", importBtn = "", superBtn = '', exportBtnGroup = "", selectPagesize = "";
    if (levels.create) {
        createBtn = `<button type="button" id="create_btn"  class="btn btn-success btn-xs"><i class="fa fa-plus white-icon"></i></button>`;
    }
    if (levels.export) {
        exportBtn = `<button type="button" id="backupExcel" class="btn btn-info btn-xs" title="${obj.LANGUAGE['download_excel']}"><i class="fas fa-file-excel"></i></button>`;

        exportBtnGroup = `<div class="btn-group" role="group">
                        <button id="dropdownExport" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            ${obj.LANGUAGE['grid_export_data']}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownExport">
                            <a class="dropdown-item export-xls" href="#"><i class="text-success fa fa-file-excel-o"></i> Excel </a>
                            <a class="dropdown-item export-pdf" href="#"><i  class="text-danger fa fa-file-pdf-o"></i> PDF </a>
                        </div>
                    </div>`;
    }
    if (levels.import) {
        importBtn = `<button type="button" id="importExcel" class="btn btn-warning btn-xs"  title="<%- LANGUAGE['data_import'] %>"><i class="fas fa-file-import"></i></button>`;
    }

    selectPagesize = `<div class="dropdown-menu" aria-labelledby="dropdownPagination">`;

    var pageSize = obj.gridFilters.pageSize || 20;

    for (var i = 0; i < obj.paginationApp.length; i++) {
        var actived = pageSize == obj.paginationApp[i] ? " active " : "";
        selectPagesize += `<a data-value="${obj.paginationApp[i]}" class="dropdown-item pageSizeGrid ${actived}" id="pagination${obj.paginationApp[i]}" href="#"  >${obj.paginationApp[i]}</a>`;
    }
    selectPagesize += `</div>`;

    var toolbarDefault = `<div class="float-right"><div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                    ${createBtn}
                    ${exportBtn}
                    ${importBtn}
                    <button type="button" class="btn btn-default btn-xs" title="<%- LANGUAGE['grid_personalize_labeling'] %>" data-toggle="modal" data-target="#grid-labels"><i class="fa fa-font"></i></button>
                    <button type="button" class="btn btn-info btn-xs" title="<%- LANGUAGE['grid_personalize_setting'] %>" data-toggle="modal" data-target="#grid-modal"><i class="fa fa-cog"></i></button>
                    <button type="button" id="reloadgrid" class="btn btn-default btn-xs" title="<%- LANGUAGE['grid_refresh'] %>"><i class="fas fa-redo"></i></button>
                    <div class="btn-group" role="group">
                        <button id="dropdownPagination" type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Pagination ${pageSize}
                        </button>
                        ${selectPagesize}
                    </div>
                    
                    <div class="btn-group" role="group">
                        <button id="dropdownExport" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            ${obj.LANGUAGE['grid_export_data']}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownExport">
                            <a class="dropdown-item export-xls" href="#"><i class="text-success fa fa-file-excel-o"></i> Excel </a>
                            <a class="dropdown-item export-pdf" href="#"><i  class="text-danger fa fa-file-pdf-o"></i> PDF </a>
                        </div>
                    </div>

                </div></div>`;
    var toolbar = obj.toolbar ? obj.toolbar : toolbarDefault;

    var html = '';
    html += `<div class="card">
        <div class="card-body">
            <div class="float-right">
                <div class="summary"></div>
            </div>
            <div class="card-title"><i class="fa fa-book"></i> ${obj.header}</div>
                ${toolbar}
                            <div style="padding-top: 7px;"><a href="#" class="open_advancesearch"> Advance Search</a></div>
            ${advanceSearch}
            <input type="hidden" id="pageSize" value="${pageSize}">
            <div class="table-responsive pt-3">
                    <div id="jsGrid" class="table-responsive"></div>
            </div>


        </div>
    </div>`;
    return html;
}


var gridBootstrap5 = (obj) => {
    var levels = obj.levels;
    var routeName = obj.routeName;
    var advanceSearch = !obj.advanceSearch ? "" : obj.advanceSearch;
    var createBtn = "", exportBtn = "", importBtn = "", superBtn = '', exportBtnGroup = "", selectPagesize = "";
    if (levels.create) {
        createBtn = `<button type="button" id="create_btn"  class="btn btn-success btn-xs"><i class="fa fa-plus white-icon"></i></button>`;
    }
    if (levels.export) {
        exportBtn = `<button type="button" id="backupExcel" class="btn btn-info btn-xs" title="${obj.LANGUAGE['download_excel']}"><i class="fas fa-file-excel"></i></button>`;

        exportBtnGroup = `<div class="btn-group" role="group">
                        <button id="dropdownExport" type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            ${obj.LANGUAGE['grid_export_data']}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownExport">
                            <a class="dropdown-item export-xls" href="#"><i class="text-success fa fa-file-excel-o"></i> Excel </a>
                            <a class="dropdown-item export-pdf" href="#"><i  class="text-danger fa fa-file-pdf-o"></i> PDF </a>
                        </div>
                    </div>`;
    }
    if (levels.import) {
        importBtn = `<button type="button" id="importExcel" class="btn btn-warning btn-xs"  title="<%- LANGUAGE['data_import'] %>"><i class="fas fa-file-import"></i></button>`;
    }
    selectPagesize = `<div class="dropdown-menu" aria-labelledby="dropdownPagination">`;


    var pageSize = obj.gridFilters.pageSize || 20;

    for (var i = 0; i < obj.paginationApp.length; i++) {
        var actived = pageSize == obj.paginationApp[i] ? " active " : "";
        selectPagesize += `<a data-value="${obj.paginationApp[i]}" class="dropdown-item pageSizeGrid ${actived}" id="pagination${obj.paginationApp[i]}" href="#"  >${obj.paginationApp[i]}</a>`;
    }
    selectPagesize += `</div>`;


    var toolbarDefault = `<div class="float">
<div class="btn-group float-end" role="group" aria-label="Button group with nested dropdown">
                    ${createBtn}
                    ${exportBtn}
                    ${importBtn}
                    <button type="button" class="btn btn-secondary btn-xs" title="${LANGUAGE['grid_personalize_labeling']}" data-bs-toggle="modal" data-bs-target="#grid-labels" ><i class="fa fa-font"></i></button>
                    <button type="button" class="btn btn-info btn-xs" title="${LANGUAGE['grid_personalize_setting']}" data-bs-toggle="modal" data-bs-target="#grid-modal"><i class="fa fa-cog"></i></button>
                    <button type="button" id="reloadgrid" class="btn btn-default btn-xs" title="${LANGUAGE['grid_refresh']}"><i class="fas fa-redo"></i></button>
                    <div class="btn-group" role="group">
                        <button id="dropdownPagination" type="button" class="btn btn-info dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Pagination ${pageSize}
                        </button>
                        ${selectPagesize}
                    </div>
                    
                    <div class="btn-group" role="group">
                        <button id="dropdownExport" type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            ${obj.LANGUAGE['grid_export_data']}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownExport">
                            <a class="dropdown-item export-xls" href="#"><i class="text-success fa fa-file-excel-o"></i> Excel </a>
                            <a class="dropdown-item export-pdf" href="#"><i  class="text-danger fa fa-file-pdf-o"></i> PDF </a>
                        </div>
                    </div>

                </div></div>`;
    var toolbar = obj.toolbar ? obj.toolbar : toolbarDefault;
    var html = '';
    html += `<div class="card">
        <div class="card-body">
            <div class="float-end">
                <div class="summary"></div>
            </div>
            <div class="card-title"><i class="fa fa-book"></i> ${obj.header}</div>
            <div class="row">
               ${toolbar}
                           <div style="padding-top: 7px;"><a href="#" class="open_advancesearch"> Advance Search</a></div>
            ${advanceSearch}
            </div>
            
            <input type="hidden" id="pageSize" value="${pageSize}">
            <div class="table-responsive pt-3 row">
                    <div id="jsGrid" class="table-responsive"></div>
            </div>


        </div>
    </div>`;
    return html;
}


var tabBootstrap4 = (arr = []) => {
    var html = "";
    html += `<ul class="nav nav-tabs" role="tablist">${Util.newLine}`;
    arr.forEach(function (item, index) {
        var active = "", selected = "false";
        if (item.active) {
            active = " active ";
            selected = "true";
        }
        html += `${Util.tab}<li class="nav-item"><a class="nav-link ${active}" data-toggle="tab" href="#arr${index}" role="tab" aria-controls="arrtab${index}" aria-selected="${selected}">${item.label}</a></li>${Util.newLine}`;
    });
    html += `</ul>`;


    return {
        html: html,
        class: "tab-pane fade",
        active: "show active"
    };
}


var tabBootstrap3 = (arr = []) => {
    var html = "";
    html += `<ul class="nav nav-tabs" role="tablist">${Util.newLine}`;
    arr.forEach(function (item, index) {
        var active = "", selected = "false";
        if (item.active) {
            active = " active ";
            selected = "true";
        }
        html += `${Util.tab}<li class="nav-item"><a class="nav-link ${active}" data-toggle="tab" href="#arr${index}" role="tab" aria-controls="arrtab${index}" aria-selected="${selected}">${item.label}</a></li>${Util.newLine}`;
    });
    html += `</ul>`;


    return {
        html: html,
        class: "tab-pane",
        active: "active"
    };
}


var tabBootstrap5 = (arr = []) => {
    var html = "";
    html += `<ul class="nav nav-tabs" id="myTab" role="tablist">${Util.newLine}`;
    arr.forEach(function (item, index) {
        var active = "", selected = "false";
        if (item.active) {
            active = "active";
            selected = "true";
        }
        html += `${Util.tab}
                <li class="nav-item" role="presentation" >
                <button class="nav-link ${active}" id="tab${index}" data-bs-toggle="tab" data-bs-target="#arr${index}" type="button" role="tab" aria-controls="arrtab${index}" aria-selected="true">${item.label}</button>
                </li>${Util.newLine}`;
    });
    html += `</ul>`;


    return {
        html: html,
        class: "tab-pane fade",
        active: "show active"
    };
}

module.exports = Form;