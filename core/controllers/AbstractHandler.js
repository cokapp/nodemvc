/*
 Http处理器基类
 */
var Handler = Class.extend({
    HandlerRegExp: null,
    HandlerName: null,
    method: ['all'],
    para: {},

    //send to client
    rsp: null,

    contentType: 'html',
    tpl: null,
    model: null,

    //events
    onBeforeHand: [],
    onAfterHand: [],

    _reset: function() {
        var _this = this;
        
        _this.rsp = {
            status: {
                success: true,
                errorCode: null,
                message: null
            }
        };
        _this.contentType = 'html';
        _this.tpl = null;
        _this.model = null;
        _this.onBeforeHand = [];
        _this.onAfterHand = [];

    },

    init: function() {
        var _this = this;

        _this._reset();

        gb.logger.info('HandlerName : %s is initing', this.HandlerName);
    },
    hand: function(req, res, next) {
        var _this = this;
        //ref self
        req.handler = _this;
        _this.next = next;

        //step.1 参数处理
        _this.para = _this._reqestParse(req, res);
        //step.2 模型映射
        _this._initModel();

        //前拦截器
        for (var i in _this.onBeforeHand) {
            var hasNext = _this.onBeforeHand[i](req, res, _this.next);
            if (!hasNext) {
                return;
            }
        }
        //step.3 正式处理Http请求
        _this._dohand();
        //后拦截器
        for (var i in _this.onAfterHand) {
            var hasNext = _this.onAfterHand[i](_this.para.req, _this.para.res, _this.next);
            if (!hasNext) {
                return;
            }
        }
        //step.4 返回结果
        _this._endHand();
    },
    _initModel: function() {
        var _this = this;

        var appRoot = gb.config.__ENV.APP_ROOT;
        try {
            var Model = require(gb.path.join(appRoot, gb.config.DIR.MODELS, _this.HandlerName + 'Model'));
            _this.model = new Model();
        } catch (e) {
            var emptyModel = require('../models/emptyModel');
            gb.logger.info('未定义模型：%s', _this.HandlerName);
            _this.model = new emptyModel();
            return;
        }

        //简单的自动映射
        for (var i in _this.model) {
            if (typeof _this.para.req.param(i) === 'undefined' || typeof _this.para.req.param(i) === 'function') {
                continue;
            }
            console.log('%s=%s', i, _this.para.req.param(i));
            _this.model[i] = _this.para.req.param(i);
        }

        if (_this.initModel) {
            _this.initModel();
        }
    },
    _reqestParse: function(req, res) {
        var _this = this;

        var parsedUrl = gb.url.parse(req.url);
        var pathName = this.mappedUrlPath;
        var urlPara = pathName.match(this.HandlerRegExp);
        var para = {
            parsedUrl: parsedUrl,
            pathName: pathName,
            urlPara: urlPara,
            query: req.query,
            body: req.body,
            params: req.params,
            req: req,
            res: res
        };
        gb.logger.info('reqestParsed: ' +
            '\r\n pathName: %s ' +
            '\r\n mappedPathName: %s ' +
            '\r\n urlPara: %s ' +
            '\r\n query: %s ' +
            '\r\n body: %s ' +
            '\r\n params: %s \r\n ', parsedUrl.pathname, para.pathName, JSON.stringify(para.urlPara), JSON.stringify(para.query), JSON.stringify(para.body), JSON.stringify(para.params));

        return para;
    },
    _dohand: function() {
        var _this = this;

        gb.async.series([

            function(cb) {
                if (_this.preDoAll !== null) {
                    _this.preDoAll(cb);
                } else {
                    cb(null, null);
                }
            },
            function(cb) {
                if (_this.preDoGet !== null) {
                    _this.preDoGet(cb);
                } else {
                    cb(null, null);
                }
            },
            function(cb) {
                if (_this.preDoPost !== null) {
                    _this.preDoPost(cb);
                } else {
                    cb(null, null);
                }
            }
        ], function(e, d) {
            if (_this.doAll != null) {
                gb.logger.info('doAll by %s', _this.HandlerName);
                _this.doAll();
                return;
            }
            if (_this.para.req.method === 'GET') {
                gb.logger.info('doGet by %s', _this.HandlerName);
                _this.doGet();
            } else {
                gb.logger.info('goPost by %s', _this.HandlerName);
                _this.doPost();
            }
        });
    },
    doGet: null,
    doPost: null,
    doAll: null,

    preDoGet: null,
    preDoPost: null,
    preDoAll: null,

    initModel: null,

    _endHand: function() {
        var _this = this;

        var rsp = _this.rsp || {};

        if (_this.contentType === 'json') {
            rsp.model = _this.model;
            _this.para.res.send(rsp);
        } else { //always html
            if (typeof rsp.layout === 'undefined' || rsp.layout === null) {
                rsp.layout = '_public/layout';
            }
            rsp.model = _this.model;
            rsp.req = _this.para.req;

            var tpl = _this.tpl || _this.HandlerName;
            _this.para.res.render(tpl, rsp);
        }
    }
});

module.exports = Handler;
