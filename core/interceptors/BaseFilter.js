var Interceptor = Class.extend({
	/*拦截点：Before || After*/
    Point: 'Before',
    Name: null,
    Reg: /.*/,
    Weight: 0,
    intercept: function(req, res, next){
    	if(this.doIntercept){
    		return this.doIntercept();
    	}
        return true;
    },
    doIntercept: null
})

module.exports = Interceptor;