game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'phaser-example');
game.persistantVals = [];
game.temporaryVals = [];

game.addPersistant = function(name, value) {
	persistantVals.push(name);
	game[name] = value;
};

game.addTemporary = function(name, value) {
	temporaryVals.push(name);
	game[name] = value;
};

game.deleteTemp = function() {
	temporaryVals.forEach(function(propertyName) {
		delete game[propertyName];
	});
};

game.updateShadowTexture = function(value) {
	var input = value || 0;
    shadowTexture.context.fillStyle = 'rgb(' + input + ',' + input + ',' + input + ')';
    shadowTexture.context.fillRect(0, 0, JSONlevels[0].width * JSONlevels[0].tilewidth, 
                                         JSONlevels[0].height * JSONlevels[0].tileheight);
    lights.forEach(function(light) {
        var radius = lightRadius + game.rnd.integerInRange(1,20);
        var gradient =
        	shadowTexture.context.createRadialGradient(
                light.x, light.y,lightRadius * 0.75,
                light.x, light.y, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

        shadowTexture.context.beginPath();
        shadowTexture.context.fillStyle = gradient;
        shadowTexture.context.arc(light.x, light.y, radius, 0, Math.PI*2);
        shadowTexture.context.fill();
    }, game);

    shadowTexture.dirty = true;
};


var Torch = function(game, x, y, key) {
    Phaser.Sprite.call(this, game, x, y, key);
};

Torch.prototype = Object.create(Phaser.Sprite.prototype);
Torch.prototype.constructor = Torch;

var TILE_DIMESNSION = 32;
var JSONlevels = [];

var player;
var map;
var layer;
var cursors;
var sprite;
var shadowTexture;
var lightRadius;
var lights;

var movingPlatforms;
var bats;
var randomBoolean = true;

var score = 0;
var scoreString = '';
var scoreText;
var current_lives = 3; // lives
var stateText;
var currentSeconds = 0;

var timer;
var timeBeg;
var seconds = 0;
// var music;
var batDeath;
var batAudio;
var goldAudio;
var fallingAudio;

var registerAudioRadius = 500; //px