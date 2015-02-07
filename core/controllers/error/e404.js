/*
404
 */
var Handler = COKMVC.BaseController.extend({
	doAll : function(cb) {
		this.contentType = 'json';
		this.model = "<iframe scrolling='no' frameborder='0' src='http://cokdoc.qiniudn.com/404.htm' width='100%' height='480' style='display:block;'></iframe>";  
		cb();
	}

});

module.exports = Handler;