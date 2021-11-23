const Discord = require('discord.js');
const {Intents} = require("discord.js");
const _ = require("lodash");

const client = new Discord.Client({ intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES
	]
});

const prefix = '--';

client.once('ready', () => {
	console.log('TeamSplitterBOT is ready!');
})

function getName(member) {
	const nickName = member.nickname;
	const userName = member.user.username;

	if (nickName === null) {
		return userName;
	}

	return nickName;
};

// let usersNick = [];
function getNames(members) {
	let names = [];

	for (let [memberId, member] of members) {
		names.push(getName(member));
	}

	return names;
}

messageCreateFunction = function(message) {
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}

	const member = message.member;
	const memberId = member.id;

	const channel = member.voice.channel;
	const name = getName(member);

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	switch (command) {
		case 'help':
			message.channel.send('Available commands: ping, keyboard, 5v5');
			break;
		case'ping':
			message.channel.send('pong!');
			break;
		case'keyboard':
			message.channel.send('Logitech something is my keyboard, yes!');
			break;
		case '5v5':
			console.log('channel: '+channel);
			console.log('name: '+name);

			if (channel === null) {
				message.channel.send(`${member.user}`+', you are not in a voice channel! Join a voice channel first.');
				return;
			}

			const voiceId = member.voice.channel.id;

			console.log('memberId: '+memberId);
			console.log('voiceId: '+voiceId);

			const channels = message.guild.channels._cache;
			const voiceChannel = channels.get(voiceId);
			const members = voiceChannel.members;
			const names = _.shuffle(getNames(members));

			console.log('names: '+names.toString());

			const length = members.size;
			const indices = _.shuffle(_.range(0, length));

			let indicesSplit = null;
			if (length >= 10) {
				indicesSplit = _.chunk(indices, 5);
			} else if (length <= 1) {
				message.channel.send('In voice channel, there must be at least 2 persons!');
				return;
			} else {
				indicesSplit = _.chunk(indices, Math.floor(length / 2));
			}

			const membersUser = members.map((k, v) => k)

			const membersTeam1 = indicesSplit[0].map((x) => { return membersUser[x]; });
			const membersTeam2 = indicesSplit[1].map((x) => { return membersUser[x]; });

			const membersTextTeam1 = membersTeam1.map((member) => { return `${member.user}`; });
			const membersTextTeam2 = membersTeam2.map((member) => { return `${member.user}`; });

			message.channel.send('Team :one:: '+membersTextTeam1.toString()+'\nvs.\nTeam :two:: '+membersTextTeam2.toString());
			console.log('');
			break;
		default:
			break
	}
}

client.on('messageCreate', messageCreateFunction)

client.login('OTExMjY3Mjg0NjcxMTM1NzQ0.YZe5yw.acdQFQzP3R8jwg9gKOVfDSNQ1yk')
