var menuOptions = new Array(
        ["Play",function(){game.state.start("game1");}],
        ["Extras",function(){game.state.start("extras");}],
        ["Credits",function(){game.state.start("game1");}]
        );

var menuOptionsWithBonus = new Array(
        ["Play",function(){game.state.start("game1");}],
        ["Play Bonus",function(){game.state.start("gameBonus");}],
        ["Extras",function(){game.state.start("extras");}],
        ["Credits",function(){game.state.start("game1");}]
        );

var buttonHeight = 100;
var horizontalMargin = 200;
var verticalMargin = 25;

var realButtonHeight = buttonHeight+verticalMargin*2;//Considering margins

var menuMarginTop;

var menuState= {
	create: function(){
                var menuToUse;
                if(record>=secretLevelScore){
                        menuToUse = menuOptionsWithBonus;
                }else{
                        menuToUse = menuOptions;
                }
                var menuItemsCount = menuToUse.length;
                menuMarginTop = (game.height-(menuItemsCount*realButtonHeight))/2;

                for (var i = 0; i < menuToUse.length; i++) {
                        this.createMenuOption(menuToUse[i][0], i, menuToUse[i][1]);
                };

	},
        createMenuOption: function(title, position, actionCallback){
                
                var initX = horizontalMargin;
                var endX = game.width-horizontalMargin*2;
                var initY = menuMarginTop + (position*realButtonHeight);
                var endY = buttonHeight;


                var bar = game.add.graphics();
                bar.beginFill(0x000000, 0.2);
                bar.drawRect(initX, initY, endX, endY);
                bar.inputEnabled = true;

                var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

                //  The Text is positioned at 0, 100
                text = game.add.text(0, 0, title, style);
                text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

                //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
                text.setTextBounds(initX, initY, endX, endY);
                bar.events.onInputDown.add(actionCallback, this);

        }
}