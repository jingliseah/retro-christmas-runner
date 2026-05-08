/**
 * Copyright TBWA\KL 2017.
 */

var isJumping = false;
var isPlaying = false;
var gameSpeed = 1.0;
var points = 0;
var localStorageName = "crackalien";
var hiScore;
var lblScore, lblHiScore;
var isMuted = false;



var mainGameState = {


    init: function () {

        gameSpeed = 1.0;
        points = 0;
        isJumping = false;
        
		// Responsive
		if (this.game.device.desktop == false) {
			this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.game.input.onDown.add(this.gofull, this);
			
		} else {
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		}
		
		this.game.scale.refresh();

        this.game.physics.startSystem (Phaser.Physics.ARCADE);
        //this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);
        this.game.physics.arcade.gravity.y = 1500;

        //this.game.renderer.renderSession.roundPixels = true;
        //Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    },
	
	gofull: function () {
		
		this.game.scale.startFullScreen();
		
	},


    preload: function () {
        
        this.game.load.onLoadStart.add(this.loadStart, this);
        this.game.load.onLoadComplete.add(this.loadComplete, this);
        this.loadText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Loading', { fill: '#ffffff'});
        this.loadText.anchor.setTo (0.5);



        this.game.load.audio('titleMusic', ['assets/sfx/merryxmas.mp3', 'assets/sfx/merryxmas.ogg']);

		// Image buttons
        game.load.image ('hid-btn', 'assets/imgs/logo-button.png');
		game.load.image ('menu-hid-btn', 'assets/imgs/menu-button.png');

		game.load.image ('postcard', 'assets/imgs/postcard.png');
		game.load.image ('top-bar', 'assets/imgs/top-bar.png');

        // Parallax layers
        this.load.image ('sky', 'assets/imgs/sky.png');
        this.load.image ('mountains3', 'assets/imgs/hill3.png');
        this.load.image ('mountains2', 'assets/imgs/hill2.png');
        this.load.image ('mountains1', 'assets/imgs/hill1.png');

        this.load.image ('snowGround', 'assets/imgs/snow.png');

        // Enemies
        this.load.image ('snowBall', 'assets/imgs/snowball.png');
        this.load.image ('rock1', 'assets/imgs/rock1.png');
        this.load.image ('rock2', 'assets/imgs/rock2.png');
        this.load.image ('rock3', 'assets/imgs/rock3.png');
        this.load.image ('rock4', 'assets/imgs/rock4.png');
        this.load.image ('rock5', 'assets/imgs/rock5.png');
		this.load.image ('rock5', 'assets/imgs/rock6.png');

        this.game.load.spritesheet('rain', 'assets/imgs/rain.png', 17, 17);

        // Player sprites
        this.load.spritesheet ('santaRun', 'assets/imgs/santa_spritesheet.png', 57, 58, 20);


    },





    create: function () {
        points = 0;
		
		hiScore = Math.max(points, hiScore);
    	localStorage.setItem(localStorageName, hiScore);

        // Parallax layers
        this.sky = this.game.add.sprite (0,0, 'sky');
        this.layer1 = this.game.add.tileSprite (0, 0, 450, 96, 'mountains3');
        //this.layer1.scale.setTo (2);
        this.layer2 = this.game.add.tileSprite (0, 30, 450, 96, 'mountains2');
        //this.layer2.scale.setTo (2);
        this.layer3 = this.game.add.tileSprite (0, 68, 450, 96, 'mountains1');
        //this.layer3.scale.setTo (2);


        // Ground
        this.ground = this.game.add.tileSprite (0, this.game.world.height-50, this.game.world.width, this.game.world.height, 'snowGround');
        //this.ground.angle = 3;
        this.game.physics.arcade.enable (this.ground);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;


        this.snowball = this.game.add.sprite (30, 0, 'snowBall');
        this.game.physics.arcade.enable (this.snowball);
        this.snowball.body.collideWorldBounds = false;
        this.snowball.anchor.setTo (0.5);
        //this.snowball.scale.setTo (2);
        this.snowball.body.bounce.set (0, 0.5 );


        // Player
        this.player = this.game.add.sprite (this.game.world.centerX-50, 120, 'santaRun');
        this.player.animations.add ('jump', [11], 15, true);
        this.player.animations.add ('run', [9,10,11,12,13,14,15], 15, true);
		this.player.animations.add ('tripped', [16,17,18,19], 15, false);
        this.player.animations.play ('run');

        this.game.physics.arcade.enable (this.player);
        this.player.body.collideWorldBounds = true;
        this.player.anchor.setTo (0.5);
        this.player.scale.setTo (0.9);

        this.rocks = this.add.group ();
        this.rocks.enableBody = true;

        this.snowballs = this.add.group ();
        this.snowballs.enableBody = true;


        // clear rocks and snowballs
        this.rocks.forEach (function (r) { r.destroy (); });
        this.snowballs.forEach (function (s) { s.destroy (); });

        this.rockCreator = this.game.time.events.loop (Phaser.Timer.SECOND * 1, this.createRock, this);

		this.topBar = this.game.add.image(35, 16, 'top-bar');

        lblScore = game.add.text (50, 7, "Score:\n 0", { font: "10px Arial-Black", fill: "#000000" });
        lblHiScore = game.add.text (120, 7, "Hi-Score:\n "+hiScore, { font: "10px Arial-Black", fill: "#000000" });

/*
        var emitter = game.add.emitter(game.world.centerX, 0, 100);
        emitter.width = game.world.width;
        emitter.angle = 30; // uncomment to set an angle for the rain.
        emitter.makeParticles('rain');
        emitter.minParticleScale = 0.5;
        emitter.maxParticleScale = 1;
		emitter.y = -200;
        emitter.setYSpeed(10, 100);
        //emitter.setXSpeed(-5, 5);
        emitter.gravity = 0;
        emitter.minRotation = 0;
        emitter.maxRotation = 0;
        emitter.start(false, 1000, 20);
*/

        // Controls - keyboard & mobile
        var spacebar = this.game.input.keyboard.addKey (Phaser.Keyboard.SPACEBAR);
        spacebar.onDown.add (this.jump, this);
        this.game.input.onDown.add(this.jump, this);

        /*this.mute = this.game.add.button(20, 190, 'mute', this.muteAudio, this);
		this.mute.anchor.x = .5;
		this.mute.anchor.y = .5;
		this.mute.input.useHandCursor = true;
		this.mute.animations.add('mute', [1], 3, true);
		this.mute.animations.add('music', [0], 3, true);
		this.mute.animations.play('mute');*/

        this.music = this.game.add.audio ('titleMusic');
        this.music.loop = true;
		this.music.play ();

        /*if (!isMuted) {
            this.mute.animations.play ('music');
            this.music.play ();
        }*/

        isPlaying = true;
    },



    render: function () {
        //game.debug.bodyInfo(this.player, 32, 32);
        //game.debug.body(this.player);
    },



    update: function () {

        // Player must collide with the ground
        this.game.physics.arcade.collide (this.player, this.ground);
        this.game.physics.arcade.collide (this.snowball, this.ground);
        this.game.physics.arcade.collide (this.rocks, this.ground);

        if (isPlaying) {

            this.game.physics.arcade.overlap (this.rocks, this.snowball, this.destroyRock);
            this.game.physics.arcade.overlap (this.snowballs, this.snowball, this.destroySnowballs);
            
            this.game.physics.arcade.overlap (this.player, this.rocks, this.killPlayer, function () {
                this.killSnowBall ();
            }, this);

            this.game.physics.arcade.overlap (this.player, this.snowballs, this.killPlayer2, function () {
                this.killSnowBall ();
            }, this);
        }


        if (isPlaying) {

            // TODO: crush the rocks (expode animation)
            //this.game.physics.arcade.collide (this.snowball, this.rocks);

            this.layer1.tilePosition.x -= 0.5 * gameSpeed;
            this.layer2.tilePosition.x -= 0.7 * gameSpeed;
            this.layer3.tilePosition.x -= 1 * gameSpeed;
            this.ground.tilePosition.x -= 4 * gameSpeed;

            this.snowball.angle += 5 * gameSpeed;

            if (this.player.body.y >= 103 && this.player.animations.name != 'run') {
                isJumping = false;
                this.player.animations.play ('run');
            }
        }


    },


    jump: function () {

        if (!isPlaying)
            return;

        if (!isJumping) {
            isJumping = true;
            this.player.animations.play ('jump');
            this.player.body.velocity.y = -470;
        }


    },





    createRock: function () {

        if (isPlaying) {

            var numOfRocks = Math.floor(Math.random() * 10)+1;

            var rockX = 0;
            var counter = 0;
            //var rock = this.rocks.getFirstExists (false);

            /*if (!rock) {
                rock = this.rocks.create (0, 0, 'rock1');
            }*/


            //if (numOfRocks % 2 == 1 ) {
            if (numOfRocks == 1 || numOfRocks == 3 |numOfRocks == 7) {
                var rockId = Math.floor(Math.random() * 5)+1;
                var rock = this.rocks.create (this.game.world.width,this.game.world.height-79, 'rock1');
                rock.anchor.setTo (0,0);
                rock.loadTexture ('rock'+rockId);
                //rock.reset (this.game.world.width+(5*numOfRocks), this.game.world.height-79);
                rock.body.velocity.x = -240 * gameSpeed;
                //rock.scale.setTo (1);
                counter++;
            } else if (numOfRocks == 2 || numOfRocks == 8  || numOfRocks == 10) {
            
                var ball = this.snowballs.create (this.game.world.width,this.game.world.height-70, 'snowBall');
                ball.anchor.setTo (0.5);
                ball.body.velocity.x = -340 * gameSpeed;
                ball.body.gravity.y = -1500;
                ball.scale.setTo (0.5);

                var animation = game.add.tween (ball);
                animation.to ({angle: -1080}, 1500);
                animation.start ();

                counter++;
            
            } else if (numOfRocks == 4 || numOfRocks == 6) {
            /*
                var ball = this.snowballs.create (this.game.world.width,this.game.world.height-120, 'snowBall');
                ball.anchor.setTo (0.5);
                ball.body.velocity.x = -340 * gameSpeed;
                ball.body.gravity.y = -1500;
                ball.scale.setTo (0.5);

                var animation = game.add.tween (ball);
                animation.to ({angle: -1080}, 1500);
                animation.start ();

                counter++;
            
            */
            }


        }
    },




    destroyRock: function (snowball, rock) {


        // TODO: animate
        rock.destroy ();
        points += (10 * Math.round (gameSpeed));
        gameSpeed = parseFloat (gameSpeed) + 0.05;
        lblScore.text = "Score:\n "+points;

        var scoreMsg = "+"+(10 * Math.round (gameSpeed));
        //var scoreMsg = 10;
        //if (Math.round (gameSpeed) > 1)
        //    scoreMsg += " x" + Math.round (gameSpeed)

        var scoreAni = game.add.text (50, game.world.height - 80, scoreMsg, { font: "15px Arial-Black", fill: "#ff0000" });
        //scoreAni.angle = -12;
        var animation = game.add.tween (scoreAni);
        //animation.to ({alpha: 0, y: game.world.height - 100, x: 80}, 500);
        animation.to ({alpha: 0, y: game.world.height - 100}, 500);
        animation.start ();

        if (snowball.scale.x < 2.5) {
            snowball.body.y -=10;
            snowball.scale.setTo (snowball.scale.x+0.05, snowball.scale.y+0.05);
        }

    },


    destroySnowballs: function (snowball, sb) {


        // TODO: animate
        sb.destroy ();
        points += (10 * Math.round (gameSpeed));
        //gameSpeed = parseFloat (gameSpeed) + 0.05;
        lblScore.text = "Score:\n "+points;

        var scoreMsg = "+"+(10 * Math.round (gameSpeed));
        //var scoreMsg = 10;
        //if (Math.round (gameSpeed) > 1)
        //    scoreMsg += " x" + Math.round (gameSpeed)

        var scoreAni = game.add.text (50, game.world.height - 80, scoreMsg, { font: "15px Arial-Black", fill: "#ff0000" });
        //scoreAni.angle = -12;
        var animation = game.add.tween (scoreAni);
        //animation.to ({alpha: 0, y: game.world.height - 100, x: 80}, 500);
        animation.to ({alpha: 0, y: game.world.height - 100}, 500);
        animation.start ();

        if (snowball.scale.x < 2.5) {
            snowball.body.y -=10;
            snowball.scale.setTo (snowball.scale.x+0.05, snowball.scale.y+0.05);
        }

    },


    killPlayer: function (player, rock) {
        gtag('event', 'Player hit rock');

        rock.parent.forEach (function (r) {
            r.body.velocity.x = 0;
        });


        isPlayerDead = true;
        isPlaying = false;

        player.animations.stop ('run');


		var tripped = player.animations.play ('tripped');

        rock.body.velocity.x = 0;

        var trippedAni = game.add.tween (player);
        //animation.to ({alpha: 0, y: game.world.height - 100, x: 80}, 500);
        trippedAni.to ({x: player.x+80},200);
        trippedAni.start ();

        /*tripped.onComplete.add(function () {
            //this.killSnowBall ();
            //this.showEnding ();
        }, this);*/

    },

    killPlayer2: function (player, sb) {

        gtag('event', 'Player hit snowball');

        isPlayerDead = true;
        isPlaying = false;

        player.animations.stop ('run');


		var tripped = player.animations.play ('tripped');

        var trippedAni = game.add.tween (player);
        //animation.to ({alpha: 0, y: game.world.height - 100, x: 80}, 500);
        trippedAni.to ({x: player.x+80},200);
        trippedAni.start ();

        /*tripped.onComplete.add(function () {
            //this.killSnowBall ();
            //this.showEnding ();
        }, this);*/

    },


    killSnowBall: function () {

        this.game.world.bringToTop(this.snowball);
        var snowDeath = game.add.tween (this.snowball);
        snowDeath.to ({angle: 360, x: game.world.width+200}, 1000);
        snowDeath.start ();
		
		snowDeath.onComplete.add(function () {
            this.showEnding ();
        }, this);
    },



    
    showEnding: function () {
		
        gtag('event', 'Score', {
          'event_category': 'Score',
          'event_label': points
        });
		
		var item = game.add.sprite(260, 150, 'postcard');
		item.scale.setTo(0.1);
		item.anchor.setTo(0.5,0.5);
		game.add.tween(item).to({x: game.world.centerX, y: game.world.centerY}, 800, Phaser.Easing.Bounce.Out, true, 300, 0);
		game.add.tween(item.scale).to({ x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
		
        var facebook = game.add.button(71, 176, 'hid-btn', this.shareOnFacebook, this);
        facebook.anchor.setTo(0.5, 0.5);
        facebook.input.useHandCursor = true;
		facebook.alpha = 0;
		game.add.tween(facebook).to( { alpha: 1 }, 5000, Phaser.Easing.Bounce.Out, true);
		
        var twitter = game.add.button(97, 176, 'hid-btn', this.shareOnTwitter, this);
        twitter.anchor.setTo(0.5, 0.5);
        twitter.input.useHandCursor = true;
		twitter.alpha = 0;
		game.add.tween(twitter).to( { alpha: 1 }, 5000, Phaser.Easing.Bounce.Out, true);
		
		var homeBtn = game.add.button(277, 176, 'menu-hid-btn', this.homeBtn, this);
		homeBtn.anchor.setTo(0.5, 0.5);
		homeBtn.input.useHandCursor = true;
		homeBtn.alpha = 0;
		game.add.tween(homeBtn).to( { alpha: 1 }, 5000, Phaser.Easing.Bounce.Out, true);

        var startGame = game.add.button(309, 176, 'menu-hid-btn', this.restartGame, this);
		startGame.anchor.setTo(0.5, 0.5);
		startGame.input.useHandCursor = true;
		startGame.alpha = 0;
		game.add.tween(startGame).to( { alpha: 1 }, 5000, Phaser.Easing.Bounce.Out, true);

        if (points > hiScore)
            //hiScore = points;
			hiScore = Math.max(points, hiScore);
			localStorage.setItem(localStorageName, hiScore);

    },
	
	restartGame: function () {

        gtag('event', 'Restart', {
          'event_category': 'Player restarted'
        });

        gameSpeed = 1;
        this.music.stop ();
        game.state.start ('main');
		localStorage.setItem("hiSantaScore",Math.max(points, hiScore));

    },

	homeBtn: function () {


        gtag('event', 'Home', {
          'event_category': 'Player went home'
        });


        this.music.stop ();
        this.game.state.start("title");

    },

	shareOnFacebook: function onClick(){

        gtag('event', 'Share', {
          'event_category': 'Player clicked to share on Facebook'
        });



        social.FacebookShareWithScore (points);
    },

	shareOnTwitter: function onClick(){

        gtag('event', 'Share', {
          'event_category': 'Player clicked to share on Twitter'
        });
        social.TwitterShareWithScore (points);
    },


    
    muteAudio: function () {
        if (this.music.isPlaying) {
            isMuted = true;
            this.mute.animations.play('mute');
            this.music.stop ();
        } else {
            isMuted = false;
            this.mute.animations.play('music');
            this.music.play ();
        }
    },


    
    loadStart: function () {
    },


    loadComplete: function () {
    
        this.loadText.setText = "";
    
    }


}
