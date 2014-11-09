var OBJECT_HASH_MAP = {
    27: {
        name: "rplatform",
        tween: function(platform) {
            platform.body.kinematic=true;       // set body to kinematic (movable static body)
            platform.leftbounds = platform.body.x;       //set bounds for later calculations
            platform.rightbounds = platform.body.x + 160;      //128 defines the distance the platform will move down
            platform.velo = 200;   //define the speed for the moving platform
        },
    },
    29: {
        name: "lplatform",
        tween: function(platform) {
            platform.body.kinematic=true;       // set body to kinematic (movable static body)
            platform.rightbounds = platform.body.x;       //set bounds for later calculations
            platform.leftbounds = platform.body.x - 160;      //128 defines the distance the platform will move down
            platform.velo = 200;   //define the speed for the moving platform
        },
    },
    25: {
        name: "spikes",
        tween: function(sprite) {
            sprite.body.kinematic = true;
            game.add.tween(sprite.body.velocity).to( {x: 0, y: -150 }, 1600, Phaser.Easing.Elastic.Out).
                                                to( {x: 0, y: 150}, 1600, Phaser.Easing.Elastic.Out).loop().start();
        },

    },
    28: {
        name: "vplatform",
        tween: function(platform) {
            platform.body.kinematic=true;       // set body to kinematic (movable static body)
            platform.bottombounds = platform.body.y;       //set bounds for later calculations
            platform.topbounds = platform.body.y + 182;      //128 defines the distance the platform will move down
            platform.velo = 150;   //define the speed for the moving platform
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
    };
};

LevelLoader.prototype.parse = function() {

    for (var i = 0; i < this.tileMap.length; i++) {

        var hashObject = OBJECT_HASH_MAP[ this.tileMap[i] ];

        if(hashObject) {
            var xc = (i % this.width) * TILE_DIMESNSION + 16;
            var yc = Math.floor(i / this.width) * TILE_DIMESNSION + 16;
            var objectString = hashObject.name;

            if (objectString == 'rplatform' || objectString == 'lplatform' || objectString == 'vplatform') {
                var platform = movingPlatforms.create(xc, yc, objectString);
                game.physics.p2.enable(platform);
                platform.name = objectString;
                hashObject.tween(platform);
                game.objects[objectString].push(platform);
            } else {
                var sprite = game.add.sprite(xc, yc, hashObject.name);
                game.objects[objectString].push(sprite);
                game.physics.p2.enable(sprite);
                hashObject.tween(sprite);
            }
        }
    }
};