import DateFormatter from "./training01.mjs";

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