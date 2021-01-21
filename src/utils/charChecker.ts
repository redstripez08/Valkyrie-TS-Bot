/** Checks Length of string. If over max, it shortens it and adds trailing ellipses */
export default function (str: string, max: number = 2048): string {
    return str.length > max ? `${str.slice(0, max - 3)}...` : str;
}