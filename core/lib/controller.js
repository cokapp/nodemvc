/*
controller Manager
控制器管理器
*/
var path = require('path');

module.exports = function(appControllerRoot) {

    var _this = this;
    _this.allControllers = [];

    _this.reload = function() {

        _this.allControllers = [];

        var controllerPath = {
            core: [path.join(__dirname, '../controllers/')],
            app: [path.join(appControllerRoot, '/')]
        };

        for (var pathtype in controllerPath) {
            var paths = controllerPath[pathtype];
            for (var pathindex in paths) {
                var p = paths[pathindex];
                gb.logger.info('load controller in folder %s', p);
                var allFiles = gb.fileutil.readAllFile(p);
                for (var i in allFiles) {
                    var file = allFiles[i];
                    //约定：以Controller.js结尾的为Http处理器
                    var endWith = 'Controller.js';
                    if (file.slice(-endWith.length) != endWith) {
                        continue;
                    }

                    var name = file.replace('Controller\.js', '');
                    name = name.replace(p, '');
                    name = name.replace(/\\/g, '/');

                    var C = require(gb.path.join(file));
                    C.prototype.HandlerName = name;
                    if (C.prototype.HandlerRegExp === null) {
                        var reg = C.prototype.HandlerName;
                        reg = reg.replace(/\//g, '\\\/');
                        reg = '^\\/' + reg + '$';
                        C.prototype.HandlerRegExp = new RegExp(reg, 'i');
                    }

                    _this.allControllers[name] = C;

                    gb.logger.info('add %s handler named %s , regexp %s, hand file = %s', pathtype, C.prototype.HandlerName, C.prototype.HandlerRegExp, file);

                }
            }
        }
    }
    _this.getHandler = function(urlpath) {

        for (var name in _this.allControllers) {
            var C = _this.allControllers[name];
            var mts = urlpath.match(C.prototype.HandlerRegExp);
            if (mts) {
                gb.logger.info('%s matched controller named %s, regexp %s', urlpath, name, C.prototype.HandlerRegExp);
                return _this.allControllers[name];
            }
        }

        gb.logger.warn('%s matched no controller, used e404 handler instead', urlpath);
        return _this.allControllers['error/e404'];
    }

    _this.reload();

}
