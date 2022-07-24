//Import Statements
const { SlashCommandBuilder } = require("@discordjs/builders");
var mongoUtil = require("../../mongoUtil");
const config = require("../../config.json");
const func = require("../../functions");
const Discord = require("discord.js");
const shop = require("./shop.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("equip")
    .setDescription("Equips a color you own!")
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription(
          "Enter the color you want to equip, use spaces between words!"
        )
        .setRequired(true)
    ),
  async execute(client, interaction) {
    //Options Storage
    const member =
      interaction.options.getMentionable(config.userStringOption)?.user ||
      interaction.user;
    const colorChoice = interaction.options
      .getString("color")
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
    if (typeof shop[colorChoice] === "undefined") {
      return func.embedInteraction(
        interaction,
        `${colorChoice} is not a valid color`
      );
      //Check if user data exists
    } else if (dat === null) {
      await economyCollection.insertOne({
        userID: member.id,
        tokens: 0,
        colors: [],
        equippedColor: "nothing",
      });
      return func.embedInteraction(interaction, "You don't own any colors!");
    } else {
      //Check whether they own the color
      for (let i = 0; i < dat.colors.length; i++) {
        if (dat.colors[i] == colorChoice) {
          //Check if previous equippedColor is nothing, if not remove the role
          if (dat.equippedColor != "nothing") {
            await interaction.member.roles.remove(
              shop[dat.equippedColor].roleId
            );
          }
          //Equip the color and give the role
          await interaction.member.roles.add(shop[colorChoice].roleId);

          await economyCollection.updateOne(
            { userID: member.id },
            { $set: { equippedColor: colorChoice } }
          );

          return func.embedInteraction(
            interaction,
            `Equipped ${shop[colorChoice].name}`
          );
        }
      }
      return func.embedInteraction(
        interaction,
        `You don't own ${shop[colorChoice].name}`
      );
    }
  },
  category: "economy",
};
