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
    hashmap = require('./hashmap'),
    ControllerFactory = require('./ControllerFactory');

var configuration = require('./configuration');

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
gb.ControllerFactory = ControllerFactory;


//执行闭包，导出Class类，使用Class.extend继承
require('./SimpleInheritance');


gb.init = function(options){

    var conf = new configuration(options.appRoot);
    for(var i in options.cfgFiles){
        var cfgFile = options.cfgFiles[i];
        conf.attach(cfgFile.weight, cfgFile.file);
    }
    gb.config = conf.load();

    console.log(gb.config);

    var AbstractHandler = require('../controllers/AbstractHandler');
    gb.AbstractHandler = AbstractHandler;

    gb.allControllers = gb.utils.getAllControllers();

}
