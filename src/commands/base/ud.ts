import * as Discord from "discord.js";
import { DateTime } from "luxon";
import axios, { AxiosResponse } from "axios";
import { Command } from "../../typings/types";
import { axiosErrorHandler, charChecker } from "../../utils";
import Link from "../../classes/Link";
const { TIMEZONE = "UTC" } = process.env;

interface Response extends AxiosResponse {
    data: {
        list: Array<{
            definition: string;
            permalink: string;
            thumbs_up: number;
            sound_urls: Array<any>;
            author: string;
            word: string;
            defid: number;
            current_vote: string;
            written_on: string;
            example: string;
            thumbs_down: number;        
        }>
    } 
}

export default {
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
            const link = new Link("https://api.urbandictionary.com/v0/define", {
                querystring: {term: args.join(" ")},
                headers: {"Accept": "application/json"}
            });
            
            const { data }: Response = await axios.get(link.href, {headers: link.headers});
            if (!data.list.length) return message.channel.send("No Results Found!");

            // UD API returns an array. This gets the highest-ranked one.
            const ud_res = data.list[0];
            // Formats ISO Dates to be human-readble
            const date = DateTime.fromISO(ud_res.written_on).setZone(TIMEZONE).toFormat("yyyy LLL dd, t");
            
            // Links in UD are represented by a word bein encapsulated in square brackets, [like this]
            // This Replaces [ud links] with Discord Valid links
            const ud_links = /\[(\w| |\d){0,}\]/gi
            const linkMatches = ud_res.definition.match(ud_links) || [];
            const exLinkMatches = ud_res.example.match(ud_links) || [];

            function swapLinks(matches: RegExpMatchArray, str: string): string {
                if (matches.length) {
                    for (const link of matches) {
                        // Removes brackets surrounding word
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
                .setDescription(charChecker(definition))
                .addField("Example", charChecker(example, 1024))
                .setFooter(`${ud_res.thumbs_up} 👍\t${ud_res.thumbs_down} 👎\nWritten on: ${date}`);
            
            message.channel.send(embed);
        } catch (error) {
            axiosErrorHandler(message, error);
        }
    }
} as Command;