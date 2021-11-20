const Discord = require('discord.js');
const {Intents} = require("discord.js");

const client = new Discord.Client({ intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES
	]
});

const prefix = '-';

client.once('ready', () => {
	console.log('TeamSplitterBOT is ready!');
})

let usersNick = [];
function getArrUserNick(members) {
	let usersNick = [];

	for (let [memberId, member] of members) {
		const nick = member.nickname;
		const username = member.user.username;
		if (nick === null) {
			usersNick.push(username);
		} else {
			usersNick.push(nick);
		}
	}

	return usersNick;
}

messageCreateFunction = function(message) {
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		message.channel.send('pong!');
	} else if (command === 'keyboard') {
		message.channel.send('Logitech something is my keyboard, yooo!');
	} else if (command === 'general') {
		const member = message.member;
		const memberId = member.id;

		const getName = function(member) {
			const nickName = member.nickname;
			const userName = member.user.username;

			if (nickName === null) {
				return userName;
			}

			return nickName;
		};

		const channel = member.voice.channel;
		const name = getName(member);

		console.log('channel: '+channel);
		console.log('name: '+name);

		if (channel === null) {
			message.channel.send(`${member.user}`+', you are not in a voice channel! Join a voice channel first.');
			// message.channel.send(''+member.user.username+'#'+member.user.discriminator+', you are not in a voice channel!');
			return;
		}

		const voiceId = member.voice.channel.id;

		console.log('memberId: '+memberId);
		console.log('voiceId: '+voiceId);

		// message.guild.channels.fetch(voiceId).then((voice) => {
		// 	const userNick = getArrUserNick(voice.members);
		// 	console.log('--- Current userNick: '+userNick.toString());
		// })
		
		const cache = message.guild.channels._cache;
		for (let [voiceId, voice] of cache) {
			const name = voice.name;
			if (name.toLowerCase().includes('general') && voice.type === 'GUILD_VOICE') {
				console.log('found the general voice!');
				console.log('voice.name: '+voice.name+', voice.type: '+voice.type);

				const members = voice.members;
				const userNick = getArrUserNick(members);

				// let usersNick = [];
				// for (let [memberId, member] of members) {
				// 	const nick = member.nickname;
				// 	const username = member.user.username;
				// 	if (nick === null) {
				// 		usersNick.push(username);
				// 	} else {
				// 		usersNick.push(nick);
				// 	}
				// }

				console.log('- usersNick.length: '+usersNick.length);
				console.log('- usersNick: '+usersNick);
			}
		}

		console.log('');
	}
}

client.on('messageCreate', messageCreateFunction)

client.login('OTExMjY3Mjg0NjcxMTM1NzQ0.YZe5yw.acdQFQzP3R8jwg9gKOVfDSNQ1yk')
