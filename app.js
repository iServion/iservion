var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressSession = require('express-session');
var CONFIG = require("./config/config");
var zCache = require("./components/zCache");
var csrf = require('csurf')
var zRole = require("./components/zRole");
var env = process.env.NODE_ENV || 'development';
const moment = require('moment');
var Util = require('./components/Util');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const menuGenerator = require('./components/menuGenerator');
var io = require('./components/io');
var UI = require('./components/UI');
var esessions;
var sharedsession = require("express-socket.io-session");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var parseForm = bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000})
app.use(bodyParser.json({limit: "50mb"}));
app.use(logger('dev'));
app.use(parseForm);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

var customCsrf = (req, res, next) => {
    var url = req.url;
    if(url.indexOf("/") > -1) {
        var urls = url.split("/");
        if(urls[1] == "api"){
            next();
        } else {
            csrf({ cookie: true })(req, res, next);
            res.locals.csrfToken = req.csrfToken();
        }
    } else {
        csrf({ cookie: true })(req, res, next);
        res.locals.csrfToken = req.csrfToken();
    }
}

//get absolute path
global.dirRoot = path.resolve(__dirname);
global.layout = "bootstrap5";
global.appUserList = {}

app.use(customCsrf);
app.set('trust proxy', 1) // trust first proxy
app.use(cookieParser(CONFIG.app.sessionName));

//session stores in redis
if (env == 'production') {
    var RedisStore = require('connect-redis')(expressSession);
    esessions = expressSession({
        genid: function (req) {
            return Util.generateUnique() // use UUIDs for session IDs
        },
        store: new RedisStore(),
        secret: CONFIG.keys.secret,
        resave: false,
        saveUninitialized: true,
        // cookie: {maxAge: 24 * 60000}
    });
} else {
    esessions = expressSession({
        genid: function (req) {
            return Util.generateUnique() // use UUIDs for session IDs
        },
        secret: CONFIG.keys.secret,
        resave: false,
        saveUninitialized: true,
        // cookie: {maxAge: 24 * 60000}
    });
}
//session handling
app.use(esessions);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Share session with io sockets
io.use(sharedsession(esessions, {
    autoSave: true
}));


//cache routes models tables roles etc
app.use(zCache.cache);

var index = require('./routes/index');
var zindex = require('./routes/zindex');

app.use(async(req, res, next) => {
    res.locals.renderHead = "";
    res.locals.renderBody = "";
    res.locals.renderEnd = "";
    res.locals.titleApp = CONFIG.app.title;
    res.locals.descriptionApp = CONFIG.app.description;
    res.locals.moduleHead = "";
    res.locals.moduleEnd = "";
    res.locals.menuApp = "home";
    res.locals.routeName = "index";
    res.locals.userId = -1;
    res.locals.roleId = 0;
    res.locals.token = "test123";
    res.locals.paginationApp = CONFIG.app.pagination;
    res.locals.attributeData = {}
    res.locals.moment = moment;
    res.locals.cLevels = {};
    res.locals.companyName = "";
    res.locals.companyId = 0;
    res.locals.userId = 0;
    res.locals.menuGenerator = "";
    res.locals.menuOfJson = {};
    res.locals.userAvatar = "/img/user.png";
    res.locals.zuser = {
        fullname: 'test',
        role: {name: "test"}
    };
    res.locals.frameworkcss = "bootstrap5";
    global.frameworkcss = "bootstrap5";
    global.layout = "two";

    res.locals.socketUrl = CONFIG.app.socketUrl;
    res.locals.zcompanies = [];
    res.locals.isLogin = false;
    res.locals.objectStores = {};
    if (req.session) {
        var reqSession = req.session;
        if (reqSession.hasOwnProperty('user')) {
            var tUser = req.session.user;
            if (tUser && Object.prototype.hasOwnProperty.call(tUser, "id")) {
                tUser.role = {
                    name: "Admin"
                }
                res.locals.isLogin = true;
                res.locals.token = tUser.token;
                res.locals.roleId = tUser.role_id;
                res.locals.isLogin = true;
                res.locals.zuser = tUser;
                res.locals.userId = tUser.id;
                res.locals.cLevels = tUser.roleKeys;
                res.locals.companyId = tUser.company.id;
                res.locals.companyName = tUser.company.name;
                res.locals.userAvatar = tUser.image ? tUser.image.indexOf("http") > -1 ? tUser.image : "/uploads/zuser/" + tUser.image : "/img/user.png";
                res.locals.zcompanies = tUser.companies;

                global.LANGUAGE = require('./languages/lang_en');
                var alllayouts = zCache.get(zCache.STATICS.CONFIG);
                if (alllayouts) {
                    var companyLayout = alllayouts[res.locals.companyId];
                    if (companyLayout && companyLayout.hasOwnProperty("json")) {
                        var layouts = alllayouts[res.locals.companyId].json;
                        //global.layout = "layout" + layouts.layouts.name;
                        global.layout = "two";
                        res.locals.frameworkcss = layouts.layouts.frameworkcss;
                        global.frameworkcss = layouts.layouts.frameworkcss;
                    }
                }
            }
        }

        res.locals.menuGenerator = menuGenerator.html(req, res);
        res.locals.menuJson = menuGenerator.menu(req, res);
        res.locals.menu = menuGenerator.menu(req, res);
        res.locals.menuPlus = menuGenerator.menuPlus(req, res);
        res.locals.menuSystems = menuGenerator.systems(req, res);
    }
    global.COMPANY_ID = res.locals.companyId;
    global.USER_ID = res.locals.userId;

    if (res.locals.isLogin == false) {
        global.LANGUAGE = require('./languages/lang_en');
    }
    if (!res.locals.LANGUAGE) {
        global.LANGUAGE = require('./languages/lang_en');
    }
    res.locals.LANGUAGE = global.LANGUAGE;
    res.locals.currency = {}
    res.locals.settings = {}

    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;

    res.locals.sessionFlashc = req.session.sessionFlashc;
    next();
});

//this default role to any routes
app.use(async function (req, res, next) {
    //UI class in frontend
    res.locals.UI = new UI(req, res);

    let explode = req.path.split("/");
    let route = explode[1];
    let action = "index";
    res.locals.menuApp = Util.capitalizeAfterSpace(route);
    res.locals.routeName = route;
    if (explode.length > 2) {
        action = explode[2] || "index";
    }
    // define role for route base on session or not
    //define routes at zRole
    if (zRole.routes.indexOf(route) > -1) {
        req.route = route;
        req.action = action;
        await zRole.access(req, res, next);
    } else {
        next();
    }
});

//custom route
app.use('/', zindex);
app.use('/', index);
zCache.get("ROUTES").forEach(file => {
    app.use("/" + file, require(`./routes/${file}`));
});

// error handler
app.get('*', function(req, res){
    res.render("layouts/error", {
        error:"Page Not Found!!",
        renderBody: 'index/error.ejs'
    });
});


module.exports = app;
