import { LinkOptions } from "../typings/types";
import * as querystring from "querystring";

export default class Link extends URL {
    public headers?: object;

    constructor(url: string, base?: string | URL | LinkOptions, options?: LinkOptions) {
        typeof base === "string" || base instanceof URL ? super(url, base) : super(url);

        if (base) {
            if (typeof base !== "string" && !(base instanceof URL)) {
                base.headers ? this.headers = base.headers : null;
                base.querystring ? this.search = querystring.stringify(base.querystring) : null;
            } else if (options) {
                options.querystring ? this.search = querystring.stringify(options.querystring) : null;
                options.headers ? this.headers = options.headers : null;
            }
        }
    }

}