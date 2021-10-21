import dayjs from './statics/SigDayjs.mjs';
let anyday = dayjs();
anyday = anyday.month(anyday.month() - 100);
anyday = anyday.date(anyday.date() - 20);


const r = [anyday.format('YYYY/MM/DD(dd)'), anyday.format('YY-M-D(d)')];
console.log(r);
console.log('# typeof r        : ', typeof r);
console.log('# toString.call(r): ', toString.call(r));