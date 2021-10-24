/**
 * [usage] new Date(spreadISO8601("2020-10-20"))
 *     => new Date(2020, 9, 20) に展開される
 *     ※ 注意！ Dateコンストラクタに単位ごとで日付を設定するとき、月はゼロ始まりで扱う
 * @param iso8601DateStr YYYY-MM-DD
 * @returns new Date(...[ここを返却する])
 */
const spreadISO8601 = (
    iso8601DateStr => iso8601DateStr.split("-").map(
        (e, i) => i === 1 ? e - 1 : e - 0
    )
);

const cut = (arr, index) => [
    arr.slice(0, index),
    arr.slice(index)
]

const cut2 = (arr, ...index) => {
    // スプレッド構文の引数だから、indexがArrayであることは保証されている
    // （もし...indexに配列以外の値を入れたとしても、自動的に「配列内の一要素」に変換される）

    const result = [];
    for (let i = 0; i < index.length; i++) {
        const previous = i === 0 ? 0 : index[i - 1]
        const current = index[i]
        result.push(arr.slice(previous, current))
    }
    if (index[index.length-1]<arr.length-1) {
        result.push(arr.slice(index[index.length]));
    }
    return result;
}


export default {
    s: spreadISO8601,
    c: cut
}

