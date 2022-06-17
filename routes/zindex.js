var router = require('express').Router();
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
var debug = require("./../components/debug");


router.get('/ruby', async(req,res) => { 
res.locals.renderBody = 'zindex/page3.ejs';
var myusernameis  = "clark Kent";

    res.render(`layouts/layout0`, {
        myusernameis: myusernameis
    }); 
});


module.exports = router;