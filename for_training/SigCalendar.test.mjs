import SigCalendar from "./SigCalendar.mjs"

const testCuiCalendar = () => {
    const year = 2021;
    const monthNum = 11; // 注意！月のゼロ始まりの数値表現なので、11を指定すれば「12月」の意味合いになる
    const startDayOfWeek = 0; // 日曜日
    const sigCalendar = new SigCalendar(year, monthNum, startDayOfWeek);
    const cuiCalendar = sigCalendar.drawOnCUI();
    console.log(cuiCalendar);
    console.assert(
        cuiCalendar === `
  --------------------------- 
 | 2021/11/30 - 2021/12/30   |
 |---------------------------|
 |         30 *01  02  03 *04|
 |*05  06  07  08  09  10 *11|
 |*12  13  14 *15  16  17 *18|
 |*19  20  21  22  23  24 *25|
 |*26  27  28  29  30        |
  --------------------------- 
`, "[Test] drawOnCUI() is failed");
}

const assert = () => {
    testCuiCalendar();
}

assert();