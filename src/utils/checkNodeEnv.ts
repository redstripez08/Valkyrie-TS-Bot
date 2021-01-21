type EnvStates = "production" | "dev";
/** Checks Node Environment. */
export default function (envState: EnvStates): Boolean {
    return process.env.NODE_ENV?.toLowerCase().trim() === envState;
}