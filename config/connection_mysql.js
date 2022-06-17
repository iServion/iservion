const mysql = require('mysql');
const config = require('./config_database')
var util = require('util');

var toNumber = function (num) {
    num = num + "";
    var t = replaceAll(num, ".", "");
    if (t) {
        return parseFloat(t);
    } else return 0;
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}


var pool = mysql.createPool(
    config
);

pool.conn = mysql.createConnection(config);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

pool.query = util.promisify(pool.query) // Magic happens here.


pool.results = async(obj) => {
    var select = obj.select || "*";
    var table = obj.table || "";
    var where = obj.where || {};
    //[{field:"your_field",option:"=>",value:"12",operator:"AND",isJSON : false}]
    var whereArray = obj.whereArray || [];
    var statement = obj.statement || "";
    var limit = obj.limit ? ` LIMIT ${obj.limit} ` : "";
    var orderBy = !obj.orderBy ? "" : " ORDER BY `" + obj.orderBy[0] + "` " + obj.orderBy[1];
    var values = obj.values || [];
    var objJoin = obj.joins || [];
    var join = '';
    if (objJoin.length) {
        join = objJoin.join(" ");
    }


    var arr = [], wherequery = [];
    for (var key in where) {
        wherequery.push(key.indexOf(".") > -1 ? ` ${key} = ? ` : "`" + key + "` = ? ");
        arr.push(where[key]);
    }
    wherequery = arr.length ? wherequery.join(" AND ") : "";

    if (whereArray.length) {
        var andOr = wherequery ? " AND " : "";
        whereArray.forEach((item, index) => {
            if (index > 0) andOr = "";
            var operator = !item.operator ? " AND " : item.operator;
            var field = item.field.indexOf(".") > -1 ? item.field : " `" + item.field + "` ";
            //is JSON is field is JSON
            //JSON_CONTAINS(color, '"Red"' ,'$')
            if(item.isJSON) {
                wherequery += andOr + ` JSON_CONTAINS(${field}, '"${item.value}"' ,'$')  ${operator}`
            } else {
                wherequery += andOr + field + item.option + " ?   " + operator;
                arr.push(item.value);
            }
        });

        //console.log(arr)

        wherequery = wherequery.slice(0, -5);
    }

    var wheres = arr.length ? " WHERE " + wherequery : "";
    var sql = "SELECT " + select + " FROM `" + table + "` " + join + "   " + wheres + statement + orderBy + limit;
    //console.log(sql)
    var result = await pool.query(sql, arr.length ? arr : values.length ? values : []);
    /*
     var v = arr.length ? arr : values.length ? values : [];
     console.log(v);*/
    return result;
}

pool.result = async(obj) => {
    var results = await pool.results(obj);
    return results[0];
}

pool.insert = async(obj) => {
    var table = obj.table;
    var data = obj.data;
    return await pool.query('INSERT INTO `' + table + '` SET ?', data);
}

pool.update = async(obj) => {
    var table = obj.table;
    var data = obj.data;
    var where = obj.where || {}
    //[{field:"your_field",option:"=>",value:"12",operator:"AND"}]
    var whereArray = obj.whereArray || [];
    var arr = [], wherequery = [];
    for (var key in where) {
        wherequery.push("`" + key + "` = ? ");
        arr.push(where[key]);
    }

    wherequery = arr.length ? wherequery.join(" AND ") : "";
    if (whereArray.length) {
        var andOr = wherequery ? " AND " : "";
        whereArray.forEach((item, index) => {
            if (index > 0) andOr = "";
            var operator = !item.operator ? " AND " : item.operator;
            var field = item.field.indexOf(".") > -1 ? item.field : " `" + item.field + "` ";
            wherequery += andOr + field + item.option + " ?   " + operator;
            arr.push(item.value);
        });

        wherequery = wherequery.slice(0, -5);
    }

    var wheres = arr.length ? " WHERE " + wherequery : "";
    //console.log("UPDATE `" + table + "` SET ?  " + wheres + "  " + data + JSON.stringify(arr))
    return await pool.query("UPDATE `" + table + "` SET ?  " + wheres, [data, ...arr]);
}


pool.delete = async(obj) => {
    var table = obj.table;
    var where = obj.where || {}
    var arr = [], wherequery = [];
    for (var key in where) {
        wherequery.push("`" + key + "` = ? ");
        arr.push(where[key]);
    }
    wherequery = arr.length ? wherequery.join(" AND ") : "";
    var wheres = arr.length ? " WHERE " + wherequery : "";
    return await pool.query("DELETE FROM `" + table + "`  " + wheres, arr);
}

pool.driver = config.driver || "mysql";
pool.showTables = 'SHOW TABLES';
pool.showFullFields = (table) => {
    return "SHOW FULL FIELDS FROM `" + table + "`;"
}
pool.describeTable = (table) => {
    return "DESCRIBE `" + table + "`";

}
pool.showComments = (table) => {
    return 'SELECT COLUMN_NAME , COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema="' + config.database + '" AND table_name="' + table + '";';
}

pool.showFields = (table) => {
    return "SELECT TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME, REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_SCHEMA = '" + config.database + "' AND TABLE_NAME = '" + table + "';";
}


pool.existTable = (table) => {
    pool.query(`SELECT * FROM information_schema.tables WHERE table_name = '${table}'`, function (err, result, fields) {
        if (err) throw err;
        if (result.length) return true;
        else return false;
    });
}
module.exports = pool;