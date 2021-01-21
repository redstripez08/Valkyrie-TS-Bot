"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(str, max = 2048) {
    return str.length > max ? `${str.slice(0, max - 3)}...` : str;
}
exports.default = default_1;
