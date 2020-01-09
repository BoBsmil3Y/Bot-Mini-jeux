module.exports = {
	name: 'speedtext',
	description: 'Lance le jeu speed text',
	execute(m, args) {
		console.log(`Commande speedtext lancée.`);

		const axios = require('axios');

		let text;
		let player = m.author;
		let channel = m.channel;
		let start, end;

		axios.get('https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text')
		.then(response => {
			var temp = response.data.split(/ +/);
			text = temp[0] + " " + temp[1] + " " +  temp[2] + " " +  temp[3];
			channel.send(text);
			start = Date.now();
		})
		.catch(error => {
			console.log(error);
			channel.send("Une erreur s'est produite en récupérant le texte. Veuillez en informer le staff.")
			.then(m => m.delete(5000));
		});



		// Check the wroten text.
		channel.awaitMessages((mes => mes.author.id === player.id), { max: 1, time: 15000})
		.then(collected => {;
			end = Date.now();

			let originalText = text.toLowerCase().split(/ +/);
			let wrotenText = collected.first().content.toLowerCase().replace('  ', ' ').split(/ +/);

			if (wrotenText === "annuler") return channel.send("Jeu annulé !").delete(5000);

			for (let i = 0; i < originalText.length; i++) {

				if (wrotenText[i] !== originalText[i]) return channel.send(`Tu as fait une faute ! Tu as mal écrit le mot ${originalText[i]} ! \nTa version du mot : ${wrotenText[i]}`);

			};
			
			var time = end - start;
			channel.send(`Bravo ${player.username} ! Ton temps est de : ${time/1000} s`)
			

		}).catch(error => {
			console.log(error);
			channel.send("Une erreur s'est produite en récupérant ton texte. Veuillez en informer le staff.")
		});


		// Classement plus rapide


	},
};
