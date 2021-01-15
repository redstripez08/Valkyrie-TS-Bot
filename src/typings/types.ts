import { AxiosRequestConfig } from "axios";
import * as Discord from "discord.js";

export namespace Typings {
    export interface Command {
        name: string
        aliases: string[]
        execute(message: Discord.Message, args: string[]): void
    }
}


/**
 * Schema for Bot Commands.
 */
export interface Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string | null;
    cooldown: number;
    guildOnly: boolean;
    argsRequired: boolean;
    rolesRequired: object[];
    execute(message: Discord.Message, args: string[]): void;
}

export interface Link extends URL {
    options?: AxiosRequestConfig;
}