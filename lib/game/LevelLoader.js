var TILE_DIMESNSION = 32;

var OBJECT_HASH_MAP = {
    27: {
        name: "rplatform",
        tween: function(sprite) {
            sprite.body.kinematic = true;
            game.add.tween(sprite.body.velocity).to( {x: 100, y: 0 }, 1500, Phaser.Easing.Elastic.Out).
                                                to( {x: -100, y: 0}, 1500, Phaser.Easing.Elastic.Out).loop().start();
        },
    },
    29: {
        name: "lplatform",
        tween: function(sprite) {
            sprite.body.kinematic = true;
            game.add.tween(sprite.body.velocity).to( {x: -100, y: 0 }, 1500, Phaser.Easing.Elastic.Out).
                                                to( {x: 100, y: 0}, 1500, Phaser.Easing.Elastic.Out).loop().start();
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
};

function LevelLoader(jsonDataArr, width) {
    this.tileMap = jsonDataArr;
    this.width = width;

    game.objects = {
        platforms: [],  //array of sprite ID's
        bats: [],
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

            var sprite = game.add.sprite(xc, yc, hashObject.name);
            game.physics.p2.enable(sprite);
            sprite.body.kinematic = true;
            hashObject.tween(sprite);
        }
    }
};