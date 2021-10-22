'use strict';

// import { ManageDateClass } from "./class-statement.mjs";
// import { ManageDateClosure } from "./closure-statement.mjs";

// const mdc1 = new ManageDateClass(new Date());
// const mdc2 = ManageDateClosure(new Date(new Date() - (24 * 60 * 60 * 1000)));
// console.log('mdc1', mdc1.date, mdc1);
// console.log('mdc2', mdc2.getDate(), mdc2);

class SigDayjs {
    constructor(date) {
        this.init(date);
    }
    init(date) {
        this.$L = undefined;
        this.$d = date && new Date(date) || new Date();
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
    clone() {
        return new SigDayjs(this.$d);
    }
    toDate() {
        return this.$d;
    }
    year(yearNum) {
        return yearNum && this.init(this.$d.setFullYear(yearNum)) && this || this.$y;
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
    hour(hourNum) {
        return hourNum && this.init(this.$d.setHours(hourNum)) && this || this.$H;
    }
    minutes(minNum) {
        return minNum && this.init(this.$d.setMinutes(minNum)) && this || this.$m;
    }
    second(secNum) {
        return secNum && this.init(this.$d.setSeconds(secNum)) && this || this.$s;
    }
    millisecond(msNum) {
        return msNum && this.init(this.$d.setMilliseconds(msNum)) && this || this.$ms;
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
    add(num, unit) {
        // Number(num)と同じく、numが数値であることを保証する（undefinedや文字列ならNaN）
        num = num - 0;  // <= マイナスゼロなら実際の値に影響はないが、ここでもし誤って「マイナス1」などにしてしまったら当然のことながらNG（うっかりしてるとやりかねないので気をつけるべき...）

        // ES6で動作させる前提
        if (Number.isNaN(num)) {
            throw new Error("first argument is NaN");
        }

        /* 対応するunit（単位）
         * day	       d  <= Day
         * week        w  <= Week
         * month       M  <= Month
         * quarter     Q  <= Quarter
         * year	       y  <= Year
         * hour	       h  <= Hour
         * minute      m  <= Minute
         * second      s  <= Second
         * millisecond ms <= Millisecond
         */
        const convertToShorthand = unit => {
            // 長いunitから短いunit（ショートハンド）へと変換する（逆だとNG）
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
            }
            // formatのような「部分変換」ではなく「完全変換」なので、
            // millisecondとsecondの誤変換を気にしてキー文字列長降順ソートする必要はない
            unit = Object.keys(alias).reduce((previous, current) => {
                // unitとキーが一致しないなら、reduceとして実行しているのでもう一度unitを返却しないとバグが生じる
                return previous === current && alias[current] || previous;
            }, unit);
            // ここが関数定義内であることを忘れないように...（製造中に忘れていたことに気付かなかったため覚書）
            return unit;
        };
        unit = convertToShorthand(unit);

        // 増分msを算出し、addしたdayjsオブジェクトを返却する関数をunitごとに定義 ※immutable
        const addFunc = {
            /**
             * *****************
             * ***** 注意 ******
             * *****************
             * 
             * 下記はコードとしてNG。
             * ```
             * new Date() + num
             * ```
             * 
             * なぜなら、DateオブジェクトはNumberではないから。
             * DateオブジェクトをNumberにしたいなら、下記の方法を使うべき
             * ```
             * // 方法1（JS仕様による減算時の暗黙のNumber変換を活用）
             * new Date()-0 + num // <= マイナスゼロなら実際の値に影響はないが、ここでもし誤って「マイナス1」などにしてしまったら当然のことながらNG（うっかりしてるとやりかねないので気をつけるべき...）
             * 
             * // 方法2
             * new Date().getTime()
             * ```
             * 
             */
            "d": num => new SigDayjs(this.$d - 0 + num * 1000 * 60 * 60 * 24),
            "w": num => new SigDayjs(this.$d - 0 + num * 1000 * 60 * 60 * 24 * 7),
            "M": num => new SigDayjs(this.$d - 0 + new Date(this.$d).setMonth(this.$d.getMonth() + num) - new Date(this.$d)),
            "Q": num => new SigDayjs(this.$d - 0 + new Date(this.$d).setMonth(this.$d.getMonth() + num * 3) - new Date(this.$d)),
            "y": num => new SigDayjs(this.$d - 0 + new Date(this.$d).setFullYear(this.$d.getFullYear() + num) - new Date(this.$d)),
            "h": num => new SigDayjs(this.$d - 0 + num * 1000 * 60 * 60),
            "m": num => new SigDayjs(this.$d - 0 + num * 1000 * 60),
            "s": num => new SigDayjs(this.$d - 0 + num * 1000),
            "ms": num => new SigDayjs(this.$d - 0 + num)
        }
        return addFunc[unit](num);
    }
}

/**
 * 上記クラスのコンストラクタをコールする導線なので、
 * こちらの関数にもコンストラクタ同様の引数を設定しないとNG.
 * 忘れないように注意（うっかり忘れて時間を費やした実績あり）
 */
const sigDayjs = (date) => {
    return new SigDayjs(date);
}

export default sigDayjs;