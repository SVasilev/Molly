var TILE_DIMESNSION = 32;

var OBJECT_HASH_MAP = {
	0 : {
			name: "platform",
		},
};

var TEXTURE_HASH = {
	'platform': game.loadImage; //or 
};

function LevelLoader(jsonMap) {
	this.tileMap = jsonMap;

	game.objects = {
		platforms: [],
		enemy: [],
	};
};

LevelLoader.prototype.parse = function() {

	for (var i = 0; i < this.tileMap.length; i++) {
		for (var k = 0; k < this.tileMap[0].length; k++) {

			var hashObject = OBJECT_HASH_MAP[ this.tileMap[i][k] ];

			if(hashObject) {
				var x = i * TILE_DIMESNSION;
				var y = k * TILE_DIMESNSION;
				// var objectString = hashObject.name;

				game.add.sprite(x, y, game.textureKeys[hashObject.name]);
				// this.objects[ objectString ].push(hashObject.constructor( game, x, y, game.textureKeys[objectString] );
			}
		}
	}
};