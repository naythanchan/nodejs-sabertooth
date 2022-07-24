//Import Statements
const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");
const shop = require("./shop.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Give a user an item!")
    .addStringOption((option) =>
      option
        .setName("give")
        .setDescription("Give someone an item, use spaces between words!")
        .setRequired(true)
    )
    .addMentionableOption((option) =>
      option
        .setName("mention")
        .setDescription("Mention someone")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (interaction.user.id != config.ownerID) {
      return func.embedInteraction(
        interaction,
        `You don't have permissions to run this command!`
      );
    }

    //Options Storage
    const member =
      interaction.options.getMentionable("mention") || interaction.user;
    const colorChoice = interaction.options
      .getString("give")
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .join("-");

    //Get Database
    var db = mongoUtil.getDb();
    const economyCollection = db
      .db(config.database)
      .collection(config.collection.economy);

    //Find a document within the collection that matched the member id
    var dat = await economyCollection.findOne({ userID: member.id });

    //Check if there is a document for that user
    if (typeof shop[colorChoice] === "undefined") {
      return func.embedInteraction(
        interaction,
        `**${colorChoice}** is not a valid color`
      );
      //Check if user data exists
    } else if (dat === null) {
      await economyCollection.insertOne({
        userID: member.id,
        tokens: 0,
        colors: [],
        equippedColor: "nothing",
      });
      await economyCollection.updateOne(
        { userID: member.id },
        { $addToSet: { colors: colorChoice } }
      );
      return func.embedInteraction(
        interaction,
        `Gave **${shop[colorChoice].name}** to ${member.user.username}`
      );
    } else {
      await economyCollection.updateOne(
        { userID: member.id },
        { $addToSet: { colors: colorChoice } }
      );
      return func.embedInteraction(
        interaction,
        `Gave **${shop[colorChoice].name}** to ${member.user.username}`
      );
    }
  },
  category: "economy",
};
