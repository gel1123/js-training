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
const useFormat = dayjs => {
    let anyday = dayjs();
    anyday = anyday.month(anyday.month() - 100);
    anyday = anyday.date(anyday.date() - 20);

    const r = [anyday.format('YYYY/MM/DD(dd)'), anyday.format('YY-M-D(d)')];
    writeLog(r);
    return JSON.stringify(r);
};
const useAdd = (dayjs, anyday) => {
    console.log('before_add: ', anyday);
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
    writeLog(r);
    return JSON.stringify(r);
}
const useDiff = dayjs => {

}
const assert = (original, sig) => {
    const resultOriginalFormat = useFormat(original);
    const resultSigFormat = useFormat(sig);
    console.assert(resultOriginalFormat === resultSigFormat, "オリジナルと異なる出力がされました");
    console.log('------------------------------------------------------------');
    
    const anyday = new Date();
    const resultOriginalAdd = useAdd(original, anyday);
    const resultSigAdd = useAdd(sig, anyday);
    console.assert(resultOriginalAdd === resultSigAdd, "オリジナルと異なる出力がされました");
    console.log('------------------------------------------------------------');
};
assert(origindayjs, sigDayjs);