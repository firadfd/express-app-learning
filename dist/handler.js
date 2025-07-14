"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParseJSON = tryParseJSON;
function tryParseJSON(str) {
    try {
        return JSON.parse(str);
    }
    catch (e) {
        return str;
    }
}
