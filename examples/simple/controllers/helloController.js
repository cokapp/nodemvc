var Handler = COKMVC.BaseController.extend({
	doAll : function() {
		this.contentType = 'json';
		this.model = {
			success: true,
			message: 'hello cokmvc!'
		};
	}
});

module.exports = Handler;