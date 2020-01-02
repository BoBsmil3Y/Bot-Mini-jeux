module.exports = {
	name: 'speedtext',
	description: 'Lance le jeu speed text',
	execute(m, args) {
		console.log(`Commande speedtext lancée.`);

		const axios = require('axios');

		let player = m.author;
		let channel = m.channel;

		axios.get('https://baconipsum.com/api/?type=meat-and-filler&paras=2&format=text')
		.then(response => {
			channel.send(response.data) // .await
		})
		.catch(error => {
			console.log(error);
			channel.send("Une erreur s'est produite en récupérant le texte. Veuillez en informer le staff.")
			.then(m => m.delete(5000));
		});

		/*channel.awaitMessages((mes => mes.author.id === player.id), { max: 1, time: 60000})
		.then(collected => {
			
		});*/

		// Await message -> filtre id joueur
		// Faire les calculs de points : https://10fastfingers.com/faq

	},
};
