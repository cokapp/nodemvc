//执行闭包，导出Class类，使用Class.extend继承
require('./SimpleInheritance');

var fs = require('fs'),
    path = require('path'),
    url = require('url'),
    async = require('async');

var hashmap = require('./hashmap'),
    utils = require('./utils'),
    fileutil = require('./fileutil'),
    logger = require('./log').logger;

var Context = require('./Context');

var COKMVC = {};
global.COKMVC = COKMVC;
module.exports = COKMVC;

COKMVC.fs = fs;
COKMVC.url = url;
COKMVC.path = path;
COKMVC.async = async;

COKMVC.utils = utils;
COKMVC.logger = logger;
COKMVC.fileutil = fileutil;
COKMVC.hashmap = hashmap;

COKMVC.BaseController = require('../controllers/Base');
COKMVC.BasePlugin = require('../plugins/Base');


COKMVC.init = function(options){
	var ctx = new Context(options);

	global.ctx = COKMVC.ctx = ctx;

}