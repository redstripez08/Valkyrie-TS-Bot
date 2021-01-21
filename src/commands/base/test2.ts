import * as Discord from "discord.js";
import { Command } from "../../typings/types";
import * as lodash from "lodash";

export default {
    name: "test2",
    aliases: ["tt", "t2"],
    description: "Test",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    execute(message, args) {
        message.channel.send(args);
    }
} as Command;