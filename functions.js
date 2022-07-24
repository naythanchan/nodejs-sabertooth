const mongoUtil = require('./mongoUtil');
const config = require('./config');
module.exports={
    embed: function (channel, message, deleteTimer) { // `ping` is the name of the function, then function() is where you can pass arguments.
    channel.send({
      embeds: [{
        description: message,
        color: config.embedColor
      }]
    }).then(msg => {
      if (!isNaN(deleteTimer)) {
        msg.delete({ timeout: deleteTimer })
      }
    }
    )
  },
  embedInteraction: function (interaction, message) { // `ping` is the name of the function, then function() is where you can pass arguments.
    interaction.reply({
      embeds: [{
        description: message,
        color: config.embedColor
      }]
    })
  },
    levelSystem: async function (dat, config, levelCollection, message) {
        // console.log(Date.now())
        const cooldown = 30000
        if (dat === null) {
    
          const levelData = {
            "stats": {
              [message.author.id]: {
                xp: 0,
                totalxp: 0,
                level: 1,
                reqxp: 5,
                cooldown: Date.now()
              }
            }
          }
          await levelCollection.insertOne({ 'guildId': message.guild.id, 'level': levelData })
          console.log('added')
        }
        if (dat === null) {
          dat = await levelCollection.findOne({ 'guildId': message.guild.id })
        }
        if (dat.level.stats[message.author.id]) {
          var diff = Date.now() - dat.level.stats[message.author.id].cooldown
          if (diff > cooldown) {
            var setxp = "level.stats." + message.author.id + ".xp"
            var settotalxp = "level.stats." + message.author.id + ".totalxp"
            var setcooldown = "level.stats." + message.author.id + ".cooldown"
            var setreqxp = "level.stats." + message.author.id + ".reqxp"
            var setlevel = "level.stats." + message.author.id + ".level"
    
            var getxp = dat.level.stats[message.author.id].xp
            var getreqxp = dat.level.stats[message.author.id].reqxp
    
            getxp++;
            if (getxp == getreqxp) {
              getreqxp = dat.level.stats[message.author.id].level * 10
              //+dat.level.stats[message.author.id].level*10
              var getlevel = dat.level.stats[message.author.id].level
              getlevel++;
              await levelCollection.updateOne(
                { 'guildId': message.guild.id },
                { $inc: { [setlevel]: 1 } }
              )
              await levelCollection.updateOne(
                { 'guildId': message.guild.id },
                { $set: { [setreqxp]: getreqxp } }
              )
              getxp = 0;
              var db = mongoUtil.getDb();
              const collection = db.db(config.database).collection(config.collection.modConfig);
              var dat =await collection.findOne({"guildId":message.guild.id})
              var indx=Math.floor(Math.random() * module.exports.replies.length)
              if(dat === null  || (!dat.hasOwnProperty("levelNotificationChannel")) )
              message.channel.send(`${module.exports.replies[indx]}, <@${message.author.id}> you reached level ${getlevel}`)
              else {
                message.guild.channels.cache.get(dat.levelNotificationChannel).send(`${module.exports.replies[indx]}, <@${message.author.id}> you reached level ${getlevel}`)
              }
            }
    
            await levelCollection.updateOne(
              { 'guildId': message.guild.id },
              { $inc: { [settotalxp]: 1 } }
            )
            await levelCollection.updateOne(
              { 'guildId': message.guild.id },
              { $set: { [setxp]: getxp } }
            )
    
            await levelCollection.updateOne(
              { 'guildId': message.guild.id },
              { $set: { [setcooldown]: Date.now() } }
            )
    
            // setTimeout(async ()=>{
            //   await levelCollection.updateOne(
            //     {'guildId':message.guild.id},
            //     {$set:{[setcooldown]:false}}
            //   )
            //   console.log('cooldown over')
            // },1000)
          }
    
        }
        else {
          const lvlData = {
    
    
            xp: 1,
            totalxp: 1,
            level: 1,
            reqxp: 5,
            cooldown: Date.now()
    
    
          }
          var ss = "level.stats." + message.author.id
          await levelCollection.updateOne(
            { 'guildId': message.guild.id },
            { $set: { [ss]: lvlData } }
          )
          console.log('done')
        }
    
    
    
    
      },
      replies:["Get a life dude but congrats","Ugghh not you again","Dont you have anything else to do?","I am soo bored but"],
      partition:function(items, left, right,id){
        var pivot   = items[Math.floor((right + left) / 2)], //middle element
            i       = left, //left pointer
            j       = right; //right pointer
        while (i <= j) {
            while (items[i] > pivot) {
                i++;
            }
            while (items[j] < pivot) {
                j--;
            }
            if (i <= j) {
                module.exports.swap(items, i, j,id); //sawpping two elements
                i++;
                j--;
            }
        }
        return i;
      },
      quickSort:function(items, left, right,id){
        var index;
        if (items.length > 1) {
            index = module.exports.partition(items, left, right,id); //index returned from partition
            if (left < index - 1) { //more elements on the left side of the pivot
                module.exports.quickSort(items, left, index - 1,id);
            }
            if (index < right) { //more elements on the right side of the pivot
                module.exports.quickSort(items, index, right,id);
            }
        }
        return items;
      },
      swap:function(items, leftIndex, rightIndex,id){
        var temp = items[leftIndex];
        items[leftIndex] = items[rightIndex];
        items[rightIndex] = temp;
    
        temp=id[leftIndex];
        id[leftIndex] = id[rightIndex];
        id[rightIndex] = temp;
      }
    
    
}