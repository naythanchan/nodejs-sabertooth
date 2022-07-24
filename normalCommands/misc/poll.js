const Discord = require('discord.js');
const config = require('../../config.json');
exports.run = async(client,message,args)=>{
	message.delete().catch(O_o=>{});
	console.table(args)
	var test = args.split(" \"")
	var reactns=['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟']
	const pollMessage = test[0].substring(1,test[0].length-1)
	const pollEmbed = new Discord.MessageEmbed()
				.setColor(config.embedColor)
  if(test.length>10)
	return message.channel.send('I am sorry but i have a limit of 10 options')
  if(test.length<=1)
	{
		pollEmbed.setDescription('👍 Yes\n\n 👎 No\n\n 🤷‍♂️ Idk')
		return message.channel.send(`:bar_chart: **${pollMessage}**`,pollEmbed).then(function(message){
      message.react('👍')
			message.react('👎')
			message.react('🤷‍♂️')
      // message.react(client.emojis.find(emoji => emoji.name === ":-1:"));
    }).catch(c=>console.log(c));
	}

	 var desc=''
	 for(let i=1;i<test.length;i++){
		 desc+=reactns[i]+test[i].substring(0,test[i].length-1)+"\n\n"
		 console.log(test[i].substring(0,test[i].length-1))
	 }

		pollEmbed.setDescription(desc)
    message.channel.send(`:bar_chart: **${pollMessage}**`,pollEmbed).then(function(message){
      for(let i=1;i<test.length;i++){
				message.react(reactns[i])
			}
      // message.react(client.emojis.find(emoji => emoji.name === ":-1:"));
    }).catch(c=>console.log(c));
}
exports.help = {
  name : "poll",
  description: "Makes a poll with default reactions",
  aliases: ["vote"],
  usage: process.env.PREFIX+"poll/alias \"<message>\" \"option1\" \"option2\" and so on\nIf you have a yes/no question do not supply options",
  permissions:false,
	category:'info'
};