var router = require('express').Router();
const csrf = require('csurf');
var csrfProtection = csrf({cookie: true});
const fs = require('fs-extra');
var zRoute = require('./../components/zRoute')
var connection = require('./../config/connection');
var Util = require('./../components/Util');
var zRole = require('./../components/zRole');
var moduleLib = require('./../components/moduleLib');
var io = require("./../components/io");
var CONFIG = require("./../config/config");
var debug = require("./../components/debug");
var MYMODEL = require('./../models/zreport');
var zReport = require('./../components/zReport');
var zCache = require('./../components/zCache');

var setupAccess = async(req, res, next) => {
    var levels = zRole.levels(MYMODEL.routeName, zRole.routes.indexOf(MYMODEL.routeName) > -1 ? await zRole.rules(res.locals.roleId) : {});
    if (levels.create && levels.update) {
        next();
    } else {
        return res.redirect('/zreport');
    }
}

var access = async(req, res, next) => {
    var levels = zRole.levels(MYMODEL.routeName, zRole.routes.indexOf(MYMODEL.routeName) > -1 ? await zRole.rules(res.locals.roleId) : {});
    if (levels.index) {
        next();
    } else {
        return res.redirect('/login');
    }
}

router.get('/', async(req, res) => {
    await zRoute.attributeData(res, MYMODEL);
    var relations = await zRoute.relations(req, res, MYMODEL.table);
    var DATA_TABLE = require('./../components/dataTable');
    var dataTable = new DATA_TABLE(res.locals.visiblesObj);
    dataTable.filterMODEL = await zRoute.dataTableFilter(MYMODEL, relations);
    res.render(`layouts/${layout}`, {
        dataTable: dataTable,
        titleHeader: MYMODEL.title + " List",
        renderHead: `${MYMODEL.routeName}/indexcss.ejs`,
        renderBody: `${MYMODEL.routeName}/index.ejs`,
        renderEnd: `${MYMODEL.routeName}/indexjs.ejs`
    });
});

router.post('/list', async(req, res) => {
    var relations = await zRoute.relations(req, res, MYMODEL.table);
    var body = req.body;
    var fields = body.fields;
    var select = Util.selectMysql(fields);
    var whereArray = [];
    var columns = body.columns;
    columns.forEach(function (item) {
        if (item.search.value) {
            whereArray.push({
                field: fields[item.data],
                option: MYMODEL.options[fields[item.data]],
                value: item.search.value,
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
        offset: body.start,
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
                zRoute.actionButtons(levels, row, MYMODEL.table, function (cb) {
                    var buttons = cb.arr.splice(0, 3);
                    if(!row.parent_id){
                        if(row.excel) {
                            buttons.push(`<i onclick="location.href='/zreport/setup/${row.id}'" class="fa fa-cog boxy-small btn-danger btn-rounded"></i>`);
                            buttons.push(`<i onclick="location.href='/zreport/show/${row.id}/${row.title}'" class="fa fa-plane boxy-small btn-success btn-rounded"></i>`);
                            buttons.push(`<i class="fa fa-copy  can-copy-pure boxy-small btn-default btn-rounded" data-name="zreport/show/${row.id}/${row.title}" title="click to copy"></i>`);
                        }
                    } else {
                        if(row.excel) {
                            buttons.push(`<i onclick="location.href='/zreport/setup/${row.id}'" class="fa fa-cog boxy-small btn-danger btn-rounded"></i>`);
                            buttons.push(`<i onclick="location.href='/zreport/show/${row.id}/${row.title}'" class="fa fa-plane boxy-small btn-success btn-rounded"></i>`);
                            buttons.push(`<i class="fa fa-copy  can-copy-pure boxy-small btn-default btn-rounded" data-name="zreport/show/${row.id}/${row.title}" title="click to copy"></i>`);
                        }
                    }

                    arr.push(buttons)
                });
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
    res.json(data);
});


router.get('/show/:id/:title', access, csrfProtection, async(req, res) => {
    var id = req.params.id;
    var title = req.params.title;
    var html = await zReport.show(id, res.locals.companyId,req.csrfToken(), true)
    await moduleLib.datepicker(req, res);

    res.render(`layouts/${layout}`, {
        html: html,
        title: title,
        userId: res.locals.userId,
        levels: zRole.levels(MYMODEL.routeName, zRole.routes.indexOf(MYMODEL.routeName) > -1 ? await zRole.rules(res.locals.roleId) : {}),
        renderHead: `${MYMODEL.routeName}/gridcss.ejs`,
        renderBody: `${MYMODEL.routeName}/show.ejs`,
        renderEnd: `${MYMODEL.routeName}/gridjs.ejs`,
    });
});


router.get('/create', csrfProtection, async(req, res) => {
    let data = MYMODEL.datas;
    let relations = await zRoute.relations(req, res, MYMODEL.table);
    let zForms = zRoute.formField(req, res, MYMODEL, relations, data);
    //add script
    await zRoute.moduleLib(req, res, MYMODEL, relations, zForms);
    var tables = zCache.get("TABLES");
    var objCache = zCache.get("MYMODELS");
    var obj = {}
    for (var key in objCache) {
        obj[key] = objCache[key].labels;
    }

    res.render('layouts/' + layout, {
        data: data,
        zForms: zForms,
        relations: relations,
        obj: obj,
        tables: tables,
        titleHeader: LANGUAGE['form_create'] + ' ' + MYMODEL.title,
        csrfToken: req.csrfToken(),
        renderBody: MYMODEL.routeName + '/create.ejs',
        renderEnd: MYMODEL.routeName + '/createjs.ejs'
    });
});

router.post('/create', csrfProtection, async(req, res) => {
    let json = Util.jsonSuccess(LANGUAGE['data_saved']);
    try {
        let userId = res.locals[CONFIG.generator.userId];
        let data = zRoute.post(req, res, MYMODEL)[MYMODEL.routeName];
        var validator = zRoute.validator(data, MYMODEL);
        if (validator.status == 0) return res.json(validator.message);

        var result = await zRoute.insertSQL(req, res, MYMODEL.table, data);

    } catch (err) {
        if (Object.prototype.hasOwnProperty.call(err, "sqlMessage")) {
            json = Util.flashError(err.sqlMessage);
        } else {
            json = Util.flashError(err.toString());
        }
        debug(req, res, err);
    }
    res.json(json);
});

router.get('/update/:id', csrfProtection, async(req, res) => {
    let id = req.params.id;
    var results = await connection.results({table: MYMODEL.table, where: {id: id, company_id: res.locals.companyId}});
    if (results.length == 0) {
        req.session.sessionFlash = Util.flashError(LANGUAGE['data_not_found']);
        return res.redirect('/' + MYMODEL.routeName);
    }
    let data = results[0];
    if (data.parent_id) {
        if (data.parent_id == id) {
            return res.json(Util.flashError("Parent Id wrong"));
        }
    }

    let relations = await zRoute.relations(req, res, MYMODEL.table);
    let zForms = zRoute.formField(req, res, MYMODEL, relations, data);
    //add script
    await zRoute.moduleLib(req, res, MYMODEL, relations, zForms);
    var tables = zCache.get("TABLES");
    var objCache = zCache.get("MYMODELS");
    var obj = {}
    for (var key in objCache) {
        obj[key] = objCache[key].labels;
    }
    res.render('layouts/' + layout, {
        data: data,
        zForms: zForms,
        relations: relations,
        tables: tables,
        obj: obj,
        titleHeader: LANGUAGE['form_update'] + ' ' + MYMODEL.title,
        csrfToken: req.csrfToken(),
        renderBody: MYMODEL.routeName + '/update.ejs',
        renderEnd: MYMODEL.routeName + '/updatejs.ejs'
    });
});


router.post('/update/:id', csrfProtection, async(req, res) => {
    let json = Util.jsonSuccess(LANGUAGE['data_saved']);
    try {
        let id = req.params.id;
        console.log(req.body)

        let data = zRoute.post(req, res, MYMODEL)[MYMODEL.routeName];
        let validator = zRoute.validator(data, MYMODEL);
        if (validator.status == 0) return res.json(validator.message);
        if (data.parent_id == id) {
            return res.json(Util.flashError("Parent can not self"));
        }
        var result = await zRoute.updateSQL(req, res, MYMODEL.table, data, {id: id});

    } catch (err) {
        if (Object.prototype.hasOwnProperty.call(err, "sqlMessage")) {
            json = Util.flashError(err.sqlMessage);
        } else {
            json = Util.flashError(err.toString());
        }
        debug(req, res, err)
    }
    res.json(json);
});

router.delete('/delete', async(req, res) => {
    let id = req.body.id;
    let json = Util.jsonSuccess(LANGUAGE['data_delete']);
    try {

        await zRoute.deleteSQL(MYMODEL.table, id, res.locals.companyId);

    } catch (err) {
        if (Object.prototype.hasOwnProperty.call(err, "sqlMessage")) {
            json = Util.flashError(err.sqlMessage);
        } else {
            json = Util.flashError(err.toString());
        }
        debug(req, res, err)
    }
    return res.json(json);
});


//UI FOR Setiing custom report
// for setup custom reports

router.get("/setup/:id", setupAccess, async(req, res) => {
    try {
        let userId = res.locals.userId;
        let companyId = res.locals.companyId;
        let id = req.params.id;
        let dir = dirRoot + "/public/uploads/zreport/";
        let toJson, data, results, excelData = {}, max = 0, table, selectFromTable = {};
        let objQuery = {};
        let filter = {};
        let sessions = {};

        let row = await connection.results({
            table: "zreport",
            where: {
                id: id,
                company_id: companyId
            }
        })
        if (row.length > 0) {
            var hasParent = row[0].parent_id ? true : false;
            console.log(hasParent)
            if (hasParent) {
                var parent = await connection.result({
                    table: "zreport",
                    where: {
                        id: row[0].parent_id
                    }
                })
                console.log(parent)
                filter = parent.filters ? parent.filters : [];
            } else {
                filter = row[0].filters ? row[0].filters : [];
            }
            data = row[0];
            let json = data.json ? data.json : {};
            data.query = json.query || "";
            data.file = row[0].excel;
            data.excel = json.excel || [];
            data.where = json.filter || {};
            //sessions = cRoute.getSessionsData(req,res, filter);
            data.selectFromTable = selectFromTable = json.selectFromTable || {};
            var filename = data.file;
            if (!filename) {
                return res.json(Util.flashError("No excel file!!"));
            }
            let reportData = zReport.reportData(dir + filename, data, sessions);
            table = reportData.table,
                max = reportData.max,
                excelData = reportData.excelData,
                objQuery = reportData.objQuery,
                results = reportData.results;
        }

        //get all models
        let MYMODELS = zCache.get("MYMODELS");
        //console.log(MYMODELS)
        //set as object for table key and callback value
        let objTableKeyCallback = {}
        data.excel.map((m) => {
            objTableKeyCallback[m.title + "___" + m.value] = m.callback;
        });
        var datawheres = data.wheres || [];
        var wheres = [];
        for(var i =0; i < 4; i++) {
            wheres[i] = !datawheres[i] ? "" : datawheres[i];
        }

        res.render("layouts/" + layout, {
            table: table,
            data: data,
            max: max,
            objQuery: objQuery,
            excelData: excelData,
            results: results,
            filters: filter,
            MYMODELS: MYMODELS,
            objVirtual: {},
            excelsq: Util.excelSequence(),
            wheres :wheres,
            objTableKeyCallback: objTableKeyCallback,
            selectFromTable: selectFromTable,
            images: CONFIG.generator.imagesName,
            renderHead: `${MYMODEL.routeName}/setupcss.ejs`,
            renderBody: `${MYMODEL.routeName}/setup.ejs`,
            renderEnd: `${MYMODEL.routeName}/setupjs.ejs`,
        });
    } catch (err) {
        debug(req, res, err);
        //res.json(err)
    }
});


// post report settings excel,query,sql,filter etc
router.post('/setup', setupAccess, zReport.reportPostData);
router.post('/report', access, zReport.submitReport);
router.post('/add_query', access, zReport.updateQuery);
router.get('/view/:id', async(req, res) => {
    await zRoute.attributeData(res, MYMODEL);
    let id = req.params.id;
    let data = {}
    try {
        let results = await connection.results({table: MYMODEL.table, where: {id: id}});
        if (results.length == 0) {
            req.session.sessionFlash = Util.flashError(LANGUAGE['data_not_found']);
            return res.redirect('/' + MYMODEL.routeName);
        }
        data = await zRoute.viewTable(req, res, MYMODEL, results[0]);
    } catch (err) {
        debug(req, res, err);
        res.send("Err");
    }
    res.render(`layouts/${layout}`, {
        data: data,
        Util: Util,
        levels: zRole.levels(MYMODEL.routeName, zRole.routes.indexOf(MYMODEL.routeName) > -1 ? await zRole.rules(res.locals.roleId) : {}),
        renderBody: `${MYMODEL.routeName}/view.ejs`
    });
});

module.exports = router;