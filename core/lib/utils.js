var utils = {};
module.exports = utils;


utils.cloneObj = function (obj) {
    var newobj, s;
    if (typeof obj !== 'object') {
        return;
    }
    newobj = obj.constructor === Object ? {} : [];
    if (JSON) {
        s = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(s); //反系列化（还原）
    } else {
        if (newobj.constructor === Array) {
            newobj.concat(obj);
        } else {
            for (var i in obj) {
                newobj[i] = obj[i];
            }
        }
    }
    return newobj;
};

utils.combine = function (from, to, isCover) {

    for (var i in from) {
        if(typeof to[i] == 'object'){
            utils.combine(from[i], to[i], isCover);
        }else if(to[i] === null || typeof to[i] === 'undefined' || isCover){
            to[i] = from[i];
        }
    }
}
