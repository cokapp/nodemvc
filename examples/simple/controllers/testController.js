var Handler = COKMVC.BaseController.extend({
	HandlerRegExp : /^\/test/i,
	doAll : function() {
		this.render();
	}

});

module.exports = Handler;