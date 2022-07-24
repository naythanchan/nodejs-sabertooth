//Import Statements
const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");
const shop = require("./shop.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("take")
    .setDescription("Take an item from a user")
    .addStringOption((option) =>
      option
        .setName("take")
        .setDescription("Take an item from someone, use spaces between words")
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
      .getString("take")
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
      return func.embedInteraction(
        interaction,
        `${member.user.username} has nothing to take!`
      );
    } else {
      //Check whether they own the color
      for (let i = 0; i < dat.colors.length; i++) {
        if (dat.colors[i] == colorChoice) {
          //If they have the color equipped, remove it
          if (dat.equippedColor == colorChoice) {
            await interaction.member.roles.remove(
              shop[dat.equippedColor].roleId
            );
            await economyCollection.updateOne(
              { userID: member.id },
              { $set: { equippedColor: "nothing" } }
            );
          }

          //Remove the item
          await economyCollection.updateOne(
            { userID: member.id },
            { $pull: { colors: colorChoice } }
          );

          return func.embedInteraction(
            interaction,
            `Took **${shop[colorChoice].name}** from ${member.user.username}`
          );
        }
      }
      return func.embedInteraction(
        interaction,
        `${member.user.username} does not own **${shop[colorChoice].name}**. There is nothing to take.`
      );
    }
  },
  category: "economy",
};
