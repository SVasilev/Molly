var OBJECT_HASH_MAP = {
    31: {
        name: "rplatform",
        tween: function(platform) {
            platform.body.kinematic=true;       // set body to kinematic (movable static body)
            platform.leftbounds = platform.body.x;       //set bounds for later calculations
            platform.rightbounds = platform.body.x + 160;      //128 defines the distance the platform will move down
            platform.velo = 200;   //define the speed for the moving platform
        },
    },
    32: {
        name: "lplatform",
        tween: function(platform) {
            platform.body.kinematic=true;       // set body to kinematic (movable static body)
            platform.rightbounds = platform.body.x;       //set bounds for later calculations
            platform.leftbounds = platform.body.x - 160;      //128 defines the distance the platform will move down
            platform.velo = 200;   //define the speed for the moving platform
        },
    },
    26: {
        name: "spikes",
        tween: function(sprite) {
            sprite.body.kinematic = true;
        },

    },
    30: {
        name: "vplatform",
        tween: function(platform) {
            platform.body.kinematic=true;       // set body to kinematic (movable static body)
            platform.bottombounds = platform.body.y;       //set bounds for later calculations
            platform.topbounds = platform.body.y + 182;      //128 defines the distance the platform will move down
            platform.velo = 150;   //define the speed for the moving platform
        },
    },
    25: {
        name: "button",
        tween: function() {},
    },
    27: {
    	name: "lamp",
    	tween: function() {},
    },
    28: {
        name: "bat",
        tween: function(platform) {
            platform.body.kinematic=true;       // set body to kinematic (movable static body)
            platform.rightbounds = platform.body.x;       //set bounds for later calculations
            platform.leftbounds = platform.body.x - 128;      //128 defines the distance the platform will move down
            platform.velo = 250;   //define the speed for the moving platform
        },
    },
    33: {
        name: "torch",
        tween: function(platform) {
                
        },
    },
    35: {
        name: "start",
        tween: function() {
            //set player coordinates
        },
    },
    36: {
        name: "finish",
        tween: function() {
            //set player coordinates
        },
    },
    34: {
        name: 'coin',
        tween: function() {

        },
    },

};

function LevelLoader(jsonDataArr, width) {
    this.tileMap = jsonDataArr;
    this.width = width;

    game.objects = {
        lplatform: [],  //array of sprite ID's
        rplatform: [],
        vplatform: [],
        bat: [],
        lamp: [],
        spikes: [],
        button: [],
        start: [],
        finish: [],
        coin:[],
    };
};

LevelLoader.prototype.parse = function() {

    for (var i = 0; i < this.tileMap.length; i++) {

        var hashObject = OBJECT_HASH_MAP[ this.tileMap[i] ];

        if(hashObject) {
        	var objectString = hashObject.name;
        	var offset = 16;
        	
        	if(objectString == "button" || objectString == "torch") offset = 0;
        	//if(objectString == "torch") offset = -30;
            var xc = (i % this.width) * TILE_DIMESNSION + offset;
            var yc = Math.floor(i / this.width) * TILE_DIMESNSION + offset;

            if (objectString == 'start') {
                // game.player.sprite.body.x = xc;
                // game.player.sprite.body.y = yc;
            } else if (objectString == 'coin') {
                var sprite = game.add.sprite(xc, yc, hashObject.name);
                game.physics.p2.enable(sprite);	
                sprite.body.kinematic = true;
                game.objects[objectString].push(sprite);
                hashObject.tween(sprite);
                
                game.add.sprite(3500, 1800, 'hl3');
            } else if (objectString == 'finish') {
                //set end lvl
            } else if (objectString == 'torch') {
                var obj = new Torch(game, xc, yc, 'torch');
                lights.add(obj);
            } else if (objectString == 'rplatform' || objectString == 'lplatform' || objectString == 'vplatform') {
                var sprite = movingPlatforms.create(xc, yc, objectString);
                game.physics.p2.enable(sprite);
                sprite.name = objectString;
                hashObject.tween(sprite);                
            } else if (objectString == 'bat') {
                var sprite = movingPlatforms.create(xc, yc, objectString);
                sprite.animations.add('fly', [1, 2, 3, 4, 5, 6, 7, 8], 40, true);
                sprite.animations.play('fly');
                game.physics.p2.enable(sprite);
                sprite.name = objectString;
                game.objects[objectString].push(sprite);
                hashObject.tween(sprite);
            } else {
	        	if(objectString == 'button' || objectString == 'lamp') continue;
                var sprite = game.add.sprite(xc, yc, hashObject.name);
                game.objects[objectString].push(sprite);
                game.physics.p2.enable(sprite);
                hashObject.tween(sprite);
            }
        }
    }
};

LevelLoader.prototype.loadButtons = function() {
	for (var i = 0; i < this.tileMap.length; i++) {

        var hashObject = OBJECT_HASH_MAP[ this.tileMap[i] ];

        if(hashObject) {
        	var objectString = hashObject.name;
        	var offset = 0;
        	
        	if(objectString == "lamp") offset = -10;
        	if(objectString == "button") offset = -35;
            var xc = (i % this.width) * TILE_DIMESNSION + offset;
            var yc = Math.floor(i / this.width) * TILE_DIMESNSION + offset;
            if(objectString == 'button') {
		        var sprite = game.add.sprite(xc, yc, hashObject.name);
		        game.objects[objectString].push(sprite);
            } else if(objectString == 'lamp') {
            	var sprite = game.add.sprite(xc, yc, hashObject.name);
                game.objects[objectString].push(sprite);
            }
            
		}
	}
};