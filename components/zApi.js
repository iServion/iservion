/**
 * Created by sintret dev on 4/25/2022.
 */
const connection = require('./../config/connection');
var Util = require("./Util");
const moment = require('moment');
var Mail = require("./Mail");
var csrf = require('csurf');
var csrfProtection = csrf({cookie: true});
var zRoute = require('./zRoute');
var CONFIG = require('./../config/config');
var zRole = require('./zRole');
var moduleLib = require('./moduleLib');
var debug = require('./debug')
var io = require("./io");
var fs = require("fs");
var zSSH = require("./zSSH2");
var qs = require('qs')

var api = {}

api.compare = async(results,code, zapi) => {
    var companyId = zapi.company_id;
    var userId = zapi.created_by || 1;
    var id =zapi.id;

    var resultsArr = [], rowsArr = [];
    if(results.length == 0) {
        console.log("no results");
        return false;
    }
    results.forEach(function (item) {
        resultsArr.push(item.name);
    });
    var client = await connection.result({
        table : "client_pc",
        where : {
            company_id : companyId,
            code : code
        }
    });

    var rows = await connection.results({
        table : "application_list",
        where : {
            client_pc_id : client.id
        }
    });

    var resultsObj = Util.arrayToObject(results,"name");
    var rowsObj = Util.arrayToObject(rows,"name");


    console.log("results")
    console.log(JSON.stringify(resultsObj))

    console.log("rows")
    console.log(JSON.stringify(rowsObj))
    var obj = {
        versions : [],
        apps : [],
        removed : []
    }

    rows.forEach(function (item) {
        if(!Util.in_array(item.name,resultsArr)){
            obj.apps.push(item);
        } else{
            if(item.version != resultsObj[item.name].version) {
                console.log(`${item.name}` +item.version)
                console.log(`${item.name}` +resultsObj[item.name].version)
                obj.versions.push(item);
            }
        }
        rowsArr.push(item);
    });


    results.forEach(function (item) {
        if(!Util.in_array(item.name,rowsArr)){
            obj.removed.push(item);
        }
    });


    var html = ``;
    var isChange = false;
    if(obj.apps.length) {
        isChange = true;
        html += `<strong>New Apps</strong><br>`;
        obj.apps.forEach(function (item, idx) {
            html += `${(idx+1)}.  ${item.name} ${item.version}<br>`;
        });
    }

    if(obj.versions.length) {
        isChange = true;
        html += `<strong>New Versions</strong><br>`;
        obj.versions.forEach(function (item, idx) {
            html += `${(idx+1)}.  ${item.name} ${item.version}<br>`;
        });
    }

    if(obj.removed.length) {
        isChange = true;
        html += `<strong>Removed Apps</strong><br>`;
        obj.removed.forEach(function (item, idx) {
            html += `${(idx+1)}.  ${item.name} ${item.version}<br>`;
        });
    }

    if(isChange) {
        await connection.insert({
            table: "zactivity",
            data: {
                company_id: companyId,
                created_at: Util.now(),
                created_by: userId,
                updated_by: userId,
                user_id: userId,
                table: "client_pc",
                id_data: client.id,
                status: 1,
                status_label: "Changes",
                title: `Changes Apps  ${client.name}`,
                description: html,
                data: JSON.stringify(obj)
            }
        });
    }

    //console.log(html)

    return obj;
}

api.put=async(req,res)=>{
    var json = Util.flashError("API Error");
    var title = req.params.title;
    var token = req.headers["x-token"];
    var code=req.body.code;
    var userId = 1;
    var zapi= await connection.result({
        table : "zapi",
        where : {
            token : token
        }
    });
    if(!zapi.id) {
        res.json(json);
        userId = zapi.created_by;
        return false;
    }
    var companyId = zapi.company_id;
    if(title == "client") {
        json = Util.jsonSuccess("Success");
        let DIR_VIEW = dirRoot + "/public/uploads/zapi";
        if (!fs.existsSync(DIR_VIEW)){
            fs.mkdirSync(DIR_VIEW);
        }
        let files = qs.parse(req.files);
        let filename = `${code}.csv`;
        var results = await connection.results({
            table : "client_pc",
            where : {
                company_id : companyId,
                code : code
            }
        });

        if(!results.length) {
            return res.json(Util.flashError("Sorry code not found"))
        }
        var clientId = results[0].id;
        //save this for compare
        var previousResults = await connection.results({
            table : "application_list",
            where : {
                client_pc_id : clientId
            }
        });

        await connection.delete({
            table : "application_list",
            where : {
                client_pc_id : clientId
            }
        });

        for (var key in files) {
            files[key].mv(DIR_VIEW + "/" + filename, function (err) {
                if (err) {
                    json = Util.flashError(err);
                    return res.status(500).send(err);
                }
                var buffer  = fs.readFileSync(DIR_VIEW + "/" + filename, { encoding: "utf-16le" })
                var content = buffer.toString('utf-8');
                if (content) {
                    var lines = content.split("\r");
                    var num = 1;
                    lines.forEach(async function (line) {
                        if(line) {
                            var split = line.split(",");
                            var name = split[1];
                            var version = split[2];
                            //console.log(`Name : ${name}  Version : ${version}`);
                            var data = {
                                name : name,
                                version : version,
                                client_pc_id : clientId,
                                updated_at : Util.now(),
                                created_at : Util.now(),
                                updated_by : zapi.updated_by,
                                created_by:zapi.created_by,
                                company_id : zapi.company_id
                            }
                            if(num < 10) {
                               /* console.log(data)
                                console.log(num)*/
                            }
                            if(name && name != "Name") {
                                await connection.insert({
                                    table : "application_list",
                                    data : data
                                });
                            }
                        }

                        num++;
                    });


                    setTimeout(function () {
                        api.compare(previousResults, code, zapi).then(function (obj) {
                            //console.log(obj)
                        });
                    },3000);

                    res.json(json);

                } else {
                    res.json(Util.flashError("eror no file"));
                }
            });
        }
    } else {
        res.json(json);

    }
}

api.post=async(req,res) => {
    try {
        /*        console.log(req.body);
         return res.json(req.body)*/
        var title = req.params.title;
        var json = Util.flashError("API Error");
        json.items = [];
        var token = req.headers["x-token"];
        var zapi= await connection.result({
            table : "zapi",
            where : {
                token : token
            }
        });
        if(!zapi.id) {
            res.json(json);
            return false;
        }
        var companyId = zapi.company_id;
        var where = {
            company_id:companyId
        }
        if(title == "health") {
            json = Util.jsonSuccess("Success");
            if(req.body.server_id) {
                where['id'] = req.body.server_id;
            }
            var servers = await connection.results({
                table : "server",
                where : where
            });
            var items = {};
            for(var i = 0; i < servers.length; i++) {
                var server= servers[i];
                items[server.title] = [];
                var services = await connection.results({
                    table : "services",
                    where : {
                        server_id : server.id
                    }
                });
                services.forEach(function (item) {
                    items[server.title].push({
                        service : item.title,
                        status : item.status == 0 ? "Not Active" : "Active"
                    })
                })
            }
            json.items = items;
        } else if(title == "service") {
            json = Util.jsonSuccess("Success");
            if(req.body.server_id) {
                where['id'] = req.body.server_id;
            } else {
                return res.json(Util.flashError("server_id required"))
            }
            if(req.body.service) {
                var server= await connection.result({
                    table : "server",
                    where : where
                });
                var command =  `systemctl status  ${req.body.service}`;
                await zSSH.open(server, function (conn, error) {
                    if (error) {
                        return res.json(Util.flashError(error))
                    }

                    conn.exec(command, {}, (err, stream) => {
                        if (err) {
                            return res.json(Util.flashError(err));
                        }
                        console.log("Open ssh exec")

                        var html = "";
                        let code = 0;
                        var bufs = [];
                        stream.on('data', (data)=> {
                            bufs.push(data);
                            console.log(data)
                        });
                        stream.on('end', async() => {
                            var buf = Buffer.concat(bufs);
                            var string = buf.toString();
                            return res.json(Util.jsonSuccess(string));
                            conn.end();
                        });
                        stream.on('close', () => {
                            if (code !== 0) {
                                var msg = 'Do you have X11 forwarding enabled on your SSH server?';
                                //return res.json(Util.flashError(msg));
                            }
                            conn.end();
                        }).on('exit', (exitcode) => {
                            code = exitcode;
                        });
                    });
                });

            } else {
                return res.json(Util.flashError("service  required"))
            }
        }

    } catch (err) {
        res.json(err.toString)
    }
}


module.exports=api;