'use strict;'

export const Utils = {};

Utils.getTypeNameInLowerCase = target =>
    Object.prototype.toString.call(target)
        .slice(8, -1).toLowerCase();

Utils.isArgType = (target, checkType) =>
    Utils.getTypeNameInLowerCase(target)
    === checkType.toLowerCase();

Utils.isMap = target => Utils.isArgType(target, "object");