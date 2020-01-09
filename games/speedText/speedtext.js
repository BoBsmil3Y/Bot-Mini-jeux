module.exports = {
	name: 'speedtext',
	description: 'Lance le jeu speed text',
	execute(m, args) {
		console.log(`Commande speedtext lancée.`);

		const axios = require('axios');

		let text;
		let player = m.author;
		let channel = m.channel;

		axios.get('https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text')
		.then(response => {
			var temp = response.data.split(/ +/);
			text = temp[0] + " " + temp[1] + " " +  temp[2] + " " +  temp[3] + " " + temp[4];
			channel.send(text);
		})
		.catch(error => {
			console.log(error);
			channel.send("Une erreur s'est produite en récupérant le texte. Veuillez en informer le staff.")
			.then(m => m.delete(5000));
		});



		// Check the wroten text.
		channel.awaitMessages((mes => mes.author.id === player.id), { max: 1, time: 15000})
		.then(collected => {;

			let originalText = text.toLowerCase().split(/ +/);
			let wrotenText = collected.first().content.toLowerCase().replace('  ', ' ').split(/ +/);
			let wrong = false;

			if (wrotenText === "annuler") return channel.send("Jeu annulé !").delete(5000);

			for (let i = 0; i < originalText.size; i++) {

				if (!wrotenText[i] === originalText[i]) return wrong = true;

			};

			if(wrong) return channel.send(`Tu as fait une faute ! Tu as mal écrit le mot ${originalText[i]} ! \nTa version du mot : ${wrotenText[i]}`);

			channel.send(`Bravo ${player.username} ! Ton temps est de : XX.XX s`)
			

		});

		// Await message -> filtre id joueur
		// Faire les calculs de points : https://10fastfingers.com/faq

	},
};
