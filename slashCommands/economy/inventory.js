const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");
const shop = require("./shop.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Check your inventory!")
    .addMentionableOption((option) =>
      option.setName(config.userStringOption).setDescription("Mention someone")
    ),
  async execute(client, interaction) {
    const member =
      interaction.options.getMentionable(config.userStringOption)?.user ||
      interaction.user;
    var db = mongoUtil.getDb();
    const economyCollection = db
      .db(config.database)
      .collection(config.collection.economy);

    var dat = await economyCollection.findOne({ userID: member.id });

    if (dat === null) {
      await economyCollection.insertOne({
        userID: member.id,
        tokens: 0,
        colors: [],
        equippedColor: "nothing",
      });
      const inventoryEmbed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`${member.username}'s Inventory`)
        .setDescription(`Looks like it's empty...`);
      return interaction.reply({ embeds: [inventoryEmbed] });
    } else if (dat.colors.length == 0) {
      const inventoryEmbed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`${member.username}'s Inventory`)
        .setDescription(`Looks like it's empty...`);
      return interaction.reply({ embeds: [inventoryEmbed] });
    } else {
      let colorList = "";
      for (i of dat.colors) {
        colorList = colorList + "\n" + `<@&${shop[i].roleId}>`;
      }
      const inventoryEmbed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`${member.username}'s Inventory`)
        .setDescription(`${colorList}`);
      return interaction.reply({ embeds: [inventoryEmbed] });
    }
  },
  category: "economy",
};
