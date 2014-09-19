/*
404
 */
var BaseController = require('../Base');

var Handler = BaseController.extend({
	_initModel: function(){
		//disable model init
	},
	doAll : function() {
	    this.para.res.send("<iframe scrolling='no' frameborder='0' src='http://cokdoc.qiniudn.com/404.htm' width='100%' height='480' style='display:block;'></iframe>");  
	}

});

module.exports = Handler;