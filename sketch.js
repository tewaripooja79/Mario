var gameState = "Play";
var ground, groundImage, bg, bgImage;
var mario, mAnimation;
var obstacle, obstacleAnimation, brick, bricksImage;
var score;
var obstaclesGroup, bricksGroup;
var jumpSound, dieSound, checkPointSound;
var collidedAnimation;
var gameOver, gameOverImage, restart, restartImage;
var highScore=0;


function preload() {

  bgImage = loadImage("bg.png");
  groundImage = loadImage("ground2.png");
  mAnimation = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  obstacleAnimation = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");
  bricksImage = loadImage("brick.png");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  collidedAnimation = loadAnimation("collided.png");
  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");


}

function setup() {
  createCanvas(600, 400);

  bg = createSprite(200, 200, 600, 400);
  bg.addImage(bgImage);
  bg.x = bg.width / 2;
  bg.scale = 1.1;

  ground = createSprite(200, 370, 250, 10);
  ground.addImage(groundImage);
  ground.scale = 1.0;
  console.log(ground.x);

  mario = createSprite(50, 210, 10, 40);
  mario.addAnimation("ani", mAnimation);
  mario.addAnimation("collide", collidedAnimation);
  mario.scale = 1.4;

  restart = createSprite(300, 200);
  restart.addImage(restartImage);
  restart.scale = 0.5;

  gameOver = createSprite(290, 160);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.7;


  bricksGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
  mario.setCollider("rectangle", 0, 0, 35, 35);
  mario.debug = true;
}

function draw() {
  background(210);

  if (gameState === "Play") {
    ground.velocityX = -10;

    if (keyDown("space") && mario.y > 150) {
      mario.velocityY = -10;
      jumpSound.play();

    }
    mario.velocityY = mario.velocityY + 0.8;


    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }


    if (mario.isTouching(obstaclesGroup)) {
      gameState = "End";
      mario.changeAnimation("collide", collidedAnimation);
      dieSound.play();
    }

    for (i = 0; i < bricksGroup.length; i++) {
      if (mario.isTouching(bricksGroup.get(i))) {
        score = score + 1;
        
        if(highScore<score){
          highScore=score;
        }
        
        bricksGroup.get(i).destroy();
      }
    }

    if (score > 0 && score%100===0) {
      checkPointsound.play();
    }

    obstacles();
    bricks();

    gameOver.visible = false;
    restart.visible = false;

  } else if (gameState === "End") {
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetime=(-1);
    bricksGroup.setLifetime=(-1);
    
    restart.visible = true;
    gameOver.visible = true;
    
    if(mousePressedOver(restart)){
      reset();
    }

  }
  mario.collide(ground);
  drawSprites();

  textSize(18);
  fill(0)
  text("SCORE: " + score, 350, 40);
  textSize(16);
  fill(120);
  text("HighestScore:" + highScore,350,60);
}

function reset(){
  gameState="Play";
  score=0;
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  mario.changeAnimation("ani", mAnimation);
}

function obstacles() {

  if (frameCount % 30 === 0) {
    obstacle = createSprite(600, 315, 10, 30);
    obstacle.velocityX = -10;
    obstacle.addAnimation("obsAni", obstacleAnimation);
    obstacle.scale = 0.7;
    obstacle.lifetime = 170;
    obstaclesGroup.add(obstacle);

  }
}

function bricks() {

  if (frameCount % 50 === 0) {
    brick = createSprite(600, 300, 10, 10);
    brick.velocityX = -3;
    brick.addImage(bricksImage);
    brick.scale = 0.7;

    brick.lifetime = 200;
    brick.y = Math.round(random(170, 200));
    bricksGroup.add(brick);
  }
}