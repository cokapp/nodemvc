var NodeMVC = {};
module.exports = NodeMVC;

var express = require('express');
var session = require('express-session');

var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var partials = require('express-partials');

var path = require('path');
var fs = require('fs');

//StartUP
NodeMVC.startup = function(options, callback) {
    //前置检查
    //日志目录
    var logFolder = path.join(process.cwd(), 'logs');;
    if(!fs.existsSync(logFolder)){
        fs.mkdirSync(logFolder);
    }

    //应用初始化
    require('./lib/COKMVC').init(options);

    var app = express();
    // view engine setup
    app.use(partials());
    app.set('views', COKMVC.path.join(ctx.config.__ENV.APP_ROOT, ctx.config.DIR.VIEWS));

    app.engine('.' + ctx.config.VIEW_SUFFIX, require('ejs').renderFile);
    app.set('view engine', ctx.config.VIEW_SUFFIX);

    app.use(session({
        secret: ctx.config.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));

    //static dir
    for (var i in ctx.config.DIR.STATIC) {
        var st = ctx.config.DIR.STATIC[i];
        app.use('/' + i, express.static(COKMVC.path.join(ctx.config.__ENV.APP_ROOT, st)));
    }

    var icon;
    var iconPath = path.join(ctx.config.__ENV.APP_ROOT, ctx.config.FAVICON);
    if(!fs.existsSync(iconPath)){
        icon = new Buffer(0);
    }else{
        icon = iconPath;
    };
    app.use(favicon(icon));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());

    var dispatcher = require(path.join(__dirname, 'lib/dispatcher'));
    dispatcher(app);

    app.set('port', process.env.VCAP_APP_PORT 
        || process.env.PORT 
        || ctx.config.PORT 
        || 80);

    var server = app.listen(app.get('port'), function() {
        COKMVC.logger.info('Express server listening on port ' + server.address().port);
        callback(server);
    });

};
