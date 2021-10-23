export default class DateFormatter {
    constructor(date) {
        this.$date = new Date(date);
        this.$YYYY = this.$date.getFullYear();
        this.$M = this.$date.getMonth() + 1;
        this.$D = this.$date.getDate();
        this.$d = this.$date.getDay();
        this.matches = {
            YYYY: this.$YYYY,
            MM: this.$M < 10 && `0${this.$M}` || this.$M,
            DD: this.$D < 10 && `0${this.$D}` || this.$D,

            YY: this.$YYYY + ''.slice(2), // $YYYYは数値。sliceしたいからStrに変換すべき
            M: this.$M,
            D: this.$D,

            dd: "日_月_火_水_木_金_土".split("_")[this.$d],
            d: this.$d
        }
    }
    format(formatStr) {
        return formatStr
            .replace(/YYYY/g, this.matches.YYYY)
            .replace(/MM/g, this.matches.MM)
            .replace(/DD/g, this.matches.DD)
            .replace(/YY/g, this.matches.YY)
            .replace(/M/g, this.matches.M)
            .replace(/D/g, this.matches.D)
            .replace(/dd/g, this.matches.dd)
            .replace(/d/g, this.matches.d);
    }
}