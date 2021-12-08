// const Discord = require('discord.js');
import Discord from 'discord.js';
// const {Intents} = require("discord.js");
import {Intents} from "discord.js";
// const {token} = require("./config.js");
// @ts-ignore
import { token } from './config';
import _ from "lodash";

import moment from 'moment';

function getDateTime(): string {
	let _now: moment.Moment = moment(new Date());
	return _now.format('YYYY.MM.DD HH:mm:ss ZZ');
}

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

function csgo5v5(message, channel, name, member, memberId) {
	console.log('- channel: '+channel);
	console.log('- name: '+name);

	if (channel === null) {
		return `${member.user}`+', you are not in a voice channel! Join a voice channel first.';
	}

	const voiceId = member.voice.channel.id;

	console.log('- memberId: '+memberId);
	console.log('- voiceId: '+voiceId);

	const channels = message.guild.channels._cache;
	const voiceChannel = channels.get(voiceId);
	const members = voiceChannel.members;
	const names = _.shuffle(getNames(members));

	console.log('- names: '+names.toString());

	const length = members.size;
	const indices = _.shuffle(_.range(0, length));

	let indicesSplit = null;
	if (length >= 10) {
		indicesSplit = _.chunk(indices, 5);
	} else if (length <= 1) {
		return 'In voice channel, there must be at least 2 persons!';
	} else {
		indicesSplit = _.chunk(indices, Math.floor(length / 2));
	}

	const membersUser = members.map((k, v) => k)

	const membersTeam1 = indicesSplit[0].map((x) => { return membersUser[x]; });
	const membersTeam2 = indicesSplit[1].map((x) => { return membersUser[x]; });

	const membersTextTeam1 = membersTeam1.map((member) => { return `${member.user}`; });
	const membersTextTeam2 = membersTeam2.map((member) => { return `${member.user}`; });

	console.log('');
	return 'Team :one:: '+membersTextTeam1.toString()+'\nvs.\nTeam :two:: '+membersTextTeam2.toString();
}

const messageCreateFunction = function(message) {
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}

	const strDateTime: string = getDateTime();
	console.log('\nDateTime: '+strDateTime);

	const member = message.member;
	const memberId = member.id;

	const channel = member.voice.channel;
	const name = getName(member);

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	console.log('- member: '+member);
	console.log('- name: '+name);
	console.log('- args: '+args);

	let messageToSend = '';
	switch (command) {
		case 'help':
			messageToSend = 'Available commands:\n- ping,\n- keyboard,\n- 5v5,\n- spin, params: -csgo-5v5, -csgo-maps';
			break;
		case'ping':
			messageToSend = 'pong!';
			break;
		case'keyboard':
			messageToSend = 'Logitech 910';
			break;
		case '5v5':
			messageToSend = csgo5v5(message, channel, name, member, memberId);
			break;
		case 'spin':
			const d = {
				'-csgo-maps': 0,
				'-csgo-5v5': 0,
			};

			for (var arg of args) {
				if (d.hasOwnProperty(arg)) {
					d[arg] = 1;
				}
			}

			if (d['-csgo-5v5'] === 1 || d['-csgo-maps'] === 1) {	
				if (d['-csgo-5v5'] === 1) {
					messageToSend = csgo5v5(message, channel, name, member, memberId);
				}

				if (d['-csgo-maps'] === 1) {
					const maps = ['Mirage', 'Dust2', 'Vertigo', 'Overpass', 'Ancient', 'Inferno', 'Nuke'];
					const mapsBold = maps.map((x) => { return `**${x}**`; });
					const randomMap = _.sample(mapsBold);
					messageToSend = `${messageToSend}${messageToSend.length > 0 ? '\n' : ''}Available maps: ${mapsBold.join(', ')}\nChoosen map was: ${randomMap}`;
				}
			} else {
				const randomElement = _.sample(args);
				messageToSend = 'Elements in array: '+args+'\nChoosen element was: '+randomElement;
			}

			break;
		default:
			messageToSend = `Wrong command! type: ${prefix}help for a list of commands!`;
			break
	}

	message.channel.send(messageToSend);
}

client.on('messageCreate', messageCreateFunction);

client.login(token);
