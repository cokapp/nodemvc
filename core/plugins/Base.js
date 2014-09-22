/*
插件接口
*/
var Plugin = Class.extend({
    Name: null,
    Hooks: ['app_init_before'],
    Priority: 10,
    register: function(pm){
    	var _this = this;
    	for(var i in _this.Hooks){
    		var hook = _this.Hooks[i];
    		pm.register(hook, _this);
    	}
    },
    exec: function(){

    }
});

module.exports = Plugin;