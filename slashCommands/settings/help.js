const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Description of how the economy works"),
  async execute(client, interaction) {
    const helpEmbed = new Discord.MessageEmbed()
      .setColor(config.embedColor)
      .setTitle(`Saber Shop - Help`)
      .setDescription(
        `Check <#710683316847771700> for a more comprehensive overview\n\nThe Saber Shop contains colors you can purchase using Saber Tokens <:SaberToken:709095614922752051>. To get these tokens, you can gamble or work. Once you have enough tokens, you can purchase colors!\n\nCommands:\nprofile - view your stats\nbrowse [color] - allows you to see the details of a specific color\nbuy [item] - buy a color or sword using tokens\nequip - gives you the color role\nunequip - removes your color role\ninventory - check which colors you own\nleaderboard - displays the top 10 richest users\nwork - every hour you can earn a salary\nfight [bet] - gamble your tokens (you need to purchase a sword to be able to fight)\nbeg - try to gain a small amount of tokens\n\nOwner-Only Commands:\nadd-tokens [amount] - gives a member tokens\nremove-tokens [amount] - takes away a user's tokens\ngive [item] - give a user an item\ntake [item] - take a user's item`
      );
    interaction.reply({ embeds: [helpEmbed] });
  },
  category: "settings",
};
