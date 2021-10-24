import SigCalendar from "./SigCalendar.mjs"

const show = () => {
    const today = new Date();

    const year = today.getFullYear();
    const monthNum = today.getMonth(); // 注意！月のゼロ始まりの数値表現なので、11を指定すれば「12月」の意味合いになる
    const startDayOfWeek = 1; // 月曜日
    const sigCalendar = new SigCalendar(year, monthNum, startDayOfWeek);
    const cuiCalendar = sigCalendar.drawOnCUI();
    console.log(cuiCalendar);
}
show();