// require('dotenv').config()
const Discord = require("discord.js")
const {Client, Collection, Intents} = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
// const fetch = require("node-fetch");
// const math = require("mathjs");
// const config = require("./config.json")

const r = "RANDOM";

var mongoUtil = require( './mongoUtil.js' );
client.slashCommands = new Discord.Collection();
const fs = require("fs");
mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
  // start the rest of your app here
} );

const readSlashCommands = (arrayDirs) => {
  arrayDirs.forEach(dir => {
      fs.readdir(`./slashCommands/${dir}/`, (err, files) => {

          if (err) return console.log(err);
          files.forEach(file => {
              if (!file.endsWith(".js")) return;
              let props = require(`./slashCommands/${dir}/${file}`);
              console.log("Successfully loaded " + props.data.name)
              client.slashCommands.set(props.data.name, props);
      
          });
      });
  });
}

const readNormalCommands = (arrayDirs) => {
  arrayDirs.forEach(dir => {
      fs.readdir(`./normalCommands/${dir}/`, (err, files) => {

          if (err) return console.log(err);
          files.forEach(file => {
              if (!file.endsWith(".js")) return;
              let props = require(`./normalCommands/${dir}/${file}`);
              console.log("Successfully loaded " + props.data.name)
              client.slashCommands.set(props.data.name, props);
      
          });
      });
  });
}


// fs.readdir('./events/', (err, files) => {
//     if (err) console.log(err);
//     files.forEach(file => {
//         let eventFunc = require(`./events/${file}`);
//         console.log("Successfully loaded " + file)
//         let eventName = file.split(".")[0];
//         bot.on(eventName, (...args) => eventFunc.run(bot, ...args));
//     });
// });

// readSlashCommands(['gambling','settings', 'shop', ''])
// readNormalCommands(['misc',''])
readSlashCommands(['settings', 'economy'])

client.on('interactionCreate', async interaction => {
    
  if (!interaction.isCommand()) return;
  
  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;
  try {
          command.execute(client,interaction);
  } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});


client.on("ready", () => {
  client.user.setPresence({
    status: "online",
    activity: {
      name: `sbr help`,
      type: "PLAYING"
    }
  });
  console.log("Bot was logged in"); // Output a message to the logs.
});

client.login(process.env.BOT_TOKEN);