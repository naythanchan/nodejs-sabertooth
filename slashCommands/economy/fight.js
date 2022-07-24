//Import Statements
const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");
const shop = require("./shop.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fight")
    .setDescription("Win money by fighting!")
    .addIntegerOption((option) =>
      option
        .setName("bet")
        .setDescription("Enter bet amount!")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    //Get Database
    var db = mongoUtil.getDb();
    const economyCollection = db
      .db(config.database)
      .collection(config.collection.economy);

    const amount = interaction.options.getInteger("bet");

    //Find a document within the collection that matched the member id
    var dat = await economyCollection.findOne({ userID: interaction.user.id });

    if (dat === null) {
      await economyCollection.insertOne({
        userID: interaction.user.id,
        tokens: 0,
        colors: [],
        equippedColor: "nothing",
        workCooldown: null,
      });
    }

    if (dat.tokens < amount) {
      return func.embedInteraction(
        interaction,
        `You don't have enough tokens to bet ${amount} <:SaberToken:709095614922752051>! Please bet something lower instead`
      );
    } else if (amount < 50) {
      return func.embedInteraction(
        interaction,
        `Please bet at least 50 <:SaberToken:709095614922752051>`
      );
    }

    if (dat.sword == null) {
      return func.embedInteraction(
        interaction,
        `You don't have a sword to fight! Please buy a sword using the buy command`
      );
    } else if (dat.sword == "no") {
      return func.embedInteraction(
        interaction,
        `You don't have a sword to fight! Please buy a sword using the buy command`
      );
    } else {
      let rand = Math.random() * 100;
      rand = Math.floor(rand) + 1;

      if (rand <= config.fightOdds) {
        await economyCollection.updateOne(
          { userID: interaction.user.id },
          { $inc: { tokens: amount } }
        );
        return func.embedInteraction(
          interaction,
          `Because you won the fight, you were awarded ${amount} <:SaberToken:709095614922752051>!`
        );
      } else {
        await economyCollection.updateOne(
          { userID: interaction.user.id },
          { $inc: { tokens: -amount } }
        );
        await economyCollection.updateOne(
          { userID: interaction.user.id },
          { $set: { sword: "no" } }
        );
        return func.embedInteraction(
          interaction,
          `Because you lost the fight, you lost ${amount} <:SaberToken:709095614922752051> and your sword!`
        );
      }
    }
  },
  category: "economy",
};
