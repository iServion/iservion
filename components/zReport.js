/**
 * Created by ANDHIE on 2/8/2022.
 */
const Util = require('./Util')
var connection = require('./../config/connection');
const CONFIG = require('./../config/config')
const axios = require('axios');
const fs = require('fs-extra');
var io = require('./io');
const nodemailer = require('nodemailer');
var qs = require('qs');
var moment = require('moment');
var XLSX = require('xlsx');
var Excel = require('exceljs');
var debug = require("./debug");
var zRoute = require("./zRoute");


var zReport = {}


/*
 Custom Reports
 Report Generator
 */


/*
 UI For edit excel File
 */
zReport.reportData = (filename, data, sessions = {}) => {
    console.log(filename)
    var workbook = XLSX.readFile(filename);
    const Sheets = workbook.Sheets;
    let sheet = Sheets[Object.keys(Sheets)[0]];
    let excel = Util.excelSequence();
    let ref = sheet["!ref"];
    let explode = ref.split(":");
    let lastchar = explode[1];
    let stringPattern = /[A-Z]+/i;
    let digitPattern = /[0-9]+/i;
    let stringColumn = lastchar.match(stringPattern)[0];
    let maxColumn = excel.indexOf(stringColumn);

    let maxRow = lastchar.match(digitPattern)[0];
    //add 5 row for input cells
    maxRow = parseInt(maxRow) + 5;
    let excelData = {};
    let excelValue = {};
    let tableModel = {}
    let dataForExcel = data.excel;
    let dataCallback = data.callback || [];
    let callback = {}
    let objQuery = {}
    let results = [];

    //set callback as object
    dataCallback.map((m) => {
        callback[m.name] = m.value;
    });

    //console.log(JSON.stringify(sessions));

    //create UI Button in excel cell
    if (dataForExcel) {
        dataForExcel.forEach((datafor, index) => {
            let button = "",
                name = datafor.name,
                callback = datafor.callback || "",
                value = datafor.value || "";
            let split = value.split(".");
            let len = split.length;
            let MYMODEL = {};
            let table = "", tableKey = "";
            if (len == 4) {
                table = split[2];
                tableKey = split[3];
            } else {
                table = split[0];
                tableKey = split[1];
            }

            MYMODEL = tableModel.hasOwnProperty(table) ? tableModel[table] : require('./../models/' + table);


            if (!objQuery[table]) {
                objQuery[table] = [];
            }
            objQuery[table].push(value);

            if (!excelValue) {
                excelValue[name] = "";
            } else {
                button = excelValue[name] || "";
            }

            let labels = value.indexOf("_SESSIONS_") > -1 ? value.replace("_SESSIONS_.", "") : tableKey;
            button += `<li class="dragged"> <button class="btn btn-info btn-excel" type="button"  title="${name.replace('[', '').replace(']', '')} : ${value}">${MYMODEL.labels[labels]}
                        <input type="hidden" class="EXCEL" name="${name}" value='${value}_CALLBACK_SEPARATOR_${callback}'> <i class="fa fa-code call-me"></i>  <i class="fa fa-trash trash-me"></i></button></li>`;
            excelValue[name] = button;
        });
    }
    //end UI

    let table = `<table class="table table-striped table-bordered" >`;
    for (var x = 1; x < maxRow; x++) {
        table += `<tr>`;
        let arr = [];
        for (var i = 0; i <= maxColumn; i++) {
            let str = excel[i] + x;
            let strkey = excel[i] + "[" + x + "]";
            let defaultValue = Object.prototype.hasOwnProperty.call(sheet, str) ? sheet[str].v : "";
            let value = excelValue[strkey] || defaultValue;
            table += `<td width="80px" id="${str}" title="${str}" class="mydragable" data-col="${excel[i]}" data-row="${x}">${value}</td>`;
            arr.push(value)
        }
        table += `</tr>`;
        results.push(arr);
    }
    table += `</table>`;
    return {
        table: table,
        excelData: excelData,
        results: results,
        max: maxRow,
        objQuery: objQuery
    }
}


//Save reports Setup
zReport.reportPostData = async(req, res) => {
    let data_status = Util.jsonSuccess("Success");
    try {
        let body = req.body;
        ///console.log(body)
        let post = zRoute.postData(body);
        let ex = post.excel;
        delete post.excel;
        let id = body.id;
        let CALLBACK_SEPARATOR = "_CALLBACK_SEPARATOR_";

        //remove CALLBACK in query
        //sometimes bug in query callback separator in javascript
        let query = body.query;
        query = Util.replaceAll(query, CALLBACK_SEPARATOR, "");

        let callback = [], excel = [];
        ex.map((e) => {
            let name = e.name || "";
            let value = e.value || "";
            //console.log(value);
            if (value.indexOf(CALLBACK_SEPARATOR) > -1) {
                let split = value.split(CALLBACK_SEPARATOR);
                excel.push({
                    name: name,
                    title: name.replace("[", "").replace("]", ""),
                    value: split[0],
                    callback: Util.replaceAll(split[1], "'", '"')
                });
            }
        });
        post.excel = excel || "";
        post.query = query || "";
        await connection.update({
            table : "zreport",
            data : {json: JSON.stringify(post)},
            where : {
                id : id
            }
        });
    } catch (err) {
        debug(req, res, err);
        data_status = Util.flashError(err.toString());
    }
    res.json(data_status);
}


//SUBMIT REPORT ROUTE FOR  REPORT GENERATOR
zReport.submitReport = async(req, res) => {
    let company_id = res.locals.companyId;
    let body = req.body;
    console.log("BODYYYYYY");
    console.log(body);
    delete body._csrf;
    //delete key where null
    for (let keys in body) {
        if (body[keys] == "") {
            delete body[keys];
        }
        if (body[keys] == "undefined") {
            delete body[keys];
        }
    }
    //console.log(body);
    let $session = req.session.user;
    try {
        let reportId = body.zreport_name;
        let row = await connection.result({
            table: "zreport",
            where: {
                id: reportId
            }
        });
        let json = row.json ? row.json : {};
        //console.log(json);
        let query = json.query || "";
        let table = json.tables[0] || "";
        if (!table) {
            return res.json("error not configure!");
        }
        let MYMODEL = require(`./../models/${table}`);
        let title = row.title;
        let jsonExcels = json.excel || [];
        let excelObj = {};
        let callback = {}
        jsonExcels.map((jsonExcel) => {
            if (!excelObj[jsonExcel.name])
                excelObj[jsonExcel.name] = [];

            let jsonvalue = Util.replaceAll(jsonExcel.value, ".", "___");
            let nameCallback = jsonExcel.title + "___" + jsonvalue;

            jsonExcel.callbackName = nameCallback;

            let split = jsonvalue.split("___");
            if (split.length == 2) {
                jsonExcel.data = jsonvalue;
            } else if (split.length == 3) {
                jsonExcel.data = split[0] + "___" + split[1];
            } else {
                jsonExcel.data = jsonvalue;
            }

            if (jsonExcel.callback)
                callback[nameCallback] = jsonExcel.callback;

            excelObj[jsonExcel.name].push(jsonExcel);
        });

        delete body.zreports_name;

        //console.log(filterWhere);
        //excel instance
        var workbook = new Excel.Workbook();
        let filename = `${dirRoot}/public/uploads/zreport/${row.excel}`;
        await workbook.xlsx.readFile(filename);
        var worksheet = workbook.worksheets[0]; //the first one;
        let images = []; // store images
        // Force workbook calculation on load
        //workbook.calcProperties.fullCalcOnLoad = true;

        //set images
        var setExcelImages = (script, data, r, c) => {
            let excelsq = Util.excelSequence();
            //A1 = col=0 row=0
            //convert column to integer
            c = excelsq.indexOf(c);
            r = r - 1;
            script = script || "";
            if (script == "") {
                return "";
            }
            data = data || "";
            if (data == "") {
                return "";
            }

            let str = script.replace("hasImages(", "").replace(")", "");
            let explode = str.split(",");
            let table = explode[0].trim() || "";
            let width = parseInt(explode[1]) || 200;
            let height = parseInt(explode[2]) || 200;
            let photoName = `${dirRoot}/public/uploads/${table}/${data}`;
            if (!fs.existsSync(photoName)) {
                return "";
            }
            let image = workbook.addImage({
                filename: photoName,
                extension: data.split(".").pop()
            });
            images.push({
                image: image,
                width: width,
                height: height,
                c: c,
                r: r,
            });

            return "";
        }
        //end set images

        //query where sql;
        //query executes
        let datas = [];
        if (query) {
            var wheres = [];
            var whereArr = [];
            var where = "";
            //TODO if has order by limit
            var sql = json.query;
            console.log(sql);

            var num = 1;
            for (var key in json.filter) {
                if (body[key]) {

                    wheres.push( Util.replaceAll(json.filter[key],"?",`$${num}`));
                    if (json.filter[key].includes("LIKE")) {
                        whereArr.push(`%${body[key]}%`)
                    } else {
                        whereArr.push(body[key])
                    }
                    num++;
                }
            }

            //row.wheres from database
            var rowWheres = row.wheres || [];
            rowWheres.forEach(function (item) {
                wheres.push(item);
            });

            if (wheres.length) {
                where += " WHERE ";
                where += wheres.join(" AND ");
            }
            var orderby = "";
            if (row.orderby) {
                orderby = ` ORDER BY ${row.orderby} `;

            }
            sql = sql + where + orderby;
            //console.log(sql)
            datas = await connection.query(sql, whereArr);
        }

        let excelMap = {};
        let beginLooping = 0
        for (let keys in excelObj) {
            let split = keys.split("[");
            let column = split[0];
            let idx = parseInt(split[1]);

            if (!excelMap[keys]) excelMap[keys] = {}

            excelMap[keys].column = column;
            excelMap[keys].row = idx;
            excelMap[keys].rowColumn = column + idx;
            if (beginLooping == 0)
                beginLooping = idx;
        }

        if (datas.length > 1) {
            try {
                for (var i = 0; i < (datas.length - 1); i++) {
                    let r = i + beginLooping;
                    worksheet.spliceRows(r + 1, 1, true);
                    worksheet.duplicateRow(r, 1, true);
                }
            } catch (e) {
                console.log("no style");
            }
        }

        var ioroom = function (err) {
            io.to(res.locals.user.token).emit("error", err.toString());
        }

        datas.forEach((data, index) => {
            for (let keys in excelObj) {
                let columnIndex = excelMap[keys].column;
                let rowIndex = parseInt(excelMap[keys].row) + index;
                let rowColumn = columnIndex + rowIndex;
                let value = excelObj[keys].map((m) => {
                    //console.log(m)
                    return callback.hasOwnProperty(m.callbackName) ? callback[m.callbackName].indexOf("hasImages") > -1 ? setExcelImages(callback[m.callbackName], data[m.data], rowIndex, columnIndex) : zReport.callbackReport(callback[m.callbackName], data[m.data], rowIndex, columnIndex, null, data, ioroom, res) : data[m.data]
                }).join(" ");

                worksheet.getCell(rowColumn).value = Util.isNumeric(value) ? parseFloat(value) : value;
            }
        });
        //build images if any
        images.map((m)=> {
            worksheet.addImage(m.image, {
                tl: {col: m.c, row: m.r},
                ext: {width: m.width, height: m.height}
            });
        });

        var fileName = title + '.xlsx';
        if (row.scripts) {
            return zReport.additionalScripts(req,res,row.scripts,  fileName, datas, moment, Util, dirRoot, ioroom, connection, worksheet,workbook,debug)
        } else {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
            await workbook.xlsx.write(res);
            res.end();
        }
    } catch (e) {
        console.log(e)
        debug(req, res, e);
        res.json(e.toString())
    }
}

zReport.additionalScripts = (req,res,script, fileName, datas, moment, Util, dirRoot, ioroom, connection, worksheet, workbook) => {
    script = script.trim() || "";
    let CALL = {
        Util: Util,
        moment: moment,
        datas: datas,
        dirRoot: dirRoot,
        ioroom: ioroom,
        res: res,
        req:req,
        fileName: fileName,
        connection: connection,
        worksheet: worksheet,
        workbook : workbook,
    };
    let STRINGS_VARIABLE = "";
    Object.keys(CALL).forEach(function (item) {
        STRINGS_VARIABLE += ` var ${item} = this.${item}; `;
    });
    return Function(`
        var runcode = async() => {
            ${STRINGS_VARIABLE}
            try {
               ${script};
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
                await workbook.xlsx.write(res);
                res.end();
            } catch(e) {
                console.log(e.toString());
                res.json(e.toString());
            }
        };
        runcode();
    
    `).call(CALL);

}

zReport.callbackReport = (script, data, row, column, selectFromTable, obj, ioroom, res) => {
    script = script.trim() || "";
    let results = {}
    for (var key in obj) {
        let name = key.split("___");
        if (name.length > 0) {
            results[name[1]] = obj[key];
        }
    }

    let first = script.charAt(0);
    let CALL = {
        Util: Util,
        obj: obj,
        moment: moment,
        data: data,
        dirRoot: dirRoot,
        selectFromTable: selectFromTable,
        row: row,
        col: column,
        results: results,
        ioroom,
        res: res
    };
    let STRINGS_VARIABLE = "";
    Object.keys(CALL).forEach(function (item) {
        STRINGS_VARIABLE += ` var ${item} = this.${item}; `;
    });
    return Function(`
        ${STRINGS_VARIABLE}
         try {
           ${script};
        } catch(e) {
            console.log(e);
            ioroom("CELLS : " + col+row+ " " +e.toString());
        }
    `).call(CALL);

}

zReport.staticDataReport = (data, filter) => {
    delete data.id;
    delete data.password;
    delete data.token;
    let session_obj = {}
    let session_obj_fields = {}

    filter.map((m) => {
        let keyName = m.name;
        session_obj[keyName] = m.label;
        session_obj_fields[keyName] = {
            name: keyName,
            title: m.label,
            type: "text",
            category: "text",
            length: "undefined",
            required: false,
            search: "LIKE",
            key: "",
            placeholder: m.label
        }
    });

    for (var key in data) {
        let keyName = "$session." + key;
        session_obj[keyName] = key;
        session_obj_fields[keyName] = {
            name: keyName,
            title: key,
            type: "text",
            category: "text",
            length: "undefined",
            required: false,
            search: "LIKE",
            key: "",
            placeholder: key
        }

        if (key == "company") {
            for (var k in data[key]) {
                let keyName2 = "$session.company." + k;
                session_obj[keyName2] = k;
                session_obj_fields[keyName2] = {
                    name: keyName2,
                    title: key + " " + k,
                    type: "text",
                    category: "text",
                    length: "undefined",
                    required: false,
                    search: "LIKE",
                    key: "",
                    placeholder: key + " " + k,
                }
            }
        }
    }

    return {
        table: '_SESSIONS_',
        routeName: "_SESSIONS_",
        keys: Object.keys(session_obj),
        labels: session_obj,
        fields: session_obj_fields,
        relations: {},
        dropdowns: {},
        modules: {}
    }
}

zReport.listReports = async(data) => {
    let html = "";
    let rows = await connection.query("select * from zreport where parent_id = ?", [data.id]);
    rows.forEach((obj, index) => {
        let action = "";
        if (obj.excel) {
            action += `<a href="/zreport/setup/${obj.id}" class="btn btn-default"> <i class="fa fa-gear" title="Setup Report"></i> </a>`;
        }
        action += `<a href="/zreport/update/${obj.id}" class="btn btn-default"><i class="fa fa-pencil" title="Edit Data"></i> </a>`;
        action += `<a href="#" class="btn btn-default reportdelete" data-id="${obj.id}"><i class="fa fa-trash " title="Delete Report"></i></a>`;
        html += `<tr><td>${index + 1}. </td><td>${obj.title}</td><td><a href="/uploads/zreport/${obj.excel}">Excel File</a></td><td>${action}</td></tr>`;
    });

    return `<div class="form-group divReportList">
                        <div class="panel panel-default">
                            <div class="panel-heading">Report List</div>
                            <div class="panel-body">
                                <table class="table table-hover">
                                    <thead>
                                    <tr>
                                        <th width="3%">#</th>
                                        <th width="50%">Name</th>
                                        <th>File</th>
                                        <th class="pull-right"><a href="/zreport/create?id=${data.id}" class="btn btn-default" title="Add" id="addReportList"><i class="fa fa-plus"></i></a></th>
                                    </tr>
                                    </thead>
                                    <tbody class="body-reportList" data-value="">${html}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>`;
}


zReport.filterReport = async(req, res) => {
    let id = req.params.id || "";
    let companyId = res.locals.companyId;
    let data = [], rows = [];
    if (id == "") {
        rows = await connection.query("select * from zreport where company_id = ? and parent_id IS NULL", [companyId])
    } else {
        rows = await connection.results({table: "zreport", where: {id: id, company_id: companyId}})
    }

    console.log(rows)
    for (var i = 0; i < rows.length; i++) {

        var row = rows[i];
        //rows.forEach(async function (row) {
        let reportsRow = await connection.results({table: "zreport", where: {parent_id: row.id}});
        console.log(reportsRow)
        let filterHtml = reportsRow.length > 0 ? `<form  method="post" action="/zreport" >` : '';
        let filters = JSON.parse(row.filter) || [];
        console.log("filters :")
        console.log(filters)
        row.listReports = await zReport.listReports(row);
        for (var x = 0; x < filters.length; x++) {
            let filter = filters[x];
            let options = `<option value="">Please Select</option>`;
            let html = '';
            if (filter.type == 1) {
                html = `<input type="text"  class="datepicker form-control"  name="${filter.name}" >`;

            } else if (filter.type == 2) {
                let values = JSON.parse(filter.value) || [];
                values.map(function (e) {
                    options += `<option value="${e.key}">${e.label}</option>`;
                });
                html = `<select  class="form-control form-select" name="${filter.name}">${options}</select>`;

            } else if (filter.type == 3) {
                let values = filter.value || "";
                let explode = values.split(".");
                let table = explode[0];
                if (table && fs.existsSync(dirRoot + "/models/" + table + ".js")) {
                    let keycolumn = explode[1];
                    let labelcolumn = explode[2];
                    let MYMODEL = require('./../models/' + table);
                    let fields = MYMODEL.keys;
                    let where = '';
                    if (fields.indexOf("company_id") > -1) {
                        where = ` where company_id = ${company_id} `;
                    }
                    let results = await connection.query("select * from `" + table + "`  " + where + " order by " + labelcolumn + " ASC");
                    results.map(async(result) => {
                        options += `<option value="${result[keycolumn]}">${result[labelcolumn]}</option>`;
                    });
                    html = `<select  class="form-control form-select" name="${filter.name}">${options}</select>`;
                }
            }
            filterHtml += `<div class="row"><div class="form-group"><label class="control-label col-md-2">${filter.label}</label><div class="col-md-10">${html}</div></div></div><br>`;
            row.filterHtml = filterHtml;
        }

        //drop down report name
        let reportList = "";
        if (reportsRow.length > 0) {
            let reportOptions = "";
            reportsRow.map((obj) => {
                reportOptions += `<option value="${obj.id}">${obj.title}</option>`
            });
            reportList += `<div class="row"><div class="form-group"><label class="control-label col-md-2">Report Name</label><div class="col-md-10"><select class="form-control" id="zreports_name" name="zreports_name">${reportOptions}</select></div></div></div>`;
            reportList += `<br><button type="submit"  class="btn btn-block btn-success">Submit </button> `;
            reportList += `</form>`;
        }
        row.reportList = reportList;

        data.push(row);
    }

    return data;
}

/*
 One line
 */
zReport.filters2 = async(arr, companyId) => {
    var html = '';

    for (var i = 0; i < arr.length; i++) {
        var filter = arr[i];

        html += ` <div class="mb-3 row">
    <label for="${filter.name}"class="col-sm-4 col-form-label">${filter.label}</label>
    <div class="col-sm-8">`;

        if (filter.type == 1) {
            html += `<input type="text"  class="datepicker form-control"  name="${filter.name}" >`;

        } else if (filter.type == 2) {
            let values = filter.value ? JSON.parse(filter.value) : [];
            let options = `<option value="">Please Select</option>`;
            if (values.length) {
                values.map(function (e) {
                    options += `<option value="${e.key}">${e.label}</option>`;
                });
                html += `<select  class="form-control form-select" name="${filter.name}">${options}</select>`;
            }


        } else if (filter.type == 3) {
            let values = filter.value || "";
            let explode = values.split(".");
            let table = explode[0];
            let options = `<option value="">Please Select</option>`;
            if (table && fs.existsSync(dirRoot + "/models/" + table + ".js")) {
                let keycolumn = explode[1];
                let labelcolumn = explode[2];
                let MYMODEL = require('./../models/' + table);
                let fields = MYMODEL.keys;
                let where = '';
                if (fields.indexOf("company_id") > -1) {
                    where = ` where company_id = ${companyId} `;
                }
                let results = await connection.query("select * from `" + table + "`  " + where + " order by " + labelcolumn + " ASC");
                results.map(async(result) => {
                    options += `<option value="${result[keycolumn]}">${result[labelcolumn]}</option>`;
                });
                html += `<select  class="form-control form-select" name="${filter.name}">${options}</select>`;
            }
        }

        html += `</div>
  </div>`;

    }

    return html;
}


zReport.filters = async(arr, companyId) => {
    var html = '';

    for (var i = 0; i < arr.length; i++) {
        var filter = arr[i];

        html += `<div class="mb-3"><label for="${filter.name}" class="form-label">${filter.label}</label>`;
        if (filter.type == 1) {
            html += `<input type="text"  class="datepicker form-control"  name="${filter.name}" >`;

        } else if (filter.type == 2) {
            let values = filter.value ? JSON.parse(filter.value) : [];
            let options = '';
            if (values.length) {
                values.map(function (e) {
                    options += `<option value="${e.key}">${e.label}</option>`;
                });
                html += `<select  class="form-control form-select" name="${filter.name}">${options}</select>`;
            }


        } else if (filter.type == 3) {
            let values = filter.value || "";
            let explode = values.split(".");
            let table = explode[0];
            let options = '';
            if (table && fs.existsSync(dirRoot + "/models/" + table + ".js")) {
                let keycolumn = explode[1];
                let labelcolumn = explode[2];
                let MYMODEL = require('./../models/' + table);
                let fields = MYMODEL.keys;
                let where = '';
                if (fields.indexOf("company_id") > -1) {
                    where = ` where company_id = ${companyId} `;
                }
                let results = await connection.query("select * from `" + table + "`  " + where + " order by " + labelcolumn + " ASC");
                results.map(async(result) => {
                    options += `<option value="${result[keycolumn]}">${result[labelcolumn]}</option>`;
                });
                html += `<select  class="form-control form-select" name="${filter.name}">${options}</select>`;
            }
        }

        html += `</div>`;

    }

    return html;
}

zReport.showAll = async(req, res) => {
    var html = '';
    var companyId = res.locals.companyId;
    var rows = await connection.query("select * from zreport where company_id = ? and parent_id IS NULL", [companyId]);
    for (var i = 0; i < rows.length; i++) {
        var isEnd = false;

        if (i == 0) html += `<div class="row">`;

        if (i > 1) {
            if (i % 2 == 0) {
                html += `<div class="row">`;
                isEnd = true;
            }

            if (i == (rows.length - 1)) {
                isEnd = true;
            }
        }

        var content = await zReport.show(rows[i].id, companyId);
        html += `<div class="col">${content}</div>`

        if (i == 1) html += `</div>`;


        if (i > 1) {
            if (isEnd) {
                html += `</div>`;
                isEnd = false;
            }
        }
    }

    return html;

}

zReport.show = async(id, companyId, csrfToken, isHideLink = false) => {
    var html = '';
    var result = await connection.result({
        table: "zreport",
        where: {
            id: id
        }
    })
    if (result.id) {
        if (result.parent_id) {
            result = await connection.result({
                table: "zreport",
                where: {
                    id: result.parent_id
                }
            })
        }

        var arr = [];
        arr.push({id: result.id, label: result.title});
        var rows = await connection.results({
            table: "zreport",
            where: {
                parent_id: result.id
            }
        })
        rows.forEach(function (item) {
            arr.push({id: item.id, label: item.title});
        })

        var reports = `<div class="mb-3 row"><label for="reporttype" class="col-sm-4 form-label">Report Name</label><div class="col-sm-8"><select class="form-control form-select" id="zreport_name" name="zreport_name">`;
        arr.forEach(function (item) {
            reports += `<option value="${item.id}">${item.label}</option>`
        })
        reports += `</select></div></div>`;

        var link = '';
        if (!isHideLink) {
            link = `<div class="card-footer">
                    <i class="fa fa-copy copy-link" title="copy link" data-url="${CONFIG.app.url}/zreport/show/${result.id}/${result.title}"></i>
                    <a href="${CONFIG.app.url}/zreport/show/${result.id}/${result.title}" class="card-link">${CONFIG.app.url}/zreport/show/${result.id}/${result.title}</a>
                </div>`
        }
        //one line filters2
        var filter = await zReport.filters2(result.filters || [], companyId);
        html += `<form class="form" method="post" action="/zreport/report" >`;
        html += `<input type="hidden" name="_csrf" value="${csrfToken}">`;
        html += `<div class="card boxy">
                <div class="card-body">
                    <h2 class="card-title">${result.title}</h2>
                    <p class="card-text">${result.description}</p><br>
                    
                    ${reports}
                    ${filter}
                </div>
                
                <div class="card-body">
                <button type="submit" class="btn btn-success"><i class="fa fa-paper-plane"></i> Submit</button>
                </div>

                ${link}
                
            </div></form>`;
    }

    return html;
}

zReport.updateQuery = async(req, res) => {
    var body = req.body;
    var orderby = body.orderby || "";
    var wheres = body.wheres || "";
    var scripts = body.scripts || "";
    var id = body.id;
    console.log(req.body);
    var json = Util.jsonSuccess("Successfully save");
    var data = {}
    if(body.hasOwnProperty("orderby")) {
        data.orderby = orderby;
    }
    if(body.hasOwnProperty("scripts")) {
        data.scripts = scripts;
    }
    if(body.hasOwnProperty("wheres")) {
        data.wheres = wheres ? JSON.stringify(wheres) : null;
    }
    try {
        await connection.update({
            table: "zreport",
            data: data,
            where: {
                id: id
            }
        });
    } catch (err) {
        json = Util.flashError("Error " + err.toString());
    }
    res.json(json);
}

module.exports = zReport;