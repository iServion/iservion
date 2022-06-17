var connection = require('./../config/connection');
var Util = require('./Util');
var fs = require("fs");
var config = require("./../config/config");
var zCache = require("./zCache");

var a = {}

/*
 Please add your routes here
 */

var routes = fs.readdirSync("./routes/").reduce((result, item) => [...result, item.replace(".js","")],[]);
var cacheRoutes = zCache.get("ROUTES");
var cacheRoles = zCache.get("ROLES") || {};

if(cacheRoutes && cacheRoutes.length) {
    a.routes = config.environment == "production" ? Util.arrayDeletes(cacheRoutes,["auth"]) : Util.arrayDeletes(cacheRoutes,["generator","auth"]);
} else {
    a.routes = config.environment == "production" ? Util.arrayDeletes(routes,["auth"]) : Util.arrayDeletes(routes,["generator","auth"]);
}


/*
 Default actions
 you can additional here
 */
a.actions = ['index', 'create', 'update', 'delete', 'view', 'import', 'export'];

/*
 all in table roles
 */

a.params =  function (roleId) {
    var cacheRoles = zCache.get("ROLES")
      /* console.log("caches" + roleId)
       console.log(cacheRoles)
       console.log("caches")*/
       if(cacheRoles && cacheRoles.hasOwnProperty(roleId)) {
            return roleId ? cacheRoles[roleId].params : {};
       }
       return {}
}

a.rules = function (roleId) {
    return a.params(roleId);
}

a.list =  (roleId, route) => {
    var params =  a.params(roleId)
    return a.levels(route, params)
}

a.levels = (route, params) => {
    var obj = {};
    if (a.routes.indexOf(route) > -1) {
        for (var i = 0; i < a.actions.length; i++) {
            if (params.hasOwnProperty(route)) {
                if (params[route].indexOf(a.actions[i]) > -1) {
                    obj[a.actions[i]] = true;
                } else {
                    obj[a.actions[i]] = false;
                }
            } else {
                obj[a.actions[i]] = false;
            }
        }
    } else {
        for (var i = 0; i < a.actions.length; i++) {
            obj[a.actions[i]] = true;
        }
    }

    return obj;
}

a.menuAccess = (res, menu) => {
   /* console.log("menuuuu")
    console.log(menu)
    console.log("menuuuu")*/
    if(Array.isArray(menu)) {
        var isTrue = false;
        for(var i = 0; i < menu.length; i++) {
            var r = a.menuAccess(res,menu[i]);
            if(r == true){
                return true;
            }
        }
    } else {
        if(Util.in_array(menu, a.routes)){
            var params = a.params(res.locals.roleId);
            var arr = Object.keys(params) || [];
            if(Util.in_array(menu, arr)){
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    return false;
}

a.isAccess = (roleId, route, action) => {
    var params = a.params(roleId);
    if(a.routes.includes(route)) {
        if(!params[route]){
            return false;
        }
        if(a.actions.includes(action)){
            if(params[route].includes(action)){
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
        return false;
    }
    return true;
    //return a.levelAction(route,params,action);
}

//get access page after login
a.access = async (req, res, next) => {
    if (req.session.user === null || typeof req.session.user === 'undefined') {
        req.session.sessionFlash = Util.flashError("You have to login first");
        res.redirect('/login');
    } else {
        var isAccess = a.isAccess(res.locals.roleId, req.route, req.action);
        if (isAccess) {
            next();
        } else {
            if(a.isAccess(res.locals.roleId,"zrole","index")) {
                req.session.sessionFlash = Util.flashError(`You have no access this page. Go to role menu to setup`);
                res.redirect(`${config.app.afterLogin}?setup=role`)
            } else {
                res.redirect(`${config.app.afterLogin}`)
            }

        }
    }
}


module.exports = a;