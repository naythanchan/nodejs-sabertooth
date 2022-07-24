//Import Statements
const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");
const shop = require("./shop.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-tokens")
    .setDescription("Remove tokens from a user")
    .addIntegerOption((option) =>
      option
        .setName("remove-tokens")
        .setDescription("Remove tokens from someone!")
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
    console.log(interaction.user.id);
    //Options Storage
    const member =
      interaction.options.getMentionable("mention") || interaction.user;
    const amount = interaction.options.getInteger("remove-tokens");

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
      return func.embedInteraction(
        interaction,
        `${member.user.username} doesn't have any tokens to remove`
      );
      //Check if tokens are 0
    } else if (dat.tokens == 0) {
      return func.embedInteraction(
        interaction,
        `${member.user.username} doesn't have any tokens to remove`
      );
    } else {
      //Check if the amoutn to be removed is more than the amount they currently have
      if (amount > dat.tokens) {
        await economyCollection.updateOne(
          { userID: member.id },
          { $inc: { tokens: -dat.tokens } }
        );
        return func.embedInteraction(
          interaction,
          `Removed \`${dat.tokens}\` <:SaberToken:709095614922752051> from ${member.user.username}`
        );
      } else {
        await economyCollection.updateOne(
          { userID: member.id },
          { $inc: { tokens: -Math.abs(amount) } }
        );
        return func.embedInteraction(
          interaction,
          `Removed \`${amount}\` <:SaberToken:709095614922752051> from ${member.user.username}`
        );
      }
    }
  },
  category: "economy",
};
