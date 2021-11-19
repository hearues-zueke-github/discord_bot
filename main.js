const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '-';

client.once('ready', () => {
	console.log('TeamSplitterBOT is ready!');
})

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCAse();

	if (command === 'ping') {
		message.channel.send('pong!');
	} else if (command === 'keyboard') {
		message.channel.send('Logitech something is my keyboard, yooo!');
	}
})

client.login('OTExMjY3Mjg0NjcxMTM1NzQ0.YZe5yw.acdQFQzP3R8jwg9gKOVfDSNQ1yk')
