/**
 * Created by ANDHIE on 3/8/2022.
 */
var connection = require('./../config/connection');
const path = require('path');
var io = require('./io');
const Util = require('./Util')
const fs = require('fs');
const {Client} = require('ssh2');
var debug = require('./debug');

var zSSH = {}

/*
 Open server
 */
zSSH.open = async(server, callback) => {
    try {
        if (typeof server != "object") {
            var server = await connection.result({
                table: "server",
                where: {
                    id: server
                }
            });
        }
        var password = server.password;
        var config = {
            host: server.host,
            port: 22,
            username: server.username,
        }
        if (password) {
            config.password = server.password;
        } else {
            var pathFile = `${dirRoot}/public/uploads/server/${server.file}`;
            config.privateKey = fs.readFileSync(pathFile)
            if (!fs.existsSync(pathFile)) {
                callback(null, "no privateKey file found");
                return false;
            }
        }
        const conn = new Client();
        conn.on('ready', () => {
            console.log("ready for server " + server.id);
            callback(conn, null);
        }).on('error', (err) => {
            console.log("Err" + server.id)
            callback(null, "Error : " + err.toString());
        }).
        connect(config);
    } catch (err) {
        callback(null, "Error : " + err.toString());
    }
}

zSSH.sync = async(req, res)=> {
    var userId = res.locals.userId;
    var companyId = res.locals.companyId;
    var servers = await connection.results({
        table: "server",
        where: {
            status: 1,
            company_id : companyId
        }
    });
    //loop
    for (var i = 0; i < servers.length; i++) {
        var server = servers[i]
        var services = await connection.results({
            table: "services",
            where: {
                server_id: server.id,
                company_id:res.locals.companyId
            }
        });
        var serviceObj = Util.arrayToObject(services, "title");
        //find all services
        await zSSH.services(req, res, server, serviceObj);
    }
}

zSSH.services = async(req, res, server, serviceObj = {}) => {
    zSSH.open(server, async (conn, error) => {
        if (error) {
            debug(req, res, `${server.title} : ${error}`);


            await connection.update({
                table : "server",
                data : {
                    status : 0,
                    alert : 0
                },
                where : {
                    id: server.id,
                    company_id:res.locals.companyId
                }
            });
            return false;
        }
        console.log('Client :: ready ' + server.id);
        conn.exec('systemctl list-unit-files --type=service', {}, (err, stream) => {
            if (err) {
                var message = `${server.title} has errors  ${err.toString()}`;
                //console.log(message)
                //io.to(res.locals.token).emit("error", err.toString());
                debug(req,res, message);
                return false;
            }
            let code = 0;
            var bufs = [];
            stream.on('data', (data)=> {
                bufs.push(data);
            });
            stream.on('end', async() => {
                var services = Object.keys(serviceObj);
                var buf = Buffer.concat(bufs);
                var string = buf.toString();
                //console.log(`${server.title} ${string}`)
                var lines = string.split("\n");
                var arr = [];
                for (var i = 0; i < lines.length; i++) {
                    var obj = zSSH.splitString(lines[i]);
                    if (obj.status == "enabled") {
                        arr.push(obj.title);
                        if (!serviceObj[obj.title]) {
                            await connection.insert({
                                table: "services",
                                data: {
                                    title: obj.title,
                                    status: 1,
                                    server_id: server.id,
                                    company_id: res.locals.companyId
                                }
                            });
                        } else {
                            await connection.update({
                                table: "services",
                                data: {
                                    status: 1
                                },
                                where: {
                                    title: obj.title,
                                    server_id: server.id
                                }
                            });
                        }
                    }
                }
                //close connection
                conn.end()
                //find all dead services
                await zSSH.deadServices(req, res, server, serviceObj);
            });
            stream.on('close', () => {
                if (code !== 0) {
                    io.to(res.locals.token).emit("message", `Server ${server.title}, Nothing happend`)
                }
                conn.end();
            }).on('exit', (exitcode) => {
                code = exitcode;
            });
        });
    });
}


zSSH.deadServices = async(req, res, server, serviceObj = {}) => {
    try {
        zSSH.open(server, function (conn, error) {
            if (error) {
                debug(req, res, error);
                return false;
            }
            conn.exec('systemctl list-units -a --state=dead', {cwd: "/var"}, (err, stream) => {
                if (err) {
                    //io.to(res.locals.token).emit("error", err.toString());
                    debug(req,res, `${server.title} : ${err.toString()}`);
                    return false;
                }
                let code = 0;
                var bufs = [];
                stream.on('data', (data)=> {
                    bufs.push(data);
                });
                stream.on('end', async() => {
                    var services = Object.keys(serviceObj);
                    var buf = Buffer.concat(bufs);
                    var string = buf.toString();
                    //console.log(string);
                    //console.log("end -- ");
                    var lines = string.split("\n");
                    for (var i = 0; i < lines.length; i++) {
                        var obj = zSSH.parseString(lines[i]);
                        if (obj.title) {
                            if (serviceObj.hasOwnProperty(obj.title)) {
                                //console.log(obj)
                                await connection.update({
                                    table: "services",
                                    data: {
                                        status: 0
                                    },
                                    where: {
                                        server_id: server.id,
                                        title: obj.title
                                    }
                                });
                            }
                        }
                    }
                    conn.end()
                });

                stream.stderr.on('data', function err(data) {
                    var string = data.toString();
                    if(string.length > 2) {
                        io.to(res.locals.token).emit("error", data.toString());
                    }
                });

                stream.on('close', () => {
                    if (code !== 0) {
                        //io.to(res.locals.token).emit("message", `Server ${server.title}, Do you have X11 forwarding enabled on your SSH server?`)
                    }
                    conn.end();
                }).on('exit', (exitcode) => {
                    code = exitcode;
                });
            });

        });

    } catch (err) {
        console.log(err);
    }
}

zSSH.exec = async(server, command, callback) => {
    try {
        zSSH.open(server, function (conn, error) {
            if (error) {
                //debug(req,res,error);
                callback({
                    status: 0,
                    data: error
                });
                return false;
            }
            conn.exec(command, (err, stream) => {
                if (err) {
                    callback({
                        status: 0,
                        data: err.toString()
                    });
                    return false;
                }
                let code = 0;
                var bufs = [];
                stream.on('data', (data)=> {
                    bufs.push(data);
                });
                stream.on('end', async() => {
                    var buf = Buffer.concat(bufs);
                    var string = buf.toString();
                    console.log(string)
                    var html = "";
                    if (string) {
                        var lines = string.split("\n");
                        lines.forEach(function (line) {
                            html += `${line}<br>`;
                        });
                    }
                    conn.end();
                    callback({
                        status: 1,
                        data: html
                    });
                });

                stream.stderr.on('data', function err(data) {
                    var string = data.toString();
                    if(string.length > 2) {
                        callback({
                            status: 1,
                            data: string
                        });
                    }
                });

                stream.on('close', () => {
                    if (code !== 0) {
                        var msg = 'Nothing happend';
                        callback({
                            status: 0,
                            data: msg
                        });
                    }
                    conn.end();
                }).on('exit', (exitcode) => {
                    code = exitcode;
                });
            });
        });
    } catch (err) {
        console.log(err);
    }
};

zSSH.execCommand = async(req, res) => {
    var id = req.body.id;
    var command = await connection.result({
        table: "commands",
        where: {
            id: id
        }
    });
    var server = await connection.result({
        table: "server",
        where: {
            id: command.server_id
        }
    });

    if (command.long_command) {
        await zSSH.parseCommand(req, res, server, command);
    } else {
        await zSSH.exec(server, command.command, (data) => {
            if (data.status == 0) {
                io.to(res.locals.token).emit("error", data.data);
            }
            res.json(data.data);
        });
    }
}

zSSH.parseCommand = async(req, res, server, command) => {
    await zSSH.open(server, function (conn, error) {
        if (error) {
            debug(req, res, error);
            res.json(error)
            return false;
        }
        var modal = (string) => {
            return res.json(string);
        }
        var toastr = {
            error: (string) => {
                io.to(res.locals.token).emit("error", string);
            },
            message: (string) => {
                io.to(res.locals.token).emit("message", string);
            }
        }
        var CALL = {
            res: res,
            server: server,
            command: command,
            conn: conn,
            io: io,
            fs: fs,
            dirRoot: dirRoot,
            dir: dirRoot + "/public/uploads/services",
            modal: modal,
            toastr: toastr
        }
        var mycommand = "";
        for (var key in CALL) {
            mycommand += `var ${key} = this.${key};`
        }
        mycommand += `\r\n`;
        mycommand += command.long_command;
        try {
            return Function(`${mycommand}`).call(CALL);
        } catch (err) {
            debug(req, res, err);
            res.json(err)
        }
    });
}

zSSH.mycommand = async(req, res, server) => {
    await zSSH.open(server, function (conn, error) {
        if (error) {
            res.json(error);
            return false;
        }
        var bufs = [];
        var filename = "my.log";
        var dirFile = dir + "/" + filename;
        conn.exec("tail -n 20 /var/log/nginx/access.log", {}, (err, stream) => {
            let code = 0;
            stream.on('data', (data)=> {
                bufs.push(data);
            });
            stream.on('end', async() => {
                var buf = Buffer.concat(bufs);
                var string = buf.toString();
                fs.writeFile(dirFile, string, function (err) {
                    if (err) {
                        toastr.error(err);
                        return;
                    }
                    var html = '';
                    html += `Download access.log <a href="/uploads/services/${filename}" target="_blank">${filename}</a> Success... <br>`;
                    modal(html)
                });
                conn.end();
            });
            stream.on('close', () => {
                if (code !== 0) {
                    var msg = 'Nothing happend';
                    toastr.error(msg);
                }
                conn.end();
            }).on('exit', (exitcode) => {
                code = exitcode;
            });
        });


    });
}


zSSH.splitString = (string) => {
    var obj = {}
    var explode = string.split(" ");
    obj.title = explode[0];
    for (var i = 1; i < explode.length; i++) {
        if (explode[i]) {
            obj.status = explode[i].trim();
            break;
        }
    }
    return obj;
}

zSSH.parseString = (string) => {
    var obj = {}
    string = string.trim();
    var num = 100;
    var explode = string.split(" ");
    for (var i = 0; i < explode.length; i++) {
        if (explode[i].indexOf(".service") > -1) {
            obj.title = explode[i].trim();
            var num = i;
        } else {
            if (explode[i] && i > num) {
                obj.status = explode[i].trim();
                break;
            }
        }
    }
    return obj;
}

module.exports = zSSH;