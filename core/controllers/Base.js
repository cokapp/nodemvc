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
        //_this.tpl = null;
        _this.model = null;
    },

    init: function() {
        var _this = this;

        _this._reset();

        COKMVC.logger.info('HandlerName : %s is initing', this.HandlerName);
    },
    hand: function(req, res, next) {
        var _this = this;

        COKMVC.logger.info('Start hand!');
        //ref self
        // req.handler = _this;
        _this.next = next;

        //step.1 参数处理
        ctx.PM.exec('para_parse_before', _this);
        _this.para = _this._reqestParse(req, res);
        ctx.PM.exec('para_parse_after', _this);

        //step.2 正式处理Http请求
        ctx.PM.exec('req_hand_before', _this);
        _this._dohand();
        ctx.PM.exec('req_hand_after', _this);

        //step.3 返回结果
        ctx.PM.exec('req_render_before', _this);
        _this._endHand();
        ctx.PM.exec('req_render_after', _this);

        COKMVC.logger.info('End hand!');
    },
    _reqestParse: function(req, res) {
        var _this = this;

        var parsedUrl = COKMVC.url.parse(req.url);
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
        COKMVC.logger.info('reqestParsed: ' +
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

        COKMVC.async.series([

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
                COKMVC.logger.info('doAll by %s', _this.HandlerName);
                _this.doAll();
                return;
            }
            if (_this.para.req.method === 'GET') {
                COKMVC.logger.info('doGet by %s', _this.HandlerName);
                _this.doGet();
            } else {
                COKMVC.logger.info('goPost by %s', _this.HandlerName);
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
        if (_this.contentType === 'json') {
            _this.para.res.send(_this.model);
        } else { //always html
            if (typeof _this.rsp.layout === 'undefined' 
                || _this.rsp.layout === null) {
                _this.rsp.layout = '_public/layout';
            }
            _this.rsp.model = _this.model;
            var tpl = _this.tpl || _this.HandlerName;
            _this.para.res.render(tpl, _this.rsp);
        }
    }
});

module.exports = Handler;
