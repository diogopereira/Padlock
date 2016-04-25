var ring1, ring2;
var bar1, bar2;
var ball1, ball2;

var speedIncrement = 0.025;

var gameBonusState = {
     create: function(){  
          createBackBar(this, function(){game.state.start("menu");});
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
          // placing the ring in the center of the canvas
          ring1 = game.add.sprite(game.width / 2, getGameHeightWithoutTopBar() / 4+getWidthPercentage(10), "ring");
          ring1.anchor.set(0.5);
          ring1.alpha = 0.5;
          ring1.inputEnabled = true;

          ring2 = game.add.sprite(game.width / 2, getGameHeightWithoutTopBar() - (getGameHeightWithoutTopBar()/4)+getWidthPercentage(10), "ring");
          ring2.anchor.set(0.5);
          ring2.alpha = 0.5;
          ring2.inputEnabled = true;

          // placing the ball, no matter where as we will change its position later
          ball1 = game.add.sprite(0, getWidthPercentage(10), ballSkin);
          ball1.height = 50;
          ball1.width = 50;
          ball1.anchor.set(0.5);
          ball1.ballAngle = -90;

          ball2 = game.add.sprite(0, getWidthPercentage(10), ballSkin);
          ball2.height = 50;
          ball2.width = 50;
          ball2.anchor.set(0.5);
          ball2.ballAngle = -90;
          // this function will place the ball in a random spot around the ring
          this.placeBall1();
          this.placeBall2();         

          bar1 = game.add.sprite(game.width / 2, getGameHeightWithoutTopBar() / 4 + getWidthPercentage(10), "bar");
          bar1.anchor.set(0, 0.5);
          bar1.angle = -90;
          bar1.crossingBall = false;
          bar1.rotationDirection = 0;

          bar2 = game.add.sprite(game.width / 2, getGameHeightWithoutTopBar() - (getGameHeightWithoutTopBar()/4) + getWidthPercentage(10), "bar");
          bar2.anchor.set(0, 0.5);
          bar2.angle = -90;
          bar2.crossingBall = false;
          bar2.rotationDirection = 0;

          // creating restart button
          this.restartButton = game.add.sprite(game.width / 2, getGameHeightWithoutTopBar() / 4, "reload");
          this.restartButton.anchor.set(0.5);
          this.restartButton.width = ring1.width/4;
          this.restartButton.height = ring1.height/4;
          this.restartButton.visible = false;

          //Score
          this.scoreText = game.add.text(16, 16*4, 'Score: 0', { fontSize: '32px', fill: '#000' });
          this.score = 0;

          //Record Score
          this.recordText = game.add.text(16, 16*6, 'Record: '+record.toFixed(0), { fontSize: '32px', fill: '#000' });

          // waiting for a game input then call startMoving function
          //game.input.onDown.add(this.startMoving, this);

          this.barTop = game.add.graphics();
          this.barTop.beginFill(0x000000, 0);
          this.barTop.drawRect(0, getWidthPercentage(10), game.width, getGameHeightWithoutTopBar()/2);
          this.barTop.inputEnabled = true;

          this.barBottom = game.add.graphics();
          this.barBottom.beginFill(0x000000, 0);
          this.barBottom.drawRect(0, getGameHeightWithoutTopBar()/2, game.width, getGameHeightWithoutTopBar());
          this.barBottom.inputEnabled = true;

          this.barTop.events.onInputDown.add(this.startMoving, this);
          this.barBottom.events.onInputDown.add(this.startMoving, this);

     },
     placeBall1: function(){
          //  we want to move the ball by at least 40 degrees
          do{
               var newAngle = game.rnd.angle();
          } while (angleDifference(newAngle, ball1.ballAngle) < 40)
          // setting ballAngle property accordingly
          ball1.ballAngle = newAngle;  
          // placing the ball accordingly thanks to trigonometry
          ball1.x = game.width / 2 + 175 * Math.cos(Phaser.Math.degToRad(ball1.ballAngle));
          ball1.y = (getGameHeightWithoutTopBar() / 4 + getWidthPercentage(10)) + 175 * Math.sin(Phaser.Math.degToRad(ball1.ballAngle));  
     },
     placeBall2: function(){
          //  we want to move the ball by at least 40 degrees
          do{
               var newAngle = game.rnd.angle();
          } while (angleDifference(newAngle, ball2.ballAngle) < 40)
          // setting ballAngle property accordingly
          ball2.ballAngle = newAngle;  
          // placing the ball accordingly thanks to trigonometry
          ball2.x = game.width / 2 + 175 * Math.cos(Phaser.Math.degToRad(ball2.ballAngle));
          ball2.y = (getGameHeightWithoutTopBar() - (getGameHeightWithoutTopBar()/4)+getWidthPercentage(10)) + 175 * Math.sin(Phaser.Math.degToRad(ball2.ballAngle));  
     },
     startMoving: function(){
          fx.play("ball_click");
          // removing the old input listener
          //game.input.onDown.remove(this.startMoving, this);
          this.barTop.events.onInputDown.remove(this.startMoving, this);
          this.barBottom.events.onInputDown.remove(this.startMoving, this);
          // adding a new input listener calling changeDirection function  
          //game.input.onDown.add(this.changeDirection, this);
          this.barTop.events.onInputDown.add(this.changeDirection1, this);
          this.barBottom.events.onInputDown.add(this.changeDirection2, this);
          // setting rotation direction
          bar1.rotationDirection = 1;     
          bar2.rotationDirection = 1;     
     },
     changeDirection1: function(){
          fx.play("ball_click");
          // determining the difference between bar and circle angles
          var angleDifference = Math.abs(ball1.ballAngle - bar1.angle);
          // if angle difference is greater than the maximum allowed...
          if(angleDifference > maxAngleDifference){
               // it's game over
               this.fail();
          }
          else{

               this.score+=(maxAngleDifference-angleDifference);
               this.scoreText.text = "Score: "+this.score.toFixed(0);
               rotationSpeed*=1+speedIncrement;

               // resetting crossingBall property
               bar1.crossingBall = false;
               // inverting rotation direction
               bar1.rotationDirection *= -1;
               // placing the ball elsewhere
               this.placeBall1();
          }
     },
     changeDirection2: function(){
          fx.play("ball_click");
          // determining the difference between bar and circle angles
          var angleDifference = Math.abs(ball2.ballAngle - bar2.angle);
          // if angle difference is greater than the maximum allowed...
          if(angleDifference > maxAngleDifference){
               // it's game over
               this.fail();
          }
          else{

               this.score+=(maxAngleDifference-angleDifference);
               this.scoreText.text = "Score: "+this.score.toFixed(0);
               rotationSpeed*=1+speedIncrement;

               // resetting crossingBall property
               bar2.crossingBall = false;
               // inverting rotation direction
               bar2.rotationDirection *= -1;
               // placing the ball elsewhere
               this.placeBall2();
          }
     },
     update: function(){
          // moving the bar according to its rotation speed
          bar1.angle += rotationSpeed * bar1.rotationDirection;
          bar2.angle += rotationSpeed * bar2.rotationDirection;
          // determining the difference between bar and circle angles
          var angleDifference1 = Math.abs(ball1.ballAngle - bar1.angle);
          var angleDifference2 = Math.abs(ball2.ballAngle - bar2.angle);
          // if the angle difference is less than the max angle difference allowed,
          // the bar is crossing the ball
          if(angleDifference1 < maxAngleDifference && !bar1.crossingBall){
               // so we set crossingBall property to true
               bar1.crossingBall = true;
          }
          if(angleDifference2 < maxAngleDifference && !bar2.crossingBall){
               // so we set crossingBall property to true
               bar2.crossingBall = true;
          }

          // if the angle difference is greater than the max difference allowrd
          // and we are crossing the ball, it means we missed the bar
          if(angleDifference1 > maxAngleDifference && bar1.crossingBall){
               // and it's game over
               this.fail();
          }
          if(angleDifference2 > maxAngleDifference && bar2.crossingBall){
               // and it's game over
               this.fail();
          }
     },
     fail: function(){
          // stop bar rotation
          bar1.rotationDirection = 0;
          bar2.rotationDirection = 0;

          // tint bar  
          bar1.tint = 0xff0000;
          bar2.tint = 0xff0000;
          this.scoreText.addColor("#f00", 0);
          
          if(record<this.score){
               record = this.score;
               this.recordText.text = "Record: "+record.toFixed(0);
          }
          rotationSpeed = initialSpeed;

          this.restartButton.visible = true;

          //Set onClick to restart the game.
          this.barTop.events.onInputDown.add(this.restartGame, this);
          this.barBottom.events.onInputDown.add(this.restartGame, this);
 
     },
     restartGame: function(){
          this.restartButton.visible = false;
          bar1.tint = 0xffffff;
          bar2.tint = 0xffffff;

          this.scoreText.addColor("#000", 0);
          this.score = 0;
          this.scoreText.text = "Score: "+this.score; 

          //game.input.onDown.remove(this.restartGame, this);
          this.barTop.events.onInputDown.remove(this.restartGame, this);
          this.barBottom.events.onInputDown.remove(this.restartGame, this);
          
          this.placeBall1();
          this.placeBall2();         
          
          bar1.crossingBall = false;
          bar2.crossingBall = false;

          this.startMoving();
     },
     createPreviousLevelText: function(){
          var bar = game.add.graphics();
          bar.beginFill(0xFFC0CB, 0.5);
          bar.drawRect(0, getGameHeightWithoutTopBar()/2-25, game.width/3, 50);
          bar.inputEnabled = true;

          var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

          //  The Text is positioned at 0, 100
          text = game.add.text(0, 0, "I give up!", style);
          text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

          //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
          text.setTextBounds(0, getGameHeightWithoutTopBar()/2-50, game.width/3, 100);
          bar.events.onInputDown.add(this.goToPreviousLevel, this);

     },
     goToPreviousLevel: function(){
          game.state.start("game1");
     }
}

// this function returns the difference between two angles, in degrees 
function angleDifference(a1, a2){
     return Math.abs((a1 + 180 -  a2) % 360 - 180);
}