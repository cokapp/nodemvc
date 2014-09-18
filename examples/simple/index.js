var path = require('path');

//Set Core Lib
var NodeMVC = require('cokmvc');

var options = {
	appRoot: __dirname,
	cfgFiles: [{
		weight: 3,
		file: path.join(__dirname, './config.json')
	}]
};

//StartUP
NodeMVC.startup(options, function(server){
	//NodeMVC is working, enjoy!
});

