/**
 * Created by sintret dev on 8/27/2021.
 * Helper function in the frontend
 */
var MenuCollections = require("./MenuCollections");

function UI(req, res) {
    this.Form = require("./Form");
    this.Util = require("./Util");
    this.Menu = MenuCollections(req, res);
    this.Modal = require("./Modal");
    this.FormWidget = require("./FormWidget");

}

module.exports = UI;

