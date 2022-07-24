//Import Statements
const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");
const shop = require("./shop.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-tokens")
    .setDescription("Give a user tokens!")
    .addIntegerOption((option) =>
      option
        .setName("add-tokens")
        .setDescription("Give tokens to someone!")
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
    const amount = interaction.options.getInteger("add-tokens");

    //Get Database
    var db = mongoUtil.getDb();
    const economyCollection = db
      .db(config.database)
      .collection(config.collection.economy);

    //Find a document within the collection that matched the member id
    var dat = await economyCollection.findOne({ userID: member.id });

    //Check if there is a document for that user
    if (dat === null) {
      await economyCollection.insertOne({
        userID: member.id,
        tokens: 0,
        colors: [],
        equippedColor: "nothing",
      });
      await economyCollection.updateOne(
        { userID: member.id },
        { $inc: { tokens: Math.abs(amount) } }
      );
      return func.embedInteraction(
        interaction,
        `Added \`${amount}\` <:SaberToken:709095614922752051> to ${member.user.username}`
      );
    } else {
      await economyCollection.updateOne(
        { userID: member.id },
        { $inc: { tokens: Math.abs(amount) } }
      );
      return func.embedInteraction(
        interaction,
        `Added \`${amount}\` <:SaberToken:709095614922752051> to ${member.user.username}`
      );
    }
  },
  category: "economy",
};
