var score = 0;
var speedIncrement = 0.025;

var gameState1 = {
     create: function(){
          createBackBar(this, function(){game.state.start("menu");});
          currentLevelIndex = 0;
   
          // placing the ring in the center of the canvas
          this.ring = game.add.sprite(game.width / 2, game.height / 2, "ring");
          // setting ring anchor point to its middle
          this.ring.anchor.set(0.5);
          // setting it to half/transparent
          this.ring.alpha = 0.5;

          this.ring.inputEnabled = true;

          // placing the ball, no matter where as we will change its position later
          this.ball = game.add.sprite(0, 0, ballSkin);
          this.ball.height = 50;
          this.ball.width = 50;
          // setting ball anchor point to its middle
          this.ball.anchor.set(0.5);
          // let's put a fake start angle just to let next method placeBall work properly
          this.ball.ballAngle = -90;
          // this function will place the ball in a random spot around the ring
          this.placeBall();         
          // placing the bar in the middle of the canvas
          this.bar = game.add.sprite(game.width / 2, game.height / 2, "bar");
          // setting bar anchor point
          this.bar.anchor.set(0, 0.5);
          // rotating bar to make it vertical
          this.bar.angle = -90;
          // crossingBall property is used to check if the bar is crossing the ball.
          // the game does not allow the bar to cross the ball, so it will be game over
          this.bar.crossingBall = false;
          // setting bar rotation direction
          this.bar.rotationDirection = 0;

          // creating restart button
          this.restartButton = game.add.sprite(game.width / 2, game.height / 2, "reload");
          this.restartButton.anchor.set(0.5);
          this.restartButton.width = this.ring.width/4;
          this.restartButton.height = this.ring.height/4;
          this.restartButton.visible = false;

          //Score
          this.scoreText = game.add.text(16, 16*4, 'Score: 0', { fontSize: '32px', fill: '#000' });

          //Record Score
          this.recordText = game.add.text(16, 16*6, 'Record: '+record.toFixed(0), { fontSize: '32px', fill: '#000' });

          // waiting for a game input then call startMoving function
          //game.input.onDown.add(this.startMoving, this);
          this.ring.events.onInputDown.add(this.startMoving, this);

          this.placeNextLevelArrows();
          
     },
     placeBall: function(){
          //  we want to move the ball by at least 40 degrees
          do{
               var newAngle = game.rnd.angle();
          } while (angleDifference(newAngle, this.ball.ballAngle) < 40)
          // setting ballAngle property accordingly
          this.ball.ballAngle = newAngle;  
          // placing the ball accordingly thanks to trigonometry
          this.ball.x = game.width / 2 + 175 * Math.cos(Phaser.Math.degToRad(this.ball.ballAngle));
          this.ball.y = game.height / 2 + 175 * Math.sin(Phaser.Math.degToRad(this.ball.ballAngle));  
     },
     startMoving: function(){
          fx.play("ball_click");
          // removing the old input listener
          //game.input.onDown.remove(this.startMoving, this);
          this.ring.events.onInputDown.remove(this.startMoving, this);
          // adding a new input listener calling changeDirection function  
          //game.input.onDown.add(this.changeDirection, this);
          this.ring.events.onInputDown.add(this.changeDirection, this);
          // setting rotation direction
          this.bar.rotationDirection = 1;     
     },
     changeDirection: function(){
          fx.play("ball_click");
          // determining the difference between bar and circle angles
          var angleDifference = Math.abs(this.ball.ballAngle - this.bar.angle);
          // if angle difference is greater than the maximum allowed...
          if(angleDifference > maxAngleDifference){
               // it's game over
               this.fail();
          }
          else{

               score+=(maxAngleDifference-angleDifference);
               this.scoreText.text = "Score: "+score.toFixed(0);
               rotationSpeed*=1+speedIncrement;


               if(score >= levels[currentLevelIndex][3]){
                    rightArrow.alpha = 1;
                    levels[currentLevelIndex][2] = true;
               }

               // resetting crossingBall property
               this.bar.crossingBall = false;
               // inverting rotation direction
               this.bar.rotationDirection *= -1;
               // placing the ball elsewhere
               this.placeBall();
          }
     },
     update: function(){
          // moving the bar according to its rotation speed
          this.bar.angle += rotationSpeed * this.bar.rotationDirection;
          // determining the difference between bar and circle angles
          var angleDifference = Math.abs(this.ball.ballAngle - this.bar.angle);
          // if the angle difference is less than the max angle difference allowed,
          // the bar is crossing the ball
          if(angleDifference < maxAngleDifference && !this.bar.crossingBall){
               // so we set crossingBall property to true
               this.bar.crossingBall = true;
          } 
          // if the angle difference is greater than the max difference allowrd
          // and we are crossing the ball, it means we missed the bar
          if(angleDifference > maxAngleDifference && this.bar.crossingBall){
               // and it's game over
               this.fail();
          }
     },
     fail: function(){
          // stop bar rotation
          this.bar.rotationDirection = 0;
          // tint bar  
          this.bar.tint = 0xff0000; 
          this.scoreText.addColor("#f00", 0);
          
          if(record<score){
               record = score;
               this.recordText.text = "Record: "+record.toFixed(0);
               localStorage.setItem("high-score", record.toFixed(0)+"");

          }
          rotationSpeed = initialSpeed;

          //setFontColor(this.scoreText,"#FF0000");
          this.restartButton.visible = true;

          //Set onClick to restart the game.
          //game.input.onDown.add(this.restartGame, this);
          this.ring.events.onInputDown.add(this.restartGame, this);
 
     },
     restartGame: function(){
          this.restartButton.visible = false;
          this.bar.tint = 0xffffff;

          this.scoreText.addColor("#000", 0);
          score = 0;
          this.scoreText.text = "Score: "+score; 

          //game.input.onDown.remove(this.restartGame, this);
          this.ring.events.onInputDown.remove(this.restartGame, this);
          this.placeBall();         
          this.bar.crossingBall = false;
          this.startMoving();
     },
     placeNextLevelArrows: function(){
          rightArrow = game.add.button(
               game.width-getWidthPercentage(15)/2,
               getHeightPercentage(65)/2+getHeightPercentage(20),
               "backButton",
               this.rightArrowClicked
          );
          if(!levels[currentLevelIndex+1][2]){
               rightArrow.alpha = 0.3;
          }
          rightArrow.anchor.setTo(0.5);
          rightArrow.angle = 180;
          rightArrow.width = getWidthPercentage(actionBarHeight)*2;
          rightArrow.height = getWidthPercentage(actionBarHeight)*2;
     },
     rightArrowClicked: function(){
          openNextLevel();
     },
     leftArrowClicked: function(){
          
     }
}

// this function returns the difference between two angles, in degrees 
function angleDifference(a1, a2){
     return Math.abs((a1 + 180 -  a2) % 360 - 180);
}