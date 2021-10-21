'use strict';

// import { ManageDateClass } from "./class-statement.mjs";
// import { ManageDateClosure } from "./closure-statement.mjs";

// const mdc1 = new ManageDateClass(new Date());
// const mdc2 = ManageDateClosure(new Date(new Date() - (24 * 60 * 60 * 1000)));
// console.log('mdc1', mdc1.date, mdc1);
// console.log('mdc2', mdc2.getDate(), mdc2);

class SigDayjs {
    constructor() {
        this.init();
    }
    init(dateObj) {
        this.$L = undefined;
        this.$d = dateObj && new Date(dateObj) || new Date();
        this.$x = undefined;
        this.$y = this.$d.getFullYear();
        this.$M = this.$d.getMonth();
        this.$D = this.$d.getDate();
        this.$W = this.$d.getDay();
        this.$H = this.$d.getHours();
        this.$m = this.$d.getMinutes();
        this.$s = this.$d.getSeconds();
        this.$ms = this.$d.getMilliseconds();

        // 実行成功
        return true;
    }
    year() {
        return this.$y;
    }
    month(monthNum) {
        return monthNum && this.init(this.$d.setMonth(monthNum)) && this || this.$M;
    }
    date(dateNum) {
        return dateNum && this.init(this.$d.setDate(dateNum)) && this || this.$D;
    }
    day() {
        return this.$W;
    }
    hour() {
        return this.$H;
    }
    minutes() {
        return this.$m;
    }
    second() {
        return this.$s;
    }
    millisecond() {
        return this.$ms;
    }
    format(formatStr) {
        /* 対応済みフォーマット（例：2021年9月1日水曜なら）
         * YYYY : 2021
         * YY   : 21
         * MM   : 09
         * M    : 9
         * DD   : 01
         * D    : 1
         * dd   : We
         * d    : 3
         */
        const matches = {
            YYYY: this.$y,
            YY: (this.$y + '').slice(2),
            MM: this.$M + 1 > 9 && this.$M + 1 || '0' + (this.$M + 1), // 注意！プラス1がカッコの外だと文字列になって '081' のようになる。また、足し忘れることで月がおかしくなる
            M: this.$M + 1, // 注意！プラス1忘れると月がずれる
            DD: this.$D > 9 && this.$D || '0' + this.$D,
            D: this.$D,
            dd: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'][this.$W - 1 < 0 && 6 || this.$W - 1], // 注意！マイナス1忘れると配列要素がずれて曜日がおかしくなる
            d: this.$W
        }

        // 本家は正規表現でやってるが、
        // 長すぎる正規表現を本番で書いてミスする可能性もあるため、
        // あえて愚直にいく。

        // 長いパターンの優先度が高いことを利用したいので、キーを文字列長の降順ソートする
        const sortedKeys = Object.keys(matches).sort((e1, e2) => e2.length - e1.length);
        // 長いパターンから変換していく
        sortedKeys.forEach(e => {
            formatStr = formatStr.replace(e, matches[e]);
        });
        return formatStr;
    }
}

const sigDayjs = () => {
    return new SigDayjs();
}

export default sigDayjs;