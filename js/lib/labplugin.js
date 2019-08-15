var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'ipyturtle',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'ipyturtle',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

