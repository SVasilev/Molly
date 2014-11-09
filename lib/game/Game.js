game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var TILE_DIMESNSION = 32;
var JSONlevels = [];

function preload() {
	game.load.tilemap('map', '../../tilemaps/backgroundFinal.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('bgSpriteSheet', '../../tilemaps/bgSpriteSheet.png');
	game.load.image('tileset1', 'blackTileset.png');
    game.load.image('rplatform', '../../tilemaps/platform.png');
    game.load.image('lplatform', '../../tilemaps/platform.png');
    game.load.image('vplatform', '../../tilemaps/platform.png');
    game.load.image('spikes', '../../tilemaps/spikes.png');
    game.load.image('bat', '../../tilemaps/bat.png');
    game.load.image('button', '../../googleplus.png');
    game.load.image('torch', '../../tilemaps/goldButton.png');
	game.load.image('kurt', '../96x84.png');
    game.load.image('hearth', '../64x64.png');
    game.load.image('coin', '../../googleplus.png');
    game.load.image('lamp', '../../tilemaps/lamp_96x80.png');
	game.load.spritesheet('mario', '../mario-spritesheet.png', 50, 50);
	game.time.advancedTiming = true;
	
	//Audio
	game.load.audio('batDeath', '../../assets/sound/BatDeath.ogg');
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

var movingPlatforms;
var bats;

var score = 0;
var scoreString = '';
var scoreText;
var current_lives = 3; // lives

var timer;
var timeBeg;
var seconds = 0;
var batDeath;


var Torch = function(game, x, y, key) {
    Phaser.Sprite.call(this, game, x, y, key);
};

Torch.prototype = Object.create(Phaser.Sprite.prototype);
Torch.prototype.constructor = Torch;

function create() {
    var json = presentationUtils.getJSONdata("tilemaps/backgroundFinal.json");
    JSONlevels.push(json);
 
    batDeath = game.add.audio('batDeath');
    
    game.physics.startSystem(Phaser.Physics.P2JS);

    //add timer
    //var timer = '666';
    //timerText = this.game.add.text(15, 20, "Time: "+timer, { font: "24px Arial", fill: "#333333" });

    map = game.add.tilemap('map');
    map.addTilesetImage('bgSpriteSheet');
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();

    lights = game.add.group();

    map.setCollisionBetween(17, 19);
    map.setCollisionBetween(9,11);
    map.setCollisionBetween(1,3);
    game.physics.p2.convertTilemap(map, layer);
    game.physics.p2.gravity.y = 1000;

    //add groups for platforms
    movingPlatforms = game.add.group(); 
    bats = game.add.group();
    
    //LOADER
    var loader = new LevelLoader(json.layers[0].data, json.width);
    loader.parse();

    
    game.stage.backgroundColor = 0x4488cc;
    lightRadius = 150;
    shadowTexture = game.add.bitmapData(JSONlevels[0].width * JSONlevels[0].tilewidth, 
                                        JSONlevels[0].height * JSONlevels[0].tileheight);
    var lightSprite = game.add.image(0, 0, shadowTexture);
    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    
    loader.loadButtons();
    
    //player = new Torch(game, 450, JSONlevels[0].height * 32 - 100, 'kurt');
    //lights.add(player);
    player = game.add.sprite(450, 10, 'kurt');

    game.physics.p2.enable(player);
    game.camera.follow(player);
    player.body.fixedRotation = true;

    player.animations.add('walk', [1,2,3,4,3,2], 10, true);
    player.animations.add('jump', [5,6,7,8,7,6], 10, true);
    
    player.checkWorldBounds = true;
    //player.outOfBoundsKill = true;

    player.events.onOutOfBounds.add( goodbye, this );

    function goodbye(sprite) {
        sprite.animations.play('jump');
        sprite.body.x = 450;
        sprite.body.y = JSONlevels[0].height * 32 - 100;
        live = lives.getFirstAlive();

        timeBeg = Math.floor(game.time.time)/1000;
        
        if (lives.countLiving() == 0){
            //no lifes kill
        }
        if (live){
            live.kill();
        }
    }
    /*
    function takeLife(){
        live = getFirstDead()
        if (live){
            live.alive = true;
        }
    }
    */
    
    timeBeg = Math.floor(game.time.time)/1000;
    scoreAndLives();

    game.player = new Player(player);
    game.physics.p2.setBoundsToWorld(true, true, false, false, false);

    cursors = game.input.keyboard.createCursorKeys();
    

    this.game.stage.scale.pageAlignHorizontally = true;
    this.game.stage.scale.pageAlignVertically = true;
    this.game.stage.scale.refresh;
    this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.refresh();

    
    game.objects["spikes"].forEach(function(element) {
    	game.player.sprite.body.createBodyCallback(element, collidewithSpikes, game);
	});
    
    game.objects["bat"].forEach(function(element) {
    	game.player.sprite.body.createBodyCallback(element, collidewithEnemies, game);
	});
    
    game.objects["coin"].forEach(function(element) {
    	game.player.sprite.body.createBodyCallback(element, collidewithCoins, game);
	});
    
    game.physics.p2.setImpactEvents(true);
}

function collidewithSpikes(sprite) {
	game.input.keyboard.disabled = true;

    game.player.sprite.animations.play('jump');
    sprite.sprite.body.x = 450;
    sprite.sprite.body.y = JSONlevels[0].height * 32 - 100;
    live = lives.getFirstAlive();

    timeBeg = Math.floor(game.time.time)/1000;
    
    if (lives.countLiving() == 0){
        //no lifes kill
    }
    if (live){
        live.kill();
        current_lives -= 1;
    }
	//Play animation
	game.input.keyboard.disabled = false;
}

function collidewithEnemies(player, ivojson) {
	if(ivojson.sprite && player.y + player.sprite.height - ivojson.sprite.height + 1 < ivojson.y && player.x > ivojson.x - ivojson.sprite.width / 2 && player.x < ivojson.x + ivojson.sprite.width - ivojson.sprite.width / 33) {
		ivojson.sprite.destroy();
		batDeath.play();
		addScore(127);
	}
}

function collidewithCoins(player, ivojson) {
	if(ivojson.sprite) {
		ivojson.sprite.destroy();
		batDeath.play();
		addScore(62);
	}
}


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

function updateTimer() {
    seconds = Math.floor(Math.floor(game.time.time)/1000 - timeBeg);
    if (130 - seconds <= 0) {
        game.player.sprite.animations.play('jump');
        game.player.sprite.body.x = 450;
        game.player.sprite.body.y = JSONlevels[0].height * 32 - 100;
        live = lives.getFirstAlive();

        timeBeg = Math.floor(game.time.time)/1000;
        
        if (lives.countLiving() == 0){
            //no lifes kill
        }
        if (live){
            live.kill();
            current_lives -= 1;
        }
    }
    timer.setText((130 - seconds) + '');
} 

function scoreAndLives() {
        //The score
        scoreString = 'Score : ';
        scoreText = game.add.text(10, 10, scoreString + score, { font: '24px Arial', fill: '#fff' });
        scoreText.fixedToCamera = true;
        //Time
        timer = game.add.text(10, 60, 'Time : 120', { font: '24px Arial', fill: '#fff' });
        timer.fixedToCamera = true;
        //Lives
        lives = game.add.group();

        for (var i = 0; i < current_lives; i++) { //player lives
            var ship = lives.create(game.camera.width - 150 + (30 * i), 20, 'hearth');
            ship.fixedToCamera = true;
            ship.anchor.setTo(0.1, 0.1);
            //ship.angle = 180;
            ship.scale.x = 0.6;
            ship.scale.y = 0.6;
            ship.alpha = 0.6;
        }
    }

function addScore(number) {
	var currentNumber = scoreText.text.split(" ")[2];
	scoreText.text = "Score : " + (Number(currentNumber) + number).toString(); 
}

var currentSeconds = 0;

function update() {
    //scoreText.x = game.width/2;
	game.player.sprite.body.velocity.x = 0;
	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
		game.objects["button"].forEach(function(element) {
			if(game.player.sprite.body.x + 50 > element.x && game.player.sprite.body.x - 50 < element.x) {
				if(currentSeconds == 0) currentSeconds = Number(timer.text);
			}
		});
		if(game.player.sprite.body.x + 50 > element.x && game.player.sprite.body.x - 50 < element.x) {
			if(currentSeconds == 0) currentSeconds = Number(timer.text);
		}
	}
	else if (cursors.left.isDown)
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
        	game.player.sprite.animations.play('jump');
        	game.player.sprite.body.moveUp(550);
        }
    }
    movingPlatforms.forEach(movePlatforms,this);   //call movePlatforms function every step on all members
    bats.forEach(movePlatforms, this);
	if(currentSeconds - Number(timer.text) <= 3 && currentSeconds != 0) game.updateShadowTexture(80);
	else { game.updateShadowTexture(); currentSeconds = 0; }
    //game.updateShadowTexture(80);
    updateTimer();
}

function render() {
	//game.debug.inputInfo(32, 32);
	game.debug.text(game.time.fps || '--', 100, 14, "#00ff00");
	// game.debug.spriteInfo(game.player.sprite, 400, 100);
	
	
}

function  movePlatforms(platform){
    if (platform.name == 'rplatform'){   //check for the moving direction 
        if (platform.body.x > platform.body.sprite.rightbounds){  platform.body.sprite.velo *= -1;} //if reached bounds reverse speed
        if (platform.body.x < platform.body.sprite.leftbounds) { platform.body.sprite.velo *= -1;}  // reverse speed
        platform.body.velocity.x = platform.body.sprite.velo;
    } 
    else if (platform.name == 'vplatform'){
        if (platform.body.y < platform.body.sprite.bottombounds){  platform.body.sprite.velo *= -1;}
        if (platform.body.y > platform.body.sprite.topbounds) { platform.body.sprite.velo *= -1;}
        platform.body.velocity.y = platform.body.sprite.velo;
    } else {
        if (platform.body.x < platform.body.sprite.rightbounds){  platform.body.sprite.velo *= -1;} //if reached bounds reverse speed
        if (platform.body.x > platform.body.sprite.leftbounds) { platform.body.sprite.velo *= -1;}  // reverse speed
        platform.body.velocity.x = platform.body.sprite.velo;
    }
}