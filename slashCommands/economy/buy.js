//Import Statements
const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");
const shop = require("./shop.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy a color!")
    .addStringOption((option) =>
      option
        .setName("buy")
        .setDescription("Buy a color, use spaces between words!")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    //Options Storage
    const member =
      interaction.options.getMentionable(config.userStringOption)?.user ||
      interaction.user;
    const colorChoice = interaction.options
      .getString("buy")
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

    //Check if user input is a valid color in our shop
    if (typeof shop[colorChoice] === "undefined" && colorChoice != "sword") {
      return func.embedInteraction(
        interaction,
        `**${colorChoice}** is not a valid item`
      );
      //Check if user data exists
    } else if (colorChoice == "sword") {
      if (dat === null) {
        await economyCollection.insertOne({
          userID: interaction.user.id,
          tokens: 0,
          colors: [],
          equippedColor: "nothing",
          workCooldown: null,
        });
        return func.embedInteraction(
          interaction,
          `You don't have enough tokens to purchase a sword! It costs 100 <:SaberToken:709095614922752051>`
        );
      } else if (dat.tokens < 50) {
        return func.embedInteraction(
          interaction,
          `You don't have enough tokens to purchase a sword! It costs 100 <:SaberToken:709095614922752051>`
        );
      } else if (dat.sword == null) {
        await economyCollection.updateOne(
          { userID: member.id },
          { $set: { sword: "yes" } }
        );
        await economyCollection.updateOne(
          { userID: member.id },
          { $inc: { tokens: -50 } }
        );
        return func.embedInteraction(interaction, `Sword purchased!`);
      } else if (dat.sword == "yes") {
        return func.embedInteraction(interaction, `You already own a sword!`);
      } else {
        await economyCollection.updateOne(
          { userID: member.id },
          { $set: { sword: "yes" } }
        );
        await economyCollection.updateOne(
          { userID: member.id },
          { $inc: { tokens: -50 } }
        );
        return func.embedInteraction(interaction, `Sword purchased!`);
      }
    } else if (shop[colorChoice].limited == true) {
      return func.embedInteraction(
        interaction,
        `**${shop[colorChoice].name}** is not available for purchase`
      );
    } else if (dat === null) {
      await economyCollection.insertOne({
        userID: member.id,
        tokens: 0,
        colors: [],
        equippedColor: "nothing",
      });
      return func.embedInteraction(
        interaction,
        `You don't have enough tokens to purchase **${shop[colorChoice].name}** for \`${shop[colorChoice].price}\` <:SaberToken:709095614922752051>`
      );
    } else {
      //Check whether they own the color
      for (let i = 0; i < dat.colors.length; i++) {
        if (dat.colors[i] == colorChoice) {
          return func.embedInteraction(
            interaction,
            `You already own ${shop[colorChoice].name}`
          );
        }
      }
      if (dat.tokens < shop[colorChoice].price) {
        return func.embedInteraction(
          interaction,
          `You don't have enough tokens to purchase **${shop[colorChoice].name}** for \`${shop[colorChoice].price}\` <:SaberToken:709095614922752051>`
        );
      } else {
        await economyCollection.updateOne(
          { userID: member.id },
          { $addToSet: { colors: colorChoice } }
        );
        await economyCollection.updateOne(
          { userID: member.id },
          { $inc: { tokens: -shop[colorChoice].price } }
        );
        return func.embedInteraction(
          interaction,
          `${shop[colorChoice].name} purchased!`
        );
      }
    }
  },
  category: "economy",
};
