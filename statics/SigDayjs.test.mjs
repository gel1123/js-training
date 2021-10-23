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
};
assert(origindayjs, sigDayjs);
