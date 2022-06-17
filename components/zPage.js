/**
 * For dynamic page
 */
const Util = require('./Util')
var connection = require('./../config/connection');
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
var MYMODEL = require('./../models/zpage');
var pm2 = require('pm2');


var zpage = {}

zpage.create = async(req, res) => {
    var results = await connection.results({
        table : "zpage",
        where : {
            active : 1
        }
    });
    var server_code  = zpage.coreCode();
    server_code += Util.newLine;
    server_code += Util.newLine;
    server_code += Util.newLine;

    var METHOD = MYMODEL.widgets.method.fields;
    results.forEach(function (result) {
        server_code += `router.${METHOD[result.method]}('${result.page}', async(req,res) => { ${Util.newLine}`;
        server_code += `res.locals.renderBody = 'zindex/page${result.id}.ejs';`;
        server_code += Util.newLine;

        server_code += `${result.server_code} ${Util.newLine}`;

        server_code += `});`;
        server_code += Util.newLine + Util.newLine;


        var dir = dirRoot + "/views/zindex";
        fs.writeFileSync(`${dir}/page${result.id}.ejs`, result.client_code, 'utf-8');
    });
    server_code += Util.newLine;
    server_code += `module.exports = router;`;

    fs.writeFileSync(dirRoot + "/routes/zindex.js", server_code, 'utf-8');


    if(CONFIG.environment == "production") {
        setTimeout(function () {
            pm2.connect(function (err) {
                if (err) {
                    console.log(err.toString());
                }
                pm2.restart(CONFIG.app.pm2, (err, proc) => {
                    //io.to(room).emit("message","Restart done")
                });
            });
        },3000)
    }
}


zpage.layout = async(obj) =>{
    if(obj.code) {
        var dir = dirRoot + "/views/layouts";
        fs.writeFileSync(`${dir}/${obj.name}.ejs`, obj.code, 'utf-8');
        if(CONFIG.environment == "production") {
            setTimeout(function () {
                pm2.connect(function (err) {
                    if (err) {
                        console.log(err.toString());
                    }
                    pm2.restart(CONFIG.app.pm2, (err, proc) => {
                        //io.to(room).emit("message","Restart done")
                    });
                });
            },3000)
        }
    }
}

zpage.layoutDelete = async(name) => {
    var path = `${dirRoot}/views/layouts/${name}.ejs`;
    try {
        fs.unlinkSync(path);
        //file removed
        if(CONFIG.environment == "production") {
            setTimeout(function () {
                pm2.connect(function (err) {
                    if (err) {
                        console.log(err.toString());
                    }
                    pm2.restart(CONFIG.app.pm2, (err, proc) => {
                        //io.to(room).emit("message","Restart done")
                    });
                });
            },3000)

        }
    } catch(err) {
        console.error(err)
    }
}

zpage.layoutCheck = async(name) => {
    try {
        var dir = dirRoot + "/views/layouts";
        var path = dir+name+".ejs";
        if (fs.existsSync(path)) {
            //file exists
            return true;
        } else {
            return false;
        }
    } catch(err) {
        console.error(err)
        return true;
    }
}

zpage.coreCode = () => {
    return `var router = require('express').Router();
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
var debug = require("./../components/debug");`;
}

module.exports = zpage;