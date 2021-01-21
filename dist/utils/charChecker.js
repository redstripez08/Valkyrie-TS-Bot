"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.charChecker = void 0;
const charChecker = (str, max = 2048) => str.length > max ? `${str.slice(0, max - 3)}...` : str;
exports.charChecker = charChecker;
