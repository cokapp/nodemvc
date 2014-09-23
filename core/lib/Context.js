/**
 * 全局上下文
 * 
 * 输出到node全局变量global
 */
var path = require('path');

var configuration = require('./configuration');
var CM = require('./ControllerManager');
var PM = require('./PluginManager');

//应用级单例
var CTX = Class.extend({

    config: null,

    CM: null,
    PM: null,

    init: function(options){
        var _this = this;

        COKMVC.logger.info('##START##上下文初始化！');

        COKMVC.logger.info('STEP.1 载入配置');
        _this.loadConf(options);
        COKMVC.logger.info('STEP.2 载入控制器');
        _this.CMInit(options);
        COKMVC.logger.info('STEP.3 载入插件');
        _this.PMInit(options);

        COKMVC.logger.info('###END###上下文初始化！');
    },

    loadConf: function(options){
        var _this = this;
        var conf = new configuration(options.appRoot);
        for(var i in options.cfgFiles){
            var cfgFile = options.cfgFiles[i];
            conf.attach(cfgFile.weight, cfgFile.file);
        }
        _this.config = conf.load();

        COKMVC.logger.info(_this.config);
    },
    CMInit: function(options){
        var _this = this;
        
        var fd = path.join(options.appRoot, _this.config.DIR.CONTROLLERS);
        _this.CM = new CM(fd);
    },
    PMInit: function(options){
        var _this = this;

        var fd = path.join(options.appRoot, _this.config.DIR.PLUGINS);
        _this.PM = new PM(fd);
    }

});

module.exports = CTX;