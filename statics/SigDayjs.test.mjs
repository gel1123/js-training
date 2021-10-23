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
/**
 * dayjsの仕様上、月の計算は下記のようになる
 * 01.  9月30日 -  9月 1日 = 0.9354838709677419（1ヵ月を31日とみなす. 29日を【「ちょうど1ヶ月」- 1日 】とみなす）
 * 02.  9月30日 -  8月31日 = ちょうど1ヵ月（1ヵ月を30日とみなす）
 * 03.  9月30日 -  8月30日 = ちょうど1ヵ月（1ヵ月を31日とみなす）
 * 04.  9月30日 -  8月29日 = 1.032258064516129（小数点は8月基準で1ヵ月を31日とみなす. 1日を【「ちょうど1ヶ月」+ 1日 】とみなす）
 * 
 * 05. 10月31日 - 10月 1日 = 0.967741935483871（1ヶ月を31日とみなす. 30日を【「ちょうど1ヶ月」- 1日 】とみなす）
 * 06. 10月31日 -  9月30日 = ちょうど1ヵ月（1ヵ月を31日とみなす）
 * 07. 10月31日 -  9月29日 = 1.0333333333333334（小数点は9月基準で1ヵ月を30日とみなす。1日を【「ちょうど1ヶ月」+ 1日 】とみなす）
 * 
 * 08. 10月31日 -  9月 1日 = 1.9666666666666668（1ヵ月と29日。この29日は【「ちょうど1ヵ月」-1日】とみなされ、1ヵ月を9月基準で30日としている）
 * 09. 10月31日 -  8月31日 = ちょうど2ヵ月（62日）
 * 10. 10月31日 -  8月30日 = 2.032258064516129（2ヵ月と1日。この1日は【「ちょうど1ヵ月」+1日 】とみなされ、1ヵ月を8月基準で31日としている）
 *
 * 11. 2020年2月29日 - 2020年4月 1日 = -1.096774193548387
 * 12. 2020年2月29日 - 2020年3月31日 = -1
 * 13. 2020年2月29日 - 2020年3月30日 = -1
 * 14. 2020年2月29日 - 2020年3月29日 = -1
 * 15. 2020年2月29日 - 2020年3月28日 = -0.9655172413793104
 * 
 * 16. 2020年4月 1日 - 2020年2月29日 = 1.096774193548387
 * 17. 2020年3月31日 - 2020年2月29日 = 1
 * 18. 2020年3月30日 - 2020年2月29日 = 1
 * 19. 2020年3月29日 - 2020年2月29日 = 1
 * 20. 2020年3月28日 - 2020年2月29日 = 0.9655172413793104
 * 
 */
const useDiff = dayjs => {
    const dateTo = dayjs('2020-02-29 06:00:00');
    const dateFrom = dayjs('2020-04-01 06:00:00');

    const r = `
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
    return r;
}
const useDiff2 = (dayjs, e) => (`
                [
                    19年2月28日 との差分：${(dayjs('2019-02-28 06:00:00').diff(dayjs(e), 'M', true))},
                    20年2月29日 との差分：${(dayjs('2020-02-29 06:00:00').diff(dayjs(e), 'M', true))},
                    20年4月30日 との差分：${(dayjs('2020-04-30 06:00:00').diff(dayjs(e), 'M', true))},
                    20年5月31日 との差分：${(dayjs('2020-05-31 06:00:00').diff(dayjs(e), 'M', true))},
                    21年10月23日との差分：${(dayjs('2021-10-23 06:00:00').diff(dayjs(e), 'M', true))},
                ]
`);
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

    // 2021-10-23 から 2025-10-23 までの全ての日付を格納した配列に対してテストを行う
    const allDate = [
        /* 2021-10-23から配列に含めたいので、ループする回数の算出には【その前日】から最終日までの差異を使う */
        ...new Array((new Date('2025-10-23 06:00:00') - new Date('2021-10-22 06:00:00')) / 1000 / 60 / 60 / 24)
    ].map(
        (e, i) => new Date(
            new Date('2021-10-23 06:00:00').getTime() + i * 24 * 60 * 60 * 1000
        )
    );
    let failedCount = 0;
    allDate.forEach(e =>{
        const resultOriginal = useDiff2(original, e);
        const resultSig = useDiff2(sig, e);
        console.assert(resultOriginal === resultSig, `
            オリジナルと異なる出力がされました。
            {
                対象日付：${sig(e).format("YY年M月D日")},
                オリジナルの出力：${resultOriginal},
                Sigの出力：${resultSig}
            }
        `)
        failedCount = resultOriginal === resultSig ? failedCount : failedCount+1;
    });
    console.assert(failedCount === 0, `useDiff2テストで${failedCount}件のNGがあります（テストは全部で${allDate.length}件あります）`);
    console.log('------------------------------------------------------------');
};
assert(origindayjs, sigDayjs);
