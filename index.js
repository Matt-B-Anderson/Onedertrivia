var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./token.json');
var questions = require('./questions.json');
const { stream } = require('winston');
let question;
const usersRight = [];
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
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
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            // !ping
            case 'start':
                bot.sendMessage({
                    to: channelID,
                    message: 'Welcome to OnederTrivia, the place where everyone wins, well actually there does have to be some losers, but hopefully you are not one of them!'
                });
                break;
            case 'rules':
                bot.sendMessage({
                    to: channelID,
                    message: 'The rules are very simple. If you get a question right, then you get points. Points will be awarded in the next stream, so don\'t forget to be present in the next stream! Questions will be worth 15k points and the first 5 right people will get the points. There will be 3 questions and they will come out 5 minutes from each other 20 minutes before stream. Good luck and have fun! P.S. don\'t be a jerk and use your current knowledge aka don\'t use google, thanks!'
                });
                break;
            case 'question':
                if (user !== 'Onederbread') return;
                usersRight = [];
                const index = Math.floor(Math.random() * questions.length);
                question = questions[index]
                bot.sendMessage({
                    to: channelID,
                    message: `${question.trivia}`
                });
                break;
            case 'answer':
                message = message.toLocaleLowerCase();
                const right = message.includes(question.answer);
                if (right) {
                    if (usersRight.length < 5) usersRight.push(user);
                }
                break;
            case 'highscore':
                bot.sendMessage({
                    to: channelID,
                    message: usersRight.toString()
                });
                break;
        }
    }
});

