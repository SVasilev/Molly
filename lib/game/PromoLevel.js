//============================= PROMO LEVEL ===============================

var PromoLevel = function(game) {
    this.game = game;
};

PromoLevel.prototype = {

    preload: function() {
        //IMAGES
        game.load.image('bgSpriteSheet', '../../tilemaps/bgSpriteSheet.png');
        game.load.image('tileset1', 'blackTileset.png');
        game.load.image('rplatform', '../../tilemaps/platform.png');
        game.load.image('lplatform', '../../tilemaps/platform.png');
        game.load.image('vplatform', '../../tilemaps/platform.png');
        game.load.image('spikes', '../../tilemaps/spikes.png');
        game.load.image('bat', '../../tilemaps/bat.png');
        game.load.image('button', '../../tilemaps/blueButton.png');
        game.load.image('torch', '../../tilemaps/goldButton.png');
        game.load.image('hearth', '../64x64.png');
        game.load.image('coin', '../../tilemaps/gold.png');
        game.load.image('lamp', '../../tilemaps/lamp_96x80.png');
        //SPRITESHEET
        game.load.spritesheet('kurtLight', '../moleWalkingLampSprite_96x85.png', 96, 86);
        game.load.spritesheet('kurtJumpLight', '../moleWalkingLampSprite_96x85.png', 96, 86);
        game.load.spritesheet('kurt', '../moleWalkingSprite_96x85.png', 96, 86);
        game.load.spritesheet('hl3', '../hl31.jpg');
        game.load.spritesheet('mario', '../mario-spritesheet.png', 50, 50);
        //AUDIO
        game.load.audio('ambient', '../../tedyAudio/ambient.mp3');
        game.load.audio('batDeath', '../../assets/sound/BatDeath.ogg');
        game.load.audio('batAudio', '../../tedyAudio/bat.mp3');
        game.load.audio('gold', '../../tedyAudio/gold.mp3');
        game.load.audio('falling', '../../assets/sound/Pain.ogg');
        //TILEMAP
        game.load.tilemap('map', '../../tilemaps/bubalazi.json', null, Phaser.Tilemap.TILED_JSON);
        //OTHER
        game.time.advancedTiming = true;
    },

    create: function() {
        var json = presentationUtils.getJSONdata("tilemaps/bubalazi.json");
        JSONlevels.push(json);

        //Add audio to game object 
        batDeath = game.add.audio('batDeath');
        batAudio = game.add.audio('batAudio');
        goldAudio = game.add.audio('gold');
        music = game.add.audio('ambient');
        fallingAudio = game.add.audio('falling');
        batAudio.loop = true;
        music.play('', 0, 20, true);

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
        map.setCollisionBetween(9, 11);
        map.setCollisionBetween(1, 3);
        game.physics.p2.convertTilemap(map, layer);
        game.physics.p2.gravity.y = 900;

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


        var b;
        //player = game.add.sprite(3450, JSONlevels[0].height * 32 - 2000, 'kurt');
        player = game.add.sprite(450, JSONlevels[0].height * 32 - 100, 'kurt');

        game.physics.p2.enable(player);
        game.camera.follow(player);
        player.body.fixedRotation = true;
        player.body.mass = 10;

        player.animations.add('walk', [1, 2, 3, 4, 5, 6, 7, 8], 40, true);
        player.animations.add('walkLight', [1, 2, 3, 4, 5, 6, 7, 8], 40, true);
        player.animations.add('jump', [5, 6, 7, 8, 7, 6], 10, true);

        player.checkWorldBounds = true;
        //player.outOfBoundsKill = true;

        player.events.onOutOfBounds.add(goodbye, this);

        function goodbye(sprite) {
                fallingAudio.play();
                sprite.animations.play('jump');
                sprite.body.x = 450;
                sprite.body.y = JSONlevels[0].height * 32 - 100;
                live = lives.getFirstAlive();

                timeBeg = Math.floor(game.time.time) / 1000;

                if (lives.countLiving() == 0) {
                    //stateText.text=" GAME OVER \n Click to restart";
                    //stateText.visible = true;

                    //the "click to restart" handler
                    restart();
                }
                if (live) {
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

        timeBeg = Math.floor(game.time.time) / 1000;
        this.scoreAndLives();

        game.player = new Player(player);
        game.physics.p2.setBoundsToWorld(true, true, true, false, false);

        cursors = game.input.keyboard.createCursorKeys();


        this.game.stage.scale.pageAlignHorizontally = true;
        this.game.stage.scale.pageAlignVertically = true;
        this.game.stage.scale.refresh;
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.refresh();


        game.objects["spikes"].forEach(function(element) {
            game.player.sprite.body.createBodyCallback(element, this.collidewithSpikes, game);
        });

        game.objects["bat"].forEach(function(element) {
            game.player.sprite.body.createBodyCallback(element, this.collidewithEnemies, game);
        });

        game.objects["coin"].forEach(function(element) {
            game.player.sprite.body.createBodyCallback(element, this.collidewithCoins, game);
        });

        game.physics.p2.setImpactEvents(true);
    },

    collidewithSpikes: function(player, ivojson) {
        if (ivojson.sprite && player.y + player.sprite.height - ivojson.sprite.height - 8 < ivojson.y) {
            game.input.keyboard.disabled = true;
            game.player.sprite.animations.play('jump');
            player.sprite.body.x = 450;
            player.sprite.body.y = JSONlevels[0].height * 32 - 100;

            fallingAudio.play();
            live = lives.getFirstAlive();
            timeBeg = Math.floor(game.time.time) / 1000;
            if (lives.countLiving() == 0) {
                //stateText.text=" GAME OVER \n Click to restart";
                //stateText.visible = true;
                restart();
            }
            if (live) {
                live.kill();
                current_lives -= 1;
            }
            //Play animation
            game.input.keyboard.disabled = false;
        }
    },

    pointsDistanceLessThan: function(ax, ay, bx, by, value) {
        var distance = Math.sqrt(Math.abs(ax - bx) * Math.abs(ax - bx) + Math.abs(ay - by) * Math.abs(ax - bx));
        if (distance <= value) {
            return true;
        } else {
            return false;
        }
    },

    playBatAudio: function() {
        var x = game.player.sprite.body.x;
        var y = game.player.sprite.body.y;
        //foreach BAT if pythagorean
        for (var i = 0; i < game.objects["bat"].length; i++) {
            if (game.objects["bat"][i].body) {
                if (this.pointsDistanceLessThan(x, y, game.objects["bat"][i].body.x, game.objects["bat"][i].body.y, registerAudioRadius)) {
                    if (batAudio.isPlaying) {
                        return;
                    }
                    batAudio.play();
                    return;
                }
            }
        }
        batAudio.stop();
        return;

    },



    collidewithEnemies: function(player, ivojson) {
        if (ivojson.sprite && player.y + player.sprite.height - ivojson.sprite.height + 1 < ivojson.y && player.x > ivojson.x - ivojson.sprite.width / 2 && player.x < ivojson.x + ivojson.sprite.width - ivojson.sprite.width / 33) {
            ivojson.sprite.destroy();
            batDeath.play();
            // batAudio.play();
            addScore(127);
            randomBoolean = false;
        } else {
            if (m) {
                game.input.keyboard.disabled = true;
                game.player.sprite.animations.play('jump');
                player.sprite.body.x = 450;
                player.sprite.body.y = JSONlevels[0].height * 32 - 100;

                fallingAudio.play();
                live = lives.getFirstAlive();
                timeBeg = Math.floor(game.time.time) / 1000;
                if (lives.countLiving() == 0) {
                    restart();
                }
                if (live) {
                    live.kill();
                    current_lives -= 1;
                }
                //Play animation
                game.input.keyboard.disabled = false;
                randomBoolean = true;
            }
        }
    },

    collidewithCoins: function(player, ivojson) {
        if (ivojson.sprite) {
            ivojson.sprite.destroy();
            goldAudio.play();
            addScore(62);
        }
    },

    touchingDown: function(someone) {
        var yAxis = p2.vec2.fromValues(0, 1);
        var result = false;
        for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
            var c = game.physics.p2.world.narrowphase.contactEquations[i]; // cycles through all the contactEquations until it finds our "someone"
            if (c.bodyA === someone.body.data || c.bodyB === someone.body.data) {
                var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
                if (c.bodyA === someone.body.data) d *= -1;
                if (d > 0.5) result = true;
            }
        }
        return result;
    },

    updateTimer: function() {
        seconds = Math.floor(Math.floor(game.time.time) / 1000 - timeBeg);
        if (300 - seconds <= 0) {
            game.player.sprite.animations.play('jump');
            game.player.sprite.body.x = 450;
            game.player.sprite.body.y = JSONlevels[0].height * 32 - 100;
            live = lives.getFirstAlive();

            fallingAudio.play();

            timeBeg = Math.floor(game.time.time) / 1000;

            if (lives.countLiving() == 0) {
                // stateText.setText(" GAME OVER \n Click to restart");
                //stateText.visible = true;
                restart();
            }
            if (live) {
                live.kill();
                current_lives -= 1;
            }
        }
        timer.setText((300 - seconds) + '');
    },

    //mai e problem
    scoreAndLives: function() {
        //The score
        scoreString = 'Score : ';
        scoreText = game.add.text(10, 10, scoreString + score, {
            font: '24px Arial',
            fill: '#188'
        });
        scoreText.fixedToCamera = true;
        //Time
        timer = game.add.text(10, 60, 'Time : 120', {
            font: '24px Arial',
            fill: '#188'
        });
        timer.fixedToCamera = true;
        //Lives
        lives = game.add.group();

        stateText = game.add.text(10, 10, ' ', {
            font: '12px Arial',
            fill: '#fff'
        });
        stateText.fixedToCamera = true;
        stateText.visible = false;

        for (var i = 0; i < current_lives; i++) { //player lives
            var ship = lives.create(game.camera.width - 150 + (30 * i), 20, 'hearth');
            ship.fixedToCamera = true;
            ship.anchor.setTo(0.1, 0.1);
            //ship.angle = 180;
            ship.scale.x = 0.6;
            ship.scale.y = 0.6;
            ship.alpha = 0.6;
        }
    },

    addScore: function(number) {
        var currentNumber = scoreText.text.split(" ")[2];
        scoreText.text = "Score : " + (Number(currentNumber) + number).toString();
    },


    update: function() {
        //scoreText.x = game.width/2;
        game.player.sprite.body.velocity.x = 0;
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            game.objects["button"].forEach(function(element) {
                if (game.player.sprite.body.x + 70 > element.x && game.player.sprite.body.x - 70 < element.x) {
                    if (currentSeconds == 0) currentSeconds = Number(timer.text);
                }
            });
            var element = game.objects["lamp"][0];
            if (game.player.sprite.body.x + 100 > element.x && game.player.sprite.body.x - 100 < element.x) {
                element.destroy();
                game.player = new Torch(game, 450, JSONlevels[0].height * 32 - 100, 'kurtLight');
                lights.add(player);
                game.player = new Player(player);
                game.player.lamp = false;
            }
        } else if (cursors.left.isDown) {
            game.player.sprite.scale.x = -1;
            game.player.sprite.body.moveLeft(300);
            if (this.touchingDown(game.player.sprite)) {
                if (game.player.lamp) game.player.sprite.animations.play('walk');
                else game.player.sprite.animations.play('walkLight');
            }
        } else if (cursors.right.isDown) {
            game.player.sprite.scale.x = 1;
            game.player.sprite.body.moveRight(300);
            if (this.touchingDown(game.player.sprite)) {
                if (game.player.lamp) game.player.sprite.animations.play('walk');
                else game.player.sprite.animations.play('walkLight');
            }
        } else {
            if (this.touchingDown(player)) {
                if (game.player.lamp) game.player.sprite.loadTexture('kurt', 0); // this loads the frame 0 of my mario spritesheet  (stand)
                else game.player.sprite.loadTexture('kurtLight', 0);
            }
        }

        if (cursors.up.isDown) {
            if (this.touchingDown(game.player.sprite)) { // this checks if the player is on the floor (we don't allow airjumps)
                game.player.sprite.animations.play('jump');
                game.player.sprite.body.moveUp(550);
            }
        }
        movingPlatforms.forEach(this.movePlatforms, this); //call movePlatforms function every step on all members
        bats.forEach(this.movePlatforms, this);
        if (currentSeconds - Number(timer.text) <= 3 && currentSeconds != 0) game.updateShadowTexture(80);
        else {
            game.updateShadowTexture();
            currentSeconds = 0;
        }
        //game.updateShadowTexture(80);
        this.playBatAudio();
        this.updateTimer();
    },

    render: function() {
        //game.debug.inputInfo(32, 32);
        game.debug.text(game.time.fps || '--', 100, 14, "#00ff00");
        // game.debug.spriteInfo(game.player.sprite, 400, 100);


    },

    movePlatforms: function(platform) {
        if (platform.name == 'rplatform') { //check for the moving direction 
            if (platform.body.x > platform.body.sprite.rightbounds) {
                platform.body.sprite.velo *= -1;
            } //if reached bounds reverse speed
            if (platform.body.x < platform.body.sprite.leftbounds) {
                platform.body.sprite.velo *= -1;
            } // reverse speed
            platform.body.velocity.x = platform.body.sprite.velo;
        } else if (platform.name == 'vplatform') {
            if (platform.body.y < platform.body.sprite.bottombounds) {
                platform.body.sprite.velo *= -1;
            }
            if (platform.body.y > platform.body.sprite.topbounds) {
                platform.body.sprite.velo *= -1;
            }
            platform.body.velocity.y = platform.body.sprite.velo;
        } else {
            if (platform.body.x < platform.body.sprite.rightbounds) {
                platform.body.sprite.velo *= -1;
            } //if reached bounds reverse speed
            if (platform.body.x > platform.body.sprite.leftbounds) {
                platform.body.sprite.velo *= -1;
            } // reverse speed
            platform.body.velocity.x = platform.body.sprite.velo;
        }
    },

    restart: function() {
        window.location.reload(false);
    },

}