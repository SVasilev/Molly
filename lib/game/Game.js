game = new Phaser.Game(1280, 720, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
	game.load.tilemap('map', '../../tilemaps/background.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('bgSpriteSheet', '../../tilemaps/bgSpriteSheet.png');
	game.load.image('tileset1', 'blackTileset.png');
    game.load.image('rplatform', '../../tilemaps/platform.png');
    game.load.image('lplatform', '../../tilemaps/platform.png');
    game.load.image('spikes', '../../tilemaps/spikes.png');
	game.load.image('kurt', '../96x84.png');
	game.load.spritesheet('mario', '../mario-spritesheet.png', 50, 50);
}

var player;
var map;
var map1;
var layer;
var layer1;
var cursors;
var sprite;
var shadowTexture;
var lightRadius;
var lights;
var movingLight;

var Torch = function(game, x, y) {
    Phaser.Sprite.call(this, game, 200, 200, 'kurt');
};

Torch.prototype = Object.create(Phaser.Sprite.prototype);
Torch.prototype.constructor = Torch;

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);

    map = game.add.tilemap('map');
    map.addTilesetImage('bgSpriteSheet');
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();

    map.setCollisionBetween(17, 19);
    map.setCollisionBetween(9,11);
    map.setCollisionBetween(1,3);
    game.physics.p2.convertTilemap(map, layer);
    game.physics.p2.gravity.y = 1000;
    
    game.stage.backgroundColor = 0x4488cc;
    lightRadius = 150;
    shadowTexture = game.add.bitmapData(game.width, game.height);
    var lightSprite = game.add.image(0, 0, shadowTexture);
    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    lights = game.add.group();
    player = new Torch(game, game.width/2, game.height/2);
    lights.add(player);

	game.physics.p2.enable(player);
    game.camera.follow(player);
    player.body.fixedRotation = true;
    player.animations.add('walk', [1,2,3,4,3,2], 10, true);
    player.animations.add('jump', [5,6,7,8,7,6], 10, true);
    
    game.player = new Player(player);
    game.physics.p2.setBoundsToWorld(true, true, false, false, false);

    //LOADER
    var json = presentationUtils.getJSONdata("tilemaps/background.json");
    var loader = new LevelLoader(json.layers[0].data, json.width);
    loader.parse();

    cursors = game.input.keyboard.createCursorKeys();

    this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.refresh();
    
}

game.updateShadowTexture = function() {
    shadowTexture.context.fillStyle = 'rgb(0, 0, 0)';
    shadowTexture.context.fillRect(0, 0, game.width, game.height);
    lights.forEach(function(light) {
        var radius = lightRadius + game.rnd.integerInRange(1,10);
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


function touchingDown(someone) {
    var yAxis = p2.vec2.fromValues(0, 1);
    var result = false;
    for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
        var c = game.physics.p2.world.narrowphase.contactEquations[i];  // cycles through all the contactEquations until it finds our "someone"
        if (c.bodyA === someone.body.data || c.bodyB === someone.body.data)        {
            var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
            if (c.bodyA === someone.body.data) d *= -1;
            if (d > 0.5) result = true;
        }
    } return result;
}

function update() {
	game.player.sprite.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
    	game.player.sprite.scale.x = -1;
    	game.player.sprite.body.moveLeft(300);
    	//if(touchingDown(game.player.sprite)) game.player.sprite.animations.play('walk');
    }
    else if (cursors.right.isDown)
    {
    	game.player.sprite.scale.x = 1;
    	game.player.sprite.body.moveRight(300);
    	//if(touchingDown(game.player.sprite)) game.player.sprite.animations.play('walk');
    }
    else {
    	//if(touchingDown(player)) game.player.sprite.loadTexture('mario', 0);   // this loads the frame 0 of my mario spritesheet  (stand)
    }

    if (cursors.up.isDown)
    {
        if(touchingDown(game.player.sprite)){  // this checks if the player is on the floor (we don't allow airjumps)
        	//game.player.sprite.animations.play('jump');
        	game.player.sprite.body.moveUp(550);
        }
    }
	game.updateShadowTexture();
}

function render() {
	game.debug.inputInfo(32, 32);
}