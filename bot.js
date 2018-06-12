var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pollobotquotes"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Conectado!");
  bot.sendMessage({
    to: 335215459454418944,
    message: 'Conectado!'
  })
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(';');
        var cmd = args[0];




        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'addquote':
                if (args.length != 3) {
                  bot.sendMessage({
                    to: channelID,
                    message: 'El uso es !addquote;<cita>;<citado>'
                  })
                }else{
                  con.query('INSERT INTO quotes SET ?', {quote: args[1],quoted: args[2]}, function(err, rows, fields) {
                    if (!err){
                      console.log('Se añadio la cita de forma satisfactoria', fields);
                      bot.sendMessage({
                        to:channelID,
                        message: 'Se añadió la cita de forma satisfactoria, id: '.concat(rows.insertId)
                      })
                    }
                    else{
                      console.log('Error while performing Query.');
                    }
                  });

                }
            case 'quote':
            if (args.length==1){
              con.query('SELECT max(ID) as maxID FROM quotes', function(err, rows, fields){
                if(!err){
                  console.log(rows[0].maxID);
                  var maxID = parseInt(rows[0].maxID);
                  var rnum = Math.floor((Math.random()* maxID) + 1);
                  con.query('SELECT quote,quoted FROM quotes WHERE ID= ?', [String(rnum)], function(err2,rows2,fields2){
                    if (!err){
                      console.log(rows2[0].quote);
                      bot.sendMessage({
                        to:channelID,
                        message: "'".concat(rows2[0].quote,"' ","por '",rows2[0].quoted,"'")
                      })
                    }else{
                      console.log("Error obteniendo la cita aleatoria");
                    }
                  })
                }else{
                  console.log("Error obteniendo el id maximo");
                }
              }
            )}
            else if (args.length == 2) {
              con.query('SELECT quote,quoted FROM quotes WHERE ID= ?', [args[1]],function(err,rows,fields){
                if (!err){
                  console.log(rows[0].quote);
                  bot.sendMessage({
                    to:channelID,
                    message: "'".concat(rows[0].quote,"' ","por '",rows[0].quoted,"'")
                  })
                }else {
                  console.log("Error con la cita indicada");
                }
              })


            }


         }
     }

});
