module.exports = {
	name: 'speedtext',
	description: 'Lance le jeu speed text',
	execute(Discord, m , args) {
		console.log(`Commande speedtext lancée.`);
		
		const Canvas = require('canvas');
		const axios = require('axios');
	
		const player = m.author;
		const channel = m.channel;
		let start, end, text, finalText;
		
		axios.get('https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text')
		.then(async response => {
			text = response.data;
			
			//Ligne de 29 caractères maximum
			let splitText = text.split(/ +/);
			let lignSize = 0;
			let lignTemp;
			let ligns = [];

			for (word of splitText) {
				
				if (lignSize + word.length >= 33) { 
					
					ligns.push(lignTemp);
					lignTemp = word + " ";
					lignSize = word.length+1;
				
				} else {
					
					lignSize += word.length+1;
					lignTemp = (lignTemp === undefined) ? lignTemp = word + " " : lignTemp += word + " ";

				}
			};

			console.log(ligns);

			const canvas = Canvas.createCanvas(800, 450);
			const ctx = canvas.getContext('2d');

			const background = await Canvas.loadImage('games/speedText/background.png');
			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
			
			ctx.font = '50px sans-serif';
			ctx.fillStyle = '#dcdde1';
			
			for (var i = 1; i < 9; i++) {
				ctx.fillText(ligns[i-1], 20, (i*52));
				i === 1 ? finalText = ligns[i-1] : finalText += ligns[i-1];
				
			}

			console.log(finalText);

/*
			const attachment = new Discord.Attachment(canvas.toBuffer(), 'test.png');
				
			const embed = new Discord.RichEmbed()
				.setTitle("Voici le texte à recopier ! Envoi le dès que possible !")
				.setColor("#3c6382")
				.setImage(attachment);
				
			
			channel.send(embed);
			*/
			//channel.send(attachment);
			start = Date.now();
			
		})
		.catch(error => {
			console.log(error);
			channel.send("Une erreur s'est produite en récupérant le texte. Veuillez en informer le staff.")
			.then(m => m.delete(5000));
		});



		// Check the wroten text.
		channel.awaitMessages((mes => mes.author.id === player.id), { max: 1, time: 15000, errors: ['time']})
		.then(collected => {
			end = Date.now();

			let originalText = finalText.split(/ +/);
			let wrotenText = collected.first().content.replace('  ', ' ').split(/ +/);

			if (wrotenText === "annuler") return channel.send("Jeu annulé !").delete(5000);

			for (let i = 0; i < originalText.length; i++) {

				if (wrotenText[i] === undefined) return channel.send(`Tu n'avais pas fini ! Il ne fallait pas s'arreter si vite !`);
				if (wrotenText[i] !== originalText[i]) return channel.send(`Tu as fait une faute ! Tu as mal écrit le mot ${originalText[i]} ! \nTa version du mot : ${wrotenText[i]}`);

			};
			
			channel.send(`Bravo ${player.username} ! Ton temps est de : ${(end - start)/1000} s`)
			
		}).catch(error => {
			channel.send(`Le temps est dépassé ! Tu n'as pas envoyé ton texte à temps !`)
			console.error(error);
			
		});

		// Classement plus rapide

	}

};