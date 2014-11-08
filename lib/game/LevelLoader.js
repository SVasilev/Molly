var TILE_DIMESNSION = 32;

var OBJECT_HASH_MAP = {
    5 : {
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
            var x = (i % this.width) * TILE_DIMESNSION - 32;
            console.log(x);
            console.log("IN HASH");
            var y = Math.floor(i / this.width) * TILE_DIMESNSION;
            console.log(y);
            var objectString = hashObject.name;

            console.log("MATCH");

            game.add.sprite(x, y, 'platform');
            // game.objects[objectString].push('platform');
            // this.objects[ objectString ].push(hashObject.constructor( game, x, y, game.textureKeys[objectString] );
        }
    }
};