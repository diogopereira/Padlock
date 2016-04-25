var skinOptions = new Array(
        ["White", "ball"],
        ["Star", "locked"],
        ["Cross", "cross"],
        ["Mackerel", "merkel"],
        ["White", "ball"],
        ["White", "ball"],
        ["White", "ball"],
        ["White", "ball"],
        ["White", "ball"],
        ["White", "ball"],
        ["White", "ball"],
        ["White", "ball"],

        ["White", "ball"],
        ["Star", "ball"],
        ["Cross", "cross"],
        ["White", "ball"],
        ["White", "ball"],
        ["White", "ball"],
        ["White", "ball"],
        ["White", "ball"],
        ["White", "ball"],
        ["White", "ball"],
        ["White", "ball"],
        ["White", "ball"]
        );

// number of thumbnail rows
var thumbRows = 4;
// number of thumbnail cololumns
var thumbCols = 3;
// width of a thumbnail, in pixels
var thumbWidth;
// height of a thumbnail, in pixels
var thumbHeight;
// space among thumbnails, in pixels
var thumbSpacing = 8;
// how many pages are needed to show all levels?
// CAUTION!! EACH PAGE SHOULD HAVE THE SAME AMOUNT OF LEVELS, THAT IS
// THE NUMBER OF LEVELS *MUST* BE DIVISIBLE BY THUMBCOLS*THUMBROWS
var pages = skinOptions.length/(thumbRows*thumbCols);
// group where to place all level thumbnails
var levelThumbsGroup;
// current page
var currentPage = 0;
// arrows to navigate through level pages
var leftArrow;
var rightArrow;
var currentBall;

var extrasState= {
	create: function(){
		createBackBar(this, function(){game.state.start("menu");});

		var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		var text = game.add.text(0, getWidthPercentage(12.5), 'Choose your ball face!', style);
		text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

		//  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
		text.setTextBounds(0, 0, game.width, 100);

		var bar = game.add.graphics();
		bar.beginFill(0x000000, 0.2);
		bar.drawRect(getWidthPercentage(15), getHeightPercentage(20), getWidthPercentage(70), getHeightPercentage(65));

		var currentBallbar = game.add.graphics();
		currentBallbar.beginFill(0x000000, 0.2);
		currentBallbar.drawRect(game.width/2-55, game.height-120, 110, 110);

		currentBall = game.add.sprite(game.width/2, game.height-65, ballSkin);
		currentBall.height = 90;
		currentBall.width = 90;
		currentBall.anchor.setTo(0.5);

		thumbWidth = thumbHeight = getWidthPercentage(70)/thumbCols;

		// placing left and right arrow buttons, will call arrowClicked function when clicked
		leftArrow = game.add.button(getWidthPercentage(15)/2,getHeightPercentage(65)/2+getHeightPercentage(20),"backButton", this.leftArrowClicked);
		leftArrow.anchor.setTo(0.5);
		leftArrow.alpha = 0.3;
		leftArrow.width = getWidthPercentage(actionBarHeight)*2;
		leftArrow.height = getWidthPercentage(actionBarHeight)*2;
		
		rightArrow = game.add.button(game.width-getWidthPercentage(15)/2,getHeightPercentage(65)/2+getHeightPercentage(20),"backButton", this.rightArrowClicked);
		rightArrow.anchor.setTo(0.5);
		rightArrow.angle = 180;
		rightArrow.width = getWidthPercentage(actionBarHeight)*2;
		rightArrow.height = getWidthPercentage(actionBarHeight)*2;

		// creation of the thumbails group
		levelThumbsGroup = game.add.group();
		// determining level thumbnails width and height for each page
		var levelLength = thumbWidth*thumbCols+thumbSpacing*(thumbCols-1);
		var levelHeight = thumbWidth*thumbRows+thumbSpacing*(thumbRows-1);
		// looping through each page
		for(var l = 0; l < pages; l++){
			// horizontal offset to have level thumbnails horizontally centered in the page
			var offsetX = (game.width-levelLength)/2+game.width*l+45;
			// I am not interested in having level thumbnails vertically centered in the page, but
			// if you are, simple replace my "20" with
			// (game.height-levelHeight)/2
			var offsetY = (game.height-levelHeight)/2+50;
			// looping through each level thumbnails
			for(var i = 0; i < thumbRows; i ++){
				for(var j = 0; j < thumbCols; j ++){  
					// which level does the thumbnail refer?
					var levelNumber = i*thumbCols+j+l*(thumbRows*thumbCols);
					// adding the thumbnail, as a button which will call thumbClicked function if clicked   	
					var levelThumb = game.add.button(offsetX+j*(thumbWidth+thumbSpacing), offsetY+i*(thumbHeight+thumbSpacing), skinOptions[levelNumber][1], this.thumbClicked, this);	
					// custom attribute 
					levelThumb.levelNumber = levelNumber+1;
					levelThumb.iconKey = skinOptions[levelNumber][1];
					levelThumb.height = levelThumb.width = 50;
					
					// adding the level thumb to the group
					levelThumbsGroup.add(levelThumb);
					// if the level is playable, also write level number
					var style = {
							font: "18px Arial",
							fill: "#ffffff"
						};
					var levelText = game.add.text(levelThumb.x+5,levelThumb.y+5+50,skinOptions[levelNumber][0],style);
						levelText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 1);
						levelThumbsGroup.add(levelText);
				}
			}
		}

	},
	rightArrowClicked: function(button){
		if(button.alpha==0.3)
			return;
		leftArrow.alpha = 1;
		currentPage++;
		// fade out the button if we reached last page
		if(currentPage == pages-1){
			button.alpha = 0.3;
		}
		// scrolling level pages
		var buttonsTween = game.add.tween(levelThumbsGroup);
		buttonsTween.to({
			x: currentPage * game.width * -1
		}, 500, Phaser.Easing.Cubic.None);
		buttonsTween.start();
	},
	leftArrowClicked: function(button){
		if(button.alpha==0.3)
			return;
		rightArrow.alpha = 1;
		currentPage--;
		// fade out the button if we reached first page
		if(currentPage == 0){
			button.alpha = 0.3;
		}
		// scrolling level pages
		var buttonsTween = game.add.tween(levelThumbsGroup);
		buttonsTween.to({
			x: currentPage * game.width * -1
		}, 400, Phaser.Easing.Cubic.None);
		buttonsTween.start();
	},
	thumbClicked: function(button){
	// the level is playable, then play the level!!
	ballSkin = button.iconKey;
	if(ballSkin.localeCompare("locked")!=0){
		ballSkin = button.iconKey;
		currentBall.loadTexture(ballSkin);
		currentBall.height = 90;
		currentBall.width = 90;
		localStorage.setItem("ball-skin", ballSkin);
	}
	// else, let's shake the locked levels
	else{
		var buttonTween = game.add.tween(button)
		buttonTween.to({
			x: button.x+thumbWidth/15
		}, 20, Phaser.Easing.Cubic.None);
		buttonTween.to({
			x: button.x-thumbWidth/15
		}, 20, Phaser.Easing.Cubic.None);
		buttonTween.to({
			x: button.x+thumbWidth/15
		}, 20, Phaser.Easing.Cubic.None);
		buttonTween.to({
			x: button.x-thumbWidth/15
		}, 20, Phaser.Easing.Cubic.None);
		buttonTween.to({
			x: button.x
		}, 20, Phaser.Easing.Cubic.None);
		buttonTween.start();
	}
	}
}