import * as Discord from "discord.js";
import { AxiosRequestConfig } from "axios";
import { ParsedUrlQueryInput } from "querystring";

/** Schema for Bot Commands. */
export interface Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string | null;
    cooldown: number;
    guildOnly: boolean;
    argsRequired: boolean;
    rolesRequired: object[];
    /** 
     * The actual command to be executed.
     * @param   message       Discord Message
     * @param   args          Arguments passed by user
     * */
    execute(message: Discord.Message, args: string[]): Promise<void> | void;
}

export interface LinkOptions {
    url?: string;
    base?: string | URL;
    querystring?: ParsedUrlQueryInput;
    headers?: object;
}

export class Client extends Discord.Client {
    constructor(options?: Discord.ClientOptions);
    public commands?: Discord.Collection<string, Command> | undefined;
}