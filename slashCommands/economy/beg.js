//Import Statements
const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");
const shop = require("./shop.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Beg for some spare tokens!"),
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

    let rand = Math.random() * 100;
    rand = Math.floor(rand) + 1;

    let amount = Math.random() * 4;
    amount = Math.floor(amount) + 1;

    if(rand <= config.begOdds){
        await economyCollection.updateOne(
            { userID: interaction.user.id },
            { $inc: { tokens: amount } }
          );
          return func.embedInteraction(
            interaction,
            `Someone gave you ${amount}!`
          );
    } else {
        return func.embedInteraction(
            interaction,
            `Sorry! No one was kind enough to give you their spare tokens...`
          );      
    }
  },
  category: "economy",
};
