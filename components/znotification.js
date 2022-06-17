var connection = require('./../config/connection');
var Util = require('./Util');
var fs = require("fs");
var config = require("./../config/config");


var me = {}

me.list = async(req,res)=> {
    return await connection.results({
        table:"znotification",
        where:{
            user_id:res.locals.userId,
            status:1
        },
        limit:100,
        orderBy:['id','desc']
    });
}

me.html = async(req,res)=>{
    var html = '';
    var results = await me.list(req,res);
    results.forEach(function (result) {
        
    });

    return html;
}