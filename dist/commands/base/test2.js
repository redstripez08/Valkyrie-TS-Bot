"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
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
};
