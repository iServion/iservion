const path = require('path')
const config = require('dotenv').config({path: path.resolve(__dirname, '../.env')})

var driver = process.env.DRIVER || "mysql";

console.log("driver : "+driver)

var pool = {}
if(driver == "mysql"){
    pool = require('./connection_mysql')
} else {
    pool = require('./connection_postgresql')
}

module.exports = pool
