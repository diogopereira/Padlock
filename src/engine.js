// the game itself
var game;

// gameState | gameState | unlocked | pointsObjective
var levels = new Array(
	["game1", gameState1, true, 100],
	["game2", gameState2, false, 200],
	["game3", gameState3, false, 300]
);
var currentLevelIndex = -1;

// a selection of colors to be randomly picked and set as background color
var bgColors = [0x62bd18, 0xff5300, 0xd21034, 0xff475c, 0x8f16b2, 0x588c7e, 0x8c4646];
// lock rotatiokn speed
var initialSpeed = 2;
var rotationSpeed = initialSpeed;
// maximum angle difference allowed between the ball and the ball
var maxAngleDifference = 15;

var record = 0;
//var score = 0;


var secretLevelScore = 100;
var isBonusLevelVisible = false;

var fx;

var actionBarHeight = 10;

var ballSkin = "ball";


window.onload = function() {
    // creation of the game
	game = new Phaser.Game(640, 960, Phaser.AUTO, "");
    // creation of the main (and only) game state
    game.state.add("boot", bootState);
    game.state.add("load", loadState);
    game.state.add("menu", menuState);
    game.state.add("extras", extrasState);
    game.state.add("gameBonus", gameBonusState);
    for(var i = 0; i<levels.length ; i++){
    	    game.state.add(levels[i][0], levels[i][1]);
    }
    
    game.state.start("boot");
}

function createBackBar(context, backCallbackAction){
	var bar = game.add.graphics();
	bar.beginFill(0x000000, 0.2);
	bar.drawRect(0, 0, game.width, getWidthPercentage(actionBarHeight));

	//var backButton = game.add.sprite(0, 0, "backButton");
	var	backButton = game.add.button(0,0,"backButton", backCallbackAction);

	backButton.width = getWidthPercentage(actionBarHeight);
	backButton.height = getWidthPercentage(actionBarHeight);
	backButton.inputEnabled = true;

	backButton.events.onInputDown.add(backCallbackAction, context);
}

function getWidthPercentage(percentage){
	return game.width*percentage/100;	
}

function getHeightPercentage(percentage){
	return game.height*percentage/100;	
}

function getGameHeightWithoutTopBar(){
	return game.height-getWidthPercentage(actionBarHeight);
}

function openNextLevel(){
	if(currentLevelIndex==levels.length-1){
		return;
	}

	if(!levels[currentLevelIndex+1][2]){//If unlocked
		return;
	}
	currentLevelIndex++;
	game.state.start(levels[currentLevelIndex][0]);
}

function openPreviousLevel(){
	if(currentLevelIndex<=0){
		return;
	}
	currentLevelIndex--;
	game.state.start(levels[currentLevelIndex][0]);
}
