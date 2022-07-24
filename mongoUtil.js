const MongoClient = require('mongodb').MongoClient;
var _db;
module.exports = {
  connectToServer: async function(){
    const uri = process.env.MONGO_URI
    try {
      _db = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (error) {
      console.log(error);
    }
  },

  getDb:function(){
    return _db;
  }
}
