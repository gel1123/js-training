'use strict';
const alias = {
    day: "d",
    week: "w",
    month: "M",
    quarter: "Q",
    year: "y",
    hour: "h",
    minute: "m",
    second: "s",
    millisecond: "ms"
};


const monthDiff = (a, b) => {
    // 未対応
}

export default {
    convertToShorthand: unit => Object.keys(alias).reduce((unit, current) => {
        return unit === current && alias[unit] || unit;
    }, unit),
    monthDiff: monthDiff
};