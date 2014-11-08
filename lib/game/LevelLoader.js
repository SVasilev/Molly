var TILE_DIMESNSION = 32;

var OBJECT_HASH_MAP = {
    27 : {
            name: "platform",
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

    console.log("IN PARSE");
    for (var i = 0; i < this.tileMap.length; i++) {

        var hashObject = OBJECT_HASH_MAP[ this.tileMap[i] ];

        if(hashObject) {
            var xc = (i % this.width) * TILE_DIMESNSION - 32;
            var yc = Math.floor(i / this.width) * TILE_DIMESNSION;
            var objectString = hashObject.name;

            var sprite = game.add.sprite(xc, yc, 'platform');
            game.physics.p2.enable(sprite);
            var a = sprite.body;
            sprite.body.mass = 1000000000;
            console.log(a);
            // sprite.body.collideWorldBounds(false, false, false, false, false);
            var tween = game.add.tween(sprite);
            tween.to({ x: xc + 96 }, 1000);
            tween.to({x: xc - 96}, 1000);
            tween.loop();
            tween.start();
            // var tween = add.tween(sprite);
            // tween.to({x: 45}, 6000);

            // game.add.tween(sprite.scale).to({x: 1.0, y: 1.0}, 2400, Phaser.Easing.Bounce.Out, true);
            // game.objects[objectString].push('platform');
            // this.objects[ objectString ].push(hashObject.constructor( game, x, y, game.textureKeys[objectString] );
        }
    }
};