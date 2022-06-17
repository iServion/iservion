/**
 * For default route controller
 */
const Util = require('./Util')
var connection = require('./../config/connection');
var gridTable = 'zgrid';
const CONFIG = require('./../config/config')
const axios = require('axios');
const fs = require('fs-extra');
var io = require('./io');
const zCache = require('./zCache');
const nodemailer = require('nodemailer');
var qs = require('qs');
var moment = require('moment');
var debug = require("./debug");
var moduleLib = require("./moduleLib");
var cForm = require("./Form");

var zRoute = {}


zRoute.postData = (obj) => {
    return qs.parse(obj);
}

zRoute.post = (req, res, MYMODEL, routeName, body) => {
    routeName = routeName || MYMODEL.routeName;
    body = body || req.body;
    let post = qs.parse(body);
    let isEmptyFiles = Util.isEmptyObject(req.files);
    let time = new Date().getTime();
    let path_tmp = dirRoot + "/public/uploads/" + routeName + "/";
    let hasFile = false;
    let files;
    let checkboxes = [];
    let multies = [];
    fs.ensureDir(path_tmp, err => {
        console.log(err); // => null
    });

    if (!isEmptyFiles) {
        files = qs.parse(req.files);
        let fileRoute = files[routeName];
        for (var key in fileRoute) {
            let filename = time + fileRoute[key].name;
            if (Array.isArray(fileRoute[key])) {
                hasFile = true;
                //add folder again
                fs.ensureDir(path_tmp + key, err => {
                    console.log(err); // => null
                });
            } else {
                fileRoute[key].mv(path_tmp + filename, function (err) {
                    if (err) {
                        console.log(err)
                        return res.status(500).send(err);
                    }
                });
                post[routeName][key] = filename;
            }
        }
    }

    let widgets = MYMODEL.widgets;
    for (var key in post[routeName]) {
        var widgetName = widgets[key].name;
        var val = post[routeName][key];
        switch (widgetName) {
            case "dropdown_checkbox" :
                var checkboxArr = [];
                for (var k in post[routeName][key]) {
                    if (post[routeName][key][k] == 1) {
                        checkboxArr.push(k)
                    }
                }
                post[routeName][key] = JSON.stringify(checkboxArr);
                break;

            case "dropdown_multi" :
                post[routeName][key] = JSON.stringify(post[routeName][key]);
                break;

            case "table" :
                var MODEL_TABLE = require('./../models/' + widgets[key].table);
                var tableData = post[routeName][key];
                var dataTable = []
                tableData.forEach((item) => {
                    for (var k in item) {
                        if (MODEL_TABLE.widgets[k].name == "number") {
                            item[k] = Util.toNumber(item[k]);
                        }
                    }
                    dataTable.push(item)
                })
                post[routeName][key] = JSON.stringify(dataTable);
                break;

            case "multi_line_editor" :
                post[routeName][key] = JSON.stringify(post[routeName][key]);
                break;

            case "relation" :
                post[routeName][key] = val ? val : null;
                break;

            case "typeahead" :
                post[routeName][key] = val ? val : null;
                break;

            case "datepicker" :
                post[routeName][key] = val ? val : null;
                break;

            case "datetime" :
                var val = post[routeName][key];
                post[routeName][key] = val ? val : null;
                break;

            case "integer" :
                post[routeName][key] = val ? val : null;
                break;
        }
    }

    return post;
}

zRoute.attributeData = async(res, MYMODEL, obj) => {
    obj = obj || null;
    let userId = res.locals.userId;
    let routeName = MYMODEL.routeName;
    let attributeData, labels, visibles, invisibles, filter;
    attributeData = MYMODEL;
    let zgrid = await connection.results({
        table: 'zgrid', 
        where: {user_id: userId, route_name: routeName}
    });
    if (zgrid.length) {
        visibles = zgrid[0].visibles ? zgrid[0].visibles : MYMODEL.grids.visibles;
        invisibles = zgrid[0].invisibles ? zgrid[0].invisibles : MYMODEL.grids.invisibles;
        filter = zgrid[0].filter ? zgrid[0].filter : null;
    } else {
        visibles = MYMODEL.grids.visibles;
        invisibles = MYMODEL.grids.invisibles;
        filter = null;

    }
    attributeData.labels = MYMODEL.labels;

    res.locals.routeName = routeName;
    res.locals.attributeData = attributeData;
    res.locals.visibles = visibles;
    res.locals.invisibles = invisibles;
    res.locals.gridFilter = filter;
    res.locals.visiblesObj = visibles.reduce((result, item) => {
        return {...result, [item]: MYMODEL.labels[item]}
    }, {});
}


/*
 For ajax purpose
 */
zRoute.ajax = async(req, res) => {
    var body =req.body;
    var table = body.table;
    var type = body.type;
    var results;
    var obj = {
        table : table
    }
    if(body.where) {
        obj.where = body.where;
    }
    if(body.data) {
        obj.data = body.data;
    }
    if(!table){
        io.to(res.locals.token).emit("error","table must be set");
        return false;
    }
    if(!type){
        io.to(res.locals.token).emit("error","type must be set, select insert update or delete");
        return false;
    }
    var roles = appCache.get("ROLES");
    var params= roles[res.locals.roleId].params;
    if(!params.hasOwnProperty(table)) {
        io.to(res.locals.token).emit("error","You have no access to this page");
    }
    var MYMODEL = require(`./../models/${table}`);
    if(type == "select") {
        if(params[table].includes("index")) {
            results = await connection.results(obj)
        } else {
            io.to(res.locals.token).emit("error","You have no access to this page");
        }
    } else if(type == "update") {
        if(params[table].includes("update")) {
            results = await connection.update(obj)
        } else {
            io.to(res.locals.token).emit("error","You have no access to this page");
        }
    } else if(type == "insert") {
        if(params[table].includes("create")) {
            results = await connection.insert(obj);
        } else {
            io.to(res.locals.token).emit("error","You have no access to this page");
        }
    } else if(type =="delete") {
        if(params[table].includes("delete")) {
            results = await connection.delete(obj)
        } else {
            io.to(res.locals.token).emit("error","You have no access to this page");
        }
    }

    res.json({
        results : results,
        MYMODEL : MYMODEL
    });
}


zRoute.validator = function (datas, MYMODEL) {
    var json = Util.jsonSuccess(LANGUAGE['data_saved']);
    var obj = MYMODEL.fields;
    var labels = MYMODEL.labels;
    let fields = Util.requiredFields(obj);
    let message = "";
    let status = 1;
    let field = "";
    fields.map((item) => {
        if (datas.hasOwnProperty(item)) {
            if (!datas[item] || datas[item] == "") {
                status = 0;
                field = item;
                message = Util.jsonError(item, labels[item] + " can not be blank");
            }
        }
    });

    var widgets = MYMODEL.widgets;
    var numbers = [];
    for (var key in widgets) {
        if (widgets[key].name == "number") {
            numbers.push(key);
        }
    }
    if (numbers.length) {
        for (var key in datas) {
            if (Util.in_array(key, numbers)) {
                datas[key] = Util.replaceAll("" + datas[key], ".", "");
                datas[key] = parseFloat(datas[key]) || 0;
            }
        }
    }
    return {
        status: status,
        message: message,
        field: field
    };
}

zRoute.relations = async(req, res, table) => {
    try {
        let MYMODEL = require("./../models/" + table);
        let fields = MYMODEL.keys;
        let relations = {}
        let typeahead = {}
        let company_id = res.locals.companyId;
        //f0r widgets
        for (var key in MYMODEL.widgets) {
            var keyRow = key + "Row";
            var keyFields = key + "Fields";
            var keyObject = key + "Object";
            var widget = MYMODEL.widgets[key];
            var widgetName = MYMODEL.widgets[key].name;
            if (widgetName == "dropdown_multi") {
                var obj = {
                    select: widget.fields.join(",") + " as name ",
                    table: widget.table,
                    where: {company_id: company_id},
                    orderBy: ['name', 'asc']
                }
                if (widget.table == "zcompany" || widget.table == "zrole" || widget.table == "zgrid" ) {
                    delete obj.where;
                }
                relations[key] = [Util.arrayUnShift(['id', 'name']), ... await connection.results(obj)];
                relations[keyObject] = Util.arrayWithObject(relations[key], 'id', 'name');
            } else if (widgetName == "table") {
                var MODEL_TABLE = require(`./../models/${widget.table}`);
                var nots = [...CONFIG.generator.notRenderField, ...['no', 'actionColumn']];
                var obj = {}
                var visibles = MODEL_TABLE.grids.visibles;
                var invisibles = MODEL_TABLE.grids.invisibles;
                visibles.forEach(function (item) {
                    if (!Util.in_array(item, nots)) {
                        obj[item] = MODEL_TABLE.labels[item];
                    }
                });
                invisibles.forEach(function (item) {
                    if (!Util.in_array(item, nots)) {
                        obj[item] = MODEL_TABLE.labels[item];
                    }
                });
                relations[key] = obj;
                relations[keyRow] = await zRoute.relations(req, res, widget.table);
                relations[key + "Table"] = widget.table;

            } else if (widgetName == "multi_line_editor") {
                var MODEL_TABLE = require(`./../models/${widget.table}`);
                var nots = [...CONFIG.generator.notRenderField, ...['no', 'actionColumn']];
                relations[keyFields] = MYMODEL.widgets[key].fields;
                relations[key] = await zRoute.relations(req, res, widget.table);
            } else if (widgetName == "select") {
                relations[key] = widget.fields;
                relations[keyFields] = widget.fields;
                relations[keyObject] = Util.objectToGridFormat(relations[key], true);
            } else if (widgetName == "relation") {
                var obj = {
                    select: widget.fields.join(",") + " as name ",
                    table: widget.table,
                    where: {company_id: company_id},
                    orderBy: ['name', 'asc']
                }
                if (widget.table == "zcompany" || widget.table == "zrole" || widget.table == "zgrid" ) {
                    delete obj.where;
                }
                relations[key] = [Util.arrayUnShift(['id', 'name']), ... await connection.results(obj)];
                relations[keyFields] = widget.fields;
                relations[keyObject] = Util.arrayWithObject(relations[key], 'id', 'name');
            } else if (widgetName == "dropdown_chain") {
                var obj = {
                    select: widget.fields.join(",") + " as name ",
                    table: widget.table,
                    where: {company_id: company_id},
                    orderBy: ['id', 'asc']
                }
                if (widget.table == "zcompany" || widget.table == "zrole" || widget.table == "zgrid" ) {
                    delete obj.where;
                }
                relations[key] = [Util.arrayUnShift(['id', 'name']), ... await connection.results(obj)];
                relations[keyFields] = widget.fields;
                relations[keyObject] = Util.arrayWithObject(relations[key], 'id', 'name');
            } else if (widgetName == "typeahead") {
                let select = widget.fields.join(",") + " as name ";
                var obj = {
                    select: select,
                    table: widget.table,
                    where: {company_id: company_id},
                    orderBy: ['name', 'asc']
                }
                if (widget.table == "zcompany" || widget.table == "zrole" || widget.table == "zgrid" ) {
                    delete obj.where;
                }
                relations[key] = [Util.arrayUnShift(['id', 'name']), ... await connection.results(obj)];
                relations[keyObject] = Util.arrayWithObject(relations[key], 'id', 'name');
                relations[keyFields] = widget.fields;

            } else if (widgetName == "switch") {
                relations[key] = Util.modulesSwitch(widget.fields);
                relations[keyFields] = widget.fields;
            }
        }

        return relations;
    } catch (err) {
        debug(req, res, err);
    }
}

/*
 Function to create filter elements on  data table grid
 */
zRoute.dataTableFilter = async(MYMODEL, relations, filter) => {
    filter = filter || {}
    let filterColumns = filter.hasOwnProperty("columns") ? filter.columns : [];
    let filterObject = {}
    let filterKey = '';
    let isFilter = false;
    filterColumns.forEach(function (item) {
        var value = item.search.value
        if(value) {
            filterKey += ` $("#data_table_${filter.fields[item.data]}").change(); `
            filterObject[filter.fields[item.data]] = Util.replaceAll(value,"%","");
            isFilter = true;
        }
    });
    if(isFilter) {
        filterKey  += ` $("select[name='dataTable_length']").val(${filter.length}); $("select[name='dataTable_length']").change(); `
    }
    let fields = MYMODEL.fields;
    let widgets = MYMODEL.widgets;
    let types = {}
    let dataTable = {};
    for (var key in fields) {
        var html = '';
        var value = filterObject.hasOwnProperty(key) ? filterObject[key] : "";

        if (key == "id") {
            types[key] = 'input';
            dataTable[key] = `<input type="number" placeholder="${fields[key].title}" value="${value}" id="data_table_${key}" >`;
        } else {
            if (widgets.hasOwnProperty(key)) {
                var widgetName = widgets[key].name;
                switch (widgetName) {
                    case "switch" :
                        var options = relations[key].reduce((result, item) => {
                            var selected = value === item.id ? " selected " : "";
                            return result + `<option value="${item.id}" ${selected}>${item.name}</option>`
                        }, "");
                        dataTable[key] = `<select id="data_table_${key}" class="form-control form-control-sm form-select" >${options}</select>`;
                        types[key] = 'select';
                        break;

                    case "relation" :
                        var options = relations[key].reduce((result, item) => {
                            var selected = value === item.id ? " selected " : "";
                            return result + `<option value="${item.id}"  ${selected}>${item.name}</option>`
                        }, "");
                        dataTable[key] = `<select id="data_table_${key}" class="form-control form-control-sm form-select" >${options}</select>`;
                        types[key] = 'select';
                        break;

                    case "dropdown_multi" :
                        var options = relations[key].reduce((result, item) => {
                            var selected = value == item.id ? " selected " : "";
                            return result + `<option value="${item.id}" ${selected} >${item.name}</option>`
                        }, "");
                        dataTable[key] = `<select id="data_table_${key}" class="form-control form-control-sm form-select" >${options}</select>`;
                        types[key] = 'select';
                        break;

                    case "dropdown_chain" :
                        var options = relations[key].reduce((result, item) => {
                            var selected = value == item.id ? " selected " : "";
                            return result + `<option value="${item.id}" ${selected}>${item.name}</option>`
                        }, "");
                        dataTable[key] = `<select id="data_table_${key}" class="form-control form-control-sm form-select" >${options}</select>`;
                        types[key] = 'select';
                        break;

                    case "select" :
                        var options = `<option value="">--</option>`;
                        for (var k in relations[key]) {
                            var selected = value === k ? " selected " : "";
                            options += `<option value="${k}" ${selected}>${relations[key][k]}</option>`;
                        }
                        dataTable[key] = `<select id="data_table_${key}" class="form-control form-control-sm form-select" >${options}</select>`;
                        types[key] = 'select';
                        break;

                    case "typeahead" :
                        var options = relations[key].reduce((result, item) => {
                            var selected = value === item.id ? " selected " : "";
                            return result + `<option value="${item.id}" ${selected}>${item.name}</option>`
                        }, "");
                        dataTable[key] = `<select id="data_table_${key}"  class="form-control form-control-sm form-select"  >${options}</select>`;
                        types[key] = 'select';
                        break;

                    case "number" :
                        dataTable[key] = `<input type="text"  class="form-control form-control-sm" value="${value}" id="data_table_${key}" >`;
                        types[key] = 'input';
                        break;

                    case "integer" :
                        dataTable[key] = `<input type="number"  class="form-control form-control-sm" value="${value}" id="data_table_${key}" >`;
                        types[key] = 'input';
                        break;

                    default :
                        dataTable[key] = `<input type="text" class="form-control form-control-sm"  value="${value}" id="data_table_${key}" >`;
                        types[key] = 'input';
                        break;
                }
            } else {
                dataTable[key] = ``;
            }
        }
    }

    dataTable.MYMODEL = MYMODEL;
    dataTable.RELATIONS = relations;
    dataTable.TYPES = types;
    dataTable.FILTER = filter;
    dataTable.FILTEROBJECT = filterObject;
    dataTable.FILTERKEY = filterKey;
    return dataTable;
}

zRoute.dataTableData = (key, value, MYMODEL, relations) => {
    relations = relations || {}
    var keyFields = key + "Fields";
    var keyObject = key + "Object";
    let myvalue = value;
    var widgetName = MYMODEL.widgets[key] ? MYMODEL.widgets[key].name : "";
    if (widgetName) {
        switch (widgetName) {
            case "switch" :
                myvalue = relations[keyFields][value] || "";
                break;

            case "relation" :
                myvalue = relations[keyObject][value] || "";
                break;

            case "dropdown_multi" :
                var arr = value ? value : [];
                if (arr.length) {
                    var myarr = [];
                    arr.forEach(function (item) {
                        myarr.push(relations[keyObject][item]);
                    })
                    myvalue = myarr.length ? myarr.join(", ") : "";
                }
                break;

            case "dropdown_chain" :
                myvalue = relations[key][value] || "";
                break;

            case "select" :
                myvalue = relations[keyFields][value] || "";
                break;

            case "typeahead" :
                myvalue = relations[keyObject][value] || "";
                break;

            case "datetime" :
                myvalue = Util.timeSql(value);
                break;

            case "datepicker" :
                myvalue = Util.dateFormat(value, MYMODEL.widgets[key].format);
                break;

            case "number" :
                myvalue = Util.formatNumber(value);
                break;

            case "integer" :
                myvalue = parseInt(value);
                break;

            case "image" :
                myvalue = Util.fileView("/uploads/" + MYMODEL.routeName + "/", value);
                break;

            case "file" :
                myvalue = Util.fileView("/uploads/" + MYMODEL.routeName + "/", value);
                break;

            case "password" :
                myvalue = "xxxxxx";
                break;

            case "json" :
                myvalue = JSON.stringify(value)
                break;

            default :
                value = value || "";
                myvalue = value.length > 50 ? value.substring(0, 50) : value;
        }
    }

    return myvalue;
}

zRoute.users = async(req) => {
    if (!Object.prototype.hasOwnProperty.call(req.session, "user")) {
        return [];
    } else {
        if (CONFIG.generator.userCompanyTable == "") {
            return await connection.query('SELECT  id, ' + CONFIG.generator.userFieldName + ' as name FROM zuser ');
        } else {
            return await connection.query('SELECT  zuser.id, zuser.' + CONFIG.generator.userFieldName + ' as name FROM zuser LEFT JOIN ' + CONFIG.generator.userTable + ' ON (' + CONFIG.generator.userTable + '.id = ' + CONFIG.generator.userCompanyTable + '.' + CONFIG.generator.userId + ') WHERE ' + CONFIG.generator.userCompanyTable + '.' + CONFIG.generator.company_id + ' = ?', [req.session.user.company_id]);
        }
    }
}

zRoute.usersObj = {id: '', [CONFIG.generator.userFieldName]: ''};
zRoute.usersArr = ['id', CONFIG.generator.userFieldName];
zRoute.usersDropdown = async(req) => {
    return [zRoute.usersObj, ...await zRoute.users(req)];
}
zRoute.getUsers = async() => {
    return Util.arrayToObject(await connection.results({table: "zuser"}), "id");
}


zRoute.changePassword = async(req, res) => {
    let userId = req.session.user.id;
    var query = req.body;
    var passwordNow = query.passwordNow.trim();
    var password = query.password.trim();
    var passwordRepeat = query.passwordRepeat.trim();
    var password_pattern = Util.regexPassword(6, 20)
    if (!password.match(password_pattern)) {
        return res.json(Util.jsonError('password', 'password combine char and number, min 6 chars'))
    }
    if (password != passwordRepeat) {
        return res.json(Util.jsonError('password', 'password and  repeat are not equal'))
    }
    let user = await connection.query("select * from  zuser where id = ? and  password = ?", [userId, Util.hash(passwordNow)])
    if (user.length == 0) {
        return res.json(Util.jsonError('passwordNow', 'password sekarang salah'))
    }
    let data = {
        password: Util.hash(password)
    }
    await  connection.query("update zuser set  ? where id = ?", [data, userId])
    res.json(Util.jsonSuccess("successfully change your password"))
}


zRoute.resetPassword = async(req, res) => {
    var query = req.body;
    var password = query.password;
    var password_repeat = query.password_repeat.trim();
    var password_pattern = Util.regexPassword(6, 20)
    var forgot_password = req.params.forgot_password || "";
    var json = Util.jsonError('password', 'Your link has expired!!!')
    if (forgot_password == "")
        return res.json(Util.jsonError('password', 'Your link has expired!!!'))
    if (!password.match(password_pattern))
        return res.json(Util.jsonError('password', 'password combine char and number, min 6 chars'))
    if (password != password_repeat)
        return res.json(Util.jsonError('password', 'password dan  password repeat are not equal'))

    var row = await connection.query("SELECT * FROM zuser WHERE forgot_password = ?", [forgot_password])
    if (row.length > 0) {
        await connection.query("UPDATE zuser set password = ?,forgot_password = ''  where id = ?", [Util.hash(password), row[0].id]);
        req.session.sessionFlash = Util.jsonSuccess("Success to change password");
        json = Util.jsonSuccess("Success")
    } else {
        json = Util.jsonError('password', 'Your link has expired!!!')
    }
    res.json(json);
}

zRoute.loginAuth = async(username, fields) => {
    var results = await connection.results({table: "zuser", where: {username: username, active: 1}})
    if (results.length) {
        await connection.update({table: "zuser", data: fields, where: {id: results[0].id}})
        //back to query to completed
        results = await connection.results({table: "zuser", where: {id: results[0].id}})
    }
    return results;
}

zRoute.loginNormal = async(username, password) => {
    var result = await connection.result({
        table: "zuser",
        where: {username: username, active: 1}
    });
    if(!result) {
        return [];
    } else {
        var match =  Util.hashCompare(password, result.password);
        if(match) {
            return [result];
        }
    }

    return [];
}


zRoute.login = async(username, password, req, res, isSocialLogin, url = "") => {
    try {
        isSocialLogin = isSocialLogin || false;
        var rows = isSocialLogin ? await zRoute.loginAuth(username, password) : await zRoute.loginNormal(username, password);
        if (rows.length > 0) {
            await zRoute.handleSession(req, rows[0]);
            var redirect = url == "" ? `${CONFIG.app.url}${CONFIG.app.afterLogin}` : "/" + url;
            console.log(redirect)
            res.redirect(redirect);
        } else {
            console.log("ada error")
            req.session.sessionFlashc = 1;
            res.locals.sessionFlash = 1;
            res.redirect(url == "" ? '/login?err=1' : "/" + url);
        }
    } catch (err) {
        debug(req, res, err);
        res.json("Error : " + err.toString());
    }
}

zRoute.logout = async(req, res) => {
    req.session.destroy(function (err) {
        if (err) console.log(err);
        res.redirect('/');
    });
}

zRoute.handleSession = async(req, user) => {
    var company = await connection.result({
        table : "zcompany",
        where : {
            id : user.company_id
        }
    });
    var userCompany = await connection.results({
        table : "zuser_company",
        joins : [
            "LEFT JOIN zcompany ON (zcompany.id = zuser_company.company_id)"
        ],
        where : {
            "zuser_company.user_id" : user.id
        }
    });

    if(!userCompany.length){
        req.session.user = {}
    } else {
        var userCompanyObject = Util.arrayToObject(userCompany,"company_id");
        var role = await connection.result({
            table : "zrole",
            where : {
                id : userCompanyObject[user.company_id].role_id
            }
        });

        user.roleName = role.name;
        var roleKeys = role.params ? role.params : {};
        user.roleKeys = Object.keys(roleKeys);
        user.company = company;
        user.companies = userCompany;
        req.session.user = user;
    }
}


zRoute.excelQuery = async(req,res,MYMODEL) => {
    await zRoute.attributeData(res, MYMODEL);
    var results = await connection.results({
        table :"zgrid",
        where : {
            route_name : MYMODEL.routeName,
            user_id : res.locals.userId
        }
    });
    var rows = [];
    var body = {};
    if(results.length) {
        var result = results[0];
        body = result.filter;
        var fields = body.fields.filter(item => item != "no" && item != "actionColumn");
        var select = Util.selectMysql(fields);
        var whereArray = [];
        var columns = body.columns;
        columns.forEach(function (item) {
            if (item.search.value) {
                whereArray.push({
                    field: body.fields[item.data],
                    option: MYMODEL.options[body.fields[item.data]],
                    value : item.search.value,
                    operator: "AND"
                });
            }
        });
        var orderColumn = body.fields[body.order[0].column] == "actionColumn" ? "id" : body.fields[body.order[0].column] == "no" ? "id" : body.fields[body.order[0].column] == "actionColum" ? "id" : body.fields[body.order[0].column];
        rows = await connection.results({
            select: select,
            table: MYMODEL.table,
            whereArray: whereArray,
            limit: body.length,
            offset : body.start,
            orderBy: [orderColumn, body.order[0].dir]
        });
    } else {
        rows = await connection.results({
            select : Util.selectMysql(fields),
            table: MYMODEL.table,
            limit: 10,
            offset : 0,
            orderBy: ["id", "desc"]
        });
    }
    await zRoute.excel(req, res, MYMODEL, fields, rows);
}

// for excels
zRoute.excel = async(req, res, MYMODEL, fields, rows, callback, fileName) => {
    //if any other custom value then callback needed
    callback = callback || function () {
        };
    const Excel = require('exceljs');
    var workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet(res.locals.routeName, {pageSetup: {paperSize: 9, orientation: 'landscape'}})
    worksheet.properties.defaultColWidth = 13;
    var sequence = Util.excelSequence();
    var labels = MYMODEL.labels;
    var start = 4, num = 1, routeName = res.locals.routeName;
    // properties
    var yellow = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'FFFFFF00'},
        bgColor: {argb: 'FF0000FF'}
    };
    var blue = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: '96C8FB'},
        bgColor: {argb: '96C8FB'}
    };
    var center = {vertical: 'middle', horizontal: 'center', wrapText: true};
    var bold = {bold: true};
    //end properties

    for (var i = 0; i < fields.length; i++) {
        worksheet.getCell(sequence[i] + '1').value = labels[fields[i]];
        worksheet.getCell(sequence[i] + '1').fill = blue;
        worksheet.getCell(sequence[i] + '1').font = bold;
        worksheet.getCell(sequence[i] + '1').alignment = center;
    }
    for (var i = 0; i < fields.length; i++) {
        worksheet.getCell(sequence[i] + '2').value = fields[i];
        worksheet.getCell(sequence[i] + '2').fill = yellow;
        worksheet.getCell(sequence[i] + '2').alignment = center;
    }
    worksheet.mergeCells('A3:' + sequence[(i - 1)] + '3');
    worksheet.getCell('A3').value = 'DATA';
    worksheet.getCell('A3').font = bold;
    worksheet.getCell('A3').alignment = center;

    //check relations
    var isRelations = false;
    var relations = [], tableObj={}, obj = {}, dropdowns = [], passwords = [];
    var usersObj = await zRoute.getUsers();

    if (Object.prototype.hasOwnProperty.call(MYMODEL, "widgets")) {
        isRelations = true;
        for (var key in MYMODEL.widgets) {
            var widget =MYMODEL.widgets[key];
            if(widget.name == "password") {
                passwords.push(key)
            } else {
                if(widget.hasOwnProperty("table")) {
                    relations.push(key);
                    var table = widget.table;

                    var results = await connection.results({
                        select : widget.fields.join(" , ") +" as name " ,
                        table : table
                    });

                    tableObj[key] = Util.arrayToObject(results,"id");
                }
            }

        }
    }

    rows.forEach(function (result) {
        fields.forEach((field, i) => {
            var t;
            if (field == 'created_at' || field == 'created_at') {
                t = !callback(result, field) ? Util.timeSql(result[field]) : callback(result, field);
            } else if (field == 'updated_at' || field == 'updated_at') {
                t = !callback(result, field) ? Util.timeSql(result[field]) : callback(result, field);
            } else if (Util.in_array(field, CONFIG.generator.createdupdated_by)) {
                t = !callback(result, field) ? usersObj[result[field]] : callback(result, field);
            } else {
                // callback will call if you have
                if (Util.in_array(field, relations)) {
                    t = !callback(result, field) ? tableObj[field][result[field]].name : callback(result, field);
                } else if (Util.in_array(field, dropdowns)) {
                    t = !callback(result, field) ? MYMODEL.dropdowns[field].fields[result[field]] : callback(result, field);
                } else if (Util.in_array(field, passwords)) {
                    t = 'xxxxxx';
                } else {
                    t = !callback(result, field) ? result[field] : callback(result, field);
                }
            }
            worksheet.getCell(sequence[i] + start).value = t;
        });
        start++;
        num++
    });

    fileName = fileName || routeName + '_' + new Date().getTime() + '.xlsx'
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    await workbook.xlsx.write(res);
    res.end();
}


/*
 Grids Data Table
 save grid
 */
zRoute.dataTableSave = async(routeName, userId, body) => {
    var results = await connection.results({
        table: "zgrid",
        where: {
            user_id: userId,
            route_name: routeName
        }
    })
    if (results.length) {
        await connection.update({
            table: "zgrid",
            data: {
                visibles: JSON.stringify(body.fields),
                filter: JSON.stringify(body)
            },
            where: {
                user_id: userId,
                route_name: routeName
            }
        })
    } else {
        await connection.insert({
            table: "zgrid",
            data: {
                route_name: routeName,
                user_id: userId,
                visibles: JSON.stringify(body.fields),
                filter: JSON.stringify(body)
            },
            where: {
                user_id: userId,
                route_name: routeName
            }
        })
    }
    return "ok";
}

zRoute.actionButtons = (levels, row, table, callback = null) => {
    var arr = [];
    if (levels.view) {
        arr.push(`<i data-id="${row.id}" title="view" class="fa fa-eye gridview boxy-small  btn-primary btn-rounded"></i>`);
    }
    if (levels.update) {
        arr.push(`<i data-id="${row.id}" title="Update" class="far fa-edit gridupdate boxy-small btn-warning btn-rounded"></i>`);
    }
    if (levels.delete) {
        arr.push(`<i data-id="${row.id}" title="Delete" class="fa fa-trash griddelete boxy-small btn-danger btn-rounded"></i>`);
    }
    var view = '';
    view += arr.join("&nbsp;");
    if (callback) {
        callback({
            arr:arr,
            view:view,
            levels : levels,
            row : row,
            table : table
        });
    }

    return view;
}

zRoute.actionButtons2 = (levels, row, table, callback = null) => {
    var arr = [];
    arr.push(`<span class="action-sec"><div class="dot dot-menu"></div><div class="dropdown"><ul>`);
    if (levels.view) {
        arr.push(`<li><a href="/${table}/view" data-id="${row.id}" title="view" ><div class="img"><i class="far fa-eye"></i></div><span>View</span></a></li>`);
    }
    if (levels.update) {
        arr.push(`<li><a href="/${table}/update/${row.id}" ><div class="img"><i class="far fa-edit"></i></div><span>Edit</span></a></li>`);
    }
    if (levels.delete) {
        arr.push(`<li><a href="#" data-id="${row.id}" class="griddelete"><div class="img"><i class="far fa-trash-alt"></i></div><span>Delete</span></a></li>`);
    }
    arr.push(`</ul></div></span>`)
    var view = '';
    view += arr.join(" ");
    if (callback) {
        callback({
            arr:arr,
            view:view,
            levels : levels,
            row : row,
            table : table
        });
    }

    return view;
}

zRoute.dataTableViewLevel = (levels, row, table) => {
    return zRoute.actionButtons(levels, row, table);
}

zRoute.postGridReload = async(req, res)=> {
    var routeName = res.locals.routeName;
    let userId = res.locals.userId;
    var json = Util.jsonSuccess("Successfully to reset grid filter ");
    await connection.delete({
        table: gridTable,
        where: {user_id: userId, route_name: routeName}
    });
    //await zRoute.attributeData(res, )
    res.json(json)
}

zRoute.postGrid = async(req, res) => {
    try {
        var query = req.body;
        //console.log(query);
        var visible = query.serialize_left;
        var invisible = query.serialize_right;
        var post = {
            user_id: res.locals.userId,
            route_name: res.locals.routeName,
            visibles: visible,
            invisibles: invisible
        }
        var results = await connection.results({
            table: gridTable,
            where: {user_id: res.locals.userId, route_name: res.locals.routeName}
        })
        if (results.length == 0) {
            await connection.insert({table: gridTable, data: post});
        } else {
            await connection.update({table: gridTable, data: post, where: {id: results[0].id}})
        }
        res.json(Util.jsonSuccess(LANGUAGE['grid_saved']))
    } catch (err) {
        debug(req, res, err);
        res.json(err)
    }
}

//for dropdown chains
zRoute.chains = async(req,res) => {
    var body = req.body;
    var id = body.id;
    var column = body.column;
    var table = body.table;
    var MYMODEL = require("./../models/"+table);
    var data = {}
    var obj = body.obj;
    if(id) {
        for(var key in obj) {
            var columnName = MYMODEL.widgets[column].chains[key].column;
            var results = await connection.results({
                select : MYMODEL.widgets[key].fields.join(",") + " as name ",
                table : MYMODEL.widgets[key].table,
                where : {
                    [columnName] : id,
                    company_id : res.locals.companyId
                },
                //orderBy : [MYMODEL.widgets[key].fields[1], "asc"]
            });

            data[key] = `<option value="">Please Select</option>`;
            if(results.length){
                results.forEach(function (result) {
                    var selected = result.id == obj[key] ? " selected " : "";
                    data[key] += `<option value="${result.id}" ${selected} >${result.name}</option>`;
                });
            }
        }
    }


    res.json(data);
}

zRoute.formField = (req, res, MYMODEL, relations, data = {}) => {
    var cForms = require("./Form");
    relations = relations || {};
    var fields = MYMODEL.fields;
    var dropdowns = MYMODEL.dropdowns || {};
    var modules = MYMODEL.modules || {};
    var relationsModel = MYMODEL.relations || {};
    var widgets = MYMODEL.widgets || {}

    var forms = {};
    forms.label = {};
    forms.field = {};
    forms.obj = {};
    forms.fn = {};
    forms.group = {};
    forms.scriptGroup = "";

    for (var key in fields) {
        // for label
        forms.label[key] = cForms.label(key, fields[key].title, fields[key].required);

        //for object property
        var obj = {
            type: "input",
            id: key,
            name: MYMODEL.table + "[" + fields[key].name + "]",
            title: fields[key].title || "",
            required: fields[key].required,
            placeholder: fields[key].placeholder || "",
            value: !data[key] ? "" : data[key],
            frameworkcss: res.locals.frameworkcss,
            form_css: res.locals.form_css
        };

        //check if widgets
        if (widgets.hasOwnProperty(key)) {
            var widgetName = widgets[key].name;
            var keyFields = key + "Fields";

            if(widgets[key].hasOwnProperty("information"))
            {
                obj.information = widgets[key].information;
            }
            switch (widgetName) {
                case "text" :
                    if (widgets[key].hidden) {
                        obj.type = "hidden";
                    } else {
                        obj.type = "input";
                    }
                    break;
                case "textarea" :
                    if (widgets[key].hidden) {
                        obj.style = "display:none";
                    }
                    obj.type = "textarea";
                    break;
                case "image" :
                    obj.type = "image";
                    break;
                case "email" :
                    obj.type = "email";
                    break;
                case "file" :
                    obj.type = "file";
                    break;
                case "select" :
                    obj.type = "select";
                    obj.data = relations[key]
                    break;
                case "switch" :
                    obj.type = "switch";
                    obj.class = "switch";
                    break;
                case "dropdown_checkbox" :
                    obj.type = "dropdown_checkbox";
                    obj.data = widgets[key].fields || [];
                    break;
                case "relation" :
                    obj.type = "select";
                    var htmlOptions = ` <a href="/${widgets[key].table}" target="_blank">  > </a>`;
                    forms.label[key] = cForms.label(key, fields[key].title, fields[key].required, htmlOptions);
                    obj.data = relations[key];
                    break;
                case "typeahead" :
                    obj.type = "typeahead";
                    forms.label[key] = cForms.label(key, fields[key].title, fields[key].required);
                    obj.data = relations[key];
                    obj.typeaheadvalue = !data[key] ? "" : relations[key + "Object"][data[key]];
                    break;
                case "dropdown_chain" :
                    obj.type = "select";
                    var htmlOptions = ` <a href="/${widgets[key].table}" target="_blank">  > </a>`;
                    forms.label[key] = cForms.label(key, fields[key].title, fields[key].required, htmlOptions);
                    obj.data = relations[key + "Row"];
                    break;
                case "dropdown_multi" :
                    obj.type = "multi";
                    obj.data = relations[key] || [];
                    obj.multi = relations[key + "Object"];
                    break;
                case "number" :
                    obj.type = "number";
                    obj.class = "number";
                    break;
                case "integer" :
                    obj.type = "number";
                    obj.class = "number";
                    break;
                case "email" :
                    obj.type = "input";
                    break;
                case "password" :
                    obj.type = "password";
                    break;
                case "datepicker" :
                    obj.type = "datepicker";
                    obj.class = " datepicker";
                    obj.value = obj.value == "0000-00-00" ? "" : Util.dateSql(obj.value);
                    break;
                case "datetime" :
                    obj.type = "datetimepicker";
                    obj.class = " datetimepicker";
                    obj.value = obj.value == "0000-00-00 00:00:00" ? "" : Util.timeSql(obj.value);
                    break;
                case "clockpicker" :
                    obj.type = "input";
                    obj.class = " clockpicker";
                    break;
                case "editor" :
                    obj.type = "textarea";
                    obj.class = " editor";
                    break;
                case "ide_editor" :
                    forms.label[key] = cForms.label(key, fields[key].title, fields[key].required, ` <span class="badge bg-primary float-end boxy-small">${widgets[key].language}</span>`);
                    obj.type = "ide_editor";
                    obj.class = " ide_editor";
                    break;
                case "table" :
                    obj.type = "table";
                    obj.data = relations[key];
                    break;
                case "multi_line_editor" :
                    obj.type = "multi_line_editor";
                    obj.data = relations[key];
                    obj.description = widgets[key].description;
                    obj.fields = relations[key + "Fields"];
                    break;

                case "json" :
                    obj.type = "json";
                    obj.data = relations[key];
                    break;

                default :
                    obj.type = "input";
                    break;
            }
        } else {
            obj.type = "input";
        }
        forms.obj[key] = obj;
        forms.field[key] = cForms.field(obj);
        forms.fn = (key, options)=> {
            var OBJ = forms.obj[key];
            for (var k in options) {
                OBJ[k] = options[k];
            }
            return cForms.field(OBJ);
        }
    }

    return forms;
}


//generate all scripts in one line
zRoute.moduleLib = async(req, res, MYMODEL, relations, zForms = "", data = {}) => {
    //add script in the folder runtime/script
    await moduleLib.script(req, res, MYMODEL.table);
    //add additional script
    if (zForms) {
        moduleLib.addScript(req, res, zForms.scriptGroup);
    }

    var obj = {}
    var widgets = MYMODEL.widgets,
        widgetsArray = Object.keys(widgets) || [];
    var hasDatePicker = false;
    var hasNumber = false;
    var hasClockPicker = false;
    var hasEditor = false;
    var hasDateTimePicker = false;
    var hasTable = false;
    var chainsObj = {}
    var hasChain = false;
    var hasIde = false;
    for (var key in widgets) {
        if (widgets[key].name == "datepicker") {
            hasDatePicker = true;
        } else if (widgets[key].name == "number") {
            hasNumber = true;
        } else if (widgets[key].name == "clockpicker") {
            hasClockPicker = true;
        } else if (widgets[key].name == "editor") {
            hasEditor = true;
        } else if (widgets[key].name == "ide_editor") {
            hasIde = true;
        } else if (widgets[key].name == "switch") {
            moduleLib.switch(req, res, `#${key}`, widgets[key].fields);
        } else if (widgets[key].name == "typeahead") {
            moduleLib.typeahead(req, res, `#${key}Typeahead`, relations[key]);
        } else if (widgets[key].name == "datetime") {
            hasDateTimePicker = true;
        } else if (widgets[key].name == "table") {
            hasTable = true;
        }


        // dropdown chains
        if (widgets[key].name == "relation") {
            if(widgets[key].isChain){
                if(Object.keys(widgets[key].chains).length) {
                    chainsObj[key] = widgets[key].chains;
                    hasChain = true;
                }
            }
        }
    }


    if (hasDatePicker) moduleLib.datepicker(req, res);
    if (hasNumber) moduleLib.number(req, res);
    if (hasClockPicker) moduleLib.clockpicker(req, res);
    if (hasEditor) moduleLib.editor(req, res);
    if (hasDateTimePicker) moduleLib.datetimepicker(req, res);
    if (hasTable) await moduleLib.script(req, res, MYMODEL.table);
    if(hasIde) await moduleLib.ideCDN(req,res);

    var scriptForm = '';
    if(hasChain){
        for(var key in chainsObj) {
            scriptForm += `
            $("body").on("change", "#${key}", function () {
        chains("${key}","${MYMODEL.routeName}",${JSON.stringify(Object.keys(chainsObj[key]))});
    });
    $(function () {
        chains("${key}","${MYMODEL.routeName}",${JSON.stringify(Object.keys(chainsObj[key]))});
    });
            `;

        }
    }

    var routeName = MYMODEL.routeName, dropdowns = MYMODEL.dropdowns;

    scriptForm += ` $(function () {
        $(".isfile").each(function (index, value) {
            var filename = $(this).attr("data-filename") || "";
            var id = $(this).attr("data-id");
            if (filename.length > 3) {
                var ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
                if (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "bmp" || ext == "webp") {
                    $("#file"+id).attr("src","/uploads/${routeName}/"+filename).attr("height","100px");
                } else {
                    $("#file"+id).attr("src","/img/file.png").attr("height","100px");
                }
                $("#file"+id).on("click", function () {
                    location.href = "/uploads/${routeName}/"+filename;
                });
            }
            if($(this).data("required") == true) {
                var imageElement = "#file"+id;
                if(!$(imageElement).attr("src")) {
                    $("#"+id).attr("required",true);
                }
            }
        });
    });`;

    for (var keys in widgets) {
        var widgetName = widgets[keys].name;
        switch (widgetName) {
            case "multi_line_editor" :
                scriptForm += `$(".text-toggle").on("click", function(){
                var editorId = $(this).data("id");
                $("#"+editorId).attr("type","text");
                $("#a_"+editorId).hide();
                $("#"+editorId).show();

                });
                
                    $(".editor-value").on("change",function(index,item){
                        if($(this).attr("type") == "text") {
                            if($(this).val()) {
                                var editorId = $(this).data("id");
                                $("#a_"+editorId).html($(this).val()).show();
                                $(this).attr("type","hidden");
                            }
                        }
                    });`;
                break;

            case "dropdown_multi" :
                scriptForm += ` $("#dropdownadd${keys}").on("click", function () {
        var val = $("#${keys}").val();
        if(val == ""){
            alert("Please select data");
            return false;
        }
        var count = $(".span${keys}").length;
        var data = "<span class='span${keys}' > "+(count+1)+". <input type='hidden' name='${routeName}[${keys}][]' value='"+val+"' /> " + $("#${keys} option:selected").text()+"   <i class='fa fa-trash pointer text-danger pull-right' onclick='$(this).closest(\`span\`).remove();'  title='Delete'></i><br></span>";
        $("#dropdownbox${keys}").append(data);
        $("#${keys}").val("");
    });${Util.newLine}`;
                break;

            case "table" :
                var MODEL_TABLE = require("./../models/" + MYMODEL.widgets[keys].table);
                var MODEL_TABLE_RELATIONS = await zRoute.relations(req, res, MODEL_TABLE.table);
                var zForm = zRoute.formField(req, res, MODEL_TABLE, MODEL_TABLE_RELATIONS);
                await zRoute.moduleLib(req, res, MODEL_TABLE, MODEL_TABLE_RELATIONS, zForms);

                var trash = `trash_${key}_${MYMODEL.widgets[keys].table}`;
                var trtd = '';
                for (var key in relations[keys]) {
                    var obj = zForm.obj[key];
                    var name = MYMODEL.table + "[" + keys + "][${increment}][" + key + "]";
                    obj.name = name;
                    obj.class = MYMODEL.table + "_" + keys + "_" + key;
                    obj.id = key;
                    obj.options = {
                        "data-name": key,
                        "data-id": obj.class
                    }
                    trtd += `<td  class="td_${key}_${MYMODEL.widgets[keys].table}">${cForm.field(obj)}</td>`;
                }

                trtd += `<td style="vertical-align:top"><span class="fas fa-trash-alt ${trash}" ></span></td></tr>`;
                var subname = MYMODEL.table + "_" + keys;

                scriptForm += `$("table").on("click", ".${trash}", function () {$(this).closest('tr').remove();});`;
                scriptForm += Util.newLine;
                scriptForm += 'var append' + keys + ' = function (increment) {return `<tr data-id="${increment}"  data-name="' + MYMODEL.table + '[' + keys + ']">';
                scriptForm += trtd;
                scriptForm += "`}";
                scriptForm += Util.newLine;
                scriptForm += `var append${keys}Max = $('tbody#body-${keys}>tr').length;${Util.newLine}`;
                scriptForm += `function ${keys}Handler(){ 
 var index = $("#body-${keys}>tr").length || 0; 
$("#body-${keys}>tr").each(function (index, tr) {
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

            var selects = $(tr).find("select");
            selects.each(function (i,input) {
                if($(input).data("name")){
                    $(input).removeAttr("name");
                    $(input).attr("name",dataname+"["+index+"]["+$(input).data("name")+"]");
                }
            });

            var textareas = $(tr).find("textarea");
            textareas.each(function (i,input) {
                if($(input).data("name")){
                    $(input).removeAttr("name");
                    $(input).attr("name",dataname+"["+index+"]["+$(input).data("name")+"]");
                }
            });
            }
          
        }); ${Util.newLine}};${Util.newLine}`;
                scriptForm += ` $(function () {
        $('#add${keys}').on('click',function(){
            $('#body-${keys}').append(append${keys}(append${keys}Max));
            append${keys}Max++;
            ${keys}Handler();
        });
    var ${keys} = $("#body-${keys}").data("value") ? $("#body-${keys}").data("value") : [];
    ${keys}.forEach(function (myobj, index) {
            $("#body-${keys}").append(append${keys}(index));
            ${keys}Handler();
            for(var key in myobj){
                if($(".${subname}_" + key).eq(index).attr("type") == "checkbox" && myobj[key] == 1)
                    $(".${subname}_" + key).eq(index).prop("checked", true);
                $(".${subname}_" + key).eq(index).val(myobj[key] ? myobj[key] : '');
            }
        append${keys}Max = index + 1;
    });
});${Util.newLine}`;
                break;


            case "ide_editor" :
                scriptForm += `var editor_${keys} = ace.edit("editor_${keys}");
    editor_${keys}.getSession().setMode("ace/mode/${widgets[keys].language}");
    editor_${keys}.setValue($("#${keys}").text());
    editor_${keys}.on("change",function(e){
        $("#${keys}").text(editor_${keys}.getValue());
    });
    `;
                
                break

        }
    }

    moduleLib.addScript(req, res, scriptForm);
}

zRoute.viewTable = async(req, res, MYMODEL, results, isPreview) => {
    isPreview = isPreview || false;
    var data = {};
    var widgets = MYMODEL.widgets;
    var widgetsArray = Object.keys(widgets);
    var routeName = MYMODEL.routeName;
    var hasIdeEditor = false;
    var editors =[];

    for (var key in results) {
        if (Util.in_array(key, widgetsArray)) {
            var widgetName = widgets[key].name;
            switch (widgetName) {
                case "datepicker" :
                    data[key] = Util.dateSql(results[key], widgets[key].format || "");
                    break;
                case "number" :
                    data[key] = Util.formatNumber(results[key]);
                    break;
                case "image" :
                    data[key] = Util.fileView("/uploads/" + routeName + "/", results[key]);
                    break;
                case "file" :
                    data[key] = Util.fileView("/uploads/" + routeName + "/", results[key]);
                    break;
                case "password" :
                    data[key] = "xxxxxxxx";
                    break;
                case "datetime" :
                    data[key] = Util.timeSql(results[key], widgets[key].format || "");
                    break;
                case "switch" :
                    data[key] = widgets[key].fields[results[key]] || "";
                    break;
                case "select" :
                    data[key] = widgets[key].fields[results[key]] || "";
                    break;
                case "relation" :
                    var row = {}
                    if (results[key]) {
                        row = await connection.result({
                                table: widgets[key].table,
                                select: widgets[key].fields[1] + " as name",
                                where: {id: results[key]}
                            }) || {};
                    }
                    data[key] = !row.name ? "" : row.name;
                    break;
                case "typeahead" :
                    var row = {}
                    if (results[key]) {
                        row = await connection.result({
                                table: widgets[key].table,
                                select: widgets[key].fields[1] + " as name",
                                where: {id: results[key]}
                            }) || {};
                    }
                    data[key] = !row.name ? "" : row.name;
                    break;

                case "dropdown_multi" :
                    var rows = await connection.results({
                        select: widgets[key].fields.join(",") + "as name",
                        table: widgets[key].table
                    });
                    data[key] = Util.arrayToList(results[key], Util.arrayWithObject(rows, "id", "name"))
                    break;

                case "dropdown_chain" :
                    var row = {}
                    if (results[key]) {
                        row = await connection.result({
                                table: widgets[key].table,
                                select: widgets[key].fields[1] + " as name",
                                where: {id: results[key]}
                            }) || {};
                    }
                    data[key] = !row.name ? "" : row.name;
                    break;

                case "ide_editor" :
                    hasIdeEditor = true;
                    editors.push(key);
                    data[key] = !results ? "" : Util.replaceAll(results[key],"</script>",`<//script>`);

                    break;

                case "table" :
                    var tableClass = isPreview ? "" : "table-striped table-hover";
                    var html = `<table class="table ${tableClass}">`;
                    html += `<tr>`;
                    var MODEL_TABLE = require("./../models/" + MYMODEL.widgets[key].table);
                    var nots = [...CONFIG.generator.notRenderField, ...['no', 'actionColumn']];
                    var visibles = MODEL_TABLE.grids.visibles || [];
                    var invisibles = MODEL_TABLE.grids.invisibles || [];

                    var obj = {}
                    visibles.forEach(function (item) {
                        if (!Util.in_array(item, nots)) {
                            obj[item] = MODEL_TABLE.labels[item];
                            html += `<th>${MODEL_TABLE.labels[item]}</th>`;
                        }
                    });
                    invisibles.forEach(function (item) {
                        if (!Util.in_array(item, nots)) {
                            obj[item] = MODEL_TABLE.labels[item];
                            html += `<th>${MODEL_TABLE.labels[item]}</th>`;
                        }
                    });
                    html += `</tr>`;
                    var arr = results[key] || [];
                    console.log(arr);
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        var data_table = await zRoute.viewTable(req, res, MODEL_TABLE, item);
                        html += `<tr>`;
                        for (var k in obj) {
                            html += `<td>${data_table[k]}</td>`;
                        }
                        html += `</tr>`;
                    }

                    html += `</table>`;
                    data[key] = html;
                    break;


                default :
                    data[key] = results[key];
            }

        } else {
            data[key] = results[key];
        }
    }

    if(hasIdeEditor) {
        var contentScript = '';
        editors.forEach(function (item) {
            contentScript +=  `var editor_${item} = ace.edit("editor_${item}");
            editor_${item}.getSession().setMode("ace/mode/${widgets[item].language}");
            editor_${item}.getSession().setValue(\`${data[item]}\`);

            `;
        });
        moduleLib.ideCDN(req,res);
        moduleLib.addScript(req,res,contentScript)
    }

    return data;
}


/*
 MySQL CRUD with context
 */


//attach to service after create
zRoute.insertSQL = async(req, res, table, data) => {
    let MYMODEL = require("./../models/" + table);
    let fields = MYMODEL.keys;
    if (fields.indexOf("company_id") > -1) data.company_id = res.locals.companyId;
    if (fields.indexOf("update_at") > -1) data.update_at = Util.now();
    if (fields.indexOf("created_at") > -1) data.created_at = Util.now();
    if (fields.indexOf("updated_by") > -1) data.updated_by = res.locals.userId;
    if (fields.indexOf("created_by") > -1) data.created_by = res.locals.userId;
    return await connection.insert({table: table, data: data});
}

zRoute.updateSQL = async(req, res, table, data, whereData) => {
    let MYMODEL = require("./../models/" + table);
    let fields = MYMODEL.keys;
    if (fields.indexOf("update_at") > -1) data.update_at = Util.now();
    if (fields.indexOf("updated_by") > -1) data.updated_by = res.locals.userId;
    return await connection.update({table: table, where: whereData, data: data});
}

zRoute.deleteSQL = async(table, id, company_id) => {
    let MYMODEL = require("./../models/" + table);
    let fields = MYMODEL.keys;

    var obj = {
        table : table
    }
    if (fields.indexOf("company_id") > -1){
        obj.where = {company_id : company_id};
    }

    let results = await connection.results(obj);
    if (results.length) {
        var where = {
            id : id
        }
        if (fields.indexOf("company_id") > -1){
            where['company_id'] = company_id;
        }

        await connection.delete({table: table, where: where})
        return results[0];
    } else {
        throw new Error('Data not found');
    }
}


module.exports = zRoute;