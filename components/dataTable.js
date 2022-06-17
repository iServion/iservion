/**
 * Created by sintret dev on 1/6/2022.
 */
var Util = require("./Util")

class dataTable {
    constructor(visibles) {
        this.visibles = visibles; //array object
        this.setColumns = "";
        this.setTable = "";
        this.MYMODEL = null;
        this.searchColumns = {};
        this.relations;
        this.routeName;
        this.types = {};
        this.levels = {};
    }

    // for filter html
    set filterMODEL(obj) {
        this.MYMODEL = obj.MYMODEL;
        this.relations = obj.relations;
        this.routeName = this.MYMODEL.routeName;
        this.types = obj.TYPES;
        delete obj.MYMODEL;
        delete obj.relations;
        delete obj.TYPES;
        this.searchColumns = obj;
    }

    get columns() {
        if (this.setColumns)
            return this.setColumns;
        var html = '';
        for (var key in this.visibles) {
            html += `<th id="data_${key}">${this.visibles[key]}</th>`;
        }
        return html;
    }

    /*
     Create table html header
     */
    get table() {
        if (this.setTable)
            return this.setTable;
        return `<table id="dataTable" class="display table table-hover table-responsive" style="width:100%">
            <thead>${this.columns}</thead>
        </table>`;
    }


    get buttons() {
        var html = `<div class="btn-group float-end" role="group" aria-label="Button group with nested dropdown">`;
        if (this.levels.create) {
            html += `<button type="button" class="btn btn-success btn-xs gridadd"><i class="fa fa-plus white-icon"></i></button>`;
        }
        if (this.levels.export) {
            html += `<button type="button" class="btn btn-info btn-xs gridexcel" title="Download Excel"><i class="fas fa-file-excel"></i></button>`;
        }
        if (this.levels.import) {
            html += `<button type="button" class="btn btn-warning btn-xs gridimport" title="Import Data"><i class="fas fa-file-import"></i></button>`;
        }
        html += `<button type="button" class="btn btn-info btn-xs gridsettings" title="Personalize grid settings" data-bs-toggle="modal" data-bs-target="#grid-modal"><i class="fa fa-cog"></i></button>
                        <button type="button" class="btn btn-default btn-xs gridreload" title="Refresh grid filter"><i class="fas fa-redo"></i></button>`;

        if (this.levels.export) {
            html += `<div class="btn-group" role="group">
                            <button id="dropdownExport" type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-cloud-download-alt"></i>
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownExport">`;
            html += `<a class="dropdown-item export-xls" href="#"><i class="text-success fa fa-file-excel-o"></i> Excel </a>`;
            html += `<a class="dropdown-item export-pdf" href="#"><i class="text-danger fa fa-file-pdf-o"></i> PDF </a>
                            </div>
                        `;
        }
            html += `</div>`;

        return html;
    }


    get buttons2xx() {
        return `<div class="dt-buttons btn-group flex-wrap"><h1 class="page-title">Distro</h1>               <button class="btn btn-secondary create" tabindex="0" aria-controls="DataTables_Table_0" type="button"><span><i class="fas fa-plus"></i><span>Create</span></span></button> <button class="btn btn-secondary buttons-copy buttons-html5 copy" tabindex="0" aria-controls="DataTables_Table_0" type="button"><span><i class="fas fa-copy"></i><span>Copy</span></span></button> <button class="btn btn-secondary buttons-excel buttons-html5 excel" tabindex="0" aria-controls="DataTables_Table_0" type="button"><span><i class="fas fa-file-excel"></i> <span>Excel</span></span></button> <button class="btn btn-secondary buttons-pdf buttons-html5 pdf" tabindex="0" aria-controls="DataTables_Table_0" type="button"><span><i class="fas fa-file-pdf"></i><span>PDF</span></span></button> <button class="btn btn-secondary refresh" tabindex="0" aria-controls="DataTables_Table_0" type="button"><span><i class="fas fa-sync"></i><span>Refresh</span></span></button> <div class="btn-group"><button class="btn btn-secondary buttons-collection dropdown-toggle has-submenu" tabindex="0" aria-controls="DataTables_Table_0" type="button" aria-haspopup="dialog" aria-expanded="false"><span><i class="fas fa-cloud-download-alt"></i><span>Download</span></span><span class="dt-down-arrow"></span></button></div> </div>`;
    }
    get buttons2() {
        var html = `<div class="dataTables_wrapper dt-bootstrap5 no-footer "><div class="dt-buttons btn-group flex-wrap">`;
        if (this.levels.create) {
            html += `<button class="btn create gridadd" tabindex="0" aria-controls="DataTables_Table_0" type="button"><span><i class="fas fa-plus"></i><span>Create</span></span></button>`
        }

        if (this.levels.export) {
            html += `<button class="btn  buttons-excel buttons-html5 excel gridexcel" tabindex="0" aria-controls="DataTables_Table_0" type="button"><span><i class="fas fa-file-excel"></i> <span>Excel</span></span></button>`;
        }

        if (this.levels.import) {
            html += `<button class="btn buttons-copy buttons-html5 copy gridimport" tabindex="0" aria-controls="DataTables_Table_0" type="button"><span><i class="fas fa-exchange-alt"></i> <span>Import</span></span></button>`;
        }
        html += `<button class="btn buttons-excel buttons-html5 setting gridsettings" tabindex="0" aria-controls="DataTables_Table_0" type="button" data-bs-toggle="modal" data-bs-target="#grid-modal"><span><i class="fas fa-cog"></i> <span>Settings</span></span></button>`;
        html += `<button class="btn refresh gridreload" tabindex="0" aria-controls="DataTables_Table_0" type="button"><span><i class="fas fa-sync"></i><span>Refresh</span></span></button>`;

        if (this.levels.export) {
            html += `<div class="btn-group" role="group">
                            <button id="dropdownExport" type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-cloud-download-alt"></i> Download
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownExport">`;
            html += `<a class="dropdown-item export-xls" href="#"><i class="text-success fa fa-file-excel-o"></i> Excel </a>`;
            html += `<a class="dropdown-item export-pdf" href="#"><i class="text-danger fa fa-file-pdf-o"></i> PDF </a>
                            </div>
                        `;
        }
        html += `</div></div>`;

        return html;
    }

    get scripts() {
        let script = '<script type="text/javascript" src="https://cdn.datatables.net/v/bs5/dt-1.11.3/date-1.1.1/fc-4.0.1/fh-3.2.1/r-2.2.9/rg-1.1.4/sc-2.0.5/sl-1.3.4/datatables.min.js"></script>';
        script += `<script>${Util.newLine}`;
        script += `var dataTableFilters = ${JSON.stringify(this.searchColumns)};${Util.newLine}`;
        script += `var dataTableFields = ${JSON.stringify(Object.keys(this.visibles,null,2))};${Util.newLine}`;
        script += `var dataTableTypes = ${JSON.stringify(this.types,null,2)};${Util.newLine}`;
        script += `var dataTableRoute = "${this.routeName}";${Util.newLine}`;
        script += `</script>${Util.newLine}`;
        script += `<script type="text/javascript" src="/js/datatableaddon.js"></script>${Util.newLine}`;

        if (this.searchColumns.FILTERKEY) {
            script += `<script>$(function () {  setTimeout(function () {  ${this.searchColumns.FILTERKEY} },500) });</script>${Util.newLine}`;
        }
        return script;
    }
}

module.exports = dataTable;