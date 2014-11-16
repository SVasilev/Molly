var TitleScreen = function(game) {
	this.game = game;
};

TitleScreen.prototype = {
	preload: function() {
		this.game.load.image('titleScreen', '../../tedyAssets/molly.png');
	},

	create: function() {
		title = game.add.sprite(300, 300, 'titleScreen');
		this.game.stage.backgroundColor = 0x4488cc;
	},

	update: function() {
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('promoLevel');
		}
	},
}
