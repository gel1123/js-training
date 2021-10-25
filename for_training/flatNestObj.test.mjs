import flatNestObj from "./flatNestObj.mjs";

const obj = {
    hoge: 1,
    fuge: {
        fugeID: 2,
        fugeVAL: 3
    },
    sage: {
        s: {
            a: {
                g: [1, 2, 3, 4],
                e: {
                    sageID: -1,
                    sageOBJ: {
                        sageCORE: null
                    }
                }
            }
        }
    }
}
const r = JSON.stringify(flatNestObj(obj), null, 4);
console.assert(r === `{
    "hoge": 1,
    "fugeID": 2,
    "fugeVAL": 3,
    "g": [
        1,
        2,
        3,
        4
    ],
    "sageID": -1,
    "sageCORE": null
}`, "[Error] flatNestObj.test.mjs");