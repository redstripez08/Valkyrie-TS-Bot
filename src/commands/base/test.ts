import * as Discord from "discord.js";
import { Command } from "../../typings/types";

const command: Command = {
    name: "test",
    aliases: ["t"],
    description: "Test",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    execute(message: Discord.Message, args: string[]) {
        message.channel.send("no " + args.join(" "));
    }
}

module.exports = command;