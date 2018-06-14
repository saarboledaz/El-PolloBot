var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database reached!");
  let dbo = db.db("PolloDB");
  db.close();
});

var insertQuote = function (vquote,vquoted,callback){
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    let dbo = db.db("PolloDB");
    let obquote = { quote : vquote, quoted : vquoted};
    dbo.collection("quotes").insertOne(obquote, (err,res) =>  {
      if (err) throw err;
      callback(res.ops[0]);
    })
    db.close();
  })
}

var findQuote = function (vquoted,callback){
  MongoClient.connect(url,(err,db) =>{
    if(err) throw err;
    let dbo = db.db("PolloDB");
    dbo.collection("quotes").find({quoted : vquoted}).toArray( (err,res) => {
      if(err) throw err;
      callback(res);

    })
    db.close();
  })
}
var findQuoteID = function (id,callback){
  MongoClient.connect(url,(err,db) =>{
    if(err) throw err;
    let dbo = db.db("PolloDB");
    dbo.collection("quotes").findOne({_id : id} ,(err,res)=>{
      if(err) throw err;
      callback(res);

    })
    db.close();
  })
}

var randomQuote = function (callback){
  MongoClient.connect(url,(err,db) =>{
    if(err) throw err;
    let dbo = db.db("PolloDB");
    dbo.collection("quotes").aggregate({ $sample: {size: 1} },(err,obj) =>{
      if(err) throw err;
      obj.toArray(function(err1,res){
        if(err1) throw err1;
        callback(res[0]);

      })
      db.close();

    })
  })
}
delQuote = function (id,callback){
  MongoClient.connect(url, (err,db)=>{
    if(err) throw err;
    let dbo = db.db("PolloDB");
    dbo.collection("quotes").deleteOne({ _id : id}, (err,obj)=> {
      if (err) throw err;
      callback(res);
    })
    db.close();
  })
}
/* Testing
var myQuote;
insertQuote("pollo","PolloDB", function (insertedQuote){
  myQuote = insertedQuote;
});
console.log(myQuote);

findQuote("PolloDB", function(founds){
  console.log(founds);
  findQuoteID(founds[0]._id,function(object){
    console.log(object);
  });
});
*/

module.exports={

insertQuote : insertQuote,

findQuote : findQuote,

findQuoteID : findQuoteID,

randomQuote : randomQuote,

delQuote : delQuote
}
