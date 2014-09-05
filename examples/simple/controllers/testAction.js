var Handler = gb.AbstractHandler.extend({
	HandlerRegExp : /^\/test/i,
	doAll : function() {
		this.render();
	}

});

module.exports = Handler;