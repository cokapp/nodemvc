/*
模块载入器
*/
var path = require('path');

var hashmap = require('./hashmap'),
    fileutil = require('./fileutil'),
    logger = require('./log').logger;

var ML = {};
module.exports = ML;

/*
从给定目录载入所有符合规则的模块
此处paths数组是有序的，后续path中模块将替换之前同名模块
*/
ML.load = function(paths, regex) {
    var allModules = new hashmap();

    for (var pathindex in paths) {
        var folder = path.normalize(paths[pathindex]);
        
        logger.info('从文件夹【%s】中载入模块！', folder);
        var allFiles = fileutil.readAllFile(folder);
        for (var i in allFiles) {
            var file = allFiles[i];
            if(!file.match(regex)){
                continue;
            }
            // var name = path.basename(file, '.js');
            var name = path.normalize(file);
            var M = require(path.normalize(file));
            M.prototype.Folder = folder;
            M.prototype.File = name;
            logger.info('模块已载入：文件【%s】', file);            
            allModules.put(name, M);
        }
    }

    return allModules;
}
