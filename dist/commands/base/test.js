"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sql = new sequelize_1.Sequelize("mysql://root:password@localhost:3306/newtest", {});
class Test extends sequelize_1.Model {
}
Test.init({}, { sequelize: sql, modelName: "Test" });
exports.default = {
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
        }
        catch (err) {
            console.error(err);
        }
    }
};
