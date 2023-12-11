// Player object with initial properties
const player = {
  posX: 0,
  posY: 0,
  size: 50,
  forceY: 0,
  isJumping: false,
  timeJump: 0
}

// Initial set of obstacles
const obstacles = [{
  posX: 600,
  height: 50,
  width: 70
},{
  posX: 1800,
  height: 50,
  width: 70
},{
  posX: 2500,
  height: 50,
  width: 70
}];

const coins = [{
  posX: 0,
  posY: 0
},
{
  posX: 0,
  posY: 0
}];

// Constants for gravity, map speed, background position, floor position, etc.
const gravity = 0.3;
const mapSpeed = 5;

let background_posx = 0;

const floorPosition = 100;

let gameover = false;
let gameStarted = false;

let backgroundImage;

let score = 0;

// Setup function to create the canvas and initialize variables
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  
  player.posX = width / 3;
  player.posY = height - floorPosition - 100;
  
  backgroundImage = loadImage('background.png')
  
  frameRate(60);
}

// Main draw function that is repeatedly called
function draw() {
  background(0);
  textSize(20);
  
  drawBackground();
  
  if(!gameStarted) {
     fill(255);
     textAlign(CENTER);
     textSize(30);
     text("Play to game", width/2, height/2);
     textAlign(LEFT);
  }
  
  // Check if the game is not over
  else if(!gameover) {
    
    // Check for serial connection
    if(!serialActive) {
      fill(255);
      text("Press space to select serial port.", 20, 30);  
    }
    else {
      fill(255);
      text("Connected", 20, 30);  
    }

    // Draw game elements
    drawObstacles();
    drawFloor();
    drawCoins();
    drawPlayer();
    
    fill(255);
    text("Score : " + score, width - 200, 30);

    // Move game elements
    moveBackground();
    movePlayer();
    moveObstacles();
    moveCoins();
    
    score++;
  }
  
  else {
   fill(255);
   textAlign(CENTER);
   textSize(30);
   text("GAME OVER", width/2, height/2);
   textAlign(LEFT);  
  }
}

// Function to draw the floor
function drawFloor() {
  fill(100, 100, 100);
  rect(0, height - floorPosition, width, floorPosition);
}

// Function to draw the player
function drawPlayer() {
  fill(255, 150, 0);
  push();
  
  translate(player.posX, player.posY);
  
  // Rotate player if jumping
  if(player.timeJump > 0 && millis() - player.timeJump < 800) {
    rotate((millis() / 100)%(2*PI));
  }
  else {
    rotate(0);
  }
  
  // Draw a triangular player shape
  triangle(-20, 20, 0, -20, 20, 20);
  
  pop();
}

// Function to draw the background
function drawBackground() {
  image(backgroundImage, background_posx, 0, width, height);
  image(backgroundImage, background_posx + width, 0, width, height);
}

// Function to move the background
function moveBackground() {
  background_posx = (background_posx - 3) % width;
}

// Function to draw obstacles
function drawObstacles() {
  for(o of obstacles) {
    fill(156, 47, 8);
    rect(o.posX, height - floorPosition, o.width, -o.height, 10); 
    
    fill(200, 75, 30);
    noStroke();
    rect(o.posX + o.width/10, height - floorPosition - o.height/10, o.width / 3, -o.height / 3, 5);
    
    fill(140, 30, 0);
    rect(o.posX + o.width - o.width/10, height - floorPosition - o.height + o.height/5, -o.width / 3, o.height / 2, 5);
    
    stroke(0);
  }
}

function drawCoins() {
  for(c of coins) {
    fill(255, 200, 0);
    ellipse(c.posX, c.posY, 30, 30);
  }
}

function moveCoins() {
  for(c of coins) {
    c.posX -= mapSpeed;
    
    if(c.posX < -50 || testCollisionsWithPlayer(c.posX, c.posY)) {
      
      if(c.posX > -50) {
        score += 1000;
      }
      
      c.posX = random(width, width*2);
      c.posY = random(height / 3, height - floorPosition - 50);
      let ob = testCollisions(c.posX, c.posY);
      while(ob) {
        c.posY = height - floorPosition - ob.height - 50;
        ob = testCollisions(c.posX, c.posY);
      }
    }
  }  
}

function testCollisionsWithPlayer(x, y) {
  return (Math.sqrt(Math.pow(player.posX - x, 2) + Math.pow(player.posY - y, 2)) < player.size / 1.5);
}

// Function to test collisions
function testCollisions(x, y) {
  // Test collide with floor
  if(player.forceY > 0 && y > height - floorPosition - player.size/2) {
    return true;
  }
  
  for(o of obstacles) {
    // Test collide with obstacles
    if(x + player.size / 2 > o.posX && x - player.size / 2 < o.posX + o.width && y > height - floorPosition - o.height - player.size / 2) {
      return o;  
    }
  }
  
  return false;
}

// Function to move the player
function movePlayer() {
  let nextPosX = player.posX;
  
  // If there is a collision, move the player to the left
  if(testCollisions(player.posX, player.posY)) {
    player.posX -= mapSpeed;
    nextPosX = player.posX;
    player.isJumping = false;
    
    // Check for game over condition
    if(player.posX < 0 - player.size) {
      gameover = true;
    }
  }
  // If no collision, allow the player to move right
  else if(player.posX < width / 3) {
    nextPosX = player.posX + 1;
  }
  
  const nextPosY = player.posY + player.forceY;
  
  // If there is a collision with the floor or an obstacle, stop jumping
  if(testCollisions(nextPosX, nextPosY)) {
    player.forceY = 0;
    player.isJumping = false;
  }
  else {
    // Move the player and apply gravity
    player.posY = nextPosY;
    player.posX = nextPosX;
    player.forceY += gravity;
  }
}

// Function to move obstacles
function moveObstacles() {
  for(o of obstacles) {
    o.posX -= mapSpeed;
    
    // Reset obstacle position and size if it goes off the screen
    if(o.posX < -o.width) {
      o.posX = random(width, width*1.5);
      o.width = random(50, 200);
      o.height = random(20, 200);
    }
  }
}

// Function to read serial data
function readSerial(data) {
  const pin = data.split(':')[0]; 
  const action = data.split(':')[1];
  
  console.log(data);
  
  if(pin == "2" && action == "pressed") {
    if(!player.isJumping) {
      player.isJumping = true;
      player.timeJump = millis();
      player.forceY = -10;
    }
  }
  
   if(pin == "3" && action == "pressed") {
      if(!gameStarted) {
        gameStarted = true;
      }
     
     if(gameover) {
        gameover = false;
        score = 0;
        player.posX = width / 3;
       
        for(const o of obstacles) o.posX += width;

      }
    }

}

// Function to handle key presses
function keyPressed() {
  // If space is pressed, set up serial communication
  if(key == " ") {
    setUpSerial();
  }
  
  // If 'z' is pressed and the player is not jumping, initiate a jump
  if(key == 'z' && !player.isJumping) {
    player.isJumping = true;
    player.timeJump = millis();
    player.forceY = -10;
  }
}
