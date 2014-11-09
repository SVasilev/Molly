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
    28: {
        name: "bat",
        tween: function(platform) {
            platform.body.kinematic=true;       // set body to kinematic (movable static body)
            platform.rightbounds = platform.body.x;       //set bounds for later calculations
            platform.leftbounds = platform.body.x - 160;      //128 defines the distance the platform will move down
            platform.velo = 200;   //define the speed for the moving platform
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

};

function LevelLoader(jsonDataArr, width) {
    this.tileMap = jsonDataArr;
    this.width = width;

    game.objects = {
        lplatform: [],  //array of sprite ID's
        rplatform: [],
        vplatform: [],
        bat: [],
        spikes: [],
        button: [],
        start: [],
        finish: [],
    };
};

LevelLoader.prototype.parse = function() {

    for (var i = 0; i < this.tileMap.length; i++) {

        var hashObject = OBJECT_HASH_MAP[ this.tileMap[i] ];

        if(hashObject) {
            var xc = (i % this.width) * TILE_DIMESNSION + 16;
            var yc = Math.floor(i / this.width) * TILE_DIMESNSION + 16;
            var objectString = hashObject.name;

            if (objectString == 'start') {
                // game.player.sprite.body.x = xc;
                // game.player.sprite.body.y = yc;
            } else if (objectString == 'finish') {
                //set end lvl
            } else if (objectString == 'button') {
                var sprite = game.add.sprite(xc, yc, hashObject.name);
                game.objects[objectString].push(sprite);
            } else if (objectString == 'torch') {
                var obj = new Torch(game, xc, yc, 'torch');
                lights.add(obj);
            } else if (objectString == 'rplatform' || objectString == 'lplatform' || objectString == 'vplatform') {
                var sprite = movingPlatforms.create(xc, yc, objectString);
                game.physics.p2.enable(sprite);
                sprite.name = objectString;
                hashObject.tween(sprite);                
            } else {
                var sprite = game.add.sprite(xc, yc, hashObject.name);
                game.objects[objectString].push(sprite);
                game.physics.p2.enable(sprite);
                hashObject.tween(sprite);
            }
        }
    }
};