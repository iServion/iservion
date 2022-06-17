var express = require('express');
var router = express.Router();
var zRole = require("./../components/zRole")
var Util = require('./../components/Util');
var Excel = require('exceljs');
// setup route middlewares
var csrf = require('csurf')
var bodyParser = require('body-parser')
var parseForm = bodyParser.urlencoded({extended: true})
var csrfProtection = csrf({cookie: true})
var connection = require("./../config/connection");
var zCache = require("./../components/zCache");

router.get('/', csrfProtection, async function (req, res, next) {
    var id = req.query.id;
    if (id == undefined)
        id = 1;

    var model = await connection.results({
        table : "zrole",
        where : {
            id : id
        }
    })
    var json = model[0].params ;
    var routes = zRole.routes;
    var results = await connection.results({table:"zrole"});

    res.render("layouts/"+layout, {
        model: model,
        table: "zrole",
        id: id,
        actions: zRole.actions,
        routes: routes,
        json: json,
        results: results,
        csrfToken: req.csrfToken(),
        renderBody: "zrole/index.ejs",
        renderEnd: "zrole/indexjs.ejs"
    });
})

router.post('/update/:id',async function (req, res, next) {
    console.log("ok")
    var data = {};
    var name = req.body.name;
    var params = req.body.params;
    var newKey = {}
        Object.keys(params).map( (key) => {
            var arr = [];
            for (var k in params[key]) {
                arr.push(k);
            }
            newKey[key] = arr;
        });


    var json = {}
    json.params = JSON.stringify(newKey);
    try {

        await connection.update({
            table : "zrole",
            data : {
                params : json.params
            },
            where : {
                id : req.params.id
            }
        })
        data.status = 1;
        data.data = 1;
        await zCache.ROLES();
        res.json(data);
    } catch (error) {
        data.status = 0;
        data.data = error;
        res.json(data);
    }

});

module.exports = router;
