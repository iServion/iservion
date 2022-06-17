//for view to dropdowns group

const Util = require('./Util');
const t = {}

t.viewForm = (name) => {
    return `<%- zForms.field["${name}"] %>`;
}

module.exports = t;