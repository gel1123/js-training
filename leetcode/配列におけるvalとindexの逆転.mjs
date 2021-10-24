'use strict';

/**
 * 
 * 配列要素の値を、配列の要素番号とみなして、
 * 配列の並び順を入れ替える関数
 * 
 * Input: nums = [0,2,1,5,3,4]
 * Output: [0,1,2,4,5,3]
 * 
 * Input: nums = [5,0,1,2,3,4]
 * Output: [4,5,0,1,2,3]
 * 
 * 実装の説明：
 * 1. まず配列のクローンを作ります
 * 2. 配列のクローンをもとに、map()で新しい関数を作り始めます。
 * 3. map()のコールバックで、配列のクローンの要素値を、もとの配列の引数として渡します
 * 4. 上記手順で、無事にmap()の返却値が「要素値と要素indexが入れ替わった配列」になります。
 * 
 * @param {number[]} nums
 * @return {number[]}
 */
const buildArray = nums => [...nums].map(e => nums[e]);

export default buildArray;