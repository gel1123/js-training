'use strict';

/**
 * 例1：
 * 入力： strs = ["flower", "flow", "flight"]
 * 出力： "fl"
 * 
 * 例2：
 * 入力： strs = ["dog", "racecar", "car"]
 * 出力： ""
 * 説明：入力文字列に共通のプレフィックスはありません。
 *  
 * 制約：
 * 1 <= strs.length <= 200
 * 0 <= strs[i].length <= 200
 * strs[i] 小文字の英字のみで構成されます。
 * 
 * @param {string[]} strs
 * @return {string}
 */
const longestCommonPrefix = strs => {

    if (!strs || !strs.length) return "";

    const charsList = strs.reduce(
        (p, c) => {
            const chars = [...c];
            p.push(chars);
            return p;
        }, []
    );
    const shortestLength = charsList.reduce(
        (p, c) => p.length < c.length ? p : c
    ).length;

    let lastMatchIndex = -1;
    [...new Array(shortestLength)].find(
        // 最初にprefが一致しなくなったindexを探す
        (_, i) => {
            const isMatch = charsList.reduce(
                (p, c) => p === false ?
                    false :
                    p[i] === c[i] ?
                        p : false
            );
            if (isMatch) {
                lastMatchIndex = i;
            } else {
                return true;
            }
        }
    );
    if (lastMatchIndex < 0) {
        return "";
    } else {
        return strs[0].slice(0, lastMatchIndex + 1);
    }
};

export default longestCommonPrefix;