module.exports = {
	name: 'top',
    description: 'Affiche le top du jeu demandé.',
    usage: '+<top> <jeu>',
	execute(m, args) {

        if (args.length < 2) return m.reply(`Il manque quelque chose ! Commande : ${usage}`);
        if (args.length > 2) return m.reply(`Oulah, tu écris trop ! Commande : ${usage}`);

        
        // m.reply(`Top du jeu ${args[2]} introuvable.`).then(m => m.delete(5000));
        

	}
};
