var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.tilemap('map', '../../tilemaps/background.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap('map1', '../smth1.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('bgSpriteSheet', '../../tilemaps/bgSpriteSheet.png');
	game.load.image('tileset1', 'blackTileset.png');
    game.load.image('platform', '../../tilemaps/zelenPr.png');
	game.load.image('kurt', '../96x84.png');
    //game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    //game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
    //game.load.image('mario', '../mario-spritesheet.png');
	game.load.spritesheet('mario', '../mario-spritesheet.png', 50, 50);

}

var player;
var map;
var map1;
var layer;
var layer1;
var cursors;
var sprite;

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.stage.backgroundColor = '#2d2d2d';

    map = game.add.tilemap('map');
    //map1 = game.add.tilemap('map1');

    map.addTilesetImage('bgSpriteSheet');
    //map1.addTilesetImage('tileset1');
    
    layer = map.createLayer('Tile Layer 1');
    //layer1 = map1.createLayer('Tile Layer 1');

    layer.resizeWorld();
    //layer1.resizeWorld();

    map.setCollisionBetween(17, 19);
    map.setCollisionBetween(9,11);
    map.setCollisionBetween(1,3);
    game.physics.p2.convertTilemap(map, layer);
    //game.physics.p2.convertTilemap(map1, layer1);
    game.physics.p2.gravity.y = 1000;
    
    game.blackSprites = new Array(20);
    for (var i = 0; i < 20; i++) {
    	game.blackSprites[i] = new Array(80);
    } 
    for(var i = 0; i < 20; i++) {
    	for(var j = 0; j < 80; j++) {
    		// game.blackSprites[i][j] = (game.add.sprite(j * 32, i * 32, 'tileset1'));
    	}
    }
    
    //player = game.add.sprite(200, 200, 'mario');
    player = game.add.sprite(200, 200, 'kurt');
	game.physics.p2.enable(player);
	player.body.fixedRotation = true;
	//game.physics.p2.restitution = 0.2; //BOUNCING
    game.physics.p2.enable(player);
    game.camera.follow(player);
    player.animations.add('walk', [1,2,3,4,3,2], 10, true);
    player.animations.add('jump', [5,6,7,8,7,6], 10, true);
    
    game.player = new Player(player);
    game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    cursors = game.input.keyboard.createCursorKeys();
    // game.input.onDown.addOnce(circle, this);

    this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.refresh();
}

function fadeLevel() {
	var blackTilesGroup = game.add.group();
	var playerGroup = game.add.group(); // A little hack for the player dissappearing problem.
	
	for(var i = 0; i < 20; i++) {
    	for(var j = 0; j < 80; j++) {
    		blackTilesGroup.add(game.blackSprites[i][j]);
    	}
    }
	
	game.add.tween(blackTilesGroup).to({alpha: 0},2000,Phaser.Easing.Linear.None,true).to({alpha: 1},2000,Phaser.Easing.Linear.None,true).loop();
	playerGroup.add(game.player.sprite);
}


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
        	game.player.sprite = player;
        	game.player.sprite.body.moveUp(550);
        }
    }
	
}

function render() {
	game.debug.inputInfo(32, 32);
	game.debug.spriteInfo(game.player.sprite, 300, 32);
}