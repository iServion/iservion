var express = require('express');
var router = express.Router();
var connection = require('./../config/connection');
var Util = require('./../components/Util')
var moment = require('moment');
const fs = require('fs-extra')
var moduleLib = require('./../components/moduleLib');
var access = require("./../components/access");
var zRoute = require('./../components/zRoute');
var zRole = require('./../components/zRole');
var zSSH2 = require('./../components/zSSH2');
var io = require('./../components/io')
var debug = require("./../components/debug");


router.get('/', async function (req, res) {
    //pooling for the server
    try {
        await zSSH2.sync(req,res);
    } catch(err) {
        setTimeout(function () {
            console.log(err)
            io.to(res.locals.token).emit("error", err.toString());
        },3000);
    }
    var isSetup = false;
    if (req.query.setup == "role") {
        isSetup = true;
    }
    var dashboardPanel = `<ul class="server">`;
    var servers = await connection.results({
        table: "server",
        where : {
            status : 1,
            company_id : res.locals.companyId
        }
    });

    var services = {}
    var rows = await connection.results({
        table : "services",
        where : {
            company_id : res.locals.companyId
        },
        orderBy : ["title","asc"],
/*        limit : 10,
        offset : 1*/
    });
    rows.forEach(function (item) {
        if(!services[item.server_id]) {
            services[item.server_id] = [];
        } else {
            services[item.server_id].push(item);
        }
    });
    var id = req.query.id || null;
    var num=1;
    servers.forEach((item)=>{
        var classActive =  num ==1?`class="active"`:`` ;
        if(id) {
            classActive = id == item.id ? `class="active"`:`` ;
        } else {
            id = item.id;
        }
        dashboardPanel += `
                        <li ${classActive} >
                            <a href="/zdashboard?id=${item.id}">
                                <p>${item.title}</p>
                                <span>${item.host}</span>
                            </a>
                        </li>
                       
                    `;
        num++;
    });

    dashboardPanel += `</ul>`;
    var datas =services[id] || [];
    var count = datas.length || 0;
    var countLeft = count ? count/2 : 0;
    var countPage = count ? Math.round(count / 20) : 0;


    res.render("layouts/" + layout, {
        titleHeader: " Dashboard  ",
        isSetup: isSetup,
        servers: servers,
        services: services,
        dashboardPanel:dashboardPanel,
        company_name : res.locals.companyName,
        companyName : null,
        id:id,
        datas:datas,
        count:count,
        countLeft:countLeft,
        countPage:countPage,
        renderBody: "zdashboard/index2.ejs",
        renderEnd: "zdashboard/indexjs2.ejs"
    });
});

router.post('/exec', async function (req, res) {
    res.json(await zSSH2.execCommand(req,res,req.body.id));
});


router.post('/sftp', async function (req, res) {
    console.log(req.body)
    try {
        zSSH2.open(req.body.id, function (conn, err) {
            if(err) {
                debug(req,res, err);
                return false;
            }

            var html = ' ';
            conn.sftp((err, sftp) => {
                if (err) throw err;
                var remoteDir = "/home";
                sftp.readdir(remoteDir, (err, list) => {
                    if (err) throw err;
                    let count = list.length;
                    list.forEach(item => {
                            let remoteFile = remoteDir + '/' + item.filename;
                            let localFile = dirRoot + '/public/uploads/services/' + item.filename;
                            console.log('Downloading ' + remoteFile);
                            io.to(res.locals.token).emit("message",'Downloading ' + remoteFile);
                            sftp.fastGet(remoteFile, localFile, (err) => {
                                if (err) {
                                    io.to(res.locals.token).emit("error",remoteFile + ' to ' + localFile + ' Failed ...');
                                    io.to(res.locals.token).emit("error",err.toString());
                                    html +=  remoteFile + ' to ' + localFile + ' Failed <br> ';
                                } else {
                                    html += `${remoteFile} to <a href="/uploads/services/${item.filename}" target="_blank">${localFile}</a> Success <br>`;
                                }
                                console.log('Downloaded to ' + localFile);
                                io.to(res.locals.token).emit("message",'Downloaded to ' + localFile);
                                count--;
                                if (count <= 0) {
                                    conn.end();
                                    res.json(html);
                                }
                            });
                    });
                });
            });
        });
    } catch (err) {
        console.log(err)
        debug(req,res,err);
        res.json(err);
    }

});

module.exports = router;