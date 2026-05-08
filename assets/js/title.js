var isMuted = false;

var title = {

    init: function () {

        // Responsive
		if (this.game.device.desktop == false) {
			this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.game.input.onDown.add(this.gofull, this);
			
			function goFullscreen() {
				// Must be called as a result of user interaction to work
				mf = document.getElementById("game");
				mf.webkitRequestFullscreen();
				mf.style.display="";
			}
			
			function fullscreenChanged() {
				if (document.webkitFullscreenElement == null) {
					mf = document.getElementById("game");
					mf.style.display=document.getElementById("game");
				}
			}
			
			document.onwebkitfullscreenchange = fullscreenChanged;
			document.documentElement.onclick = goFullscreen;
			document.onkeydown = goFullscreen;
			
		} else {
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		}
		
		this.game.scale.refresh();
		
		
        this.game.physics.startSystem (Phaser.Physics.ARCADE);
        //this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);
        this.game.physics.arcade.gravity.y = 1500;

        this.game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
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
		game.load.image ('facebook', 'assets/imgs/logo-fb.png');
		game.load.image ('twitter', 'assets/imgs/logo-tw.png');
		game.load.image ('startGame', 'assets/imgs/start_btn.png');
		game.load.image ('exit', 'assets/imgs/exit.png');
		game.load.image ('instructions_btn', 'assets/imgs/instructions_btn.png');
		game.load.image ('instruction', 'assets/imgs/instructions.png');
		
		this.load.spritesheet ('tree', 'assets/imgs/tree.png', 103, 150, 2);
    	game.load.image ('title1', 'assets/imgs/wishes.png');
		game.load.image ('labelCmpny', 'assets/imgs/labelCmpny.png');

		// Parallax layers
        this.load.image ('sky', 'assets/imgs/sky.png');
        this.load.image ('mountains3', 'assets/imgs/hill3.png');
        this.load.image ('mountains2', 'assets/imgs/hill2.png');
        this.load.image ('mountains1', 'assets/imgs/hill1.png');

        this.load.image ('snowGround', 'assets/imgs/snow.png');
		this.load.image ('snowBall', 'assets/imgs/snowball.png');

		this.game.load.spritesheet('rain', 'assets/imgs/rain.png', 17, 17);

        // Player sprites
        this.load.spritesheet ('santaRun', 'assets/imgs/santa_spritesheet.png', 57, 58, 20);
    },




    create: function () {
		
		

        
		// Parallax layers
        this.sky = this.game.add.sprite (0,0, 'sky');
        this.layer1 = this.game.add.tileSprite (0, 0, 450, 96, 'mountains3');
        this.layer2 = this.game.add.tileSprite (0, 30, 450, 96, 'mountains2');
        this.layer3 = this.game.add.tileSprite (0, 68, 450, 96, 'mountains1');

		// Ground
        this.ground = this.game.add.tileSprite (0, this.game.world.height-50, this.game.world.width, this.game.world.height, 'snowGround');
        this.game.physics.arcade.enable (this.ground);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;

        // Player
        this.player = this.game.add.sprite (this.game.world.centerX, 135, 'santaRun');
        this.player.animations.add ('static', [0,1,2,3,4,5,6,7,8], 5, true);
        this.player.animations.play ('static');

        this.game.physics.arcade.enable (this.player);
        this.player.body.collideWorldBounds = true;
        this.player.anchor.setTo (0.5);
        this.player.scale.setTo (0.9);

		this.facebook = game.add.button(325, 15, 'facebook', this.shareOnFacebook, this);
		this.facebook.anchor.x = .5;
		this.facebook.anchor.y = .5;
		this.facebook.input.useHandCursor = true;

		this.twitter = game.add.button(355, 15, 'twitter', this.shareOnTwitter, this);
		this.twitter.anchor.x = .5;
		this.twitter.anchor.y = .5;
		this.twitter.input.useHandCursor = true;

		this.startGame = game.add.button(330, 115, 'startGame', this.playTheGame, this);
		this.startGame.anchor.x = .5;
		this.startGame.anchor.y = .5;
		this.startGame.enable = false;
		this.startGame.input.useHandCursor = true;
		
		this.instructions = game.add.button(330, 145, 'instructions_btn', this.instruction, this);
		this.instructions.anchor.x = .5;
		this.instructions.anchor.y = .5;
		this.instructions.input.useHandCursor = true;
		
		var tree = this.add.group ();
		tree = this.game.add.sprite (this.game.world.centerX-170, 15, 'tree');
		tree.animations.add ('moving', [0,1], 3, true);
		tree.animations.play ('moving');
		 
    	var title1 = this.game.add.sprite(game.world.centerX, 55, 'title1');
		title1.anchor.setTo(0.5,0.5);
		game.add.tween(title1.scale).to({ x: 1.1, y: 1.1}, 1000, Phaser.Easing.Linear.None, true, 0, 0, true).loop(true);
		
		var labelCmpny = this.game.add.sprite(game.world.centerX, game.world.centerY-8, 'labelCmpny');
		labelCmpny.anchor.setTo(0.5,0.5);
		game.add.tween(labelCmpny).to( { alpha: 1 }, 3350, Phaser.Easing.Bounce.Out, true);
		
        /*this.mute = this.game.add.button(20, 190, 'mute', this.muteAudio, this);
		this.mute.anchor.x = .5;
		this.mute.anchor.y = .5;
		this.mute.input.useHandCursor = true;
		this.mute.animations.add('mute', [1], 3, true);
		this.mute.animations.add('music', [0], 3, true);
		this.mute.animations.play('mute');*/
		
		/*if (this.game.device.desktop == false) {
			var lblScreen = game.add.text (125, 7, "Tap the screen to get the fullscreen", { font: "8px Arial-Black", fill: "#000000" });
			this.game.input.onDown.add(this.gofull, this);
		}*/
		

        this.music = this.game.add.audio ('titleMusic');
        this.music.loop = true;
		this.music.play ();

        /*if (!isMuted) {
            this.mute.animations.play ('music');
            this.music.play ();
        }*/

    },
		

    render: function () {
		
    },


    update: function () {

		this.game.physics.arcade.collide (this.player, this.ground);

		if (isPlaying) {

            // TODO: crush the rocks (expode animation)
            //this.game.physics.arcade.collide (this.snowball, this.rocks);

            this.layer1.tilePosition.x -= 0.5 * gameSpeed;
            this.layer2.tilePosition.x -= 0.7 * gameSpeed;
            this.layer3.tilePosition.x -= 1 * gameSpeed;
            this.ground.tilePosition.x -= 4 * gameSpeed;

        }

    },


    playTheGame: function(){
        gtag('event', 'pressed play');
        this.game.state.start("main");
		this.music.stop ();
	},
	
	instruction: function(){

        gtag('event', 'Instructions', {
          'event_category': 'Player clicked to view instructions'
        });



		this.item = this.game.add.sprite(400, 400, 'instruction');
		this.item.anchor.setTo(0.5,0.5);
		this.game.add.tween(this.item).to({x: game.world.centerX, y: game.world.centerY}, 800, Phaser.Easing.Bounce.In, true, 100, 0);
		
		var hidExit = game.add.button(308, 33, 'exit', this.exitInstructions, this);
        hidExit.anchor.setTo(0.5, 0.5);
        hidExit.input.useHandCursor = true;
		
		this.twitter.inputEnabled = false;
		this.facebook.inputEnabled = false;
		this.startGame.inputEnabled = false;
		this.instructions.inputEnabled = false;
	},
	
	exitInstructions: function (){
		this.game.add.tween(this.item).to({x: 400, y: 400}, 1000, Phaser.Easing.Bounce.Out, true, 300, 0);
		
		this.twitter.inputEnabled = true;
		this.twitter.input.useHandCursor = true;
		this.facebook.inputEnabled = true;
		this.facebook.input.useHandCursor = true;
		this.startGame.inputEnabled = true;
		this.startGame.input.useHandCursor = true;
		this.instructions.inputEnabled = true;
		this.instructions.input.useHandCursor = true;
	},

	shareOnFacebook: function (){
        gtag('event', 'Share', {
          'event_category': 'Player clicked to share on Facebook'
        });

        social.FacebookShare ();
    },

	shareOnTwitter: function (){

        gtag('event', 'Share', {
          'event_category': 'Player clicked to share on Twitter'
        });


        social.TwitterShare ();
    },

    muteAudio: function () {


        if (this.music.isPlaying) {
            this.mute.animations.play ('mute');
            this.music.stop ();
            gtag('event', 'Mute');
        } else {
            this.mute.animations.play ('music');
            this.music.play ();
            gtag('event', 'UnMute');
        }
    },

    
    loadStart: function () {
    },


    loadComplete: function () {
    
        this.loadText.setText = "";
    
    }


}
