'use strict';

/**
 * @param {number} x
 * @return {boolean}
 */
const isPalindrome = x => (x + '').length === 1 ? true : [
    ...new Array(Math.trunc((x + '').length / 2))
].map(
    (e, i) => (x + '')[i] === (x + '')[(x + '').length - 1 - i]
).reduce(
    (p, c) => p && c
);

export default isPalindrome;