import * as Discord from "discord.js";
import * as qs from "querystring";
import { DateTime } from "luxon";
import axios, { AxiosResponse } from "axios";
import { Command, Link } from "../../typings/types";

interface UD_Response {
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

}

interface Response extends AxiosResponse {
    data: { list: Array<UD_Response> } 
}

const command: Command = {
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
            const link: Link = new URL("https://api.urbandictionary.com/v0/define");
            link.search = qs.stringify({term: args.join(" ")});
            link.options = {
                headers: {"Accept": "application/json"},
            };
            
            const { data }: Response = await axios.get(link.href, link.options);
            if (!data.list.length) return message.channel.send("No Results Found!");

            const ud_res = data.list[0];
            const charChecker = (str: string, max: number = 2048): string => str.length > max ? `${str.slice(0, max - 3)}...` : str;
            const date = DateTime.fromISO(ud_res.written_on).toLocaleString({month: "short", day: "numeric", year: "numeric"});
            
            // Replaces [ud links] with actual links
            const ud_links = /\[(\w| |\d){0,}\]/gi
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
        } catch (error) {
            if (error.response) {
                console.error(error);
                console.error(error.response);
                message.channel.send(`There was an error!\n\`${error.response.status} || ${error.response.statusText}`);
            } else {
                console.error(error);
                message.channel.send(`There was an error!\n\`${error}\``)
            }
        }
    }
};

module.exports = command;