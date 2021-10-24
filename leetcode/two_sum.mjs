'use strict';

/**
 * Input: nums = [2,7,11,15], target = 9
 * Output: [0,1]
 * Output: Because nums[0] + nums[1] == 9, we return [0, 1].
 * 
 * Input: nums = [3,2,4], target = 6
 * Output: [1,2]
 * 
 * Input: nums = [3,3], target = 6
 * Output: [0,1]
 * 
 * なお「同じ要素を2度使ってはならない」という制約あり
 * また「twoSum」であり「3つ以上の要素を足したら...」という話は考慮しない
 * 
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const twoSum = (nums, target) => {
    return nums.reduce((p, c, i) => {

        // ---- 第三引数で最初のpは[]固定 ----

        // すでに答えが見つかってるなら、最初の答えを返却する
        if (p.length > 0) return p;

        /*******************
         * POINT!!
         * Array.prototype.slice()は指定したindexが、
         * もとの配列のrangeをオーバーしていてもエラーにならない。
         * たとえば [1,2,3].slice(5) は 空の配列 が返却される
         *******************/
        const I = nums.slice(i + 1).reduce((P, C, I) => {

            // ---- 第三引数で最初のpはnull固定 ----

            // すでに答えが見つかってるなら、最初の答えを返却する
            if (P !== null) return P;

            // 上記でslice(i+1)した分だけ、INDEXを再調整する
            I = I + (i + 1);
            return c + C === target ? I : null;
        }, null);
        return I !== null ? [i, I] : p
    }, []);
};

export default twoSum;