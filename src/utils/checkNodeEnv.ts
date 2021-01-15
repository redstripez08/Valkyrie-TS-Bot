type EnvStates = "production" | "dev";
export const EnvChecker = (envState: EnvStates): Boolean => process.env.NODE_ENV?.trim() === envState;