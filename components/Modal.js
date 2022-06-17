var Util = require("./Util");
var Modal = {}

Modal.grid = (frameworkcss = "bootstrap3",obj) => {
    var attributeData = obj.attributeData, visibles = obj.visibles || [], invisibles = obj.invisibles || [], visiblesHtml = '', invisiblesHtml = '', labelsHtml = '';
    visibles.map((item) => {
        visiblesHtml += `<li data-name="${item}" draggable="true" role="option" aria-grabbed="false"><span class="fa fa-eye"></span> ${attributeData.labels[item]}</li>`;
    });
    invisibles.map((item) => {
        invisiblesHtml += `<li data-name="${item}" draggable="true" role="option" aria-grabbed="false"><span class="fa fa-eye-slash"></span> ${attributeData.labels[item]}</li>`;
    });
    var no = 1;
    for(var key in attributeData.labels) {
        labelsHtml += `<tr>
                                        <td>${no}</td>
                                        <td>${key}</td>
                                        <td>${attributeData.labels[key]}</td>
                                        <td><input maxlength="25" type="text" class="form-control" required name="${obj.routeName}[${key}]" value="${attributeData.labels[key]}"></td>
                                    </tr>`;
        no++;
    }


    var modalFields = Modal.build({
        id: "grid-modal",
        size : "modal-xl",
        header: `<h5 id="dynagrid-1-grid-modal-label" class="modal-title">
                    <i class="fa fa-cog"></i> Settings Grid 
                </h5>`,
        body : `<div class="container">
                    <form id="form-grid" class="form-vertical kv-form-bs4" action="/${obj.routeName}/grid" method="post">
                        <input type="hidden" name="_csrf" value="">
                        <div class="dynagrid-column-label">
                            Configure Order and Display of Grid Columns
                        </div>
                        <div class="row">
                            <div class="col-sm-5">
                                <ul id="gridleft" class="sortable-visible sortable list kv-connected cursor-move gridsortable" aria-dropeffect="move">
                                    <li data-name="" class="alert alert-info dynagrid-sortable-header disabled">
                                        Visible Columns
                                    </li>
                                    ${visiblesHtml}
                                </ul>
                            </div>
                            <div class="col-sm-2 text-center">
                                <div class="dynagrid-sortable-separator"><i class="fas fa-arrows-alt-h"></i></div>
                            </div>
                            <div class="col-sm-5">
                                <ul id="gridright"
                                    class="sortable-hidden sortable list kv-connected cursor-move gridsortable" aria-dropeffect="move">
                                    <li data-name="" class="alert alert-info dynagrid-sortable-header disabled">Hidden / Fixed Columns
                                    </li>
                                   ${invisiblesHtml}
                                </ul>
                            </div>
                        </div>
                        <input type="hidden" id="serialize_left" name="serialize_left" value=''/>
                        <input type="hidden" id="serialize_right" name="serialize_right" value=''/>
                    </form>
                </div> <!-- .dynagrid-config-form -->`,
        footer : `<button type="reset" class="btn btn-default grid-reset" title="Abort any changes and reset settings">
                    <i class="fa fa-refresh"></i> Reset
                </button>
                <button type="button" class="btn btn-primary grid-submit" title="Save grid settings">
                    <i class="fa fa-paper-plane"></i> Apply
                </button>`
    });



    var modalLabel = Modal.build({
        id: "grid-labels",
        size : "modal-lg",
        header : `<h5 id="dynagrid-1-grid-modal-label" class="modal-title">
                    <i class="fa fa-font fa-fw"></i> Labels Configuration
                </h5>`,
        body : `<div class="dynagrid-config-form">
                    <form id="form-labels" class="form-vertical" action="/${obj.routeName}/labels" method="post">
                        <input type="hidden" name="_csrf" value="==">

                        <div class="dynagrid-column-label">
                            Configure Field Labeling
                        </div>

                        <div class="row">
                            <div class="col-sm-12">
                                <table class="table table-condensed table-striped">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Fields</th>
                                        <th>Default</th>
                                        <th>Custom</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    ${labelsHtml}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </form>
                </div> <!-- .dynagrid-config-form -->`,
        footer : ` <button type="reset" class="btn btn-default label-reset" title="Abort any changes and reset settings">
                    <i class="fa fa-refresh"></i> Reset
                </button>
                <button type="button" class="btn btn-primary labels-submit" title="Save grid settings">
                    <i class="fa fa-paper-plane"></i> Submit
                </button>`

    });

    try {
        return modalFields + modalLabel;
    } catch (err) {
        console.log(err);
    }
}


Modal.build = (obj) => {
    var html = '<!-- Modal -->';
    try {
        var size = obj.size ? `${obj.size}` : "";
        var id = obj.id ?  `id="${obj.id}"` : "";
        var headerOptions =  Util.attributeOptions(obj.headerOptions || {},{class:"modal-header"});
        var header = obj.header ? `<div  ${headerOptions} >${obj.header}<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>`:"";
        var body = obj.body ? obj.body : "";
        var bodyOptions =  Util.attributeOptions(obj.bodyOptions || {},{class:"modal-body"});
        var footerOptions =  Util.attributeOptions(obj.footerOptions || {},{class:"modal-footer"});
        var footer = obj.footer ? `<div ${footerOptions} >${obj.footer}</div>` : "";
        html += `${Util.newLine}<div class="modal fade" ${id}  role="dialog" tabindex="-1">
              <div class="modal-dialog ${size}">
                <div class="modal-content">
                  ${header}
                  <div ${bodyOptions}>${body}</div>
                  ${footer}
                </div>
              </div>
            </div>`;

    } catch (error) {
        console.log(error)
    }

    return html;
}

module.exports = Modal;