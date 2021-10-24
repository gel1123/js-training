/**
 * ---------------------
 * Symbol       Value
 * ---------------------
 * I             1
 * V             5
 * X             10
 * L             50
 * C             100
 * D             500
 * M             1000
 * ---------------------
 * 
 * 上記のほか、次のことに気をつける必要がある
 * * ローマ数字は「4」や「9」を表現するのが苦手
 * * 「4」は「IV」
 * * 「9」は「IX」
 * 
 * * 1,   2,   3,   4,   5,   6,   7,   8,   9,   10
 * * I,  II, III,  IV,   V,  VI, VII,VIII,  IX,   X
 * 
 * @param {string} s
 * @return {number}
 */
const romanToInt = s => {

    const symbols = {
        "I": 1,
        "V": 5,
        "X": 10,
        "L": 50,
        "C": 100,
        "D": 500,
        "M": 1000
    };
    const charArray = [...s];

    return charArray.reduce((previousValue, currentValue, currentIndex) => {
        return previousValue + (
            /* 次の文字が、今の文字より大きいなら（IVなど） */
            symbols[currentValue] < symbols[charArray[currentIndex + 1]] ?
                - symbols[currentValue] :
                + symbols[currentValue]
        )
    }, 0);
};

export default romanToInt;