'use strict';
import DateFormatter from "./dateFormatter.mjs"
import U from "./Utils.mjs";

// 2021年11月のカレンダーを作成する

// 2021年11月1日から2021年11月30日までを格納した配列
const novemberDateList = [...new Array(
    /* 何日あるかを算出 */
    (new Date(...U.s("2021-12-01")) - new Date(...U.s("2021-11-01"))) / 1000 / 60 / 60 / 24
)].map((e, i) => {
    return new Date(new Date(...U.s("2021-11-01")).getTime() + i * 24 * 60 * 60 * 1000)
});

const dateListToStr = dateList => dateList.reduce(
    (previous, current) => {
        const currentStr = new DateFormatter(current).format("YYYY-MM-DD");
        return previous
            && `${previous}_${currentStr}`
            || `${currentStr}`;
    }, "" // <= 注意！ Array.prototype.reduce()の下記仕様に気をつけること（言語によっては差異あるかも）

    /**************************************************************************************
     * Array.prototype.reduce() の仕様
     * ----------------------------------
     * 1. 第二引数なしの場合
     *     reduce((previous, current) => {})
     *     ループ1周目のコールバック内引数は...
     *         * previous : array[0] がセットされている <= 注意！nullではない！！！！
     *         * current  : array[1] がセットされている <= 注意！array[0]ではない！！
     * 
     * 2. 第二引数ありの場合
     *     reduce((previous, current) => {}, initValue)
     *     ループ1周目のコールバック内引数は...
     *         * previous : initValue がセットされている
     *         * current  : array[0] がセットされている
     * 
     * と、このように第二引数の有無でループ一周目のコールバック関数の引数にセットされる配列要素が
     * ひとつズレることになる。
     * 
     * そのため、reduceを使うときは、previousとcurrentがどんな値でスタートすることに
     * なるのかについて、意識すべき。
     * 
     **************************************************************************************/
);

const getDayOfWeek = date => "日_月_火_水_木_金_土".split("_")[date.getDay()];

const novemberDateListStr = dateListToStr(novemberDateList);
let isNextLineStarting = false;
const calendarStr = novemberDateListStr.split("_").reduce(
    (p,c) => {
        // 月曜始まりのカレンダーなら
        if (getDayOfWeek(new Date(c)) === "日") {
            isNextLineStarting = true;
            return p && `${p}_${c}
` || `${c}
`;
        } else {
            if (isNextLineStarting) {
                isNextLineStarting = false;
                return `${p}${c}`;
            } else {
                return p && `${p}_${c}` || `${c}`;
            }
        }
    }, ""
)

// 要素数7個になるまで、先頭からundefinedで埋める関数
const undefinedPaddingFromHead = arr => [...new Array(7)].map((e,i) => arr[i - (7-arr.length)]);

// 要素数7個になるまで、末尾までundefinedで埋める関数
const undefinedPaddingToEnd = arr => [...new Array(7)].map((e,i) => arr[i]);

const calendarLowList = calendarStr.split("\n")
const calendarOneMonth = calendarLowList.map((row,i) => {
    const oneWeekDateList = row.split("_");
    if (i === 0) {
        return undefinedPaddingFromHead(oneWeekDateList);
    }
    if (i === (calendarLowList.length-1)) {
        return undefinedPaddingToEnd(oneWeekDateList);
    }
    return oneWeekDateList;
});

const dateObjCalendarOneMonth = calendarOneMonth.map(row => row.map(e => e && new Date(e) || null));
const formatCalendar = dateObjCalendarOneMonth.map(row => row.map(e => e && new DateFormatter(e).format("M/D(dd)") || null));

const r = JSON.stringify(formatCalendar, null, 4);
export default r;
