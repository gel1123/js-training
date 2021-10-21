'use strict';

import origindayjs from 'dayjs';
import sigDayjs from './SigDayjs.mjs';

const useDayjsCode = dayjs => {
    let anyday = dayjs();
    anyday = anyday.month(anyday.month() - 100);
    anyday = anyday.date(anyday.date() - 20);
    
    const r = [anyday.format('YYYY/MM/DD(dd)'), anyday.format('YY-M-D(d)')];
    console.log(r);
    console.log('# typeof r        : ', typeof r);
    console.log('# toString.call(r): ', toString.call(r));
    return r.toString();
};
const assert = (original, sig) => {
    const resultOriginal = useDayjsCode(original);
    const resultSig = useDayjsCode(sig);
    console.assert(resultOriginal === resultSig, "オリジナルと異なる出力がされました");
}; 
assert(origindayjs, sigDayjs);