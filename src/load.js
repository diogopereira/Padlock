var loadState= {
	preload: function(){
		// preloading the images we are going to use
                // the ball
                game.load.image("ball", "assets/ball.png");
                game.load.image("merkel", "assets/ball_skins/ball_merkel.png");
                // the rotating bar
                game.load.image("bar", "assets/bar.png");
                // the ring
                game.load.image("ring", "assets/ring.png"); 
                // the restart
                game.load.image("reload", "assets/reload.png");

                game.load.image("backButton", "assets/back_icon.png");

                game.load.image("cross", "assets/delete.png");

                game.load.audio('sfx', 'assets/ball_click.wav');
	},
	create: function(){
                // center the game horizontally 
                game.scale.pageAlignHorizontally = true;
                // center the game vertically
                game.scale.pageAlignVertically = true;
                // setting the scale mode to cover the largest part of the screen possible while showing the entire game
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                // picking a random item in bgColors array
                var tintColor = game.rnd.pick(bgColors);
                // setting the document background color to tint color
                document.body.style.background = "#"+tintColor.toString(16);
                // setting the game background color to tint color
                game.stage.backgroundColor = tintColor;

                var recordValue = "0";
                recordValue = localStorage.getItem("high-score", "0");
                if(isNumeric(recordValue)){
                        record = parseInt(recordValue, 10);
                }

                ballSkin = localStorage.getItem("ball-skin");
                if(ballSkin==null || ballSkin=="") ballSkin = "ball";

                //Here we set-up our audio sprite
                fx = game.add.audio('sfx');
                fx.allowMultiple = true;
                fx.addMarker('ball_click', 0.5, 0.5);

		game.state.start("menu");
	}
}



function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
}