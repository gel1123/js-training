import SigCalendar from "./SigCalendar.mjs"

/**
 * 休日の定義のみSigCalendarから上書き
 * （SigCalendarは、第N何曜日の処理が動くかを確認したかったので、理由なく第一水曜と第三水曜を休日としていた）
 */
class WrapSigCalendar extends SigCalendar {
    /**
     * 祝日を定義する関数（コンストラクタで指定がなければこれが使われる）
     * @param dateInfo DateInfoクラスのオブジェクト
     */
    checkHoliday(dateInfo) {
        const W = dateInfo.$W;
        const D = dateInfo.$D;
        const M = dateInfo.$M;

        // 土曜と日曜は休み
        if (W === 6 || W === 0) {
            dateInfo.isHoliday(true);
            return;
        }
        // 14日, 20日, 23日は休日の気分
        if (D === 14 || D === 20 || D === 23) {
            dateInfo.isHoliday(true);
            return;
        }
        // 3月15日, 12月30日も休日の気分
        if ((M === 2 && D === 15) || (M === 11 && D === 30)) {
            dateInfo.isHoliday(true);
            return;
        }
        dateInfo.isHoliday(false);
    }
}

const show = () => {
    const today = new Date();

    const year = today.getFullYear();
    const monthNum = today.getMonth(); // 注意！月のゼロ始まりの数値表現なので、11を指定すれば「12月」の意味合いになる
    const startDayOfWeek = 1; // 月曜日
    const sigCalendar = new WrapSigCalendar(year, monthNum, startDayOfWeek);
    const cuiCalendar = sigCalendar.drawOnCUI();
    console.log(cuiCalendar);
}
show();