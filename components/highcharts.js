/**
 * Created by sintret dev on 12/10/2019.
 * Highcharts helper
 */
const connection = require('./../config/connection');
const Util = require('./Util')

var h = {}

h.default = {
    title: {
        text: 'Employee'
    },
    subtitle: {
        text: ''
    },
    chart: {
        type: 'column'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    plotOptions: {
        series: {
            allowPointSelect: true
        }
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }],
    credits: false
}

h.build = async function (obj) {
    if(!obj.element){
        return;
        throw "No Element!";
    }

    let shape = obj.shape || "monthly";
    return await h[shape](obj);

}


h.custom =(obj) => {
    let type = obj.hasOwnProperty("type") ? obj.type : "column";
    var out = "";

    if(type == "pie") {
        out = h.pie(obj);

        console.log(JSON.stringify(out))
    } else {
        out = h.column(obj);
    }

    let render = `var chart = Highcharts.chart('${obj.element}', {`;
    render += out;
    render += `});`;

    return render;
}


h.column = (obj) => {
    let element = obj.element;
    let type = obj.hasOwnProperty("type") ? obj.type : "column";
    let title = obj.hasOwnProperty("title") ? obj.title : "No title";
    let subtitle = obj.hasOwnProperty("subtitle") ? obj.subtitle : "";
    let xAxis = JSON.stringify(obj.xAxis);
    let yAxis = obj.yAxis;

    let series = JSON.stringify(obj.series);
    let out =  `
        title: {
            text: '${title}'
        },
        subtitle: {
            text: '${subtitle}'
        },
        chart: {
            type: '${type}'
        },
        xAxis: {
            categories: ${xAxis}
        },
        yAxis: {
            min: 0,
            title: {
                text: '${yAxis}'
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        crosshair: true,
        series : ${series},
        credits: false
        
    `;

    let render = `var chart = Highcharts.chart('${element}', {`;
    render += out;
    render += `});`;

    return render;
}

h.pie = (obj) => {
    let title = obj.hasOwnProperty("title") ? obj.title : "No title";
    let subtitle = obj.hasOwnProperty("subtitle") ? obj.subtitle : "";
    let xAxis = obj.xAxis;
    let series = obj.series[0];
    delete series.showInLegend;
    let newSeries={};
    for(var key in series) {
        if(key != "data"){
            newSeries[key] = series[key];
        }
    }

    let data = [];
    for(var key in xAxis) {
        var newObj = {};
        newObj.name = xAxis[key];
        newObj.y = series.data[key] || 0;
        data.push(newObj)
    }
    newSeries.data = data;

    var renderSeries = [];
    renderSeries.push(newSeries)
    var ret = `
        title: {
            text: '${title}'
        },
       
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y}'
                }
            }
        },
        series: ${JSON.stringify(renderSeries)},
        credits: false
        
    `;


    //console.log(ret)
    return ret;
}

h.monthly = async(obj) => {
    let element = obj.element;
    let title = obj.hasOwnProperty("title") ? obj.title : "No title";
    let subtitle = obj.hasOwnProperty("subtitle") ? obj.subtitle : "";
    let type = obj.hasOwnProperty("type") ? obj.type : "column";
    let xAxis = obj.hasOwnProperty("xAxis") ? obj.xAxis : "['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']";

    let series = [];
    if (obj.hasOwnProperty("series")) {
        series = obj.series;
    } else {
        if (obj.hasOwnProperty("query")) {
            let query = obj.query;
            series = ""+ await h.buildSQL(obj);
            if(!series) return;
        } else {
            return
            throw "ERROR NO QUERY!";
        }
    }

    let out = `
        title: {
            text: '${title}'
        },
        subtitle: {
            text: '${subtitle}'
        },
        chart: {
            type: '${type}'
        },
        xAxis: {
            categories: ${xAxis}
        },
        plotOptions: {
            series: {
                allowPointSelect: true
            }
        },
        series: ${series},
        credits: false
    `;

    let render = `var chart = Highcharts.chart('${element}', {`;
    render += out;
    render += `});`;

    return render;
}

//COALESCE(sum(level = 1),0) myvalue
h.buildSQL = async function (obj) {
    let table = obj.table;
    let year = obj.year;
    let query = obj.query;
    let field = obj.field;
    let companyId = obj.companyId || "";
    let accumulation = obj.accumulation || false;
    let queryResults = '';
    let arr = [];
    let objResults = {}
    let arrResults = [];
    let series = [];
    let seriesString = '';
    let keyName = "";
    for (var key in query) {
        queryResults += ' ' + query[key] + ' ' + key + ', ';
        arr.push(key)
        objResults[key] = [];
        keyName = key;
    }

    let where = "";
    if(companyId) {
        where = ` WHERE ${table}.companyId =  ${companyId}   `;
    }

    let column = `${table}.${field}`;
    let columnYear = `, YEAR(${column}) `;

    let sql = `SELECT ${queryResults}  tahun, m
    FROM
    (SELECT 1 AS m,${year} as tahun
    union
    SELECT 2 AS m,${year} as tahun
    union
    SELECT 3 AS m,${year} as tahun
    union
    SELECT 4 AS m,${year} as tahun
    union
    SELECT 5 AS m,${year} as tahun
    union
    SELECT 6 AS m,${year} as tahun
    union
    SELECT 7 AS m,${year} as tahun
    union
    SELECT 8 AS m,${year} as tahun
    union
    SELECT 9 AS m,${year} as tahun
    union
    SELECT 10 AS m,${year} as tahun
    union
    SELECT 11 AS m,${year} as tahun
    union
    SELECT 12 AS m ,${year} as tahun
    ) months
    LEFT JOIN  ${table} on(months.m = MONTH(${column}) AND months.tahun = YEAR(${column}))
    ${where}
    GROUP BY months.m ${columnYear}`;

    //console.log(sql);

    /*series: [{
     data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
     }],

     series: [{
     name: 'Allowance',
     data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
     }, {
     name: 'Deduction',
     data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
     }, {
     name: 'Loan',
     data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
     }, {
     name: 'Severance',
     data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
     }]
     */

    let dataRows = await connection.query(sql);
    let rows = [];
    //akumulasi nilainya dijumlah setiap bulan
    if(accumulation){
        let count = 0;
        dataRows.forEach(function (item,index) {
            count += item[keyName];
            let tahun = item.tahun;
            let m = item.m;
            let obj = item;
            obj[keyName] = count;

            rows.push(obj)
        });

    } else {
        rows = dataRows;
    }


    if(rows.length > 0){
        if (arr.length == 1) {
            for (var i = 0; i < rows.length; i++) {
                arrResults.push(rows[i][arr[0]]);
            }
            series.push({name: "'"+Util.fieldToName(arr[0])+"'",data: arrResults});
        } else {
            for (var i = 0; i < arr.length; i++) {
                for (var x = 0; x < rows.length; x++) {
                    objResults[arr[i]].push(rows[x][arr[i]]);
                }
            }

            for (var i = 0; i < arr.length; i++) {
                series.push({name: "'"+Util.fieldToName(arr[0])+"'",data:objResults[arr[i]]})
            }
        }
        seriesString = JSON.stringify(series);
        return Util.replaceAll(seriesString,'"',"");
    }
}

module.exports = h;