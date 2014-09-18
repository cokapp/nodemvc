/*
controller Manager
拦截器管理器
*/
var path = require('path');

module.exports = function(appInterceptorRoot) {

    var _this = this;
    _this.allInterceptors = [];

    _this.reload = function() {

        _this.allInterceptors = [];

        var interceptorPath = {
            core: [path.join(__dirname, '../interceptors/')],
            app: [path.join(appInterceptorRoot, '/')]
        };

        for (var pathtype in interceptorPath) {
            var paths = interceptorPath[pathtype];
            for (var pathindex in paths) {
                var p = paths[pathindex];
                gb.logger.info('load interceptor in folder %s', p);
                var allFiles = gb.fileutil.readAllFile(p);
                for (var i in allFiles) {
                    var file = allFiles[i];
                    //约定：以Interceptor.js结尾的为Http拦截器
                    var endWith = 'Interceptor.js';
                    if (file.slice(-endWith.length) != endWith) {
                        continue;
                    }

                    var name = file.replace('Interceptor\.js', '');
                    name = name.replace(p, '');
                    name = name.replace(/\\/g, '/');

                    var I = require(gb.path.join(file));
                    I.prototype.Name = name;
                    _this.allInterceptors[name] = new I();

                    gb.logger.info('add %s interceptor named %s , regexp %s, hand file = %s', pathtype, I.prototype.Name, I.prototype.Reg, file);
                }
            }
        }
    }

    _this.get = function(point){
        var interceptors = [];
        for(var i in _this.allInterceptors){
            var item = _this.allInterceptors[i];
            if(item.Point == point){
                interceptors.push(item);
            }
        }
        interceptors.sort(function(a, b) {
            return b.Weight - a.Weight;//8,6,5,1
        });

        return interceptors;
    }
    _this.getBefore = function(){
        return _this.get('Before');
    }
    _this.getAfter = function(){
        return _this.get('After');
    }

    _this.reload();

}
