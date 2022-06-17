var router = require('express').Router();
const csrf = require('csurf');
var csrfProtection = csrf({cookie: true});
const fs = require('fs-extra');
var zRoute = require('./../components/zRoute');
var connection = require('./../config/connection');
var Util = require('./../components/Util');
var zRole = require('./../components/zRole');
var moduleLib = require('./../components/moduleLib');
var io = require("./../components/io");
var CONFIG = require("./../config/config");
var debug = require("./../components/debug");
var MYMODEL = require('./../models/server_type');

router.get('/', async (req, res) => {
    await zRoute.attributeData(res, MYMODEL);
    var relations = await zRoute.relations(req, res, MYMODEL.table);
    var DATA_TABLE = require('./../components/dataTable');
    var dataTable = new DATA_TABLE(res.locals.visiblesObj);
    dataTable.filterMODEL = await zRoute.dataTableFilter(MYMODEL, relations, res.locals.gridFilter);
    var levels = zRole.levels(MYMODEL.routeName, zRole.routes.indexOf(MYMODEL.routeName) > -1 ? await zRole.rules(res.locals.roleId) : {});
    dataTable.levels = levels;
    res.render(`layouts/${layout}`, {
        dataTable: dataTable,
        levels : levels,
        titleHeader: MYMODEL.title + " List",
        renderHead: `${MYMODEL.routeName}/indexcss.ejs`,
        renderBody: `${MYMODEL.routeName}/index.ejs`,
        renderEnd: `${MYMODEL.routeName}/indexjs.ejs`
    });
});

router.post('/list', async (req, res) => {
    var relations = await zRoute.relations(req, res, MYMODEL.table);
    var body = req.body;
    var fields = body.fields;
    var select = Util.selectMysql(fields);
    var whereArray = [];
    whereArray.push({
        field: "company_id",
        option: "=",
        value : res.locals.companyId,
        operator: "AND"
    });
    var columns = body.columns;
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
    res.json(data);
});

router.get('/create', csrfProtection, async(req, res) => {
    let data = MYMODEL.datas;
    //add script
    
    let relations = await zRoute.relations(req, res, MYMODEL.table);
    let zForms = zRoute.formField(req, res, MYMODEL, relations, data);
    await zRoute.moduleLib(req, res, MYMODEL, relations, zForms);
    res.render(`layouts/${layout}`, {
        data: data,
        zForms: zForms,
        relations: relations,
        titleHeader: LANGUAGE['form_create'] + ' ' + MYMODEL.title,
        csrfToken: req.csrfToken(),
        renderBody: `${MYMODEL.routeName}/create.ejs`,
        renderEnd: `${MYMODEL.routeName}/createjs.ejs`
    });
});


router.post('/create', csrfProtection, async (req, res) => {
    let json = Util.jsonSuccess(LANGUAGE['data_saved']);
    try {
        let userId = res.locals[CONFIG.generator.userId];
        let data = zRoute.post(req,res, MYMODEL)[MYMODEL.routeName];
        var validator = zRoute.validator(data, MYMODEL);
        if(validator.status == 0) return res.json(validator.message);
        var result = await zRoute.insertSQL(req, res, MYMODEL.table, data);
        
    } catch (err) {
        if(Object.prototype.hasOwnProperty.call(err,"sqlMessage")){
            json = Util.flashError(err.sqlMessage);
        } else {
            json = Util.flashError(err.toString());
        }
        debug(req, res, err);
    }
    res.json(json);
});

router.get('/update/:id', csrfProtection, async (req, res) => {
    let id = req.params.id;
    var results = await connection.results({table: MYMODEL.table, where: {id: id, company_id: res.locals.companyId}});
    if (results.length == 0) {
        req.session.sessionFlash = Util.flashError(LANGUAGE['data_not_found']);
        return res.redirect('/' + MYMODEL.routeName);
    }
    let data = results[0];
    //add script
    
    let relations = await zRoute.relations(req, res, MYMODEL.table);
    let zForms = zRoute.formField(req, res, MYMODEL, relations, data);

    await zRoute.moduleLib(req, res, MYMODEL, relations, zForms);
    res.render(`layouts/${layout}`, {
        data: data,
        zForms: zForms,
        relations: relations,
        titleHeader: LANGUAGE['form_update'] +' ' + MYMODEL.title,
        csrfToken: req.csrfToken(),
        renderBody: `${MYMODEL.routeName}/update.ejs`,
        renderEnd: `${MYMODEL.routeName}/updatejs.ejs`,
    });
});


router.post('/update/:id', csrfProtection, async (req, res) => {
    let json = Util.jsonSuccess(LANGUAGE['data_saved']);
    try {
        let id = req.params.id;
        let data = zRoute.post(req,res, MYMODEL)[MYMODEL.routeName];
        let validator = zRoute.validator(data, MYMODEL);
        if(validator.status == 0) return res.json(validator.message);
        var result = await zRoute.updateSQL(req, res,MYMODEL.table, data, {id:id} );
        
    } catch (err) {
        if(Object.prototype.hasOwnProperty.call(err,"sqlMessage")){
            json = Util.flashError(err.sqlMessage);
        } else {
            json = Util.flashError(err.toString());
        }
        debug(req, res, err)
    }
    res.json(json);
});

router.delete('/delete', async (req, res) => {
    let id = req.body.id;
    let json = Util.jsonSuccess(LANGUAGE['data_delete']);
    try {
        
        await zRoute.deleteSQL(MYMODEL.table, id, res.locals.companyId);
        
    } catch (err) {
        json = Util.flashError(err.toString());
        debug(req, res, err)
    }
    return res.json(json);
});


router.get('/view/:id', async (req, res) => {
    await zRoute.attributeData(res, MYMODEL);
    let id = req.params.id;
    let data = {}
    try {
        let results = await connection.results({table:MYMODEL.table,where:{id:id}});
        if (results.length == 0) {
            req.session.sessionFlash = Util.flashError(LANGUAGE['data_not_found']);
            return res.redirect('/' + MYMODEL.routeName);
        }
        data = await zRoute.viewTable(req, res, MYMODEL, results[0]);
    } catch (err){
        debug(req, res, err);
        res.send("Err");
    }
    res.render(`layouts/${layout}`, {
        data: data,
        Util:Util,
        levels: zRole.levels(MYMODEL.routeName, zRole.routes.indexOf(MYMODEL.routeName) > -1 ? await zRole.rules(res.locals.roleId) : {}),
        renderBody: `${MYMODEL.routeName}/view.ejs`
    });
});

router.get('/excel-query', async (req,res) => {
    await zRoute.excelQuery(req, res, MYMODEL);
});


router.get('/excel', async (req, res) => {
    let fields = MYMODEL.keysExcel;
    let results = await connection.results({
        table: MYMODEL.table,
        where: {company_id: res.locals.companyId},
        orderBy: ['id', 'DESC']
    });
    await zRoute.excel(req, res, MYMODEL, fields, results);
});

router.get('/sample', async (req, res) => {
    let fields = [];
    for (let i = 0; i < MYMODEL.keysExcel.length; i++) {
        if (!Util.in_array(MYMODEL.keysExcel[i], Util.nots)) {
                fields.push(MYMODEL.keysExcel[i]);
        }
    }
    let results = await connection.results({table:MYMODEL.table, where:{company_id:res.locals.companyId},orderBy:["id","desc"], limit:10})
    let callback = (result,field) => {
        return result[field];
    }
    await zRoute.excel(req, res, MYMODEL, fields, results, callback);
});

router.get('/import', async (req, res) => {
    let room = res.locals.token;
    res.render(`layouts/${layout}`, {
        room: room,
        titleHeader: 'Parsing / Import Form',
        renderBody: `${MYMODEL.routeName}/import.ejs`,
        renderEnd: `${MYMODEL.routeName}/importjs.ejs`
    });
});

router.post('/import', async(req, res) => {
    let userId = res.locals[CONFIG.generator.userId];
    let room = res.locals.token;
    let progress = 0;
    let datas = [];
    let headers = [];
    let dataObj = {};
    let fields = Object.keys(MYMODEL.fields);
    dataObj.type = MYMODEL.routeName;
    var jsonObj = {
        progress: progress,
        headers: headers,
        datas: datas
    };
    let json = Util.jsonSuccess(LANGUAGE['import_success']);
    try {
        if (Object.keys(req.files).length == 0) {
            return res.json(Util.flashError(LANGUAGE['import_no_file']));
        }
    } catch (err) {
        return res.json(Util.flashError(err.toString()));
    }
    let filename = `${dirRoot}/public/excel/tmp/${Util.generateUnique()}.xlsx`;
    let excelFile = req.files.excel, labels = MYMODEL.labels, keys = {};
    await Util.moveFile(excelFile, filename);
    io.to(room).emit('message', LANGUAGE['import_process']);
    const excelToJson = require('convert-excel-to-json');
    const toJson = excelToJson({source: fs.readFileSync(filename)});
    let result;
    for (var prop in toJson) {
        var i = 0;
        if (i == 0)  result = toJson[prop];
        i++;
    }
    if (!result.length) {
        var message = "No Data Found!!. Please uploading an excel file into 1 sheet only. Can not Multiple sheets";
        io.to(room).emit('message', message);
        res.json(Util.flashError(message));
        return;
    }
    var hd = '';
    for (var prop in result[1]) {
        var i = 0;
        keys[prop] = result[1][prop];
        hd += '' + result[0][prop] + '';
        headers.push({i: i, prop: prop, value: result[0][prop]});
        i++;
    }
    hd += ' ' + LANGUAGE['noted'] + ' ';
    dataObj.msg = hd;
    io.to(room).emit('import', hd);
    for (var i = 3; i < result.length; i++) {
        var data = {}
        for (var prop in result[i]) {
            var value = result[i][prop] || '';
            data[keys[prop]] = value;
        }
        hd += '';
        for (var u = 0; u < headers.length; u++) {
            if (Object.prototype.hasOwnProperty.call(result[i], headers[u].prop)) {
                hd += '' + result[i][headers[u].prop] + '';
            } else {
                hd += ' ';
            }
        }
        try {
            if (Util.in_array("company_id", fields)) data.company_id = res.locals.companyId;
            if (Util.in_array("created_at", fields)) data.created_at = Util.now();
            if (Util.in_array("created_by", fields)) data.created_by = res.locals.userId;
            if (Util.in_array("updated_at", fields)) data.updated_at = Util.now();
            if (Util.in_array("updated_by", fields)) data.updated_by = res.locals.userId;

            var insert = await connection.insert({table: MYMODEL.table, data: data});
            hd += '' + LANGUAGE['success'] + '';
        } catch (err) {
            hd += '' + err + '';
        }
        hd += '';
        dataObj.msg = hd;
        io.to(room).emit('import', hd);
        fs.removeSync(filename)
    }
    res.json(json);
})

router.post('/grid', zRoute.postGrid);
router.post('/reload', zRoute.postGridReload);
router.post('/chains', zRoute.chains);
module.exports = router;