class DateFormatter {
    constructor(dateObj) {
        this.$d = new Date(dateObj || new Date());
        this.$y = this.$d.getFullYear();
        this.$M = this.$d.getMonth();
        this.$D = this.$d.getDate();
        this.$w = this.$d.getDay();
        this.$h = this.$d.getHours();
        this.$m = this.$d.getMinutes();
        this.$s = this.$d.getSeconds();
        this.$ms = this.$d.getMilliseconds();
        this.matches = {
            YY: (this.$y + '').slice(2), // 先に$yを数値から文字列に変換すべき
            YYYY: this.$y,
            M: this.$M + 1, // 表示用なので月はプラス1
            MM: this.$M + 1 < 10 && '0' + (this.$M + 1) || this.$M + 1, // ゼロ埋め前に月プラス1処理を優先すべき（要括弧）
            D: this.$D,
            DD: this.$D < 10 && '0' + this.$D || this.$D
        };
    }
    format(formatStr) {
        // 長いキーワードから順に変換していく
        return formatStr && Object.keys(this.matches).sort((e1, e2) => e2.length - e1.length).reduce((previous, current) => {
            return previous.replace(current, this.matches[current]);
        }, formatStr);
    }
}

(() => {

    let anydate = new Date();
    const Formatter = new DateFormatter(new Date("2021-09-09"));
    const r = Formatter.format("YY年MM月DD日");
    
    // 実際
    const actual = r;
    // 期待値
    const expected = "21年09月09日";
    console.assert(expected == actual, `\n期待値:${expected}, 実際:${actual}`);
})()