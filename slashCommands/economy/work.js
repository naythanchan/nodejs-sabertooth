//Import Statements
const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");
const shop = require("./shop.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work on the hourly!"),
  async execute(client, interaction) {
    //Get Database
    var db = mongoUtil.getDb();
    const economyCollection = db
      .db(config.database)
      .collection(config.collection.economy);

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

    if (dat.workCooldown == null) {
      await economyCollection.updateOne(
        { userID: interaction.user.id },
        { $set: { workCooldown: Date.now() } }
      );
      await economyCollection.updateOne(
        { userID: interaction.user.id },
        { $inc: { tokens: 100 } }
      );
      return func.embedInteraction(
        interaction,
        `You earned 100 <:SaberToken:709095614922752051> for your hard work`
      );
    } else if (Math.floor((Date.now() - dat.workCooldown) / 1000 / 60) < 60) {
      return func.embedInteraction(
        interaction,
        `Cooldown! Please wait ${
          60 - Math.floor((Date.now() - dat.workCooldown) / 1000 / 60)
        } minute(s) to work again`
      );
    } else {
      await economyCollection.updateOne(
        { userID: interaction.user.id },
        { $set: { workCooldown: Date.now() } }
      );
      await economyCollection.updateOne(
        { userID: interaction.user.id },
        { $inc: { tokens: 100 } }
      );
      return func.embedInteraction(
        interaction,
        `You earned 100 <:SaberToken:709095614922752051> for your hard work`
      );
    }
  },
  category: "economy",
};
