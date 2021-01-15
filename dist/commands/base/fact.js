"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const querystring = __importStar(require("querystring"));
const axios_1 = __importDefault(require("axios"));
;
const command = {
    name: "fact",
    aliases: ["facts"],
    description: "Gets a random fact using [https://uselessfacts.jsph.pl/](https://uselessfacts.jsph.pl/random.html?language=en) API.",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    async execute(message, args) {
        try {
            const link = new URL("/random.json", "https://uselessfacts.jsph.pl/");
            link.search = querystring.stringify({ language: "en" });
            const res = await axios_1.default.get(link.href);
            const embed = new Discord.MessageEmbed()
                .setColor("#fff")
                .setDescription(res.data.text)
                .setURL(res.data.source_url);
            message.channel.send(embed);
        }
        catch (error) {
            if (error.response) {
                console.error(error.response);
                message.channel.send(`There was an error!\n\`${error.response.status} || ${error.response.statusText}`);
            }
            else {
                console.error(error);
                message.channel.send(`There was an error!\n\`${error}\``);
            }
        }
    }
};
module.exports = command;
