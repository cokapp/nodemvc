/*
404
 */
var AbstractHandler = require('../AbstractHandler');

var Handler = AbstractHandler.extend({
	_initModel: function(){
		//disable model init
	},
	doAll : function() {
	    this.para.res.send("<iframe scrolling='no' frameborder='0' src='http://cokdoc.qiniudn.com/404.htm' width='100%' height='480' style='display:block;'></iframe>");  
	}

});

module.exports = Handler;