var waterDrop, waterGroup;
var bucket;
var time,startTimeA, startTimeB;
var timeL2=0, timeL3=0, flagL2=0, flagL3=0;
var dangerImg, bucketImg, dropImg, boostImg;
var backgroundSound, collectSound, boostSound;
var danger,boost;
var score=0, highScore=0, highScorer,newName;
var PLAY = 1;
var END = 0;
var gameState;
var count=0;
var speed=10;
var restart, edges;
var flagB=0, flagA=0;
var thunderSound, dangerSound, clapSound;
var instruct,instructImg;

function prload(){
    dangerImg=loadImage('images/danger.png');
    bucketImg=loadImage('images/bucket.png');
    dropImg=loadImage('images/drop.png');
    boostImg=loadImage('images/thunder.png');
    backgroundSound=loadSound('sounds/rain_2.wav');
    collectSound=loadSound('sounds/collided.wav');
    boostSound=loadSound('sounds/heavy_rain.wav');
    dangerSound=loadSound('sounds/danger.wav');
    slowSound=loadSound('sounds/light_rain.wav');
    clapSound=loadSound('sounds/Clap.wav');
    backgroundImg=loadImage('images/background.png');
    acidImg=loadImage('images/acid.png');
    instructImg=loadImage('images/Instruction.png');
}

function seup(){
    createCanvas(600,600);
    waterGroup=createGroup();
    dangerGroup=createGroup();
    boostGroup=createGroup(); 
    acidGroup=createGroup();
    bucket=createSprite(300,550,50,100);
    bucket.addImage(bucketImg);
    bucket.scale=0.5
    instruct=createSprite(300,250,50,80);
    instruct.addImage(instructImg);
    restart=createButton("Reset");
    restart.position(260,320);
    restart.size(100,40);
    restart.hide();
    edges=createEdgeSprites();
    //backgroundSound.loop();

    // create input and buttons and assign gamesate to PLAY  and capture the name from input if button pressed
    var title = createElement('h2')
    title.html("SAVE WATER GAME II");
    title.position(60, 50);
    title.style('font-size', '45px');
    title.style('color', 'yellow');
    var input = createInput("Name");
    input.position(200,400);
    
    var button = createButton('Play');
    button.position(375,400);
    button.mousePressed(()=> {
    newName=input.value();
    input.hide();
    button.hide();
    title.hide();
    instruct.visible=false;
    gameState=PLAY;
    backgroundSound.loop(); 
});
  // read the High score from  adatabase nd assign to highScore
  database=firebase.database();
  var databaseRef=database.ref('High Score');
  databaseRef.on("value",function(data){
  highScore=data.val();
  });

  databaseRef=database.ref('High Scorer');
  databaseRef.on("value",function(data){
  highScorer=data.val();
  });
}

function draw(){
    
    background(backgroundImg);
    textSize(18);
    fill('white');
    text(" Your Score: "+score,460,25);
    
    bucket.collide(edges[0]);
    bucket.collide(edges[1]);

    text("Highest Score: "+highScore,15,50);
    text("High Scorer: "+highScorer,15,25)

    if(gameState===PLAY){
        
        
        spawnWater();
        
        spawnDanger();
        spawnBoost();
        spawnAcid();
  
        if(keyDown(RIGHT_ARROW)){
            bucket.x+=speed
        }
        
        if(keyDown(LEFT_ARROW)){
            bucket.x-=speed;
        }
    
        waterGroup.collide(bucket,dissapear);
        
        if(bucket.isTouching(dangerGroup)){
            dangerGroup[0].destroy();
            dangerSound.play();
            gameState=END;
        }

        if(bucket.isTouching(boostGroup)){
            boostGroup[0].destroy();
            boostSound.play();
            startTimeB=time;
            flagB=1;
        }

        if(bucket.isTouching(acidGroup)){
            acidGroup[0].destroy();
            slowSound.play();
            startTimeA=time;
            flagA=1;
        }
        if(flagL3 ===1) {
            time=180-Math.round(count/frameRate());
        }else if (flagL2 ===1){
            time=120-Math.round(count/frameRate());
        } else {
            time=60-Math.round(count/frameRate());
        }

        text("Time Left: "+time,465,50)
        count=count+1;
        
        if(time===0){
            gameState=END;
        }

        if(flagL2 === 1 && flagL3 === 0){
            if(timeL2 < time+10){
                fill('yellow');
                text("Great Job!! You have unlocked Level 2",150,230);
                text("You have earned 60 seconds", 170,270);
            } 
        }
        
        if(flagL3 === 1){
            if(timeL3 < time+10){
                fill('yellow');
                text("Great Job!! You have unlocked Level 3",150,230);
                text("You have earned 60 seconds", 170,270);
            } 
        }
      
        //Give preference to Acid over Boost
        if(flagA===1 && flagB===1) {
            if(startTimeB<startTimeA) {
                flagA = 0;
            } else {
               flagB=0;
            }
        }

        if(flagB===1){
            if((time-startTimeB) > 50) {
                startTimeB = startTimeB+50;
            }
            if(startTimeB<=time+10){ 
                speed=15;
                push();
                fill('red');
                text("Boost on",280,300);
                pop();
            }
            else{
                speed=10;
                flagB=0;
            }
        }

        if(flagA===1){
            if((time-startTimeA) > 50) {
                startTimeA = startTimeA+50;
            }
            if(startTimeA<=time+10){
                speed=5;
                push();
                fill('red');
                text("Slow Down⚠",250,300);
                pop();
            }
            else{
                speed=10;
                flagA=0;
            }
        }
    }
    if(gameState===END){
        flagL2=0;
        flagL3=0;
        flagA=0;
        flagB=0;
        textSize(30);
        fill("red");
        restart.show();
        text("Game Over!!",220,290);
        restart.style("background","yellow");
        restart.mousePressed(function(){
            reset();
            restart.hide();
        })
        backgroundSound.stop();
        dangerSound.stop();
        boostSound.stop();
        slowSound.stop();
        clapSound.stop();
        text("You did a great job by saving water😀!!",50,200);
    }
    drawSprites();

    if(score > highScore){
        highScore=score;
        highScorer=newName;
        database.ref('/').update({
          "High Scorer":highScorer,
          "High Score":score
        });
      }
}

function spawnWater(){
    var fr= 35;
    if(flagL3===1) {
        fr = 16;
    } else if(flagB===1 || flagL2===1){
        fr=26;
    } 
        
    if(frameCount%fr===0){
        waterDrop=createSprite(random(10,590),-20,10,10);
        waterDrop.velocityY=4+4*score/40;
        waterDrop.addImage(dropImg);
        waterDrop.scale=0.3;
        waterGroup.add(waterDrop);
        waterDrop.lifetime=250;
    }
}


function spawnDanger(){
    var fd = 610;
    if( flagL3===1){
        fd=300;
    } else if(flagL2 ===1) {
        fd = 450;
    }
    if(frameCount%fd===0){
        danger=createSprite(random(10,590),-20,10,10);
        danger.velocityY=4+4*score/30;
        danger.addImage(dangerImg);
        danger.scale=0.4
        dangerGroup.add(danger);
        danger.lifetime=150;
    }
}

function spawnBoost(){
    var fb = 560;
    if( flagL3===1){
        fb=300;
    } else if(flagL2 ===1) {
        fb = 400;
    }
    if(frameCount%fb===0){
        boost=createSprite(random(10,590),-20,10,10);
        boost.velocityY=4+4*score/30;
        boost.addImage(boostImg);
        boost.scale=0.4
        boostGroup.add(boost);
        boost.lifetime=150;
    }
}

function spawnAcid(){
    var fa = 520;
    if( flagL3===1){
        fa=280;
    } else if(flagL2 ===1) {
        fa = 370;
    }
    if(frameCount%fa===0){
        acid=createSprite(random(10,590),-20,10,10);
        acid.velocityY=4+4*score/30;
        acid.addImage(acidImg);
        acid.scale=0.4
        acidGroup.add(acid);
        acid.lifetime=150;
    }
}

function reset(){
    gameState=PLAY;
    backgroundSound.loop();
    waterGroup.destroyEach();
    boostGroup.destroyEach();
    dangerGroup.destroyEach();
    speed=10;
    score=0;
    count=0;
    startTimeA=0;
    startTimeB=0;
    timeL2=0;
    timeL3=0;
    flagA = 0;
    flagB=0;
    falgL2=0;
    flagL3=0;
}

function dissapear(w,b){
    //console.log(w.y);
    if(w.y<498) {
        w.destroy();
        score=score+10;
        collectSound.play();
        if(score === 200) {
            flagL2 = 1;
            timeL2 = time+60;
            clapSound.play();
        } 
        if(score === 330) {
            flagL3 = 1;
            timeL3 = time+60;
            clapSound.play();
        }
    }
}
