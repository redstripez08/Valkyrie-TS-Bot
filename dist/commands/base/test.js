"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command = {
    name: "test",
    aliases: ["t"],
    description: "Test",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    execute(message, args) {
        message.channel.send("no " + args.join(" "));
    }
};
module.exports = command;
