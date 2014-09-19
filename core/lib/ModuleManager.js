/*
Module Manager
模块管理器
*/
var ML = require('./ModuleLoader');

var MM = Class.extend({
    allModules: null,
    sourcePaths: [],
    sourceRegex: /.*\.js/,

    init: function(moduleRoot) {
        var _this = this;

        _this.sourcePaths.push(moduleRoot);
        _this.loadAll();
    },
    loadAll: function() {
        var _this = this;

        _this.allModules = ML.load(_this.sourcePaths, _this.sourceRegex);
    }
});

module.exports = MM;
