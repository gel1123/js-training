'use strict';
import DateFormatter from './dateFormatter.mjs';

console.assert(
    new DateFormatter('2020-1-2').format("YYYY年MM月DD日（dd）") === "2020年01月02日（木）", 
    "[dateFormatter.test.mjs] 期待値と異なります"
);