require('pkginfo')(module, 'version');
const Discord = require('discord.js');
const gitRev = require('git-rev-sync');

//Token + Config import-------------------------------------------------------------------------------------
const botToken = require("./bot-token.json");
const config = require("./config.json");

//Configurations -- DO NOT CHANGE -- make changes in ./config.json---------------------------------
const newMemberRoleAssignment = config.new_member_role_assignment;
const newMemberRole = config.new_member_role;
const imageReactions = config.image_reactions;
const imageReactionsChannel = config.image_reactions_channel;
const imageReactionUpvoteEmoji = config.image_reaction_upvote_emoji_id;
const imageReactionDownvoteEmoji = config.image_reaction_downvote_emoji_id;
const communism = config.communism_enabled;
const fascism = config.fascism_enabled;
const egg = config.egg_call_and_response_enabled;
const playingGameMessage = config.playing_game_message;

const rev = gitRev.short();
const client = new Discord.Client();


//Version------------------------------------------------------------------------------------------
client.on('message', msg => {
  if (msg.content === '!version') {
    msg.reply('Version: ' + module.exports.version + '\n' + rev);
  }
});


//Egg----------------------------------------------------------------------------------------------
client.on('message', msg => {
  if (msg.content === '!egg' && egg === true) {
    msg.reply(':egg:');
  }
});


//Communism----------------------------------------------------------------------------------------
client.on('message', msg => {
  if (msg.content === '!communism' && communism === true) {
    msg.channel.send('', {
            files: [
                "./communism.png"
            ]
        });
  }
});

//Fascism------------------------------------------------------------------------------------------
client.on('message', msg => {
  if (msg.content === '!fascism' && fascism === true) {
    msg.channel.send('', {
            files: [
                "./swastika.webp"
            ]
        }); 
  }
});

//Assign all new members who join the Proletariat role, and log that-------------------------------
client.on('guildMemberAdd', (guildMember) => {
    if(newMemberRoleAssignment === true) {
        guildMember.addRole(guildMember.guild.roles.find(role => role.name === newMemberRole))
           .catch(() => console.error("Failed to add role to new member."));
        console.log("Added Proletariat role to: " + guildMember.user.username());
    }
});


//Add the upvote/downvote reactions to all image messages in #shitty-reddit for voting-------------
client.on('message', msg=> {
    if (imageReactions === true) {
        if (msg.attachments.size > 0 && msg.channel.name === imageReactionsChannel) {
            msg.react(imageReactionUpvoteEmoji).then(() => msg.react(imageReactionDownvoteEmoji))
                .catch(() => console.error("Failed to react."));
        }
    }
});
//Help commands------------------------------------------------------------------------------------
client.on('message', msg => {
  if (msg.content === '!OtterHelp' || msg.content === "!otterhelp" || msg.content === "!otterHelp" || msg.content === "!Otterhelp") {
msg.channel.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "OtterBot Kelly --  Help",
    url: "",
    description: "A list of commands for OtterBot Kelly.",
    fields: [
      {
        name: "!egg",
        value: "Kelly will respond with :egg:."
      },
             {
        name: "!version",
        value: "Kelly will respond with their version number and git commit hash."
      },
      {
        name: "!communism",
        value: "Kelly will respond with a picture of a hammer and sickle."
      },
      {
        name: "!fascism",
        value: "Kelly will respond with a picture of a swastika."
      }
    ],
    timestamp: new Date(),
    footer: {
         icon_url: client.user.avatarURL,
      text: "Version: " + module.exports.version + ". Commit: " + rev
    }
  }
});
 }
});

//Log to the console when the bot is ready and set the bot's status and nickname-------------------
client.on('ready', () => {
    client.user.setActivity(playingGameMessage, {type: 'PLAYING'});
	console.log('ready!');
});

client.login(botToken.token);