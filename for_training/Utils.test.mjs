import U from "./Utils.mjs";

console.assert(U.s("2021-10-20").join(",") === "2021,9,20", "テスト失敗");

const arr = [1,2,3,4,5,6]
console.assert(`${U.c(arr, 0).join("_")}
${U.c(arr, 1).join("_")}
${U.c(arr, 2).join("_")}
${U.c(arr, 3).join("_")}
${U.c(arr, 4).join("_")}
${U.c(arr, 5).join("_")}
${U.c(arr, 6).join("_")}` ===
`_1,2,3,4,5,6
1_2,3,4,5,6
1,2_3,4,5,6
1,2,3_4,5,6
1,2,3,4_5,6
1,2,3,4,5_6
1,2,3,4,5,6_`, "テスト失敗");