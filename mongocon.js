var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database reached!");
  var dbo = db.db("PolloDB");
  db.close();
});

var insertQuote = function (vquote,vquoted,callback){
  MongoClient.connect(url, function(err, db){
    if (err) throw err;
    var dbo = db.db("PolloDB");
    var obquote = { quote : vquote, quoted : vquoted};
    dbo.collection("quotes").insertOne(obquote, function(err,res) {
      if (err) throw err;
      console.log("Quote inserted");
      console.log("+",err,"+");
      console.log("-",res.ops[0],"-");
      db.close();
      callback = res.ops[0];
    })
  })
}

var findQuote = function (vquoted,callback){
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("PolloDB");
    dbo.collection("quotes").find({quoted : vquoted}).toArray(function(err,res){
      if(err) throw err;
      db.close();
      console.log("Quote found");
      console.log("+",err,"+");
      console.log("-",res,"-");
      callback = res;

    })

  })
}
var findQuoteID = function (id,callback){
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("PolloDB");
    dbo.collection("quotes").findOne({_id : id} ,function(err,res){
      if(err) throw err;
      db.close();
      console.log("Quote found");
      console.log(err);
      console.log(res);
      callback = res;

    })

  })

}

var randomQuote = function (callback){
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("PolloDB");
    dbo.collection("quotes").aggregate({ $sample: {size: 1} }, function(err,obj){
      if(err) throw err;
      obj.toArray(function(err1,res){
        if(err1) throw err1;
        db.close();
        console.log("Random quote requested and found");
        console.log(err);
        console.log(res);
        console.log(obj);
        console.log(err1);
        callback= res[0];

      })

    })
  })
}
delQuote = function (id,callback){
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db("PolloDB");
    dbo.collection("quotes").deleteOne({ _id : id}, function(err,obj) {
      if (err) throw err;
      db.close();
      console.log("Quote deleted");
      callback = res;
    })
  })
}

insertQuote("pollo","PolloDB");
findQuote("PolloDB", function(founds){
  console.log("wtf");
  findQuoteID(founds[0]._id);
});

module.exports={

insertQuote : insertQuote,

findQuote : findQuote,

findQuoteID : findQuoteID,

randomQuote : randomQuote,

delQuote : delQuote
}
