'use strict';
import DateFormatter from './dateFormatter.mjs';

/**
 * カレンダー中の単一の日付を表すクラス
 */
class DateInfo {
    constructor(date) {
        /** Dateオブジェクト */
        this.$d = new Date(date);
        /** 年の数値表現 */
        this.$Y = this.$d.getFullYear();
        /** 月の数値表現（！！！ゼロ始まり！！！） */
        this.$M = this.$d.getMonth();
        /** 日の数値表現 */
        this.$D = this.$d.getDate();
        /** 曜日の数値表現 */
        this.$W = this.$d.getDay();
        /** 曜日の文字列表現 */
        this.$E = "日_月_火_水_木_金_土".split("_")[this.$W];
        /** カレンダー上のDate表現 */
        this.display = this.$D < 10 ? `0${this.$D}` : `${this.$D}`;
    }
    /** 今月始まってから何度目の同曜日かをセットする */
    setNth(nTh) {
        nTh = nTh - 0;
        if (Number.isNaN(nTh)) return;
        this.nTh = nTh;
    }
    /** 祝日かどうかを設定する */
    isHoliday(isHoliday) {

        /************************
         * 注意！
         * Javaと違って、メソッド名とメンバ名を
         * 同じ名前でつけるのはNG。
         * JavaScriptはどちらも「プロパティ」として扱うので、
         * 片一方がもう片一方を上書きしてしまう。
         ************************/

        // 型をbooleanに固定
        this.holiday = !!isHoliday;
    }
}

class SigCalendar {
    /**
     * @param calendarYear 作成したいカレンダーの年
     * @param calendarMonth 作成したいカレンダーの月を数値で指定する（注意！ゼロ始まり）
     * @param startDayOfWeek 何曜日始まりのカレンダーかを数値で指定する
     */
    constructor(calendarYear, calendarMonth, startDayOfWeek) {
        /***************************************
         * 注意！
         * -----------------------
         * 日付を指定したくないからといって、new Date(YYYY, M, D)形式で 
         * new Date(2021, 11, 0)
         * なんて書いてはいけない。
         * 日付を指定なしと同じにするなら、月の初日なので、ゼロではなく「1」が正しい。
         * なので new Date(2021, 11, 1) か、
         * あるいは素直に new Date(2021, 11)とすべき
         * 
         ***************************************/
        const startDate = new Date(calendarYear, calendarMonth);
        const endDate = new Date(calendarYear, calendarMonth === 12 ? 0 : calendarMonth + 1);
        this.startDate = startDate;
        this.endDate = endDate;

        /** カレンダー全日程の一次元配列 */
        this.allDateInfo = [
            ...new Array(
                (endDate - startDate) / 24 / 60 / 60 / 1e3
            )
        ].map((e, i) => {
            return new DateInfo(
                startDate.getTime() + i * 24 * 60 * 60 * 1e3
            );
        });
        /** カレンダーが何曜日始まりか（指定なしなら日曜始まり） */
        this.startDayOfWeek = startDayOfWeek ? startDayOfWeek : 0;
        /** カレンダーが始まる曜日の文字列表現 */
        this.startDayOfWeekStr = "日_月_火_水_木_金_土".split("_")[this.startDayOfWeek];
        /** その周の終わりの曜日の数値表現 */
        this.lastDayOfWeek = this.startDayOfWeek === 0 ? 6 : this.startDayOfWeek - 1

        /** カレンダー全日程の二次元配列 */
        this.$CALENDAR = this.init();
    }
    /**
     * 祝日を定義する関数（コンストラクタで指定がなければこれが使われる）
     * @param dateInfo DateInfoクラスのオブジェクト
     */
    checkHoliday(dateInfo) {
        const W = dateInfo.$W;
        const nThWeek = dateInfo.nTh;

        // 土曜と日曜は休み
        if (W === 6 || W === 0) {
            dateInfo.isHoliday(true);
            return;
        }
        // 第1水曜日と第3水曜日は休み（一般的には休みではないが、個人的には休みであってほしいため定義）
        if ((nThWeek === 1 || nThWeek === 3) && W === 3) {
            dateInfo.isHoliday(true);
            return;
        }
        dateInfo.isHoliday(false);
    }
    /** カレンダー全日程の二次元配列を生成する */
    init() {
        const result = [];
        let week = undefined;
        this.allDateInfo.forEach((dateInfo, index) => {

            if (result.length === 1 && result[0].length < 7) {
                // 最初の週は長さ7に足りない分を先頭からundefined埋めする
                // [1,2,3] => [u,u,u,u,1,2,3]
                //  0 1 2      0 1 2 3 4 5 6
                const firstWeek = result[0];
                result[0] = [...new Array(7)].map((e, i) => firstWeek[firstWeek.length - 7 + i]);
            }

            week = week || [];
            week.push(dateInfo);

            // 1周目：resultに格納されている配列（week）の数で、今が何周目かを記録していく
            if (result.length === 0) {
                dateInfo.setNth(result.length + 1);
            } else if (result[0][dateInfo.$W]) {
                // 1周目に同じ曜日が存在するなら...
                dateInfo.setNth(result.length + 1);
            } else {
                // 上記以外なら...
                dateInfo.setNth(result.length + 1 - 1);
            }

            // その日が休日かどうかを設定する
            this.checkHoliday(dateInfo);

            if (dateInfo.$W === this.lastDayOfWeek) {
                // その日が週の最後の曜日なら
                result.push(week);
                // 次の週の処理を始めるので、week配列をリセットする
                week = [];
            } else if (this.allDateInfo.length - 1 === index) {
                /*************************
                 * 注意！！！！！
                 * 最後の週は、週の最終曜日が来るとは限らないので、
                 * 最後の日付処理後は必ずpushするべき
                 *************************/
                result.push(week);
            }
        });

        // 最後の週は長さ7に足りない分を末尾からundefined埋めする
        // [1,2,3] => [1,2,3,u,u,u,u]
        //  0 1 2      0 1 2 3 4 5 6
        const lastWeek = result[result.length - 1];
        result[result.length - 1] = [...new Array(7)].map((e, i) => lastWeek[i]);

        return result;
    }
    /** CUI向けカレンダー表示（休日をアスタリスク付きで表現する） */
    drawOnCUI() {
        return `
  --------------------------- 
 | ${new DateFormatter(this.startDate - 0).format("YYYY/MM/DD")} - ${new DateFormatter(this.endDate - 1 * 24 * 60 * 60 * 1e3).format("YYYY/MM/DD")}   |
 |---------------------------|
`+ this.$CALENDAR.map(week => {
            const weekStr = week.map(dateInfo => {
                if (dateInfo === undefined) {
                    return `   `;
                }
                const dateInfoStr = `${dateInfo.holiday ? '*' : ' '}${dateInfo.display}`
                return dateInfoStr;
            }).reduce(
                (previous, current) => {
                    if (previous) {
                        return `${previous} ${current}`;
                    } else {
                        return `${current}`;
                    }
                }, ""
            );
            return ` |${weekStr}|`;
        }).join("\n") + "\n  --------------------------- \n";
    }
    valueOf() {
        return this.$d.getTime();
    }
}

export default SigCalendar;