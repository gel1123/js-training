import { Utils } from "./common_utils.mjs";

var flatNestObj = function (obj, result) {
    var result = result || {};
    Object.keys(obj).forEach(function (key) {
        if (Utils.isMap(obj[key])) {
            flatNestObj(obj[key], result)
        } else {
            result[key] = obj[key];
        }
    });
    return result;
};

export default flatNestObj;