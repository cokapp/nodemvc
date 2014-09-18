/**
 * 全局变量
 * 输出到node全局变量global
 */

var fs = require('fs'),
    path = require('path'),
    url = require('url'),
    async = require('async');

var utils = require('./utils'),
    log = require('./log'),
    fileutil = require('./fileutil'),
    hashmap = require('./hashmap');

var configuration = require('./configuration');
var controller = require('./controller');
var interceptor = require('./interceptor');

var gb = {};
global.gb = gb;

gb.fs = fs;
gb.url = url;
gb.path = path;
gb.async = async;

gb.utils = utils;
gb.logger = log.logger;
gb.fileutil = fileutil;
gb.hashmap = hashmap;

//执行闭包，导出Class类，使用Class.extend继承
require('./SimpleInheritance');


gb.init = function(options){

    gb.logger.info('#####APP GLOBAL INITING#####');
    //load conf  
    var conf = new configuration(options.appRoot);
    for(var i in options.cfgFiles){
        var cfgFile = options.cfgFiles[i];
        conf.attach(cfgFile.weight, cfgFile.file);
    }
    gb.config = conf.load();
    gb.logger.info(gb.config);  
    gb.logger.info('#####CONFIG LOADED#####');  

    //load controllers
    var AbstractHandler = require('../controllers/AbstractHandler');
    gb.AbstractHandler = AbstractHandler;
    var appControllerRoot = path.join(options.appRoot, gb.config.DIR.CONTROLLERS);
    gb.controller = new controller(appControllerRoot);
    gb.logger.info('#####CONTROLLER LOADED#####');

    //load interceptors
    var BaseFilter = require('../interceptors/BaseFilter');
    gb.BaseFilter = BaseFilter;
    var appInterceptorRoot = path.join(options.appRoot, gb.config.DIR.INTERCEPTORS);
    gb.interceptor = new interceptor(appInterceptorRoot);
    gb.logger.info('#####INTERCEPTOR LOADED#####');

}
