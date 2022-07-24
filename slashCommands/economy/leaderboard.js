const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Display the top 10 richest members!"),
  async execute(client, interaction) {
    var db = mongoUtil.getDb();
    const economyCollection = db
      .db(config.database)
      .collection(config.collection.economy);

    const items = [];
    const id = [];
    await economyCollection
      .find()
      .limit(10)
      .sort({ tokens: -1 })
      .forEach(function (e) {
        items.push(e.tokens);
        id.push(e.userID);
      });

    var msg = "";
    var counter = 1;
    for (let i in items) {
      if (counter == 11) {
        break;
      }
      var member = await client.users.fetch(id[i]).catch(async (c) => {});
      if (member !== undefined) {
        var name = member.nickname || member.username;
        msg +=
          "`#" +
          counter +
          "`" +
          " | " +
          " **" +
          name +
          "** (" +
          items[i] +
          " <:SaberToken:709095614922752051>)\n";
        counter++;
      }
    }

    console.log(msg + "end");

    const embed = new Discord.MessageEmbed()
      .setColor(config.embedColor)
      .setDescription(msg);

    interaction.reply({ content: "Leaderboard", embeds: [embed] });
  },
  category: "economy",
};
