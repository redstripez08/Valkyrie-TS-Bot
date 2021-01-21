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
const luxon_1 = require("luxon");
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../../utils");
const Link_1 = __importDefault(require("../../classes/Link"));
const { TIMEZONE = "UTC" } = process.env;
exports.default = {
    name: "ud",
    aliases: ["urban", "udict"],
    description: "Urban Dictionary",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    async execute(message, args) {
        try {
            const link = new Link_1.default("https://api.urbandictionary.com/v0/define", {
                querystring: { term: args.join(" ") },
                headers: { "Accept": "application/json" }
            });
            const { data } = await axios_1.default.get(link.href, { headers: link.headers });
            if (!data.list.length)
                return message.channel.send("No Results Found!");
            const ud_res = data.list[0];
            const date = luxon_1.DateTime.fromISO(ud_res.written_on).setZone(TIMEZONE).toFormat("yyyy LLL dd, t");
            const ud_links = /\[(\w| |\d){0,}\]/gi;
            const linkMatches = ud_res.definition.match(ud_links) || [];
            const exLinkMatches = ud_res.example.match(ud_links) || [];
            function swapLinks(matches, str) {
                if (matches.length) {
                    for (const link of matches) {
                        const linkWord = link.slice(1, -1);
                        const regex = new RegExp(`\\[${linkWord}\\]`);
                        const embedLink = `[${linkWord}](https://www.urbandictionary.com/define.php?term=${linkWord.replace(/ /g, "%20")})`;
                        str = str.replace(regex, embedLink);
                    }
                }
                return str;
            }
            const definition = swapLinks(linkMatches, ud_res.definition);
            const example = swapLinks(exLinkMatches, ud_res.example);
            const embed = new Discord.MessageEmbed()
                .setTitle(ud_res.word)
                .setURL(ud_res.permalink)
                .setAuthor("Author: " + ud_res.author)
                .setColor("#ffa500")
                .setDescription(utils_1.charChecker(definition))
                .addField("Example", utils_1.charChecker(example, 1024))
                .setFooter(`${ud_res.thumbs_up} 👍\t${ud_res.thumbs_down} 👎\nWritten on: ${date}`);
            message.channel.send(embed);
        }
        catch (error) {
            utils_1.axiosErrorHandler(message, error);
        }
    }
};
