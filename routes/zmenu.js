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

router.get('/', async function (req, res, next) {
    if (!res.locals.isLogin) return res.redirect("/login");
    let menuApp = "Menu Generator ";
    let name = req.query.name || "standart";
    let arr = [{"text":"Home","href":"zdashboard","icon":"fas fa-home","target":"_self","title":""}];
    let isMenu = true;
    let companyId = res.locals.companyId;
    let id = req.query.id || 0;
    let findArr = [];
    let idChanges;
    let rows= await connection.results({
        table: "zmenu",
        where : {
            company_id : companyId
        }
    })
    if (rows.length > 0) {
        isMenu = true;
        //check id changes
        let rowsChanges = rows.filter((item) => item.active == 1);
        idChanges = rowsChanges[0].id;
        if (id) {
            await connection.update({
                table : "zmenu",
                where : {
                    active : 0,
                    company_id: companyId
                }
            })
            await connection.update({
                table : "zmenu",
                where : {
                    active : 1,
                    id: id
                }
            });

        } else {
            id =1;
            let selected = rows.filter(item=>item.active == 1)[0] || {}
            id = selected.id;
            name = selected.name;
        }
    }

    findArr = await connection.results({
        table:"zmenu",
        where: {
            id:id
        }
    });

    arr = findArr[0].json;
    let refresh = 0;
    if (id != idChanges) {
        refresh = 1;
    }
    zCache.MENU();
    if (!res.locals.isLogin) {
        return res.redirect("/")
    }
    res.render("zgenerator/layout", {
        isMenu: isMenu,
        rows: rows,
        name: name,
        arr: arr,
        id: id,
        refresh: refresh,
        Util: Util,
        menuApp: "Menu Generator",
        renderHead: "zmenu/indexcss.ejs",
        renderBody: "zmenu/index.ejs",
        renderEnd: "zmenu/indexjs.ejs"
    });
})


router.post('/', csrfProtection, async(req,res) => {
    let body = req.body;
    let companyId = res.locals.companyId;
    let name = body.name;
    let json = body.json || [];
    if (name == "")
        return res.json(Util.jsonError("name", "name can not be blank!"))

    let data = {
        company_id: companyId,
        json: json,
        name: name,
        updated_by: res.locals.userId
    }

    let cb = Util.jsonSuccess("Success.. Please relogin to see the changes!");
    try {
        let rows = await connection.results({
            table : "zmenu",
            where : {
                company_id : companyId,
                name: name
            }
        });
        console.log(rows)
        //let rows = await connection.query("SELECT * FROM `zmenu` WHERE `company_id` = ? AND `name` = ?", [companyId, name]);
        if (rows.length > 0) {
            await connection.update({
                table : "zmenu",
                data:data,
                where : {
                    id:rows[0].id
                }
            })
            //await connection.query("UPDATE `zmenu` SET ? WHERE id = ?", [data, rows[0].id])
        } else {
            //await connection.query("INSERT INTO `zmenu` SET ?", [data])
            data.created_by = res.locals.userId;
            await connection.insert({
                table : "zmenu",
                data : data
            })
        }
    } catch (e) {
        cb = Util.flashError(JSON.stringify(e))
    }
    zCache.MENU();

    res.json(cb)
})

module.exports = router;
