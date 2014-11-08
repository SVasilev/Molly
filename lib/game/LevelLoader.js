var TILE_DIMESNSION = 32;

var OBJECT_HASH_MAP = {
    2 : {
            name: "platform",
        },
};

var TEXTURE_HASH = {
    'platform': 'ship', //or 
};

function LevelLoader(jsonDataArr, width) {
    this.tileMap = jsonDataArr;
    this.width = width;

    game.objects = {
        platforms: [],
        enemy: [],
    };
};

LevelLoader.prototype.parse = function() {

    console.log("IN PARSE");
    for (var i = 0; i < this.tileMap.length; i++) {

        var hashObject = OBJECT_HASH_MAP[ this.tileMap[i] ];

        if(hashObject) {
            var x = (i % this.width) * TILE_DIMESNSION;
            console.log(x);
            var y = Math.floor(i / this.width) * TILE_DIMESNSION;
            console.log(y);
            var objectString = hashObject.name;

            console.log("MATCH");

            game.add.sprite(x, y, 'ship');
            // this.objects[ objectString ].push(hashObject.constructor( game, x, y, game.textureKeys[objectString] );
        }
    }
};