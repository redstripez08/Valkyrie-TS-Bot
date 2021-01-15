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
const qs = __importStar(require("querystring"));
const luxon_1 = require("luxon");
const axios_1 = __importDefault(require("axios"));
const command = {
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
            const link = new URL("https://api.urbandictionary.com/v0/define");
            link.search = qs.stringify({ term: args.join(" ") });
            link.options = {
                headers: { "Accept": "application/json" },
            };
            const { data } = await axios_1.default.get(link.href, link.options);
            if (!data.list.length)
                return message.channel.send("No Results Found!");
            const ud_res = data.list[0];
            const charChecker = (str, max = 2048) => str.length > max ? `${str.slice(0, max - 3)}...` : str;
            const date = luxon_1.DateTime.fromISO(ud_res.written_on).toLocaleString({ month: "short", day: "numeric", year: "numeric" });
            const ud_links = /\[(\w| |\d){0,}\]/gi;
            const linkMatches = ud_res.definition.match(ud_links) || [];
            const exLinkMatches = ud_res.example.match(ud_links) || [];
            let definition = ud_res.definition;
            let example = ud_res.example;
            if (linkMatches.length) {
                for (const link of linkMatches) {
                    const linkWord = link.slice(1, -1);
                    const regex = new RegExp(`\\[${linkWord}\\]`);
                    const embedLink = `[${linkWord}](https://www.urbandictionary.com/define.php?term=${linkWord.replace(/ /g, "%20")})`;
                    definition = definition.replace(regex, embedLink);
                }
            }
            if (exLinkMatches.length) {
                for (const link of exLinkMatches) {
                    const linkWord = link.slice(1, -1);
                    const regex = new RegExp(`\\[${linkWord}\\]`);
                    const embedLink = `[${linkWord}](https://www.urbandictionary.com/define.php?term=${linkWord.replace(/ /g, "%20")})`;
                    example = example.replace(regex, embedLink);
                }
            }
            const embed = new Discord.MessageEmbed()
                .setTitle(ud_res.word)
                .setURL(ud_res.permalink)
                .setAuthor("Author: " + ud_res.author)
                .setColor("#ffa500")
                .setDescription(charChecker(definition))
                .addField("Example", charChecker(example, 1024))
                .setFooter(`${ud_res.thumbs_up} 👍\t${ud_res.thumbs_down} 👎\nWritten on: ${date}`);
            message.channel.send(embed);
        }
        catch (err) {
            console.error(err);
        }
    }
};
module.exports = command;
