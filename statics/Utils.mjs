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


// ################################################################
//     注意
// =============
// 下記の関数「monthDiff」にはバグがあります。
// これを使うと正確な月差異を取得できません。
// バグの原因を理解し、最適なコードを実装するまでの間は、
// より愚直に実装した「monthDiff2」を利用してください。
// ################################################################

/* [trace1] もし this: 2021-10-21, that: 2020-11-30なら */
/* [trace2] もし this: 2018-09-30, that: 2018-08-31なら */
const monthDiff = (thisDayjs, thatDayjs) => {
    if (thisDayjs.toDate() < thatDayjs.toDate()) {
        return - monthDiff(thatDayjs, thisDayjs);
    }
    // 上記if文により、以降は常に「thisDayjs」が未来で、「thatDayjs」が過去になる。


    /* [trace1] (2020-2021)*12 + 11-10 => -12 + 1 => -11 */
    /* [trace2] (2018-2018)*12 + 8 - 9 => 0 + (-1) => -1 */
    // wholeは「全体」の意味
    const wholeMonthDiff =
        (thatDayjs.year() - thisDayjs.year()) * 12 // 年の差分を単純に12ヵ月/年で変換
        + (thatDayjs.month() - thisDayjs.month()); // 今が何月か、だけの観点での月差分

    /* [trace1] 2021-10-21 + (-11)ヵ月 => 2020-11-21 */
    /* [trace2] 2018-09-30 + (-1) ヵ月 => 2018-08-30 */
    const anchor = thisDayjs.add(wholeMonthDiff, 'M'); // this（未来）をthat（過去）に近づける
    /* [trace1] { 2020-11-30 - 2020-11-21 = 9日 } はゼロより大きいのでfalse */
    /* [trace2] { 2018-08-31 - 2018-08-30 = 1日 } はゼロより大きいのでfalse */
    const isNotAnchorOver = thatDayjs - anchor < 0; // 実際の過去月より想定の過去月の方が未来かどうか
    /* [trace1] 2021-10-21 + (-11ヵ月 + 1 = -10ヵ月) => 2021-12-21 */
    /* [trace2] 2018-09-30 + (-1 ヵ月 + 1 =   0ヵ月) => 2018-09-30 */
    const anchor2 = thisDayjs.add(
        wholeMonthDiff + (isNotAnchorOver ? -1 : 1)
        , 'M');
    /* [trace1] -11ヵ月 + 0.33ヵ月 */
    return + (
        - (
            /* [trace1] -11ヵ月 */
            /* [trace2] -1 ヵ月 */
            wholeMonthDiff + (
                /* [trace1] 実際の過去日とざっくり計算値のdiff / thatの月は何日までか
                /* [trace1] (2020-11-30 - 2020-11-21 = 9日) / (2020-12-21 - 2020-11-21 = 30日) */
                /* [trace2] (2018-08-31 - 2018-08-30 = 1日) / (2018-09-30 - 2018-08-30 = 31日) */
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

/**
 * diff == this - that
 * 11/10 - 10/1 = 1ヵ月+α
 * 11/10 - 10/31 = 1ヵ月-α
 * @param thisDayjs
 * @param thatDayjs
 */
const monthDiff2 = (thisDayjs, thatDayjs) => {

    // 1日の価値は1ヵ月の長さで決まる。
    // diffを取得するこの関数において、1ヵ月未満の日単位の差異は、
    // 過去の側を基準として算出するよう固定する
    if (thatDayjs > thisDayjs) {
        return - monthDiff2(thatDayjs, thisDayjs);
    }

    const thisYear = thisDayjs.year();
    const thatYear = thatDayjs.year();
    const thisMonth = thisDayjs.month();
    const thatMonth = thatDayjs.month();
    let thisDate = thisDayjs.date();
    let thatDate = thatDayjs.date();

    // 年の差異を含めた全体の差異を月で換算したもの（ただし日付の差異は考慮していない）
    const wholeMonthDiff = (thisYear - thatYear) * 12 + thisMonth - thatMonth;

    /**
     * 1ヵ月が何日か、については下記のパターンが存在する
     * * 31日パターン：1_3_5_7_8_10_12月
     * * 30日パターン：4_6_9_11月
     * * 29日パターン：うるう年の2月
     * * 28日パターン：うるう年以外の2月
     * 
     * this - that の右辺（that）側の月がどのパターンであるかに応じて、
     * 1日の価値（何分の一ヶ月か）が決まるので、
     * パターン判定が必要
     */
    const checkLastDateOfMonth = (month, year) => ({
        is31: "1_3_5_7_8_10_12".split("_").includes(month + ''),
        is30: "4_6_9_11".split("_").includes(month + ''),
        is29: month === 2 && year % 4 === 0,
        is28: month === 2 && year % 4 !== 0,
    });

    const thisLastDate = checkLastDateOfMonth(thisMonth, thisYear);
    const thatLastDate = checkLastDateOfMonth(thatMonth, thatYear);

    // 端数の月差異（日数の差異を月単位で小数として表すためのもの）
    let fractionMonthDiff = undefined;

    if (thatLastDate.is31) {
        // thatが31日パターン：1_3_5_7_8_10_12月

        // 日付の差異がゼロ日になる範囲を算出
        // thisが31日パターンなら: thatが 31日
        // thisが30日パターンなら: thatが 31日, 30日
        // thisが29日パターンなら: thatが 31日, 30日, 29日
        // thisが28日パターンなら: thatが 31日, 30日, 29日, 28日

        if (thisLastDate.is30) {
            // thatの日付の末尾を30日まで縮めるべき
            thatDate = thatDate > 30 ? 30 : thatDate;
        }
        if (thisLastDate.is29) {
            // thatの日付の末尾を29日まで縮めるべき
            thatDate = thatDate > 29 ? 29 : thatDate;
        }
        if (thisLastDate.is28) {
            // thatの日付の末尾を28日まで縮めるべき
            thatDate = thatDate > 28 ? 28 : thatDate;
        }
        fractionMonthDiff = (thisDate - thatDate) / 31;
    }
    if (thatLastDate.is30) {
        // thatが30日パターン：4_6_9_11月

        // 日付の差異がゼロ日になる範囲を算出
        // thisが31日パターンなら: thatが 30日
        // thisが30日パターンなら: thatが 30日
        // thisが29日パターンなら: thatが 30日, 29日
        // thisが28日パターンなら: thatが 30日, 29日, 28日
        if (thisLastDate.is29) {
            // thatの日付の末尾を29日まで縮めるべき
            thatDate = thatDate > 29 ? 29 : thatDate;
        }
        if (thisLastDate.is28) {
            // thatの日付の末尾を28日まで縮めるべき
            thatDate = thatDate > 28 ? 28 : thatDate;
        }
        fractionMonthDiff = (thisDate - thatDate) / 30;
    }
    if (thatLastDate.is29) {
        // thatが29日パターン：うるう年の2月

        // 日付の差異がゼロ日になる範囲を算出
        // thisが31日パターンなら: thatが 29日
        // thisが30日パターンなら: thatが 29日
        // thisが29日パターンなら: thatが 29日
        // thisが28日パターンなら: thatが 29日, 28日
        if (thisLastDate.is28) {
            // thatの日付の末尾を28日まで縮めるべき
            thatDate = thatDate > 28 ? 28 : thatDate;
        }
        fractionMonthDiff = (thisDate - thatDate) / 29;
    }
    if (thatLastDate.is28) {
        // thatが28日パターン：うるう年以外の2月

        // 日付の差異がゼロ日になる範囲を算出
        // thisが31日パターンなら: thatが 28日
        // thisが30日パターンなら: thatが 28日
        // thisが29日パターンなら: thatが 28日
        // thisが28日パターンなら: thatが 28日
        fractionMonthDiff = (thisDate - thatDate) / 28;
    }
    return wholeMonthDiff + fractionMonthDiff;
};
export default {
    convertToShorthand: unit => Object.keys(alias).reduce((unit, current) => {
        return unit === current && alias[unit] || unit;
    }, unit),
    monthDiff: monthDiff2
};