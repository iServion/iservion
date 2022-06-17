/**
 * Created by sintret dev on 8/30/2021.
 */

var menuGenerator = require("./menuGenerator");
var moduleLib = require("./moduleLib");

var newLine = '\r\n';

var MenuCollections = (req, res) => {
    var self = {
        bootstrap3: {
            standart: bootstrap3Horizontal(req, res),
            horizontal: {
                standart: bootstrap3Horizontal(req, res)
            },
            vertical: {
                standart: bootstrap3Vertical(req, res)
            }
        },
        bootstrap4: {
            horizontal: {
                standart: bootstrap3Horizontal(req, res)
            },
            vertical: {
                standart: bootstrap4(req, res),
                sample: sample(req, res),
                accordion: bootstrap4Accordian(req, res)
            }
        },
        bootstrap5: {
            horizontal: {
                standart: bootstrap5Horizontal(req, res)
            },
            vertical: {
                standart: bootstrap5Vertical(req, res),
            }
        }
    };

    self.run = function (obj) {
        var html = '';
        html = obj.html;
        var isScript = false;
        if (obj.hasOwnProperty("scripts")) {
            if (obj.scripts.length) {
                html += `<span class="VIRTUAL_JAVASCRIPT" style="display: none">${obj.scripts}</span>`;
            }
        }
        if (!isScript) {
            if (obj.hasOwnProperty("css")) {
                if (obj.css.length) {
                    html += `<span clas="VIRTUAL_CSS" style="display: none">${obj.css}</span>`;
                }
            }
        }
        return html;
    }



    /*
     https://www.yiiframework.com/extension/yiisoft/yii2-bootstrap/doc/api/2.0/yii-bootstrap-navbar
     obj.items []
     obj.options {}
     */
    self.navbar = navbar;
    self.sidebar = sidebar;
    self.metismenu = metismenu;
    self.mainMenu = mainMenu;

    return self;
}

var addProperty = (propterty, options = "") => {
    return ` ${property}="${options}" `;
}

var addProperties = (obj) => {
    var html = '';
    for (var key in obj) {
        html += ` ${key}="${obj[key]}" `;
    }
    return html;
}

var addScript = (contentScript, isJavascript)=> {
    var content = '';
    if (contentScript) {
        var tagOpen = isJavascript ? ' document.getElementsByTagName("body")[0].appendChild(`' : ' document.getElementsByTagName("head")[0].appendChild(`';
        content += tagOpen + newLine;
        content += contentScript + newLine;
        content += "`);" + newLine
    }
    return content;
}


//https://bootstrap-menu.com/demos/multilevel.html#
function navbar(obj) {
    var child = (arr, ulOptions, indexing) => {
        var html = `<ul ${addProperties(ulOptions)}>`;

        arr.forEach(function (item, index) {
            var liOptions = {}, aOptions = {class: "dropdown-item"};
            html += parent(item, liOptions, aOptions, indexing);
        });

        html += `</ul>`;
        return html;
    }

    var parent = (item, liOptions, aOptions, indexing) => {
        var html = '', href = item.href ? item.href : "#", ulOptions = indexing == 0 ? {class: "dropdown-menu"} : {class: "submenu dropdown-menu"}

        html += `<li ${addProperties(liOptions)}><a ${addProperties(aOptions)} href="${href}"><i class="${item.icon}"></i> ${item.text} </a>`;
        if (item.hasOwnProperty("children")) {
            html += child(item.children, ulOptions, (indexing + 1));
        }

        html += `</li>`;
        return html;
    }


    let html = '';
    let arr = obj.items;
    html += `<ul ${addProperties(obj.options)}>`;
    arr.forEach(function (item, index) {
        var liOptions = {class: "nav-item"}, aOptions = {class: "nav-link"};
        if (item.hasOwnProperty("children")) {
            liOptions = {class: "nav-item dropdown", id: "menuId" + index};
            aOptions = {class: "nav-link dropdown-toggle", "data-bs-toggle": "dropdown"}
        }
        html += parent(item, liOptions, aOptions, 0);
    });

    html += `</ul>`;

    var scripts = `document.addEventListener("DOMContentLoaded", function(){if (window.innerWidth < 992) {
  document.querySelectorAll('.navbar .dropdown').forEach(function(everydropdown){
    everydropdown.addEventListener('hidden.bs.dropdown', function () {
        this.querySelectorAll('.submenu').forEach(function(everysubmenu){
          everysubmenu.style.display = 'none';
        });
    })
  });

  document.querySelectorAll('.dropdown-menu a').forEach(function(element){
    element.addEventListener('click', function (e) {
        let nextEl = this.nextElementSibling;
        if(nextEl && nextEl.classList.contains('submenu')) {	
          e.preventDefault();
          if(nextEl.style.display == 'block'){
            nextEl.style.display = 'none';
          } else {
            nextEl.style.display = 'block';
          }
        }
    });
  })
}
}); `;

    var css = `@media all and (min-width: 992px) {
	.dropdown-menu li{ position: relative; 	}
	.nav-item .submenu{ 
		display: none;
		position: absolute;
		left:100%; top:-7px;
	}
	.nav-item .submenu-left{ 
		right:100%; left:auto;
	}
	.dropdown-menu > li:hover{ background-color: #f1f1f1 }
	.dropdown-menu > li:hover > .submenu{ display: block; }
}	
@media (max-width: 991px) {
  .dropdown-menu .dropdown-menu{
      margin-left:0.7rem; margin-right:0.7rem; margin-bottom: .5rem;
  }
}	`;

    return {
        html : html,
        scripts : scripts,
        css:css
    }
}

function metismenu(obj) {
    var child = (arr) => {
        var html = '<ul aria-expanded="false">';
        arr.map((item) => {
            html += parent(item)
        });
        html += `</ul>`;
        return html;
    }

    var parent = (obj, index) => {
        var href = obj.href ? "/"+obj.href : "javascript:void()", aClass = '';
        if(obj.hasOwnProperty("children")) {
            aClass = addProperties({class:"has-arrow","aria-expanded":"false"});
        }
        
        var html = `<li><a ${aClass} href="${href}"><i class="${obj.icon}"></i><span class="nav-text">${obj.text}</span></a>`;
        if(obj.hasOwnProperty("children")) {
            html += child(obj.children);
        }
        html += `</li>`;
        return html;
    }
    var html = '';
    let arr = obj.items;
    //<ul class="metismenu" id="menu">
    //options  = {class:"metismenu",id:"menu"}
    html += `<ul ${addProperties(obj.options)}>`;
    arr.forEach(function (item, index) {
        html += parent(item, index, true);
    });

    html += `</ul>`;
    return {
        html : html
    }
}


function sidebar(obj) {
    var child = (arr, index, isParent = false) => {
        var dataparent = isParent ? ` data-bs-parent="#sidebar"` : '';
        var html = `<ul id="multi${index}" class="submenu sidebar-dropdown list-unstyled collapse"  ${dataparent} >`;
        arr.forEach(function (item, index2) {
            html += parent(item, index+"_"+index2, false);
        });
        html += `</ul>`;
        return html;
    }


    var parent = (obj, index, isParent = false) => {
        /*
         <li class="sidebar-item">
         <a class="sidebar-link" href="ui-typography.html">
         <i class="fa fa-home" ></i> <span class="align-middle">Typography</span>
         </a>
         </li>


         <li class="sidebar-item">
         <a data-bs-target="#multi" data-bs-toggle="collapse" class="sidebar-link collapsed">
         <i class="fa fa-home" ></i> <span class="align-middle">Typography</span>
         </a>
         <ul id="multi" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
         <li class="sidebar-item">
         <a data-bs-target="#multi-2" data-bs-toggle="collapse" class="sidebar-link collapsed">Two Levels</a>
         <ul id="multi-2" class="sidebar-dropdown list-unstyled collapse">
         <li class="sidebar-item">
         <a class="sidebar-link" href="#">Item 1</a>
         <a class="sidebar-link" href="#">Item 2</a>
         </li>
         </ul>
         </li>
         <li class="sidebar-item">
         <a data-bs-target="#multi-3" data-bs-toggle="collapse" class="sidebar-link collapsed">Three Levels</a>
         <ul id="multi-3" class="sidebar-dropdown list-unstyled collapse">
         <li class="sidebar-item">
         <a data-bs-target="#multi-3-1" data-bs-toggle="collapse" class="sidebar-link collapsed">Item 1</a>
         <ul id="multi-3-1" class="sidebar-dropdown list-unstyled collapse">
         <li class="sidebar-item">
         <a class="sidebar-link" href="#">Item 1</a>
         <a class="sidebar-link" href="#">Item 2</a>
         </li>
         </ul>
         </li>
         <li class="sidebar-item">
         <a class="sidebar-link" href="#">Item 2</a>
         </li>
         </ul>
         </li>
         </ul>
         </li>
         */

        var aOptions = {
            "class":"sidebar-link"
        };
        var liOptions = {
            "class":"sidebar-item"
        }
        var href = obj.href ? "/"+obj.href : "#", isChild = false;
        var text = obj.text;
        if(obj.hasOwnProperty("children")) {
            aOptions = {
                "data-bs-target":"#multi"+index,
                "data-bs-toggle":"collapse",
                "class":"sidebar-link"
            }
            isChild = true;
            liOptions = {
                "class":"sidebar-item has-sub"
            }
        }

        text = `<i class="${obj.icon}" ></i> <span class="align-middle">${obj.text}</span>`;


        var html = `<li ${addProperties(liOptions)}>
    <a ${addProperties(aOptions)} href="${href}">
        ${text}
    </a>`;

        if(isChild) {
            html += child(obj.children, index, isParent);
        }

        html += `</li>`;
        return html;
    }

    var html = '';
    let arr = obj.items;
    //<ul class="sidebar-nav">
    //options  = {class:"sidebar-nav"}
    html += `<ul ${addProperties(obj.options)}>`;
    arr.forEach(function (item, index) {
        html += parent(item, index, true);
    });

    html += `</ul>`;
    return {
        html : html
    }
}

function bootstrap5Horizontal(req, res) {
    var child = (menuArr, menuLevel) => {
        //menuLevel = menuLevel+1;
        var ulClass = '';
        if (menuLevel == 1) {
            ulClass = 'submenu-group';
        } else {
            ulClass = 'subsubmenu';
        }

        var html = '';
        if (menuArr.length) {

            html += `<ul class="${ulClass}">`;
            menuArr.map((item) => {
                html += parent(item, menuLevel);
            });
            html += `</ul>`;

        }
        return html;
    }

    var parent = (item, menuLevel) => {
        menuLevel = menuLevel + 1;
        var ulClass = '', liClass = '';
        if (menuLevel == 1) {
            ulClass = 'menu-item';
        } else if (menuLevel == 2) {
            ulClass = 'submenu-item';
            liClass = 'sub';
        } else if (menuLevel == 3) {
            ulClass = 'subsubmenu-item';
            liClass = 'subsub';
        } else {
            ulClass = 'subsubsubmenu-item';
            liClass = 'subsubsub';
        }


        var html = '';
        var isLevel3 = false;
        var hasMenu = item.hasOwnProperty("children") ? "has-sub" : "";
        if (hasMenu) {
            var item2 = item.children;
            if (menuLevel == 1) {
                isLevel3 = true;
            }
        }


        var href = item.href ? "/" + item.href : "#";
        html += `<li class="${ulClass}  ${hasMenu}"  data-parent="${menuLevel}">
                    <a href="${href}" class="${liClass}menu-link"><i class="${item.icon}"></i><span> ${item.text}</span></a>`;
        if (item.hasOwnProperty("children")) {
            if (isLevel3) html += `<div class="submenu "><div class="submenu-group-wrapper">`;
            html += child(item.children, menuLevel);
            if (isLevel3) html += `</div></div>`;
        }


        html += `</li>`;
        return html;
    }
    let html = "", span = "", aclass = "", atoggle = "";
    let arr = menuGenerator.menuPlus(req, res);

    html += `<ul>`;
    arr.map((item) => {
        html += parent(item, 0);
    });
    html += `</ul>`;

    return {
        html: html
    }
}

function bootstrap4(req, res, obj = {}) {
    //add css to head
    var scripts = [], css = [];
    var content = `.nav-link[data-toggle].collapsed:after {content: " ▾";}
    .nav-link[data-toggle]:not(.collapsed):after {content: " ▴";}`;
    css.push(content);
    content = `$(".text-truncate").on("click", function () {
        var dataIndex = ""+$(this).data("index");
        if(dataIndex.indexOf("_") > -1) {
            var explodes = dataIndex.split("_");
            if(explodes.length >1) {
              var getId = [];
                for(var i =0; i < explodes.length; i++) {
                    getId.push(explodes[i]);    
                    if(i > 0) {
                        $("#submenu" + getId.join("_")).addClass("show");
                         setTimeout(function () {$("#submenu" + getId.join("_")).addClass("show");},600);
                    }     
                }
            }
        }
          
    });`;


    scripts.push(content);
    //generated menu

    var parent = (item, options = {}) => {
        var html = '';
        var index = options.index || 0;
        var span = "", aclass = "", atoggle = "";
        var href = item.href == "" ? "#" : "/" + item.href;
        if (item.hasOwnProperty("children")) {
            aclass = "collapsed";
            href = "#submenu" + index;
            atoggle = ` data-toggle="collapse" data-target="#submenu${index}" `;
        }

        html += `<li class="nav-item">
                    <a class="nav-link ${aclass} text-truncate" data-index="${index}" href="${href}" ${atoggle} ><i class="${item.icon} menu-icon"></i> <span class="d-none d-sm-inline">${item.text} </span></a>`;

        return html;
    }

    let html = "", span = "", aclass = "", atoggle = "";
    let arr = menuGenerator.menuPlus(req, res);

    html += `<ul class="nav flex-column flex-nowrap overflow-hidden">`;
    arr.forEach(function (item, index) {
        html += parent(item, {index: index});//li

        if (item.hasOwnProperty("children")) {
            html += `<div class="collapse" id="submenu${index}" aria-expanded="false"><ul class="flex-column pl-2 nav">`;

            item.children.forEach(function (item2, index2) {
                html += parent(item2, {index: index + "_" + index2});//li

                if (item2.hasOwnProperty("children")) {
                    html += `<div class="collapse" id="submenu${index + "_" + index2}" aria-expanded="false"><ul class="flex-column nav pl-4">`;

                    item2.children.forEach(function (item3, index3) {
                        html += parent(item3, {index: index + "_" + index2 + "_" + index3});//li

                        if (item3.hasOwnProperty("children")) {
                            html += `<div class="collapse" id="submenu${index + "_" + index2 + "_" + index3}" aria-expanded="false"><ul class="flex-column pl-4 nav">`;

                            item3.children.forEach(function (item4, index4) {
                                html += parent(item4, {index: index + "_" + index2 + "_" + index3 + "_" + index4});//li
                                html += `</li>`;
                            });

                            html += `</ul></div`;
                        }

                        html += `</li>`;
                    });

                    html += `</ul></div`;
                }

                html += `</li>`;
            });
            html += `</ul></div`;
        }
        html += `</li>`;

    });
    html += `</ul>`;

    return {
        html: html,
        scripts: scripts,
        css: css
    }
}


function sample(req, res) {
    var html = `<ul class="nav flex-column flex-nowrap overflow-hidden">
                <li class="nav-item">
                    <a class="nav-link text-truncate" href="#"><i class="fa fa-home"></i> <span class="d-none d-sm-inline">Overview</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link collapsed text-truncate" href="#submenu1" data-toggle="collapse" data-target="#submenu1"><i class="fa fa-table"></i> <span class="d-none d-sm-inline">Reports</span></a>
                    <div class="collapse" id="submenu1" aria-expanded="false">
                        <ul class="flex-column pl-2 nav">
                            <li class="nav-item"><a class="nav-link py-0" href="#"><span>Orders</span></a></li>
                            <li class="nav-item">
                                <a class="nav-link  text-truncate collapsed py-1" href="#submenu1sub1" data-toggle="collapse" data-target="#submenu1sub1" aria-controls="submenu1sub1"><span>Customers</span></a>
                                <div class="collapse" id="submenu1sub1" aria-expanded="false">
                                    <ul class="flex-column nav pl-4">
                                        <li class="nav-item">
                                            <a class="nav-link p-1 text-truncate" href="#">
                                                <i class="fa fa-fw fa-clock-o"></i> Daily </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link p-1 text-truncate" href="#">
                                                <i class="fa fa-fw fa-dashboard"></i> Dashboard </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link p-1 text-truncate" href="#">
                                                <i class="fa fa-fw fa-bar-chart"></i> Charts </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link p-1 text-truncate" href="#">
                                                <i class="fa fa-fw fa-compass"></i> Areas </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="nav-item"><a class="nav-link text-truncate" href="#"><i class="fa fa-bar-chart"></i> <span class="d-none d-sm-inline">Analytics</span></a></li>
                <li class="nav-item"><a class="nav-link text-truncate" href="#"><i class="fa fa-download"></i> <span class="d-none d-sm-inline">Export</span></a></li>
            </ul>`;

    return {
        html: html
    }
}

function bootstrap3Vertical(req, res) {
    let html = "", span = "", dropdown = "", test = "";
    let arr = menuGenerator.menu(req, res);
    arr.map((me) => {
        var href = me.href == "" ? "#" : "/" + me.href;

        if (me.hasOwnProperty("children")) {
            dropdown = `class="dropdown"`;
            span = `<span class="caret"></span>`;
            test = `class="test"`;
        } else {
            dropdown = "", span = "", test = "";
        }
        html += `<li ${dropdown}>`;
        html += `<a href="${href}" title="${me.title}" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="${me.icon} fa-fw"></i> ${me.text}${span}</a>`;

        if (me.hasOwnProperty("children")) {
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
                if (item.hasOwnProperty("children")) {
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
                        if (child.hasOwnProperty("children")) {
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

function bootstrap3Horizontal(req, res) {
    var menuHtml = "";
    let menuJson = menuGenerator.menu(req, res);
    menuJson.map(function (me) {
        var href = me.href == "" ? "javascript:void(0);" : "/" + me.href;
        menuHtml += `<li>`;
        var menuclass = me.hasOwnProperty("children") ? "menu-toggle " : "";
        menuHtml += `<a href="${href}" class="${menuclass} waves-effect waves-block" ><i class="${me.icon}"></i><span>${me.text}</span></a>`;

        if (me.hasOwnProperty("children")) {
            menuHtml += `<ul class="ml-menu">`;

            //1 child
            me.children.map(function (item) {
                var href = item.href == "" ? "javascript:void(0);" : "/" + item.href;
                menuclass = item.hasOwnProperty("children") ? "menu-toggle " : "";
                menuHtml += `<li>`;
                menuHtml += `<a href="${href}" class="${menuclass} waves-effect waves-block">
                                <span>${item.text}</span>
                            </a>`;

                //2 child
                if (item.hasOwnProperty("children")) {
                    menuHtml += `<ul class="ml-menu">`;
                    item.children.map(function (child) {
                        href = child.href == "javascript:void(0);" ? "#" : "/" + child.href;
                        menuclass = child.hasOwnProperty("children") ? "menu-toggle " : "";
                        menuHtml += `<li>`;
                        menuHtml += `<a href="${href}" class="${menuclass} waves-effect waves-block">
                                <span>${child.text}</span>
                            </a>`;

                        if (child.hasOwnProperty("children")) {
                            menuHtml += `<ul class="ml-menu">`;
                            child.children.map(function (child2) {
                                href = child2.href == "" ? "#" : "/" + child2.href;
                                menuHtml += `<li><a href="${href}" class=" waves-effect waves-block">${child2.text}</a>
                                </li>`;
                            });

                            //end 3 child
                            menuHtml += '</ul>';
                        }
                    });
                    //end 2 child
                    menuHtml += '</ul>';
                }
            });
            //end 1 child
            menuHtml += `</ul>`;
        }
        menuHtml += `<li>`
    });

    return menuHtml;
}


function bootstrap4Accordian(req, res) {
    var scripts = [];
    //add css to head
    var content = `'
*{box-sizing:border-box; -moz-box-sizing:border-box; -webkit-box-sizing:border-box;}body{background: #f0f0f0;}.content{width: 260px; margin: 100px auto;}.colors{width: 260px; float: left; margin: 20px auto;}.colors a{width: 43.3px; height: 30px; float: left;}.colors .default{background: #414956;}.colors .blue{background: #4A89DC;}.colors .green{background: #03A678;}.colors .red{background: #ED5565;}.colors .white{background: #fff;}.colors .black{background: #292929;}

@import url(http://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700);.jquery-accordion-menu,.jquery-accordion-menu *{font-family:'Open Sans',sans-serif;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;outline:0}.jquery-accordion-menu{min-width:260px;float:left;position:relative;box-shadow:0 20px 50px #333}.jquery-accordion-menu .jquery-accordion-menu-footer,.jquery-accordion-menu .jquery-accordion-menu-header{width:100%;height:50px;padding-left:22px;float:left;line-height:50px;font-weight:600;color:#f0f0f0;background:#414956}.jquery-accordion-menu ul{margin:0;padding:0;list-style:none}.jquery-accordion-menu ul li{width:100%;display:block;float:left;position:relative}.jquery-accordion-menu ul li a{width:100%;padding:14px 22px;float:left;text-decoration:none;color:#f0f0f0;font-size:13px;background:#414956;white-space:nowrap;position:relative;overflow:hidden;-o-transition:color .2s linear,background .2s linear;-moz-transition:color .2s linear,background .2s linear;-webkit-transition:color .2s linear,background .2s linear;transition:color .2s linear,background .2s linear}.jquery-accordion-menu>ul>li.active>a,.jquery-accordion-menu>ul>li:hover>a{color:#fff;background:#3b424d}.jquery-accordion-menu>ul>li>a{border-bottom:solid 1px #3b424d}.jquery-accordion-menu ul li a i{width:34px;float:left;line-height:18px;font-size:16px;text-align:left}.jquery-accordion-menu .submenu-indicator{float:right;right:22px;position:absolute;line-height:19px;font-size:20px;-o-transition:transform .3s linear;-moz-transition:transform .3s linear;-webkit-transition:transform .3s linear;-ms-transition:transform .3s linear}.jquery-accordion-menu ul ul.submenu .submenu-indicator{line-height:16px}.jquery-accordion-menu .submenu-indicator-minus>.submenu-indicator{-ms-transform:rotate(45deg);-moz-transform:rotate(45deg);-webkit-transform:rotate(45deg);transform:rotate(45deg)}.jquery-accordion-menu ul ul.submenu,.jquery-accordion-menu ul ul.submenu li ul.submenu{width:100%;display:none;position:static}.jquery-accordion-menu ul ul.submenu li{clear:both;width:100%}.jquery-accordion-menu ul ul.submenu li a{width:100%;float:left;font-size:11px;background:#383838;border-top:none;position:relative;border-left:solid 6px transparent;-o-transition:border .2s linear;-moz-transition:border .2s linear;-webkit-transition:border .2s linear;transition:border .2s linear}.jquery-accordion-menu ul ul.submenu li:hover>a{border-left-color:#414956}.jquery-accordion-menu ul ul.submenu>li>a{padding-left:30px}.jquery-accordion-menu ul ul.submenu>li>ul.submenu>li>a{padding-left:45px}.jquery-accordion-menu ul ul.submenu>li>ul.submenu>li>ul.submenu>li>a{padding-left:60px}.jquery-accordion-menu ul li .jquery-accordion-menu-label,.jquery-accordion-menu ul ul.submenu li .jquery-accordion-menu-label{min-width:20px;padding:1px 2px 1px 1px;position:absolute;right:18px;top:14px;font-size:11px;font-weight:800;color:#555;text-align:center;line-height:18px;background:#f0f0f0;border-radius:100%}.jquery-accordion-menu ul ul.submenu li .jquery-accordion-menu-label{top:12px}.ink{display:block;position:absolute;background:rgba(255,255,255,.3);border-radius:100%;-webkit-transform:scale(0);-moz-transform:scale(0);-ms-transform:scale(0);-o-transform:scale(0);transform:scale(0)}.animate-ink{-webkit-animation:ripple .5s linear;-moz-animation:ripple .5s linear;-ms-animation:ripple .5s linear;-o-animation:ripple .5s linear;animation:ripple .5s linear}@-webkit-keyframes ripple{100%{opacity:0;-webkit-transform:scale(2.5)}}@-moz-keyframes ripple{100%{opacity:0;-moz-transform:scale(2.5)}}@-o-keyframes ripple{100%{opacity:0;-o-transform:scale(2.5)}}@keyframes ripple{100%{opacity:0;transform:scale(2.5)}}.blue.jquery-accordion-menu .jquery-accordion-menu-footer,.blue.jquery-accordion-menu .jquery-accordion-menu-header,.blue.jquery-accordion-menu ul li a{background:#4A89DC}.blue.jquery-accordion-menu>ul>li.active>a,.blue.jquery-accordion-menu>ul>li:hover>a{background:#3e82da}.blue.jquery-accordion-menu>ul>li>a{border-bottom-color:#3e82da}.blue.jquery-accordion-menu ul ul.submenu li:hover>a{border-left-color:#3e82da}.green.jquery-accordion-menu .jquery-accordion-menu-footer,.green.jquery-accordion-menu .jquery-accordion-menu-header,.green.jquery-accordion-menu ul li a{background:#03A678}.green.jquery-accordion-menu>ul>li.active>a,.green.jquery-accordion-menu>ul>li:hover>a{background:#049372}.green.jquery-accordion-menu>ul>li>a{border-bottom-color:#049372}.green.jquery-accordion-menu ul ul.submenu li:hover>a{border-left-color:#049372}.red.jquery-accordion-menu .jquery-accordion-menu-footer,.red.jquery-accordion-menu .jquery-accordion-menu-header,.red.jquery-accordion-menu ul li a{background:#ED5565}.red.jquery-accordion-menu>ul>li.active>a,.red.jquery-accordion-menu>ul>li:hover>a{background:#DA4453}.red.jquery-accordion-menu>ul>li>a{border-bottom-color:#DA4453}.red.jquery-accordion-menu ul ul.submenu li:hover>a{border-left-color:#DA4453}.white.jquery-accordion-menu .jquery-accordion-menu-footer,.white.jquery-accordion-menu .jquery-accordion-menu-header,.white.jquery-accordion-menu ul li a{background:#fff;color:#555}.white.jquery-accordion-menu>ul>li.active>a,.white.jquery-accordion-menu>ul>li:hover>a{background:#f0f0f0}.white.jquery-accordion-menu>ul>li>a{border-bottom-color:#f0f0f0}.white.jquery-accordion-menu ul ul.submenu li:hover>a{border-left-color:#f0f0f0}.white.jquery-accordion-menu ul ul.submenu li a{color:#f0f0f0}.white.jquery-accordion-menu>ul>li>a>.ink{background:rgba(0,0,0,.1)}.black.jquery-accordion-menu .jquery-accordion-menu-footer,.black.jquery-accordion-menu .jquery-accordion-menu-header,.black.jquery-accordion-menu ul li a{background:#292929}.black.jquery-accordion-menu>ul>li.active>a,.black.jquery-accordion-menu>ul>li:hover>a{background:#222}.black.jquery-accordion-menu>ul>li>a{border-bottom-color:#222}.black.jquery-accordion-menu ul ul.submenu li:hover>a{border-left-color:#222}'

    `;

    addScript(content, false);
    content = '$(document).ready(function () {';
    content += `
    
    
    
    'jQuery(document).ready(function () {
        jQuery("#jquery-accordion-menu").jqueryAccordionMenu();
        jQuery(".colors a").click(function () {
            if ($(this).attr("class") != "default") {
                $("#jquery-accordion-menu").removeClass();
                $("#jquery-accordion-menu").addClass("jquery-accordion-menu").addClass($(this).attr("class"));
            } else {
                $("#jquery-accordion-menu").removeClass();
                $("#jquery-accordion-menu").addClass("jquery-accordion-menu");
            }
        });
    });
});

eval(function (p, a, c, k, e, d) {
    e = function (c) {
        return c
    };
    if (!''.replace(/^/, String)) {
        while (c--) {
            d[c] = k[c] || c
        }
        k = [function (e) {
            return d[e]
        }];
        e = function () {
            return '\\w+'
        };
        c = 1
    }
    while (c--) {
        if (k[c]) {
            p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c])
        }
    }
    return p
}('94(61(54,52,50,53,51,55){51=61(50){64(50<52?\'\':51(95(50/52)))+((50=50%52)>35?68.98(50+29):50.97(36))};73(!\'\'.70(/^/,68)){71(50--){55[51(50)]=53[50]||51(50)}53=[61(51){64 55[51]}];51=61(){64\'\\\\59+\'};50=1};71(50--){73(53[50]){54=54.70(109 96(\'\\\\56\'+51(50)+\'\\\\56\',\'57\'),53[50])}}64 54}(\'86(31(54,52,50,53,51,55){51=31(50){32(50<52?\\\'\\\':51(91(50/52)))+((50=50%52)>35?34.39(50+29):50.84(36))};38(!\\\'\\\'.37(/^/,34)){33(50--){55[51(50)]=53[50]||51(50)}53=[31(51){32 55[51]}];51=31(){32\\\'\\\\\\\\59+\\\'};50=1};33(50--){38(53[50]){54=54.37(125 83(\\\'\\\\\\\\56\\\'+51(50)+\\\'\\\\\\\\56\\\',\\\'57\\\'),53[50])}}32 54}(\\\'219(63(54,52,50,53,51,55){51=63(50){60(50<52?\\\\\\\'\\\\\\\':51(220(50/52)))+((50=50%52)>218?99.217(50+29):50.22(21))};74(!\\\\\\\'\\\\\\\'.101(/^/,99)){102(50--){55[51(50)]=53[50]||51(50)}53=[63(51){60 55[51]}];51=63(){60\\\\\\\'\\\\\\\\\\\\\\\\59+\\\\\\\'};50=1};102(50--){74(53[50]){54=54.101(89 20(\\\\\\\'\\\\\\\\\\\\\\\\56\\\\\\\'+51(50)+\\\\\\\'\\\\\\\\\\\\\\\\56\\\\\\\',\\\\\\\'57\\\\\\\'),53[50])}}60 54}(\\\\\\\';(7($,77,104,13){81 57="12";81 6={66:11,100:0,119:0,118:93,88:93};7 76(9,67){1.9=9;1.221=$.103({},6,67);1.10=6;1.14=57;1.87()};$.103(76.15,{87:7(){1.92();1.106();8(6.88){1.59()}},92:7(){$(1.9).5("225").58("19").113("112 111",7(51){51.18();51.16();8($(1).5(".3").54>0){8($(1).5(".3").80("17")=="223"){$(1).5(".3").116(6.100).213(6.66);$(1).5(".3").56("52").115("3-50-65");8(6.118){$(1).56().5(".3").120(6.66);$(1).56().5(".3").56("52").72("3-50-65")}117 202}203{$(1).5(".3").116(6.119).120(6.66)}8($(1).5(".3").56("52").199("3-50-65")){$(1).5(".3").56("52").72("3-50-65")}}77.205.108=$(1).5("52").210("108")})},106:7(){8($(1.9).58(".3").54>0){$(1.9).58(".3").56("52").206("<53 124=\\\\\\\\\\\\\\\'3-50\\\\\\\\\\\\\\\'>+</53>")}},59:7(){81 4,55,79,75;$(1.9).58("52").113("112 111",7(51){$(".4").248();8($(1).5(".4").54===0){$(1).250("<53 124=\\\\\\\\\\\\\\\'4\\\\\\\\\\\\\\\'></53>")}4=$(1).58(".4");4.72("121-4");8(!4.78()&&!4.69()){55=262.260($(1).259(),$(1).257());4.80({78:55,69:55})}79=51.247-$(1).110().107-4.69()/2;75=51.237-$(1).110().105-4.78()/2;4.80({105:75+\\\\\\\\\\\\\\\'114\\\\\\\\\\\\\\\',107:79+\\\\\\\\\\\\\\\'114\\\\\\\\\\\\\\\'}).115("121-4")})}});$.242[57]=7(67){1.240(7(){8(!$.122(1,"123"+57)){$.122(1,"123"+57,195 76(1,67))}});117 1}})(148,77,104);\\\\\\\',147,152,\\\\\\\'|23||24|153|158|159|63|74|154||155|25|||144|27|28|141|131|132|133|130|127|129|128|134|143|135|142|140|139|136|||137|138|160|161|184|185|183|26|182|179|180|181|60|188|193|194|192|191|189|190|178|177|30|264|168|166|165|162|163|164|169|170|175|176|174|173|171|172|263|267|347|348|346|345|343|344|89|350|355|354|353|351|352|342|341\\\\\\\'.332(\\\\\\\'|\\\\\\\'),0,{}))\\\',82,333,\\\'||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||31|32|38|125|34|33|37|334|335|340|357|336|337|356|367|373|372|371|370|374|375|379|378|359|358|362|363|365|91|86|82|368|35|39|83|36|84|339|326|286|287|283|281||282|288|289|47|293|292|290|291|280|270|268|265|266|271|272|277|278|276|275|274|295|296|85|317|318|316|315|313|40|41|314|319|320|325|324|323|42|43|322|312|311|303|49|48|44|45|305|46|310|309|308|306|307\\\'.85(\\\'|\\\'),0,{}))\',62,284,\'|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||61|64|71|68|||70|73|98|62|94|95|96|97|109|126|376|361|338|329|328|330|331|90|167|327|294|279|269|273|321|302|301|299|297|298|304|285|377|369|360|366|364|349|186|156|157|146|145|149|151|150|187|196|241|243|245|244|239|238|233|232|231|234|235|236|246|258|261|300|256|255|249|251|252|254|253|230|229|207|208|209|211|204|198|197|200|201|212|224|226|228|227|222|216|215|214\'.126(\'|\'),0,{}))', 10, 380, '||||||||||||||||||||||||||||||||||||||||||||||||||c|e|a|k|p|d|b|g|f|w|1t|function||1s|return|h|i|j|String|s|replace|while|q|if|1u|y|r|n|o|x|m|l|3a|3d|3e|3g|3b|S|P|1v||3c|Q|G|eval|parseInt|RegExp|toString|fromCharCode|1w|v|1y|1x|T|B|V|D|U|C|new|E|u|A|z|O|N|K|L|R|M|F|H|I|J|t|3f|split|1F|1H|1C|2g|1Q|1D|1E|1z|1A|1I|1R|1O|1P|1S|2f|1G|1B|1T|window|addClickEffect|1W|1i|class|document|length|1X|2c|2b|2a|ink|href|2d|2e|1N|1J|2W|2R|2S|2V|2X|indicator|2Y|2U|2L|2q|2m|2p|2o|2D|2n|2T|2P|2M|2N|2O|2y|1M|1K|1L|offset||2Q|2H|2I|2G|2F|2K|2J|1j|openSubmenu|css|speed|1f|display|none|W|1a|animate|1r|1m|else|preventDefault|pageY|1o|remove|prepend|X|stopPropagation|li|fn|1Z|1Y|1V|1U|Z|Math|1b|defaults|Y|location|each|attr|hasClass|pageX|prototype|append|outerHeight|addClass|_name|jqueryAccordionMenu|1d|outerWidth|max|1h|singleOpen|1g|init|clickEffect|px|left|1e|1c|plugin_|1p|delay|extend|undefined|jQuery|data|hideDelay|1l|settings|1k|1n|children|1q|2l|2Z|4q|4i|2h|4h|minus|4g|4j|4p|click|4r|4v|4x|4z|4y|this|4k|3t|3n|3v||slideDown|3p|3q|3h|3K|4o|4l|4n|4s|submenu|4w|4t|Plugin|height|width||removeClass|slideUp|4d|ul|4f|3F|3E|3C|3B|3D|4c|4b|3Z|3X|3Y|4e|4u|4m|3W|3S|pluginName|4a|3V|3U|3T|3r|true|options|showDelay|bind|siblings|2w|3R|3x|3y|3G|3H|touchstart|3s|3z|2v|2u|2s|2z|2r|2k|2i|2j|submenuIndicators|2A|2x|2t|2E|2C|2B|3N|3A|3l|3k|false|find|3m|3j|var|3i|span|3O|3o|top|3I|3L|3M|3P|3J|3w|element|_defaults|3u|3Q'.split('|'), 0, {}))
'
    `;
    addScript(content, true);


    var html = `	<ul>
					<li class="active"><a href="#"><i class="fa fa-home"></i>Home </a></li>
					<li><a href="#"><i class="fa fa-glass"></i>Events </a></li>
					<li><a href="#"><i class="fa fa-file-image-o"></i>Gallery </a><span class="jquery-accordion-menu-label">12 </span></li>
					<li><a href="#"><i class="fa fa-cog"></i>Services </a>
						<ul class="submenu">
							<li><a href="#">
							Web Design </a></li>
							<li><a href="#">Hosting </a></li>
							<li><a href="#">Design </a>
								<ul class="submenu">
									<li><a href="#">Graphics </a></li>
									<li><a href="#">Vectors </a></li>
									<li><a href="#">Photoshop </a></li>
									<li><a href="#">Fonts </a></li>
								</ul>
							</li>
							<li><a href="#">Consulting </a></li>
						</ul>
					</li>
					<li><a href="#"><i class="fa fa-newspaper-o"></i>News </a></li>
					<li><a href="#"><i class="fa fa-suitcase"></i>Portfolio </a>
						<ul class="submenu">
							<li><a href="#">Web Design </a></li>
							<li><a href="#">Graphics </a><span class="jquery-accordion-menu-label">10 </span></li>
							<li><a href="#">Photoshop </a></li>
							<li><a href="#">Programming </a></li>
						</ul>
					</li>
					<li><a href="#"><i class="fa fa-user"></i>About </a></li>
					<li><a href="#"><i class="fa fa-envelope"></i>Contact </a></li>
				</ul>`;

    var obj = {
        html: html
    }
    if (scripts.length) {
        obj.scripts = scripts;
    }
    return obj;
}

function sample4(req, res) {

    return ``;
}


function bootstrap5Vertical(req, res) {
    let html = "", span = "", dropdown = "", test = "";

    var parent = (obj, classname = "")=> {
        let href = obj.href ? obj.href : "#";
        let hassub = "", sidebarlink = "", aClass = "", span = obj.text;
        if (obj.hasOwnProperty("children")) {
            hassub = "has-sub";
            sidebarlink = "sidebar-link";
            aClass = `class="${sidebarlink}"`;
            span = `<span>${obj.text}</span>`;
        }


        let html = '';
        html += `<li class="${classname} ${hassub}">
            <a href="${href}" ${aClass} >
            <i class="${obj.icon}"></i>
            ${span}
            </a>`;
        if (hassub != "") {
            html += child(obj.children);
        }
        html += `</li>`;

        return html;
    }

    var child = (arr) => {
        let html = '<ul class="submenu ">';
        arr.map((item) => {
            html += parent(item, "submenu-item");
        });
        html += `</ul>`;
        return html;
    }


    let arr = menuGenerator.menuPlus(req, res);
    html += `<ul class="menu">`;
    arr.map((item) => {
        var classname = "";
        if (item.hasOwnProperty("children")) {
            classname = "sidebar-item";
        } else {
            classname = "sidebar-title";
        }
        html += parent(item, classname);
    });
    html += `</ul>`;

    return {
        html: html
    }
}

function mainMenu(obj) {
    let html = "", span = "", dropdown = "", test = "";
    var parent = (obj, classname = "")=> {
        let href = obj.href ? "/"+obj.href : "#";
        let hassub = "", sidebarlink = "", aClass = "", span = obj.text;
        if (obj.hasOwnProperty("children")) {
            hassub = "has-sub";
            sidebarlink = "sidebar-link";
            aClass = `class="${sidebarlink}"`;
            span = `<span>${obj.text}</span>`;
        }
        let html = '';
        html += `<li class="${classname}">
            <a href="${href}" ${aClass} >
            <i class="${obj.icon}"></i>
            ${span}
            </a>`;
        if (hassub != "") {
            html += child(obj.children);
        }
        html += `</li>`;

        return html;
    }

    var child = (arr) => {
        let html = '<div class="submenu"><ul>';
        arr.map((item) => {
            html += parent(item, "submenu-item");
        });
        html += `</ul></div>`;
        return html;
    }
    let arr = obj.items;
    html += `<ul class="main-menu">`;
    arr.map((item) => {
        var classname = "";
        if (item.hasOwnProperty("children")) {
            classname = "has-submenu ";
        } else {
            classname = "";
        }
        html += parent(item, classname);
    });
    html += `</ul>`;
    return {
        html: html
    }
}

module.exports = MenuCollections;