var myCache = require("./cache");
const fs = require('fs');
var path = require('path');
var connection = require('./../config/connection');
var Util = require('./Util');
var CONFIG = require("./../config/config");
var dirRoot = "./"
var zup = require('./zup');

var zCache = {}

//constants
zCache.KEYS = {
    ROUTES: "ROUTES",
    TABLES: "TABLES",
    MYMODELS: "MYMODELS",
    ROLES: "ROLES",
    CONFIG: "CONFIG",
    MENU: "MENU"
}

zCache.STATICS = zCache.KEYS;

zCache.get = (name) => {
    if (!myCache.has(name)) {
        zCache[name]();
    } else {
        return myCache.get(name);
    }
}

zCache.set = (X, Y) => {
    myCache.set(X, Y);
}

zCache.cache = async(req, res, next) => {
    //backupDB();
    if (myCache.has("ROLES")) {
        await cache();
        next();
    } else {
        var query = await connection.query(connection.describeTable("zrole"));
        if (query.length) {
            await cache();
            next();
        } else {
            await zup.createTable();
            await zup.addData();
            //back again the process
            await zCache.cache(req,res,next)
        }
    }
}

var cache = async()=> {
    var i = 0;
    if (myCache.has("ROLES")) {
        console.log("cache ROLES has exist " + i)
        i = i + 1;
    } else {
        console.log("cache ROLES not exist " + i)
        await zCache.ROLES();
    }
    if (myCache.has("ROUTES")) {
        i = i + 1;
    } else {
        await zCache.ROUTES();
    }
    if (myCache.has("TABLES")) {
        i = i + 1;
    } else {
        console.log("cache TABLES not exist " + i)
        await zCache.TABLES();
    }
    if (myCache.has("CONFIG")) {
        i = i + 1;
    } else {
        console.log("cache CONFIG not exist " + i)
        await zCache.CONFIG();
    }
    if (myCache.has("MENU")) {
        i = i + 1;
    } else {
        console.log("cache MENU not exist " + i);
        //zup.menu();
        await zCache.MENU();
    }
    console.log(i)

    if (i < 5) {
        await cache();
    } else {
        return i;
    }
}

zCache.renew = async()=> {
    await zCache.ROLES();
    await zCache.MENU();
    await zCache.CONFIG();
    await zCache.TABLES();
    await zCache.ROUTES();
}

zCache.ROUTES = () => {
    let routesPath = path.join(dirRoot, 'routes');
    let arr = []
    fs.readdirSync(routesPath).forEach(file => {
        let filename = file.replace(".js", "");
        if (filename != "index")
            arr.push(filename)
    });
    myCache.set("ROUTES", arr);
}

zCache.TABLES = () => {
    let routes = zCache.get("ROUTES");
    let modelsDirectory = path.join(dirRoot, 'models');
    let tables = [], obj = {};
    routes.forEach((table) => {
        if (fs.existsSync(modelsDirectory + "/" + table + ".js")) {
            tables.push(table);
            let MYMODEL = require("./../models/" + table);
            obj[table] = MYMODEL;
        }
    });
    myCache.set("TABLES", tables);
    myCache.set("MYMODELS", obj);
}

zCache.ROLES = async() => {
    var r = 0;
    var query = await connection.query(connection.describeTable("zrole"));
    if (query.length) {
        var results = await connection.results({table: "zrole"});
        var obj = Util.arrayToObject(results, "id");
        await myCache.set("ROLES", obj);
        r = 1;
    }

    return r;
}

zCache.CONFIG = async() => {
    var results = async() => {
        return await connection.results({
            table: "zconfig"
        });
    }
    var companies = await connection.results({
        table: "zcompany"
    });
    var r = await results();
    var configObj = Util.arrayToObject(r, "company_id");
    for (var i = 0; i < companies.length; i++) {
        var item = companies[i];
        if (!configObj[item.id]) {
            await connection.insert({
                table: "zconfig",
                data: {
                    company_id: item.id,
                    layout: 0,
                    json: JSON.stringify(CONFIG),
                    created_at: Util.now(),
                    updated_at: Util.now()
                }
            });
        }
    }

    myCache.set("CONFIG", Util.arrayToObject(await results(), "company_id"));
}

zCache.MYMODELS = () => {
    zCache.TABLES();
}

zCache.MENU = async() => {
    var results = async() => {
        return await connection.results({
            table: "zmenu",
            where: {
                active: 1
            }
        });
    }
    var r = await results();
    var builder = async() => {
        var obj = {}
        var arr = await results();
        arr.map((item)=> {
            obj[item.company_id] = item.json || [];
        });
        myCache.set("MENU", obj);
    }
    if (r.length) {
        await builder();
    }
}


module.exports = zCache;