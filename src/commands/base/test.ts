import * as Discord from "discord.js";
import { Sequelize, Model, DataTypes } from "sequelize";
import { Command } from "../../typings/types";

const sql = new Sequelize("mysql://root:password@localhost:3306/newtest", {
    
});

class Test extends Model {}
Test.init({
    // dog: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     primaryKey: true
    // },

    // name: DataTypes.STRING

}, {sequelize: sql, modelName: "Test"});

export default {
    name: "test",
    aliases: ["t"],
    description: "Test",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message, args) {
        try {
            await sql.authenticate();
            console.log("establisjed");
        } catch (err) {
            console.error(err);
        }
    }
} as Command;