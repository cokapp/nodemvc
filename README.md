#CokMVC
>CokMVC是运行于Node平台、基于Express的简单MVC框架。设计目标是提供清晰、快速的Web开发体验！

##特色
1. MVC
2. 约定大于配置
3. 核心+插件

##快速开始

创建项目目录【start】
```
mkdir start
cd start
```
创建【package.json】
```
{
    "name": "start",
    "version": "0.0.1dev",
    "main": "index",
    "dependencies": {
        "cokmvc": "latest"
    }
}

```
创建入口文件【index.js】
```
//Set Core Lib
var NodeMVC = require('cokmvc');

var options = {
	appRoot: __dirname
};

//StartUP
NodeMVC.startup(options, function(server){
	//NodeMVC is working, enjoy!
});

```
Install&Run
```
npm install
node index
```

##进阶
请参考示例：

1. [CokWiki](https://git.oschina.net/cokapp/CokWiki)，[demo](http://cokwiki.coding.io "host on coding.io")
2. [Simple](https://git.oschina.net/cokapp/NodeMVC/tree/master/examples/simple/)
