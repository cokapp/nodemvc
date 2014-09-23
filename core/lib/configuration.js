/*
Configuration Manager
配置管理器
*/

var hashmap = require('./hashmap'),
    utils = require('./utils');

var path = require('path'),
    fs = require('fs');

module.exports = function(appRoot) {
    var _this = this;

    _this.allConf = {};
    _this.configureFiles = new hashmap();
    _this.appRoot = appRoot;

    _this.init = function(){
	    //config of framwork
	    _this.attach(0, path.join(__dirname, '../conf'));
	    //config of app
	    _this.attach(1, path.join(_this.appRoot, './conf'));
    }

    _this.attach = function(weight, fileOrFolder) {
        if(!fs.existsSync(fileOrFolder)){
            return;  
        }
        var stats = fs.statSync(fileOrFolder);

        if (stats.isFile()) {
            _this.attachFile(weight, fileOrFolder);
            return;
        } else if (stats.isDirectory()) {
            fs.readdirSync(fileOrFolder).forEach(function(file) {
                var endWith = '.json';
                if (file.slice(-endWith.length) != endWith) {
                    return;
                }
                _this.attachFile(weight, path.join(fileOrFolder, file));
            });
        }
    }
    /*attach configure file to cm*/
    _this.attachFile = function(weight, file) {
        var managedFiles = _this.configureFiles.get(weight);
        if (managedFiles === null) {
            _this.configureFiles.put(weight, [file]);
        } else {
            managedFiles.push(file);
        }
    }
    _this.load = function() {
        var weights = _this.configureFiles.keys();
        weights.sort(function(a, b) {
            return a > b ? 1 : -1; //从小到大排序
        });

        //先载入权重小的配置文件
        for (var i in weights) {
            var weight = weights[i];
            var managedFiles = _this.configureFiles.get(weight);
            for (var j in managedFiles) {
                var configureFile = managedFiles[j];
                var conf = JSON.parse(fs.readFileSync(configureFile));
                utils.combine(conf, _this.allConf, true);
            }
        }

        _this.allConf.__ENV.ROOT = path.join(__dirname, '../../');
        _this.allConf.__ENV.APP_ROOT = _this.appRoot;

        return _this.allConf;
    }

    _this.init();
}
