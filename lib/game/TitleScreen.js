var TitleScreen = function(game) {
	this.game = game;
};

TitleScreen.prototype = {
	preload: function() {
		this.game.load.image('titleScreen', '../../tedyAssets/molly.png');
        this.game.load.audio('nextLevel', '../../assets/sound/NextLevel.ogg');
	},

	create: function() {
        nextLevel = this.game.add.audio('nextLevel');
		title = game.add.sprite(500, 300, 'titleScreen');
		this.game.stage.scale.pageAlignHorizontally = true;
        this.game.stage.scale.pageAlignVertically = true;
        this.game.stage.scale.refresh;
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.refresh();
		this.game.stage.backgroundColor = 0x000000;
        nextLevel.play();
	},

	update: function() {

		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            nextLevel.pause();
			game.state.start('promoLevel');
		}
	},
}
