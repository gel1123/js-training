/**
 * 入力された生年月日の形式を検証する。
 * 
 * ※正しい形式は YYYY/MM/DDのみ
 * @param {string} birthDate - 生年月日文字列
 * @return {boolean} - 形式が正しい場合はtrue、不正な場合はfalse
 */
function validate(birthDate) {
    const splitBirthDate = birthDate.split("/");
    const yearStr = splitBirthDate[0];
    const monthStr = splitBirthDate[1];
    const dateStr = splitBirthDate[2];

    // test時の間違い => dateStr.lengthではなく「dateStr」としていた
    if (yearStr.length === 4 && monthStr.length === 2 && dateStr.length === 2) {
        const yearNum = yearStr - 0;
        const monthNum = monthStr - 0;
        const dateNum = dateStr - 0;

        if (Number.isNaN(yearNum) || Number.isNaN(monthNum) || Number.isNaN(dateNum)) {
            return false;
        }
        const date = new Date(yearNum, monthNum - 1, dateNum);

        // test時の間違い => return後のかっこ前で ! を付与し意味を逆にしてしまった
        return (
            yearNum === date.getFullYear()
            && monthNum - 1 === date.getMonth()
            && dateNum === date.getDate()
        );

    }
    return false;
}

/**
 * 入力された生年月日から、現在日における年齢を返す。
 * 
 * ※未来ならゼロを返却する
 * @param {string} birthDate - 生年月日文字列(yyyy/MM/dd)
 * @return {number} - 年齢 (未来日付の場合は 0 を返す)
 */
function calculateAge(birthDate) {

    if (!validate(birthDate)) {
        return 0;
    }

    const splitBirthDate = birthDate.split("/");
    const yearStr = splitBirthDate[0];
    const monthStr = splitBirthDate[1];
    const dateStr = splitBirthDate[2];

    const yearNum = yearStr - 0;
    const monthNum = monthStr - 1;
    const dateNum = dateStr - 0;

    let today = new Date();

    // test時の間違い => 未来日を入れる処理が抜け落ちていた
    const result = new Date(today.getFullYear(), monthNum, dateNum) < today ?
        today.getFullYear() - yearNum :
        today.getFullYear() - yearNum - 1;
    return result < 0 ? 0 : result;
}

export default {
    v: validate,
    c: calculateAge
}