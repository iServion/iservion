const {Pool} = require('pg')
const config = require('dotenv').config();
var Util = require('./../components/Util')

var pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
})


var connection = {}

connection.query = async(string, arr) => {
    var result = await pool.query(string, arr);
    return result.rows;
}

var orderByFn = (obj) => {
    var objOrderby = !obj.orderBy ? [] : obj.orderBy;
    var orderBy = "";
    if(objOrderby.length) {
        orderBy = ` ORDER BY  `;
        for(var i =0; i < objOrderby.length; i++) {
            if(i%2==0) {
                orderBy += ` "${obj.orderBy[i]}" `
            } else {
                orderBy += ` ${obj.orderBy[i]} `;
                if(i == (objOrderby.length -1)) {
                    orderBy += ` `
                } else {
                    orderBy += `, `
                }
            }
        }
    }

    return orderBy;
}

var whereFn = (obj) => {
    var where = obj.where || {};
    //[{field:"your_field",option:"=>",value:"12",operator:"AND",isJSON : false}]
    var whereArray = obj.whereArray || [];
    var increment = 1;
    var arr = [], wherequery = [];
    for (var key in where) {
        wherequery.push(key.indexOf(".") > -1 ? ` ${key} = $${increment} ` : ` "${key}" = $${increment}`);
        arr.push(where[key]);
        increment++;
    }
    wherequery = arr.length ? wherequery.join(" AND ") : "";

    if (whereArray.length) {
        var andOr = wherequery ? " AND " : "";
        whereArray.forEach((item, index) => {
            if (index > 0) andOr = "";
            var operator = !item.operator ? " AND " : item.operator;
            if(index == (whereArray.length - 1))
                operator = "";
            var field = item.field.indexOf(".") > -1 ? item.field : ` "${item.field}" `;
            //is JSON is field is JSON
            //JSON_CONTAINS(color, '"Red"' ,'$')
            if (item.isJSON) {
                wherequery += andOr + ` JSON_CONTAINS(${field}, '"${item.value}"' ,'$')  ${operator}`
            } else {
                wherequery += `${andOr} ${field} ${item.option} $${increment} ${operator}`;
                arr.push(item.value);
            }
            increment++;
        });
        //console.log(arr)
    }

    var wheres = arr.length ? `WHERE ${wherequery}` : "";
    return {
        where : wheres,
        arr : arr,
        increment : increment
    };
}

connection.results = async(obj) => {
    var select = obj.select || "*";
    var table = obj.table || "";
    //[{field:"your_field",option:"=>",value:"12",operator:"AND",isJSON : false}]
    var statement = obj.statement || "";
    var limit = obj.limit ? ` LIMIT ${obj.limit} ` : "";
    var offset = obj.hasOwnProperty("offset") ? ` OFFSET ${obj.offset} ` : obj.limit ? "OFFSET 0" : "";
    var orderBy = orderByFn(obj);
    var values = obj.values || [];
    var objJoin = obj.joins || [];
    var join = '';
    if (objJoin.length) {
        join = objJoin.join(" ");
    }
    var whereObj = whereFn(obj);
    var wheres = whereObj.where;
    var arr = whereObj.arr;
    var sql = `SELECT ${select} FROM  "${table}" ${join} ${wheres} ${statement} ${orderBy} ${limit}  ${offset}`;
/*    console.log(sql)
    console.log(arr);*/
    var result = await pool.query(sql, arr.length ? arr : values.length ? values : null);
    return !result.rows ? [] : result.rows;
}

connection.result = async(obj) => {
    var results = await connection.results(obj);
    if(results.length){
        return results[0];
    } else {
        return [];
    }
}

connection.insert = async(obj) => {
    var result;
    var table = obj.table;
    var data = obj.data;
    var increment = 1;
    var datas = [];
    var values = [];
    var arr = [];
    for (var key in data) {
        datas.push(key);
        values.push(`$${increment}`)
        arr.push(data[key]);
        increment++;
    }
    var sql = `INSERT INTO "${table}" ("${datas.join('","')}")  VALUES (${values.join(",")})  RETURNING *`;
   /* console.log("ON INSERT " + sql)
    console.log(arr)
*/
    try {
        var results = await pool.query(sql, arr);
        return results.rows[0];
    } catch (err) {
        console.log("Error on Insert ");
        console.log(err)
        return {}
    }
}

connection.update = async(obj) => {
    var table = obj.table;
    var data = obj.data;
    var where = obj.where || {}
    //[{field:"your_field",option:"=>",value:"12",operator:"AND"}]
    var whereArray = obj.whereArray || [];
    var arr = [], wherequery = [], dataArr = [];
    var increment = 1;
    for (var key in data) {
        dataArr.push(` "${key}" = $${increment}`)
        arr.push(data[key])
        increment++;
    }
    for (var key in where) {
        wherequery.push(` "${key}" =  $${increment}`);
        arr.push(where[key]);
        increment++;
    }
    wherequery = arr.length ? wherequery.join(" AND ") : "";
    if (whereArray.length) {
        var andOr = wherequery ? " AND " : "";
        whereArray.forEach((item, index) => {
            if (index > 0)
                andOr = "";
            var operator = !item.operator ? " AND " : item.operator;
            var field = item.field.indexOf(".") > -1 ? item.field : `"${item.field}"`;
            wherequery += `${andOr} ${field} ${item.option} $${increment} ${operator}`;
            arr.push(item.value);
            increment++;
        });
        wherequery = wherequery.slice(0, -5);
    }
    var wheres = arr.length ? " WHERE " + wherequery : "";
    var sql = `UPDATE "${table}" SET ${dataArr.join(", ")} ${wheres} RETURNING *`;
  /* console.log(sql);
    console.log(arr);*/

    try {
        var result = await pool.query(sql, arr);
        //await pool.end()
        return result.rows[0]
    } catch (err) {
        console.log("Error on Update ");
        console.log(err)
        return {}
    }

}


connection.delete = async(obj) => {
    var table = obj.table;
    var where = obj.where || {}
    var arr = [], wherequery = [];
    var increment = 1;
    for (var key in where) {
        wherequery.push(` "${key}" = $${increment}`);
        arr.push(where[key]);
        increment++;
    }
    wherequery = arr.length ? wherequery.join(" AND ") : "";
    var wheres = arr.length ? " WHERE " + wherequery : "";
    var sql = `DELETE FROM "${table}" ${wheres}`
    /*console.log(sql);
    console.log(arr)*/
    return await pool.query(sql, arr);
}

connection.driver = config.driver;
connection.showTables = "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'";
connection.showFullFields = (tableRelations) => {
    return `SELECT 
                 column_name AS "Field",  concat(data_type,'(',character_maximum_length,')') AS "Type" , is_nullable AS "Null"
                FROM
                 information_schema.COLUMNS
                WHERE
                 TABLE_NAME = '${tableRelations}';`
}

connection.describeTable = (table) => {
    return connection.showFullFields(table);
}

connection.showComments = (table) => {
    return ` SELECT c.table_schema,c.table_name,c.column_name as "COLUMN_NAME",pgd.description as "COLUMN_COMMENT"
                FROM pg_catalog.pg_statio_all_tables as st
                  inner join pg_catalog.pg_description pgd on (pgd.objoid=st.relid)
                  inner join information_schema.columns c on (pgd.objsubid=c.ordinal_position
                    and  c.table_schema=st.schemaname and c.table_name=st.relname)
                WHERE c.table_name = '${table}' ORDER BY c.column_name`;
}

connection.showFields = (table) => {
    return `
        SELECT
            tc.table_name AS "TABLE_NAME", 
            kcu.column_name AS "COLUMN_NAME", 
            tc.constraint_name AS "CONSTRAINT_NAME", 
            ccu.table_name AS "REFERENCED_TABLE_NAME",
            ccu.column_name AS "REFERENCED_COLUMN_NAME",
            tc.table_schema
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='${table}';`;
}

//list constraint list
connection.constraintList = (table, schema = "public") => {
    return `
	SELECT con.*
       FROM pg_catalog.pg_constraint con
            INNER JOIN pg_catalog.pg_class rel
                       ON rel.oid = con.conrelid
            INNER JOIN pg_catalog.pg_namespace nsp
                       ON nsp.oid = connamespace
       WHERE nsp.nspname = '${schema}' AND rel.relname = '${table}'; `;

}

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


module.exports = connection;