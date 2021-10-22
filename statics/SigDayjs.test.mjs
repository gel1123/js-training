'use strict';

import origindayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear.js';
origindayjs.extend(quarterOfYear);

import sigDayjs from './SigDayjs.mjs';

const writeLog = result => {
    console.log(result);
    console.log('# typeof r        : ', typeof result);
    console.log('# toString.call(r): ', toString.call(result));
};
const useMinus = dayjs => {
    const r = dayjs("2021-10-25") - dayjs("2021-10-23")
    return r;
};
const useSetter = (dayjs, date) => {
    let d = dayjs(date);
    const r = `${d.year(1)}_${d.month(1)}_${d.date(1)}_${d.hour(1)}_${d.minute(1)}_${d.second(1)}_${d.millisecond(1)}`
    return r;
};
const useFormat = dayjs => {
    let anyday = dayjs();
    anyday = anyday.month(anyday.month() - 100);
    anyday = anyday.date(anyday.date() - 20);

    const r = [anyday.format('YYYY/MM/DD(dd)'), anyday.format('YY-M-D(d)')];
    return JSON.stringify(r);
};
const useAdd = (dayjs, anyday) => {
    const r = {
        'd': dayjs(anyday).add(1, 'd').toDate(),
        'w': dayjs(anyday).add(1, 'w').toDate(),
        'M': dayjs(anyday).add(1, 'M').toDate(),
        'Q': dayjs(anyday).add(1, 'Q').toDate(),
        'y': dayjs(anyday).add(1, 'y').toDate(),
        'h': dayjs(anyday).add(1, 'h').toDate(),
        'm': dayjs(anyday).add(1, 'm').toDate(),
        's': dayjs(anyday).add(1, 's').toDate(),
        'ms': dayjs(anyday).add(1, 'ms').toDate(),
    }
    return JSON.stringify(r);
}
const useDiff = dayjs => {
    const dateTo = dayjs('2018-07-01 06:00:00');
    const dateFrom = dayjs('2018-10-31 06:00:00');

    const r = `
    const dateTo = dayjs('2018-07-01 06:00:00');
    const dateFrom = dayjs('2018-10-31 06:00:00');

    ---- 第一引数にdayjsオブジェクト指定で、差分のミリ秒を取得できる ----
    dateFrom.diff(dateTo) => ${dateFrom.diff(dateTo)}
    dateFrom.diff(dateTo) / (24 * 60 * 60 * 1000) => ${dateFrom.diff(dateTo) / (24 * 60 * 60 * 1000)}

    ---- 第2引数で戻り値の単位を指定できる ----
    dateFrom.diff(dateTo, 'month') => ${dateFrom.diff(dateTo, 'month')}
    dateFrom.diff(dateTo, 'day') => ${dateFrom.diff(dateTo, 'day')}
    dateFrom.diff(dateTo, 'hour') => ${dateFrom.diff(dateTo, 'hour')}
    
    ---- 第3引数で戻り値の小数点を許可できる（falsyなら小数点切り捨て. 0.75日は「もう残り1日もない！」というニュアンス） ----
    dateFrom.diff(dateTo, 'day', true) => ${dateFrom.diff(dateTo, 'day', true)}
    dateFrom.diff(dateTo, 'day', false) => ${dateFrom.diff(dateTo, 'day', false)}
    dateFrom.diff(dateTo, 'M', true) => ${dateFrom.diff(dateTo, 'M', true)}
    dateFrom.diff(dateTo, 'M', false) => ${dateFrom.diff(dateTo, 'M', false)}
    `
    writeLog(r);
    return r;
}
const assert = (original, sig) => {
    const anyday = new Date();

    const resultOriginalMinus = useMinus(original);
    const resultSigMinus = useMinus(sig);
    console.assert(resultOriginalMinus === resultSigMinus, "オリジナルと異なる出力がされました");
    console.log('------------------------------------------------------------');

    const resultOriginalSetter = useSetter(original, anyday);
    const resultSigSetter = useSetter(sig, anyday);
    console.assert(resultOriginalSetter === resultSigSetter, "オリジナルと異なる出力がされました");
    console.log('------------------------------------------------------------');

    const resultOriginalFormat = useFormat(original);
    const resultSigFormat = useFormat(sig);
    console.assert(resultOriginalFormat === resultSigFormat, "オリジナルと異なる出力がされました");
    console.log('------------------------------------------------------------');

    const resultOriginalAdd = useAdd(original, anyday);
    const resultSigAdd = useAdd(sig, anyday);
    console.assert(resultOriginalAdd === resultSigAdd, "オリジナルと異なる出力がされました");
    console.log('------------------------------------------------------------');

    const resultOriginalDiff = useDiff(original);
    const resultSigDiff = useDiff(sig);
    console.assert(resultOriginalDiff === resultSigDiff, "オリジナルと異なる出力がされました");
    console.log('------------------------------------------------------------');
};
assert(origindayjs, sigDayjs);