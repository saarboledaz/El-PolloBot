
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var mondongo = require('./mongocon.js');
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
                  var response = new Object();
                  mondongo.insertQuote(args[1],args[2],function(tempRes){
                    response = tempRes;
                  });
                  if (response != null){
                    bot.sendMessage({
                      to:channelID,
                      message:"Se agregó la cita de forma satisfactoria con id: ".concat(response._id)
                    })
                  } else {
                    bot.sendMessage({
                      to:channelID,
                      message:"Ocurrió un error :("
                    })
                  }

                }
            break;
            case 'quote':
                if (args.length==1){
                  var response = new Object();
                  mondongo.randomQuote(function(tempRes){
                    response = tempRes;
                  });
                  bot.sendMessage({
                    to:channelID,
                    message:"ID cita: ".concat(response._id,", ' ",response.quote,"por '",response.quoted,"'")
                  })


                }else if (args.length == 2) {
                  var response = new Object();
                  mondongo.findQuoteID(args[1], function(tempRes){
                    response = tempRes;
                  });
                  if(response != null){
                    bot.sendMessage({
                      to:channelID,
                      message:"ID cita: ".concat(response._id,", ' ",response.quote,"por '",response.quoted,"'")
                    })
                  }


                }
            break;
          }



     }

});
