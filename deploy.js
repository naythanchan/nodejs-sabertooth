const fs = require('fs');
// require('dotenv').config()
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
// const { clientId, guildId, token } = require('./config.json');

const commands = [];
// const commandFilesDirs = ['','gambling','settings','shop']
const commandFilesDirs = ['settings', 'economy']


const deploySlashCommands = (arrayDir) => {
    arrayDir.forEach(dir=>{
        const commandFiles = fs.readdirSync(`./slashCommands/${dir}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./slashCommands/${dir}/${file}`);
            commands.push(command.data.toJSON());
        }
    })
}

deploySlashCommands(commandFilesDirs);


const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
//708353162347675749
// rest.put(Routes.applicationCommands('708353162347675749'), { body: commands })
//     .then(() => console.log('Successfully registered application commands.'))
//     .catch(console.error);
rest.put(Routes.applicationGuildCommands('647933480327577610', '593570237249617920'), { body: commands })
.then(() => console.log('Successfully registered application commands.'))
.catch(console.error);