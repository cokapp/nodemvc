/*
Controller Manager
控制器管理器
*/
var path = require('path');

var hashmap = require('./hashmap'),
    MM = require('./ModuleManager'),
    logger = require('./log').logger;

var PM = MM.extend({
    sourcePaths: [path.join(__dirname, '../controllers/')],
    sourceRegex: /.*Controller\.js$/,

    AllControllers: null,

    init: function(moduleRoot) {
        var _this = this;

        _this._super(moduleRoot);
        _this.registerAll();
    },

    registerAll: function() {
        var _this = this;

        _this.AllControllers = [];

        var mds = _this.allModules.values();
        for (var i in mds) {
            var C = mds[i];

            var name = C.prototype.File.replace('Controller\.js', '');
            name = name.replace(path.join(C.prototype.Folder, '/'), '');
            name = name.replace(/\\/g, '/');

            C.prototype.HandlerName = name;
            if (C.prototype.HandlerRegExp === null) {
                var reg = C.prototype.HandlerName;
                reg = reg.replace(/\//g, '\\\/');
                reg = '^\\/' + reg + '$';
                C.prototype.HandlerRegExp = new RegExp(reg, 'i');
            }

            _this.AllControllers[name] = C;
        }
    },
    getHandler: function(urlpath) {
        var _this = this;
        
        for (var name in _this.AllControllers) {
            var C = _this.AllControllers[name];
            var mts = urlpath.match(C.prototype.HandlerRegExp);
            if (mts) {
                logger.info('请求【%s】匹配到控制器【%s】, 正则【%s】', urlpath, name, C.prototype.HandlerRegExp);
                return C;
            }
        }
        logger.warn('请求【%s】未匹配到控制器, 返回【error/e404】', urlpath);
        return _this.AllControllers['error/e404'];
    }

});

module.exports = PM;
