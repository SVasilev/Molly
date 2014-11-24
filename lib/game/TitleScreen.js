var TitleScreen = function(game) {
	this.game = game;
};

TitleScreen.prototype = {
	preload: function() {
		this.game.load.image('titleScreen', '../../tedyAssets/molly.png');
	},

	create: function() {
		title = game.add.sprite(500, 300, 'titleScreen');
		this.game.stage.scale.pageAlignHorizontally = true;
        this.game.stage.scale.pageAlignVertically = true;
        this.game.stage.scale.refresh;
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.refresh();
		this.game.stage.backgroundColor = 0x000000;
	},

	update: function() {
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('promoLevel');
		}
	},
}
