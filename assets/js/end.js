
var endGameState = {
    
    init: function () {

        // Responsive
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        this.game.physics.startSystem (Phaser.Physics.ARCADE);
        //this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);
        this.game.physics.arcade.gravity.y = 1500;
    },
    
    
    preload: function () {
		
		// Image button
		game.load.image ('facebook', 'assets/imgs/logo-fb.png');
		game.load.image ('twitter', 'assets/imgs/logo-tw.png');
		game.load.image ('startGame', 'assets/imgs/play-again.png');
		
		// Parallax layers
        this.load.image ('sky', 'assets/imgs/sky.png');
        this.load.image ('mountains3', 'assets/imgs/hill3.png');
        this.load.image ('mountains2', 'assets/imgs/hill2.png');
        this.load.image ('mountains1', 'assets/imgs/hill1.png');

        this.load.image ('snowGround', 'assets/imgs/snow.png');
		
		this.load.image ('snowBall', 'assets/imgs/snowball.png');
		
		this.game.load.spritesheet('rain', 'assets/imgs/rain.png', 17, 17);

        // Player sprites
        this.load.spritesheet ('santaRun', 'assets/imgs/santa_spritesheet_run.png', 64, 64, 7);
    },


    create: function () {

        //game.stage.backgroundColor = '#ffffff';
    
        //var backslash = game.add.sprite (54, 3, 'backslash');
        
        //this.lblStart = game.add.text (20, 182, "Press [SPACE] or tap the screen to START", { font: "12px Arial", fill: "#000000" });
		
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


        this.snowball = this.game.add.sprite (70, 0, 'snowBall');
        this.game.physics.arcade.enable (this.snowball);
        this.snowball.body.collideWorldBounds = true;
        this.snowball.anchor.setTo (0.5);
        this.snowball.scale.setTo (2);
        this.snowball.body.bounce.set (0, 0.5 );

        
        // Player
        this.player = this.game.add.sprite (this.game.world.centerX, 130, 'santaRun');
		this.player.animations.add ('stay', [0], 15, true);
        this.player.animations.play ('stay');

        this.game.physics.arcade.enable (this.player);
        this.player.body.collideWorldBounds = true;
        this.player.anchor.setTo (0.5);
		
		// The raining snow
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
		
		var facebook = game.add.button(290, 140, 'facebook', this.sharedFacebook, this);
		facebook.anchor.x = .5;
		facebook.anchor.y = .5;
		facebook.input.useHandCursor = true;
		facebook.scale.setTo (0.1);
		
		var twitter = game.add.button(320, 140, 'twitter', this.sharedTwitter, this);
		twitter.anchor.x = .5;
		twitter.anchor.y = .5;
		twitter.input.useHandCursor = true;
		twitter.scale.setTo (0.1);
		
		var startGame = game.add.button(300, 100, 'startGame', this.playTheGame, this);
		startGame.anchor.x = .5;
		startGame.anchor.y = .5;
		startGame.input.useHandCursor = true;
		startGame.scale.setTo (0.2);
		
    },


    render: function () {
		
    },

    
    update: function () {
		
		this.game.physics.arcade.collide (this.player, this.ground);
        this.game.physics.arcade.collide (this.snowball, this.ground);
		
    },

    
    playTheGame: function(){
		this.game.state.start("main");
	},
	
	sharedFacebook: function onClick(){    
		window.open("https://phaser.io/", "_blank");
    },
	
	sharedTwitter: function onClick(){    
		window.open("https://twitter.com/?lang=en", "_blank");
    }

    
};







