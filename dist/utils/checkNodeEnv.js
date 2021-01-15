"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvChecker = void 0;
const EnvChecker = (envState) => process.env.NODE_ENV?.trim() === envState;
exports.EnvChecker = EnvChecker;
