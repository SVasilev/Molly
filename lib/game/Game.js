window.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', '../smth.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map1', '../smth1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset', 'tileset1.png');
    game.load.image('tileset1', 'blackTileset.png');
    //game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    //game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
    game.load.image('ship', '../../googleplus.png');

}

var ship;
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
    map1 = game.add.tilemap('map1');

    map.addTilesetImage('tileset');
    map1.addTilesetImage('tileset1');
    //map.addTilesetImage('walls_1x2');
    //map.addTilesetImage('tiles2');
    
    layer = map.createLayer('Tile Layer 1');
    layer1 = map1.createLayer('Tile Layer 1');

    layer.resizeWorld();
    layer1.resizeWorld();

    //  Set the tiles for collision.
    //  Do this BEFORE generating the p2 bodies below.
    map.setCollisionBetween(3, 41);
    

    //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
    //  This call returns an array of body objects which you can perform addition actions on if
    //  required. There is also a parameter to control optimising the map build.
    game.physics.p2.convertTilemap(map, layer);
    game.physics.p2.convertTilemap(map1, layer1);
    
    var aLayer = map1.layers["0"];
    for(var i = 0; i < 20; i++) {
        for(var j = 0; j < 81; j++) {
            aLayer.data[i][j] = 0;
        }
    }
    
    ship = game.add.sprite(200, 200, 'ship');
    game.physics.p2.gravity.y = 400;
    game.physics.p2.enable(ship);
    ship.body.fixedRotation = true;
    
    //game.physics.p2.restitution = 0.2; //BOUNCING
    var json = presentationUtils.getJSONdata();
    console.log(json);
    var loader = new LevelLoader(json.layers[0].data, json.width);
    loader.parse();
    
    game.physics.p2.enable(ship);

    game.camera.follow(ship);

    //  By default the ship will collide with the World bounds,
    //  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
    //  you need to rebuild the physics world boundary as well. The following
    //  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
    //  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
    //  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.
    game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    //  Even after the world boundary is set-up you can still toggle if the ship collides or not with this:
    // ship.body.collideWorldBounds = false;

    cursors = game.input.keyboard.createCursorKeys();
    
    this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.refresh();

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
    ship.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        ship.body.moveLeft(150);
    }
    else if (cursors.right.isDown)
    {
        ship.body.moveRight(150);
    }
    else
    {
        ship.body.setZeroRotation();
    }

    if (cursors.up.isDown)
    {
        if(touchingDown(ship)){  // this checks if the player is on the floor (we don't allow airjumps)
            ship.body.moveUp(250);
        }

    }
    else if (cursors.down.isDown)
    {
        ship.body.reverse(400);
    }
    
}

function render() {
    game.debug.inputInfo(32, 32);
}