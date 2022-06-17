/**
 * Created by ANDHIE on 2/28/2021.
 */

const connection = require("./../config/connection");
const zCache = require("./zCache");
var zRole = require("./zRole");

var menuGenerator = {}

menuGenerator.addItem = (obj) => {
    let newObj = {}
    for (var key in obj) {
        if (key != "children") {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

menuGenerator.children = (res, arr) => {
    var myArr = [];
    var nArr = arr.reduce((result, item) => [...result, item.href],[]);
    let isAccess =  zRole.menuAccess(res, nArr);
    if (isAccess) {
        //stupid way
        arr.map((item) => {
            var obj = {};
            if(zRole.isAccess(res.locals.roleId,item.href,"index")) {
                obj = menuGenerator.addItem(item);
                if (item.hasOwnProperty("children") && item.children.length) {
                    var child = [];
                    child.push(menuGenerator.children(res, item.children));
                    if (child[0]) {
                        obj.children = child[0];
                    }
                }
                myArr.push(obj)
            }
        });
    }
    return myArr;
}

menuGenerator.menu = (req, res) => {
    var jsonArray = [];
    if (!res.locals.isLogin) return jsonArray;
    let companyId = res.locals.companyId;
    let userId = res.locals.userId;
    let jsonMenu = zCache.get("MENU");
    let arr = [];
    if (jsonMenu && jsonMenu.hasOwnProperty(companyId)) {
        arr = jsonMenu[companyId] || [];
    } else {
        arr = menuGenerator.arr; //set to default menu
    }
    arr.map((me) => {
        if (zRole.menuAccess(res, me.href)) {
            var obj = menuGenerator.addItem(me);
            if (me.hasOwnProperty("children")) {
                obj.children = menuGenerator.children(res, me.children);
                if(obj.children.length) {
                    jsonArray.push(obj);
                }
            } else {
                jsonArray.push(obj);
            }
        }
    });

    return jsonArray;
}


menuGenerator.systems = (req,res) => {
    var arr = [];
    var children = [];
    [
        {
            text: "User Account",
            href: "zuser",
        },
        {
            text: "Company",
            href: "zcompany",
        },
        {
            text: "User Company Access",
            href: "zuser_company",
        },
        {
            text: "Access Role",
            href: "zrole",
        }
    ].forEach(function (item) {
        if (zRole.menuAccess(res, item.href)) {
            children.push(item);
        }
    })

    let userManagament = {
        text: "User Management",
        icon: "fa fa-user",
        children: children
    }
    arr.push(userManagament);

    return arr;
}

menuGenerator.menuPlus = (req, res) => {
    let arr = menuGenerator.menu(req, res);
    return  [...arr, ...menuGenerator.systems(req, res)];
}

menuGenerator.html = (req, res) => {
    let html = "";
    let arr = menuGenerator.menu(req, res);
    var span = "";
    var dropdown = "";
    var test = "";
    arr.map((me) => {
        var href = me.href == "" ? "#" : "/" + me.href;

        if (me.hasOwnProperty("children") && me.children.length) {
            dropdown = `class="dropdown"`;
            span = `<span class="caret"></span>`;
            test = `class="test"`;
        } else {
            dropdown = "", span = "", test = "";
        }
        html += `<li ${dropdown}>`;
        html += `<a href="${href}" title="${me.title}" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="${me.icon} fa-fw"></i> ${me.text}${span}</a>`;

        if (me.hasOwnProperty("children") && me.children.length) {
            html += `<ul class="dropdown-menu">`;
            var children = me.children;

            //1 child
            children.map((item) => {
                if (item.hasOwnProperty("children")) {
                    dropdown = `class="dropdown-submenu"`;
                    span = `<span class="caret"></span>`;
                    test = `class="test"`;
                } else {
                    dropdown = "", span = "", test = "";
                }

                href = item.href == "" ? "#" : "/" + item.href;
                html += `<li ${dropdown}><a ${test} title="${item.title}" tabindex="-1" href="${href}"><i class="${item.icon} fa-fw"></i> ${item.text}${span}</a>`;

                //2 child
                if (item.hasOwnProperty("children") && me.children.length) {
                    html += `<ul class="dropdown-menu">`;
                    item.children.map((child) => {
                        if (child.hasOwnProperty("children")) {
                            dropdown = `class="dropdown-submenu"`;
                            span = `<span class="caret"></span>`;
                            test = `class="test"`;
                        } else {
                            dropdown = "", span = "", test = "";
                        }

                        href = child.href == "" ? "#" : "/" + child.href;
                        html += `<li ${dropdown}><a title="${child.title}" ${test} tabindex="-1" href="${href}"><i class="${child.icon} fa-fw"></i>  ${child.text}${span}</a>`;


                        if (child.hasOwnProperty("children") && me.children.length) {
                            html += `<ul class="dropdown-menu">`;
                            child.children.map((child2) => {
                                href = child2.href == "" ? "#" : "/" + child2.href;

                                html += `<li><a title="${child2.title}" tabindex="-1" href="${href}"><i class="${child2.icon} fa-fw"></i>  ${child2.text}</a>`;
                            });

                            //end 3 child
                            html += '</ul>';
                        }
                    });

                    //end 2 child
                    html += '</ul>';
                }


            });
            //end 1 child
            html += `</ul>`;
        }
        html += `<li>`
    });
    return html;
}


//default menu
menuGenerator.arr = [];


module.exports = menuGenerator;