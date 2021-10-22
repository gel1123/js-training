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

/* [trace1] もし this: 2021-10-21, that: 2020-11-30なら */
const monthDiff = (thisDayjs, thatDayjs) => {
    if (thisDayjs.toDate() < thatDayjs.toDate()) {
        return monthDiff(thatDayjs, thisDayjs);
    }
    // 上記if文により、以降は常に「thisDayjs」が未来で、「thatDayjs」が過去になる。


    /* [trace1] (2020-2021)*12 + 11-10 => -12 + 1 => -11 */
    // wholeは「全体」の意味
    const wholeMonthDiff =
        (thatDayjs.year() - thisDayjs.year()) * 12 // 年の差分を単純に12ヵ月/年で変換
        + (thatDayjs.month() - thisDayjs.month()); // 今が何月か、だけの観点での月差分

    /* [trace1] 2021-10-21 + (-11)ヵ月 => 2020-11-21 */
    const anchor = thisDayjs.add(wholeMonthDiff, 'M'); // this（未来）をthat（過去）に近づける
    /* [trace1] { 2020-11-30 - 2020-11-21 = 9日 } はゼロより大きいのでfalse */
    const isNotAnchorOver = thatDayjs - anchor < 0; // 実際の過去月より想定の過去月の方が未来かどうか
    /* [trace1] 2021-10-21 + (-11ヵ月 + 1 = -10ヵ月) => 2021-12-21 */
    const anchor2 = thisDayjs.add(
        wholeMonthDiff + (isNotAnchorOver ? -1 : 1)
        , 'M');
    /* [trace1] -11ヵ月 + 0.33ヵ月 */
    return + (
        - (
            /* [trace1] -11ヵ月 */
            wholeMonthDiff + (
                /* [trace1] 実際の過去日とざっくり計算値のdiff / thatの月は何日までか
                /* [trace1] (2020-11-30 - 2020-11-21 = 9日) / (2020-12-21 - 2020-11-21 = 30日) */
                (thatDayjs - anchor) / (isNotAnchorOver ? (anchor - anchor2) : (anchor2 - anchor))
            )
        ) || 0
    );

    /**
     * [traceからわかること]
     * dayjsにおける月の差分は、下記のルールに従う
     * 1. this月 - that月 の差分月を、まず愚直に「年」と「月」にだけ着目して算出
     * 2. 差分日付がプラスなら、【過去月の当月】のMAX日数を1ヵ月として、差分日付が何ヶ月に相当するか算出
     * 3. 差分日付がマイナスなら、【過去月の1ヶ月前】のMAX日数を1ヵ月として、差分日付が何ヶ月に相当するか算出
     * 
     * 「2」「3」の要約：プラスの日数差分は当月ベースで考え、マイナスの日数差分は先月ベースで考える
     */

}
export default {
    convertToShorthand: unit => Object.keys(alias).reduce((unit, current) => {
        return unit === current && alias[unit] || unit;
    }, unit),
    monthDiff: monthDiff
};