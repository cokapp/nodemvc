/*
Plugin Manager
插件管理器
*/
var path = require('path');

var hashmap = require('./hashmap'),
    MM = require('./ModuleManager');

var PM = MM.extend({
    sourcePaths: [path.join(__dirname, '../plugins/')],
    sourceRegex: /.*Plugin\.js$/,

    //hold all the plugins
    AllPlugins: null,

    init: function(moduleRoot) {
        var _this = this;

        _this._super(moduleRoot);
        _this.registerAll();
    },

    registerAll: function() {
        var _this = this;

        _this.AllPlugins = new hashmap();

        for (var i in _this.allModules) {
            var plg = new _this.allModules[i];

            plg.register(_this);
        }
    },

    //添加钩子
    register: function(hook, plg) {
        var _this = this;

        if (!_this.AllPlugins.containsKey(hook)) {
            _this.AllPlugins.put(hook, [plg]);
        } else {
            _this.AllPlugins.get(hook).push(plg);
        }
    },
    //执行钩子
    exec: function() {
        var _this = this;

        var args = Array.prototype.slice.call(arguments);
        var hook = args.shift();
        var plgArgs = args;

        var plgs = _this.AllPlugins.get(hook);
        plgs.sort(function(a, b) {
            return a.Priority - b.Priority;
        });
        for (var i in plgs) {
            var plg = plgs[i];
            plg.apply(plg, plgArgs);
        }

    }
});

module.exports = PM;
