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

export default {
    s: spreadISO8601
}

