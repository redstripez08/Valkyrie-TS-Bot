"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(envState) {
    return process.env.NODE_ENV?.toLowerCase().trim() === envState;
}
exports.default = default_1;
