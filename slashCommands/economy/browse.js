//Import Statements
const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");
const shop = require("./shop.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("browse")
    .setDescription("Browse through a color!")
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription(
          "Enter the color you want to equip, use spaces between words!"
        )
        .setRequired(true)
    ),
  async execute(client, interaction) {
    //Options Storage
    const colorChoice = interaction.options
      .getString("color")
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .join("-");

    //Check if user input is a valid color in our shop
    if (typeof shop[colorChoice] === "undefined") {
      return func.embedInteraction(
        interaction,
        `**${colorChoice}** is not a valid color`
      );
      //Check if user data exists
    } else {
      const browseEmbed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`${shop[colorChoice].name}`)
        .setDescription(
          `**Display**: <@&${shop[colorChoice].roleId}>\n\n**Price**: \`${shop[colorChoice].price}\` <:SaberToken:709095614922752051>\n\n**Item Type**: \`${shop[colorChoice].type}\`\n\n**Rarity**: \`${shop[colorChoice].rarity}\`\n\n**Limited**: \`${shop[colorChoice].limited}\``
        );
      return interaction.reply({ embeds: [browseEmbed] });
    }
  },
  category: "economy",
};
