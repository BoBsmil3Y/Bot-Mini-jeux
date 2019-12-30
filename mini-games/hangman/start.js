module.exports = {
	name: 'start',
	description: 'Début du mini-jeu',
	execute(message, args) {
		const worlds = ["Myrith", "Minecraft", "Emeraude", "Diamant"]

		var random = Math.random() * (worlds.length - 1)
		console.log(`Random: ${random}`)

		var arrondi = Math.round(random)
		console.log(`Arrondi : ${arrondi}`)

		var guessWorld = worlds[arrondi]
		var hiddenWorld = ""
		for (const letter of guessWorld)  {
			var hiddenWorld = hiddenWorld + "_ "
		}
		
		message.channel.send('Début du pendu !');
		message.channel.send('Voici le mot à deviner: ``' + hiddenWorld + '``')
	},
};