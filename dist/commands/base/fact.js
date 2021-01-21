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
const axios_1 = __importDefault(require("axios"));
const Link_1 = __importDefault(require("../../classes/Link"));
const utils_1 = require("../../utils");
;
exports.default = {
    name: "fact",
    aliases: ["facts"],
    description: "Gets a random fact using the [Useless Facts](https://uselessfacts.jsph.pl/random.html?language=en) API.",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    async execute(message, args) {
        try {
            const link = new Link_1.default("/random.json", "https://uselessfacts.jsph.pl/", {
                querystring: {
                    language: "en"
                },
                headers: {
                    "Accept": "application/json"
                }
            });
            const { data } = await axios_1.default.get(link.href, { headers: link.headers });
            const embed = new Discord.MessageEmbed()
                .setColor("#fff")
                .setTitle("Random Fact")
                .setDescription(utils_1.charChecker(data.text))
                .setURL(data.permalink)
                .setFooter(data.source);
            message.channel.send(embed);
        }
        catch (error) {
            utils_1.axiosErrorHandler(message, error);
        }
    }
};
