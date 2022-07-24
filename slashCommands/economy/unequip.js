//Import Statements
const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");
const shop = require("./shop.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unequip")
    .setDescription("Unequips the color you have equipped!"),
  async execute(client, interaction) {
    //Options Storage
    const member =
      interaction.options.getMentionable(config.userStringOption)?.user ||
      interaction.user;

    //Get Database
    var db = mongoUtil.getDb();
    const economyCollection = db
      .db(config.database)
      .collection(config.collection.economy);

    //Find a document within the collection that matched the member id
    var dat = await economyCollection.findOne({ userID: member.id });

    if (dat === null) {
      await economyCollection.insertOne({
        userID: member.id,
        tokens: 0,
        colors: [],
        equippedColor: "nothing",
      });
      return func.embedInteraction(
        interaction,
        "You don't have anything equipped!"
      );
    } else {
      if (dat.equippedColor == "nothing") {
        return func.embedInteraction(
          interaction,
          "You don't have anything equipped!"
        );
      } else {
        const equippedColor = dat.equippedColor;
        await interaction.member.roles.remove(shop[equippedColor].roleId);
        await economyCollection.updateOne(
          { userID: member.id },
          { $set: { equippedColor: "nothing" } }
        );
        return func.embedInteraction(
          interaction,
          `${shop[equippedColor].name} unequipped!`
        );
      }
    }
  },
  category: "economy",
};
