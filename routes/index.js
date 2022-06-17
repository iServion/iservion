var express = require('express');
var router = express.Router();
const connection = require('./../config/connection');
var Util = require("../components/Util");
const moment = require('moment');
var Mail = require("../components/Mail");
var csrf = require('csurf');
var csrfProtection = csrf({cookie: true});
var MYMODEL = require('./../models/zuser')
const access = require('./../components/access');
var routeName = 'user';
var zRoute = require('./../components/zRoute');
var CONFIG = require('./../config/config');
var zRole = require('./../components/zRole');
var moduleLib = require('./../components/moduleLib');
var debug = require('./../components/debug')
var io = require("./../components/io");
var fs = require("fs");
var zSSH2 = require("./../components/zSSH2");
var zApi = require("./../components/zApi");


/* GET home page. */
router.get('/', csrfProtection, async(req, res) => {
    res.render("layouts/servion", {
        csrfToken: req.csrfToken(),
        isLogin : res.locals.isLogin,
        data: {menu: "home"},
        renderBody: "index/index.ejs",
    });
});

/*
for API
 */
router.put('/api/:title', zApi.put);
router.post('/api/:title', zApi.post);

/*
 ajax Post
 */
router.post('/zajax',zRoute.ajax);
router.post('/run',zSSH2.execCommand);
//password
router.post('/password-change', zRoute.changePassword);
router.post('/reset-password/:forgot_password', zRoute.resetPassword);
//logout
router.get('/logout', zRoute.logout);

router.get('/login', csrfProtection, async(req, res) => {
    if (res.locals.isLogin) {
        return res.redirect(CONFIG.app.afterLogin)
    }
    var isError = req.query.err == 1 ? true : false;
    if(isError) {
        res.locals.error = null;
    }
    res.locals.menuApp = "login"
    res.render("layouts/blank", {
        isError: isError,
        csrfToken: req.csrfToken(),
        renderHead: "index/logincss.ejs",
        renderBody: "index/login.ejs"
    });
});

router.post('/login', csrfProtection, async(req, res) => {
    await zRoute.login(req.body.username, req.body.password, req, res);
});

router.post('/login-ajax', csrfProtection, async(req, res) => {
    res.json(await zRoute.loginAjax(req.body.username, req.body.password, req, res));
});

router.get('/profile',csrfProtection, access, async(req, res) => {
    var result = await connection.result({table: "zuser", where: {id: res.locals.userId}});
    var role = await connection.result({table: "zrole", where: {id: result.role_id}});
    var verify_signed = result.verify_signed ? "/uploads/zuser/" + result.verify_signed : "/img/user.png";
    res.render("layouts/" + layout, {
        menu: {menu: "profile"},
        data: result,
        attributeData: MYMODEL,
        role: role,
        verify_signed: verify_signed,
        routeName: "zuser",
        csrfToken: req.csrfToken(),
        renderHead: "index/profile_head.ejs",
        renderBody: "index/profile2.ejs",
        renderEnd: "index/profilejs.ejs"
    });
})

router.post('/profile', access, async(req, res) => {
    var json = Util.jsonSuccess(LANGUAGE['data_saved'])
    var userId = req.session.user.id;
    let dataPost = zRoute.post(req, res, MYMODEL, "zuser", req.body);
    let data = dataPost['zuser'];
    await connection.update({
        table : "zuser",
        data : data,
        where : {
            id : userId
        }
    })
    for (var keys in data) {
        req.session.user[keys] = data[keys]
    }
    req.session.sessionFlash = json;
    if(data.image) {
        json.image = Util.imageProfile(data.image);
    }
    res.json(json);
});

router.post('/profile-sign', access, async(req, res) => {
    var json = Util.jsonSuccess(LANGUAGE['data_saved'])
    var userId = res.locals.userId;
    var image = req.body.image;
    var ext = req.body.ext;
    let base64Image = image.split(';base64,').pop();
    var filename = `${Util.generateUnique(10)}${res.locals.userId}.${ext}`;
    await connection.update({
        table: "user",
        where: {
            id: res.locals.userId
        },
        data: {
            verify_signed: filename
        }
    });
    fs.writeFile(dirRoot + "/public/uploads/user/" + filename, base64Image, {encoding: 'base64'}, function (err) {
        console.log('File created');
    });
    res.json(json);
});

router.get('/znotification/:token', async(req, res) => {
    var token = req.params.token;
    var url = '/zdashboard';
    var results = await connection.results({table: "znotification", where: {token: token}});
    if (results.length) {
        var data = {
            status: 2
        }
        await connection.update({table: "znotification", data: data, where: {token: token}})
        if (results[0].link) {
            return res.redirect(results[0].link);
        }
    }
    return res.redirect(url);
});

router.post('/notification-data',csrfProtection, async(req, res) => {
    var id = req.query.id;
    var rows = await connection.results({
        table: "znotification",
        where: {
            user_id: res.locals.userId,
            //status: 1
        },
        limit: 10,
        orderBy: ['id', 'desc']
    });

    var rowsCount = await connection.result({
        select : " count(id) as count ",
        table : "znotification",
        where: {
            user_id: res.locals.userId
        }
    });
    var arr = [];
    rows.forEach(function (item) {
        item.ago = moment(item.updated_at).fromNow();
        item.avatar = res.locals.userAvatar;
        arr.push(item);
    });
    var data = {
        count : rowsCount.count,
        data : arr
    };

    res.json(data);
});

router.post('/activity-data',csrfProtection, async(req, res) => {
    var id = req.query.id;
    var rows = await connection.results({
        table: "zactivity",
        where: {
            user_id: res.locals.userId,
            //status: 1
        },
        limit: 10,
        orderBy: ['id', 'desc']
    });

    var rowsCount = await connection.result({
        select : " count(id) as count ",
        table : "zactivity",
        where: {
            user_id: res.locals.userId
        }
    });
    var arr = [];
    rows.forEach(function (item) {
        item.ago = moment(item.updated_at).fromNow();
        item.avatar = res.locals.userAvatar;
        arr.push(item);
    });
    var data = {
        count : rowsCount.count,
        data : arr
    };

    res.json(data);
});


router.post('/notification-list',csrfProtection, async(req, res) => {
    var id = req.query.id;
    var rows = await connection.results({
        table: "znotification",
        where: {
            user_id: res.locals.userId,
            //status: 1
        },
        limit: 10,
        orderBy: ['id', 'desc']
    });
    res.json(rows);
});

router.post('/activity-list',csrfProtection, async(req, res) => {
    var id = req.query.id;
    var rows = await connection.results({
        table: "zactivity",
        where: {
            user_id: res.locals.userId,
            //status: 1
        },
        limit: 10,
        orderBy: ['id', 'desc']
    });
    var obj = {}
    obj.count = rows.length || 0;
    var html = '';
    rows.forEach(function (item) {
        html += `<a href="#" class="list-group-item">
                                    <div class="row g-0 align-items-center">
                                        <div class="col-2">
                                            <img src="${res.locals.userAvatar}" class="avatar img-fluid rounded-circle" alt="Vanessa Tucker">
                                        </div>
                                        <div class="col-10 ps-2">
                                            <div class="text-dark">${item.title}</div>
                                            <div class="text-muted small mt-1">${item.description}</div>
                                            <div class="text-muted small mt-1">${moment(item.created_at).fromNow(true)} ago</div>
                                        </div>
                                    </div>
                                </a>`;
    });
    obj.content = html;
    res.json(obj);
});


router.post("/gridprint", async(req,res) => {
    var html = "";
    var id = req.body.id;
    var table = req.body.table;
    if(id) {
        var results = await connection.results({
            table:"zapprovals",
            where : {
                id_data : id,
                table : table
            }
        });
        if(results.length) {
            var result = results[0];
            if(result.status == 3 || result.status == 4) {
                html += `<button class="btn btn-sm btn-info  gridprint" data-token="${result.token}"><span class="fa fa-print"></span></button> `;
            }
        }
    }
    res.json(html)
})

router.get('/lang/:lang', async(req, res) => {
    var json = Util.jsonSuccess(LANGUAGE['data_saved']);
    if (res.locals.isLogin) {
        var lang = req.params.lang;
        await connection.query("update `user` set language = ? where id = ?", [lang, req.session.user.id])
        req.session.user.language = lang;
    } else {
        json = Util.jsonSuccess(LANGUAGE['failed']);
    }
    req.session.sessionFlash = json;

    res.redirect('/dashboard')
});

router.get('/signup', csrfProtection, async(req, res) => {
    res.locals.menuApp = 'signup'
    res.render("layouts/fronts", {
        Util: Util,
        csrfToken: req.csrfToken(),
        renderBody: "index/signup.ejs",
        renderEnd: "index/signupjs.ejs"
    });
});


router.get('/failed', async function (req, res) {
    var template = "fronts";
    res.render("layouts/" + template, {
        menu: "failed",
        renderBody: "index/failed.ejs",
        Util: Util
    });
});

router.get("/forgot", csrfProtection, async(req, res) => {
    if (res.locals.isLogin) {
        return res.redirect('/dashboard');
    }
    var script = `submitForm('forgot-form');`;
    await moduleLib.custom(req, res, script);

    res.render("layouts/fronts", {
        csrfToken: req.csrfToken(),
        attributeData: MYMODEL,
        routeName: "user",
        data: MYMODEL.datas,
        renderBody: "index/forgot.ejs"
    });
});


router.post('/forgot', csrfProtection, async(req, res) => {
    var json = Util.jsonError("email", "Email not found in our database")
    var routeName = "user";
    var MYMDEL = require('./../models/user');
    let data = zRoute.post(req, res, MYMODEL)["user"];
    var MAIL = require('./../components/Mail');
    var email = data.email || " ";
    email = email.trim();
    if (email.length > 5) {
        var rows = await connection.query("SELECT * FROM user WHERE email = ?", [email]);
        if (rows.length > 0) {
            var post = {
                forgotPassword: Util.generateUnique(23)
            }
            await connection.query("UPDATE `user` SET ? WHERE id = ?", [post, rows[0].id]);
            var options = {
                to: email
            }
            var datas = {
                config: CONFIG,
                link: CONFIG.app.url + "/reset-password/" + post.forgotPassword,
            }
            MAIL.forgotPassword(datas, options);
            json = Util.jsonSuccess("Please check your email to reset ")
        }
    }

    res.json(json)
});


router.get('/reset-password/:forgot_password', csrfProtection, async(req, res) => {
    var forgot_password = req.params.forgot_password || "";
    var activated = false;
    if (forgot_password != "") {
        var row = await connection.query("SELECT * FROM `user` WHERE `forgotPassword` = ?", [forgot_password])
        if (row.length > 0) {
            activated = true;
        }
    }
    var script = `submitForm('form-group','','',function(data){
        if(data.status==1){
            location.href = '/login'
        }
    });`;
    await moduleLib.custom(req, res, script);
    res.render("layouts/fronts", {
        activated: activated,
        csrfToken: req.csrfToken(),
        forgot_password: forgot_password,
        renderBody: "index/reset-password.ejs"
    });
});


router.get('/no-access', async(req, res) => {
    var myview = 'fronts'
    if (req.session.user) {
        myview = 'main'
    }
    res.render("layouts/" + myview, {
        data: {table: "error"},
        menu: 'error',
        renderBody: "index/no-access.ejs",
    });
});

router.get('/no-found', async(req, res) => {
    var myview = 'fronts'
    if (req.session.user) {
        myview = 'main'
    }
    res.render("layouts/" + myview, {
        data: {table: "error"},
        menu: 'error',
        renderBody: "index/no-found.ejs",
    });
})

router.get('/activated/:token', async function (req, res) {
    var token = req.params.token;
    var model = [];
    if (token == "") {
        req.session.sessionFlash = {type: 'error', title: 'Error', message: 'Page Not Found...'}
        res.redirect('/');
    } else if (token.length < 10) {
        req.session.sessionFlash = {type: 'error', title: 'Error', message: 'Page Not Found...'}
        res.redirect('/');
    }
    model = await connection.query('select * from `user` where token = ? ', [token]);
    if (model.length) {
        var modelId = model[0]['id'];
        var row = await connection.query('update `user` SET active = ? , token = ?   WHERE id = ? ', [1, "", model[0]['id']]);
    }
    res.render("layouts/fronts", {
        model: model,
        Util: Util,
        moment: moment,
        //renderHead: "register/print_head.ejs",
        renderBody: "index/activated.ejs",
    });
});

router.post('/zrunwidget', async(req,res) => {
    var id = req.body.id;
    var serverId = req.body.serverId;
    var result = await connection.result({
        table : "zwidget",
        where : {
            id : id
        }
    });

    var server = await connection.result({
        table : "server",
        where : {
            id : serverId
        }
    });

    if(!result.id) {
        res.json(Util.flashError("error widget not found!!"));
    }

    var filename = `z${id}.sh`;
    var DIR = `${dirRoot}/public/uploads/zwidget`;
    var filePath = DIR+"/"+ filename;
    var fileStreamContent = '/tmp/'+filename;
    fs.writeFileSync(`${filePath}`, result.scripts);

    await zSSH2.open(server,function (conn, err) {
        if (err) {
            io.to(res.locals.token).emit("error", "error connection :" +err.toString());
            return false;
        }
        conn.sftp(async (err, sftp) => {
            if (err) {
                io.to(res.locals.token).emit("error", "error sftp :" +err.toString());
                return false;
            }
            var readStream = fs.createReadStream( filePath );
            var writeStream = sftp.createWriteStream( fileStreamContent );
            writeStream.on('close', async function () {
                io.to(res.locals.token).emit("message", "Preparing to execute bash script on " + server.title);
                //execute bash script file
                await executeBash(server, fileStreamContent);
            });

            writeStream.on('end', async function () {
                console.log( "sftp connection closed" );
                io.to(res.locals.token).emit("message", "sftp connection closed");
                conn.close();
            });
            // initiate transfer of file
            await readStream.pipe( writeStream );
        });
    });

    var executeBash = async(server, fileStreamContent) =>{
        await zSSH2.open(server, function (conn,err) {
            if (err) {
                io.to(res.locals.token).emit("error", "error execute :" +err.toString());
                return false;
            }
            var runfile = `/bin/bash ${fileStreamContent}`;
            //{pty: true}
            conn.exec(runfile, { }, (err, stream) => {
                if (err) {
                    io.to(res.locals.token).emit("error", "error sftp :" +err.toString());
                    return false;
                }
                io.to(res.locals.token).emit("message", "execute bash script on server " + server.title);
                let code = 0;
                var bufs = [];
                stream.on('data', (data)=> {
                    bufs.push(data);
                });
                stream.on('end', async() => {
                    var buf = Buffer.concat(bufs);
                    var string = buf.toString();
                    if(string.length > 2) {
                        io.to(res.locals.token).emit("box-message", string);
                    }
                    //close connection
                    conn.end()
                });

                stream.stderr.on('data', function err(data) {
                    var string = data.toString();
                    if(string.length > 2) {
                        io.to(res.locals.token).emit("error", data.toString());
                        io.to(res.locals.token).emit("box-message", data.toString());
                    }
                });

                stream.on('close', () => {
                    if (code !== 0) {
                        io.to(res.locals.token).emit("box-message", `Server ${server.title} has error code`)
                    }
                    conn.end();
                }).on('exit', (exitcode) => {
                    code = exitcode;
                });
            });
        })
    }

    res.json("ok")
});

router.post('/zcheckwidget', async(req,res) => {
    var id = req.body.id;
    var serverId = req.body.serverId;
    var result = await connection.result({
        table : "zwidget",
        where : {
            id : id
        }
    });
    if(!result.id) {
        res.json(Util.flashError("error widget not found!!"));
    }
    if(result.check_installer) {
        await zSSH2.exec(serverId,result.check_installer,function (data) {
            io.to(res.locals.token).emit("message", data.data)
        })
    } else {
        io.to(res.locals.token).emit("error", "No Script for check")
    }
    res.json("ok")
});

router.post('/zremovewidget', async(req,res) => {
    var id = req.body.id;
    var serverId = req.body.serverId;
    var result = await connection.result({
        table : "zwidget",
        where : {
            id : id
        }
    });
    if(!result.id) {
        res.json(Util.flashError("error widget not found!!"));
    }
    if(result.remove) {
        await zSSH2.exec(serverId,result.remove,function (data) {
            io.to(res.locals.token).emit("message", data.data)
        })
    } else {
        io.to(res.locals.token).emit("error", "No Script for check")
    }
    res.json("ok")
});

// for change company session
router.get("/session/:id", access, async(req, res) => {
    var companies = res.locals.zcompanies;
    var user = await connection.result({
        table : "zuser",
        where :{
            id : res.locals.userId
        }
    });
    for (var i = 0; i < companies.length; i++) {
        if (companies[i].id == req.params.id) {
            user.company_id = req.params.id;
            await zRoute.handleSession(req, user);
            var post = {
                company_id: companies[i].id,
                role_id: companies[i].role_id
            }
            await connection.update({
                table : "zuser",
                data : post,
                where : {
                    id : res.locals.userId
                }
            });
        }
    }
    var backURL = req.header('Referer') || '/';
    // do your thang
    res.redirect(backURL);
});

//RESTAET
router.get("/restart", access, async(req, res) => {
    var room = res.locals.user.token;
    if (CONFIG.environment == "production") {
        var pm2 = require('pm2');
        pm2.connect(function (err) {
            if (err) {
                io.to(room).emit("error", err.toString())
            }
            pm2.restart(CONFIG.app.pm2, (err, proc) => {
                io.to(room).emit("message", "Restart done")
            })
        });
    } else {
        io.to(room).emit("message", "Restart done")
    }
    res.json("ok")
});


//ERROR UI
router.get('/error', async(err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : err;
    // render the error page
    res.status(err.status || 500);
    debug(req, res, err);
    res.render('layouts/' + layout, {
        renderBody: 'index/error.ejs'
    });
});

module.exports = router;
