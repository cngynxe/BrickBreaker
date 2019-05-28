// initializes all variables + canvas

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 100;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 4;
var brickColumnCount = 9;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var intervalScore = 0;
var lives = 3;
var interval = 6;
var paddleMoveX = 5;

// All 'special functions' created by me -- which is likely why they're all so faulty

// bricks can be made smaller [function's operation currently a bit glitchy]

function SmallerBricks(){
  if (brickWidth > 10 && brickHeight >= 5){
    var brickWidth = brickWidth - 20;
    var brickheight = brickHeight - 5;
  } else {
    alert("Brick cannot get any smaller!");
}
}

// switch left and right arrow functions

function ReverseMode(){
  var paddleMoveX = -paddleMoveX;
}

// doubles ball speed

function DoubleSpeed(){
  if (interval > 1) {
    interval = interval/2;
  } else {
    alert("Maximum speed already reached!");
  }
}

// more rows to hit

function MoreRows(){
  if (brickRowCount <= 7){
    brickRowCount = brickRowCount + 1;
    brickColumnCount = 9;
  } else {
    alert("Maximum number of rows reached!");
    var brickColumnCount = 9;
    brickRowCount = 7;
}
}

// switches back to regular settings

function Default(){
  brickRowCount = 4;
  interval = 6;
  paddleMoveX = 5;
  brickWidth = 75;
  brickHeight = 20;
}

document.getElementById("changebutton1").style.visibility = "visible";
document.getElementById("changebutton2").style.visibility = "visible";
document.getElementById("changebutton3").style.visibility = "visible";
document.getElementById("changebutton4").style.visibility = "visible";
document.getElementById("changebutton5").style.visibility = "visible";


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
      document.getElementById("changebutton1").style.visibility = "visible";
      document.getElementById("changebutton2").style.visibility = "visible";
      document.getElementById("changebutton3").style.visibility = "visible";
      document.getElementById("changebutton4").style.visibility = "visible";
      document.getElementById("changebutton5").style.visibility = "visible";

      var bricks = [];
        for (var c = 0; c < brickColumnCount; c++) {
          bricks[c] = [];
          for (var r = 0; r < brickRowCount; r++) {
              bricks[c][r] = { x: 0, y: 0, status: 1};
          }
      }

      function collisionDetection() {
        for(var c=0; c<brickColumnCount; c++) {
          for(var r=0; r<brickRowCount; r++) {
              var b = bricks[c][r];
                if(b.status == 1) {
                  if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                      dy = -dy;
                      b.status = 0;
                      score++;
                      if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, WITH A GRAND TOTAL OF" + score + " POINTS!");
                        document.location.reload();
                        clearInterval(interval); // Needed for Chrome to end game
                    }
                }
            }
        }
    }
}

// draws canvas items

      function drawScore(){
        ctx.font = "16x Arial";
        ctx.fillstyle = "#0095DD";
        ctx.fillText("Score: "+score, 8, 20);
      }
      function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Lives: "+lives, canvas.width-65, 20);
      }
      function drawBall() {
          ctx.beginPath();
          ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
      }
      function drawPaddle() {
          ctx.beginPath();
          ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
      }

      function drawBricks() {
          for (var c = 0; c < brickColumnCount; c++) {
              for (var r = 0; r < brickRowCount; r++) {
                  if (bricks[c][r].status == 1) {
                      var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                      var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                      bricks[c][r].x = brickX;
                      bricks[c][r].y = brickY;
                      ctx.beginPath();
                      ctx.rect(brickX, brickY, brickWidth, brickHeight);
                      ctx.fillStyle = "#0095DD";
                      ctx.fill();
                      ctx.closePath();
                  }
              }
          }
      }

  // updates canvas items every interval 

      function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawBricks();
          drawBall();
          drawScore();
          drawLives();
          drawPaddle();
          collisionDetection();

          if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
              dx = -dx;
          }
          if (y + dy < ballRadius) {
              dy = -dy;
          }
          else if (y + dy > canvas.height - ballRadius) {
              if (x > paddleX - 10 && x < paddleX + paddleWidth + 10) {
                  if (y = y - paddleHeight) {
                      dy = -dy;
                  }
              }
              else {
                lives--;
                  if(!lives) {
                    alert("GAME OVER! YOUR FINAL SCORE IS " + score + "!");
                    document.location.reload();
                    clearInterval(interval); // Needed for Chrome to end game
                  }
                  else if (lives > 0){
                    alert("One life was lost! You have " + lives + " lives remaining!");
                    x = canvas.width/2;
                    y = canvas.height-30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width-paddleWidth)/2;
                  };
              }
          }

          if (rightPressed && paddleX < canvas.width - paddleWidth) {
              paddleX = paddleX + paddleMoveX;
          }
          else if (leftPressed && paddleX > 0) {
              paddleX = paddleX - paddleMoveX;
          }

          x += dx;
          y += dy;

      }

      if (score >= 5 && intervalScore == 0) {
        interval = interval - 2;
        setInterval(draw, interval);
        intervalScore = score;
        console.log(intervalScore);
        console.log(interval);
      }

      if (intervalScore >= score/2 && intervalScore != 0) {
        interval = interval - 2;
        paddleWidth = paddleWidth - 10;
        setInterval(draw, interval);
        intervalScore = score;
        console.log(intervalScore);
        console.log(interval);
      }

      setInterval(draw, interval);
    }
}
