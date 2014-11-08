var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.tilemap('map', '../smth.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap('map1', '../smth1.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tileset', 'tileset1.png');
	game.load.image('tileset1', 'blackTileset.png');
    //game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    //game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
    //game.load.image('mario', '../mario-spritesheet.png');
    game.load.spritesheet('mario', '../mario-spritesheet.png',50,50);

}

var ship;
var map;
var map1;
var layer;
var layer1;
var cursors;
var sprite;
var aLayer;

var val = 0;

function create() {

    game.physics.startSystem(Phaser.Physics.P2JS);

    game.stage.backgroundColor = '#2d2d2d';

    map = game.add.tilemap('map');
    //map1 = game.add.tilemap('map1');

    map.addTilesetImage('tileset');
    //map1.addTilesetImage('tileset1');
    
    layer = map.createLayer('Tile Layer 1');
    //layer1 = map1.createLayer('Tile Layer 1');

    layer.resizeWorld();
    //layer1.resizeWorld();

    //  Set the tiles for collision.
    //  Do this BEFORE generating the p2 bodies below.
    map.setCollisionBetween(3, 41);
	

    //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
    //  This call returns an array of body objects which you can perform addition actions on if
    //  required. There is also a parameter to control optimising the map build.
    game.physics.p2.convertTilemap(map, layer);
    //game.physics.p2.convertTilemap(map1, layer1);
    
    
    aLayer = map.layer;
    
    game.pradnq = function(layer) {
    	var opacity = 1;
        var timer = setInterval(function() {
            if(opacity <= 0.1) {
                clearInterval(timer);
                for(var i = 0; i < 20; i++) {
                	for(var j = 0; j < 80; j++) {
                		layer.data[i][j].alpha = 0.2;
                	}
                }
            }
            for(var i = 0; i < 20; i++) {
            	for(var j = 0; j < 80; j++) {
            		layer.data[i][j].alpha = opacity;
            	}
            }
            opacity -= 0.1;
        }, 1000);
	}
    
    //pradnq(aLayer);
    
    
    
    
    for(var i = 0; i < 20; i++) {
    	for(var j = 0; j < 80; j++) {
    		aLayer.data[i][j].alpha = 1;
    	}
    }
    
    for(var i = 0; i < 20; i++) {
    	for(var j = 0; j < 80; j++) {
    		//aLayer.data[i][j].alpha = 1;
    	}
    }
    
    //aLayer.alpha = 0.2;
    
    
    /*
    aLayer = map.layer;
    for(var i = 0; i < 20; i++) {
    	for(var j = 0; j < 80; j++) {
    		aLayer.data[i][j].alpha = 0;
    	}
    }
    */
    
    game.physics.p2.gravity.y = 1000;
    
    ship = game.add.sprite(200, 200, 'mario');
	game.physics.p2.enable(ship);
	ship.body.fixedRotation = true;
	//game.physics.p2.restitution = 0.2; //BOUNCING
    game.physics.p2.enable(ship);
    game.camera.follow(ship);
    ship.animations.add('walk', [1,2,3,4,3,2], 10, true);
    ship.animations.add('jump', [5,6,7,8,7,6], 10, true);
    
   game.player = new Player(ship);

    //  By default the ship will collide with the World bounds,
    //  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
    //  you need to rebuild the physics world boundary as well. The following
    //  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
    //  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
    //  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.
    
   //game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    //  Even after the world boundary is set-up you can still toggle if the ship collides or not with this:
    // player.sprite.body.collideWorldBounds = false;

    cursors = game.input.keyboard.createCursorKeys();
    
    this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.refresh();
    
    game.input.onDown.addOnce(change, this);

}

function change() {
	val = 1;
	game.create();
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
	    	game.player.sprite.body.moveLeft(150);
	    	if(touchingDown(game.player.sprite)) game.player.sprite.animations.play('walk');
    }
    else if (cursors.right.isDown)
    {
	    	game.player.sprite.scale.x = 1;
	    	game.player.sprite.body.moveRight(150);
	    	if(touchingDown(game.player.sprite)) game.player.sprite.animations.play('walk');
    }
    else {
    	if(touchingDown(ship)) game.player.sprite.loadTexture('mario', 0);   // this loads the frame 0 of my mario spritesheet  (stand)
    }

	
    if (cursors.up.isDown)
    {
        if(touchingDown(game.player.sprite)){  // this checks if the player is on the floor (we don't allow airjumps)
        	//game.pradnq(aLayer);
        	//aLayer;
        	//game.player.sprite.loadTexture('mario', 5);
        	
        	
        	
        	//asd.render();
        	
        	game.player.sprite.animations.play('jump');
        	game.player.sprite = ship;
        	game.player.sprite.body.moveUp(450);
        }
        else {
        	//game.player.jump();
        }
    }
	
}

function render() {
	var asd = map.layer;
	for(var i = 0; i < 20; i++) {
    	for(var j = 0; j < 80; j++) {
    		asd.data[i][j].alpha = 1;
    	}
    }
	game.debug.inputInfo(32, 32);
}