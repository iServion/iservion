/**
 * For debug code
 */
const CONFIG = require("./../config/config");
const io = require("./io");
const connection = require("./../config/connection");

module.exports = (req, res, err) => {
    if(CONFIG.app.debug == true){
        let post = {
            table: res.locals.routeName || "",
            company_id: res.locals.companyId,
            route: res.locals.routeName || "",
            description : err.toString(),
            created_by : res.locals.userId
        }
        connection.insert({
            table : "zerror",
            data : post
        });
        
        setTimeout(function () {
            io.to(res.locals.token).emit("error", err.toString());
        },1000);
    }
}