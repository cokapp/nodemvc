/*
模型映射插件

参数解析后执行：
根据http请求数据映射模型

接收参数Controller
*/
var path = require('path');

var Plugin = COKMVC.BasePlugin.extend({
    Hooks: ['para_parse_after'],
    exec: function(ctrl) {
        var _this = this;

        var appRoot = ctx.config.__ENV.APP_ROOT;
        try {
            var Model = require(COKMVC.path.join(appRoot, ctx.config.DIR.MODELS
                , ctrl.HandlerName + 'Model'));
            ctrl.model = new Model();
            ctrl.model.ctrl = ctrl;
        } catch (e) {
            var emptyModel = require('../models/emptyModel');
            COKMVC.logger.info('未定义模型：%s', ctrl.HandlerName);
            ctrl.model = new emptyModel();
            return;
        }

        //简单的自动映射
        for (var i in ctrl.model) {
            if (typeof ctrl.para.req.param(i) === 'undefined' 
                || typeof ctrl.para.req.param(i) === 'function') {
                continue;
            }
            ctrl.model[i] = ctrl.para.req.param(i);
        }
    }

});

module.exports = Plugin;
