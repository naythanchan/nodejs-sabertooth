const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Check your profile!")
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
    }

    const profileEmbed = new Discord.MessageEmbed()
      .setColor(config.embedColor)
      .setTitle(`${member.username}'s Profile`)
      .setDescription(
        `Tokens: \`${
          dat?.tokens ?? "0"
        }\` <:SaberToken:709095614922752051>\nEquipped: \`${
          dat?.equippedColor ?? "nothing"
        }\``
      );
    interaction.reply({ embeds: [profileEmbed] });
  },
  category: "economy",
};
